import * as _ from 'lodash';
import { AppInjector } from '../../../app.module';
import { MLArticleService } from '../article.service';
import { Component, Input, OnInit } from '@angular/core';
import { validation } from '../../../_core/decorators/validator';
import { ResultApi } from '../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../_core/helpers/entity.helper';
import { MLArticleEntity } from '../../../_core/domains/entities/meeyland/ml.article.entity';
import { MLArticleType } from '../../../_core/domains/entities/meeyland/enums/ml.article.type';

@Component({
    templateUrl: './approve.article.component.html',
    styleUrls: ['./approve.article.component.scss'],
})
export class MLApproveArticleComponent implements OnInit {
    @Input() params: any;
    item: MLArticleEntity;
    service: MLArticleService;

    constructor() {
        this.service = AppInjector.get(MLArticleService);
    }

    ngOnInit() {
        let item = this.params && this.params['item'];
        if (item.Type == MLArticleType.Self)
            item.GroupArticle = 'Tin tự xuất bản';
        else
            item.GroupArticle = 'Tin Crawl';
        this.item = EntityHelper.createEntity(MLArticleEntity, item);
    }

    async confirm() {
        let valid = await validation(this.item, ['Reason']);
        if (valid && this.item) {
            return await this.service.approve(this.item.Id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    let message = 'Duyệt đăng tin có mã: <b>' + this.item.Code + '<b> thành công';
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

    async reject() {
        return true;
    }
}