import * as _ from 'lodash';
import { AppInjector } from '../../../app.module';
import { MLArticleService } from '../article.service';
import { Component, Input, OnInit } from '@angular/core';
import { validation } from '../../../_core/decorators/validator';
import { ResultApi } from '../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../_core/helpers/entity.helper';
import { ActionType } from '../../../_core/domains/enums/action.type';
import { AdminDialogService } from '../../../_core/services/admin.dialog.service';
import { MLArticleType } from '../../../_core/domains/entities/meeyland/enums/ml.article.type';
import { MLArticleEntity, MLMarkReportEntity } from '../../../_core/domains/entities/meeyland/ml.article.entity';

@Component({
    templateUrl: './mark.report.component.html',
    styleUrls: ['./mark.report.component.scss'],
})
export class MLMarkReportComponent implements OnInit {
    reportId: string;
    @Input() params: any;
    ActionType = ActionType;
    allowSendEmail: boolean;
    article: MLArticleEntity;
    service: MLArticleService;
    dialog: AdminDialogService;
    articles: MLArticleEntity[];
    MLArticleType = MLArticleType;
    item: MLMarkReportEntity = new MLMarkReportEntity();

    constructor() {
        this.service = AppInjector.get(MLArticleService);
        this.dialog = AppInjector.get(AdminDialogService);
    }

    ngOnInit() {
        this.articles = this.params && this.params['items'];
        this.reportId = this.params && this.params['reportId'];
        if (this.articles && this.articles.length == 1) {
            let item = this.articles[0];
            if (item.Type == MLArticleType.Self)
                item.GroupArticle = 'Tin tự xuất bản';
            else
                item.GroupArticle = 'Tin Crawl';
            if (!item.ExpriedDate) item.ExpriedDate = item.ExpireTime;
            this.article = EntityHelper.createEntity(MLArticleEntity, item);
        }
    }

    closePopup() {
        this.dialog.HideAllDialog();
    }

    async confirm() {
        let valid = await validation(this.item);
        if (valid && this.item && this.reportId) {

            // call api
            return await this.service.markReport(this.reportId, this.item.Reason).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result) && result.Object == true) {
                    let message = 'Xử lý báo cáo tin có mã: <b>' + this.article.Code + '<b> thành công';
                    ToastrHelper.Success(message);
                    return true;
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