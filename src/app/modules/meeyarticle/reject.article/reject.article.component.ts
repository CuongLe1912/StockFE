import * as _ from 'lodash';
import { AppInjector } from '../../../app.module';
import { MLArticleService } from '../article.service';
import { Component, Input, OnInit } from '@angular/core';
import { validation } from '../../../_core/decorators/validator';
import { ResultApi } from '../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../_core/helpers/toastr.helper';
import { ConstantHelper } from '../../../_core/helpers/constant.helper';
import { MLArticleReasonType } from '../../../_core/domains/entities/meeyland/enums/ml.article.type';
import { MLArticleEntity, MLArticleRejectEntity } from '../../../_core/domains/entities/meeyland/ml.article.entity';

@Component({
    templateUrl: './reject.article.component.html',
    styleUrls: ['./reject.article.component.scss'],
})
export class MLRejectArticleComponent implements OnInit {
    @Input() params: any;
    disabled: boolean = true;
    service: MLArticleService;
    MLArticleReasonType = MLArticleReasonType;
    item: MLArticleRejectEntity = new MLArticleRejectEntity();

    constructor() {
        this.service = AppInjector.get(MLArticleService);
    }

    ngOnInit() {
        let item: MLArticleEntity = this.params && this.params['item'];
        if (item) {
            this.item.Id = item.Id;
            this.item.Code = item.Code;
        }
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

    async toggleDisableButton() {
        let valid = this.item.Type == MLArticleReasonType.Other
            ? await validation(this.item, ['Reason'], true)
            : await validation(this.item, ['Type'], true);
        this.disabled = !valid;
    }

    async confirm() {
        let valid = this.item.Type == MLArticleReasonType.Other
            ? await validation(this.item, ['Reason'])
            : await validation(this.item, ['Type']);
        if (valid && this.item) {
            return await this.service.reject(this.item.Id, this.item.Reason).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    let message = 'Từ chối đăng tin có mã: <b>' + this.item.Code + '<b> thành công';
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