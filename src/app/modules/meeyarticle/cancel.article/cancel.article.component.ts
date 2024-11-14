import * as _ from 'lodash';
import { AppInjector } from '../../../app.module';
import { MLArticleService } from '../article.service';
import { validation } from '../../../_core/decorators/validator';
import { ResultApi } from '../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../_core/helpers/toastr.helper';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { EntityHelper } from '../../../_core/helpers/entity.helper';
import { ActionType } from '../../../_core/domains/enums/action.type';
import { ConstantHelper } from '../../../_core/helpers/constant.helper';
import { EditorComponent } from '../../../_core/editor/editor.component';
import { ModalSizeType } from '../../../_core/domains/enums/modal.size.type';
import { AdminDialogService } from '../../../_core/services/admin.dialog.service';
import { MLPopupResultArticleComponent } from '../popup.result.article/popup.result.article.component';
import { MLArticleReasonType, MLArticleType } from '../../../_core/domains/entities/meeyland/enums/ml.article.type';
import { MLArticleEntity, MLArticleRejectEntity } from '../../../_core/domains/entities/meeyland/ml.article.entity';

@Component({
    templateUrl: './cancel.article.component.html',
    styleUrls: ['./cancel.article.component.scss'],
})
export class MLCancelArticleComponent implements OnInit {
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
    MLArticleReasonType = MLArticleReasonType;
    @ViewChild('uploadImage') uploadImage: EditorComponent;
    item: MLArticleRejectEntity = new MLArticleRejectEntity();

    constructor() {
        this.service = AppInjector.get(MLArticleService);
        this.dialog = AppInjector.get(AdminDialogService);
    }

    ngOnInit() {
        this.articles = this.params && this.params['items'];
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

    typeChange() {
        if (this.item) {
            if (this.item.Type == MLArticleReasonType.Other) {
                this.item.Reason = null;
            } else {
                let option = ConstantHelper.ML_ARTICLE_REASON_TYPES.find(c => c.value == this.item.Type);
                if (option) this.item.Reason = option.label;
            }
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
        let valid = this.item.Type == MLArticleReasonType.Other
            ? await validation(this.item, ['Reason'], true)
            : await validation(this.item, ['Type'], true);
        this.disabled = !(valid && this.ids && this.ids.length > 0);
    }

    async confirm() {
        let valid = this.item.Type == MLArticleReasonType.Other
            ? await validation(this.item, ['Reason'])
            : await validation(this.item, ['Type']);
        if (valid && this.item && this.ids && this.ids.length > 0) {

            // upload image
            let images = await this.uploadImage.image.upload();
            this.item.Images = images && images.length > 0 ? images.map(c => { return c.Path }) : null;

            // call api
            return await this.service.cancel(this.ids, this.item.Reason, this.item.Images, this.item.SendEmail).then((result: ResultApi) => {
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