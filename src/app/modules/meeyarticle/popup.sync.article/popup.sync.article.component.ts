import * as _ from 'lodash';
import { AppInjector } from '../../../app.module';
import { MLArticleService } from '../article.service';
import { Component, OnInit, Input } from '@angular/core';
import { validation } from '../../../_core/decorators/validator';
import { ResultApi } from '../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../_core/helpers/toastr.helper';
import { ResultType } from '../../../_core/domains/enums/result.type';
import { MLArticleSyncDataTime } from '../../../_core/domains/entities/meeyland/ml.article.entity';

@Component({
    templateUrl: './popup.sync.article.component.html',
    styleUrls: ['./popup.sync.article.component.scss'],
})
export class MLArticleSyncComponent implements OnInit {
    @Input() params: any;
    service: MLArticleService;

    item: MLArticleSyncDataTime = new MLArticleSyncDataTime();

    constructor() {
        this.service = AppInjector.get(MLArticleService);
    }

    ngOnInit() {
        this.loadItem();
    }
    async confirm() {
        //let valid = await validation(this.item);
        return await this.service.syncDataArticle(this.item).then((result: ResultApi) => {
            if (result && result.Type == ResultType.Success) {
                ToastrHelper.Success('Đồng bộ dữ liệu thành công');
                return true;
            } else{
                ToastrHelper.ErrorResult(result);
                return true;
            } 
        });
    }
    private async loadItem() {
    }
}