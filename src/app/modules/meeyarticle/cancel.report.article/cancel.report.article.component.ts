import * as _ from 'lodash';
import { AppInjector } from '../../../app.module';
import { MLArticleService } from '../article.service';
import { Component, Input, OnInit } from '@angular/core';
import { validation } from '../../../_core/decorators/validator';
import { ResultApi } from '../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../_core/helpers/entity.helper';
import { ActionType } from '../../../_core/domains/enums/action.type';
import { ConstantHelper } from '../../../_core/helpers/constant.helper';
import { ModalSizeType } from '../../../_core/domains/enums/modal.size.type';
import { AdminDialogService } from '../../../_core/services/admin.dialog.service';
import { MLPopupResultArticleComponent } from '../popup.result.article/popup.result.article.component';
import { MLArticleEntity, MLArticleCancelEntity } from '../../../_core/domains/entities/meeyland/ml.article.entity';
import { MLArticleReasonReportType, MLArticleType } from '../../../_core/domains/entities/meeyland/enums/ml.article.type';

@Component({
    templateUrl: './cancel.report.article.component.html',
    styleUrls: ['./cancel.report.article.component.scss'],
})
export class MLCancelArticleReportComponent implements OnInit {
    reportId: string;
    ids: number[] = [];
    @Input() params: any;
    ActionType = ActionType;
    allowSendEmail: boolean;
    article: MLArticleEntity;
    disabled: boolean = true;
    service: MLArticleService;
    dialog: AdminDialogService;
    articles: MLArticleEntity[];
    MLArticleType = MLArticleType;
    MLArticleReasonReportType = MLArticleReasonReportType;
    item: MLArticleCancelEntity = new MLArticleCancelEntity();

    constructor() {
        this.service = AppInjector.get(MLArticleService);
        this.dialog = AppInjector.get(AdminDialogService);
    }

    ngOnInit() {
        this.articles = this.params && this.params['items'];
        this.reportId = this.params && this.params['reportId'];
        this.allowSendEmail = this.params && this.params['allowSendEmail'];
        if (this.articles && this.articles.length == 1) {
            let item = this.articles[0];
            if (item.Type == MLArticleType.Self)
                item.GroupArticle = 'Tin tự xuất bản';
            else
                item.GroupArticle = 'Tin Crawl';
            if (!item.ExpriedDate) item.ExpriedDate = item.ExpireTime;
            this.article = EntityHelper.createEntity(MLArticleEntity, item);
        }
        this.ids = this.articles && this.articles.filter(c => c[ActionType.CancelArticle] == true).map(c => { return c.Id });
    }

    optionTypeChange() {
        if (this.item) {
            if (this.item.OptionType != MLArticleReasonReportType.Other)
                this.item.Reason = null;
            this.toggleDisableButton();
        }
    }

    closePopup() {
        this.dialog.HideAllDialog();
    }

    removedItems(items: MLArticleEntity[]) {
        this.ids = items.map(c => { return c.Id });
    }

    async toggleDisableButton() {
        let valid = this.item.OptionType == MLArticleReasonReportType.Other
            ? await validation(this.item, ['Reason'], true)
            : await validation(this.item, ['OptionType'], true);
        this.disabled = !(valid && this.ids && this.ids.length > 0);
    }

    async confirm() {
        let valid = this.item.OptionType == MLArticleReasonReportType.Other
            ? await validation(this.item, ['Reason'])
            : await validation(this.item, ['OptionType']);
        if (valid && this.item && this.ids && this.ids.length > 0) {

            // call api
            let reason = this.item.Reason;
            if (!reason) {
                let option = ConstantHelper.ML_ARTICLE_REASON_REPORT_TYPES.find(c => c.value == this.item.OptionType);
                reason = option?.label;
            }
            return await this.service.cancelReport(this.ids, reason, this.item.SendEmail, this.reportId).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    if (result.Object == true) {
                        let message = this.article
                            ? 'Hạ tin đăng có mã: <b>' + this.article.Code + '<b> thành công'
                            : 'Hạ <b>' + this.ids.length + '</b> thành công';
                        ToastrHelper.Success(message);
                        return true;
                    } else {
                        let items = result.Object as any[];
                        if (items && items.length > 0) {
                            items.forEach((item: any, index: number) => {
                                let itemDb = this.articles.find(c => c.MeeyId == item.MeeyId);
                                if (itemDb) {
                                    itemDb.Index = index + 1;
                                    itemDb['Status'] = item.Status;
                                    itemDb['Reason'] = item.Message;
                                }
                            });
                            setTimeout(() => {
                                this.dialog.WapperAsync({
                                    title: 'Kết quả hạ tin',
                                    size: ModalSizeType.Large,
                                    object: MLPopupResultArticleComponent,
                                    objectExtra: { items: _.cloneDeep(this.articles) }
                                });
                            }, 500);
                        }
                        let success = this.articles.filter(c => c['Status'] == 'Thành công').length;
                        return success > 0;
                    }
                }
                ToastrHelper.ErrorResult(result);
                return false;
            }, (e) => {
                ToastrHelper.Exception(e);
                return false;
            });
        }
        return false;
    }
}