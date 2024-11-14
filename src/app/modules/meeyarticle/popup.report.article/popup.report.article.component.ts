import * as _ from 'lodash';
import { Component, Input, OnInit } from '@angular/core';
import { EntityHelper } from '../../../_core/helpers/entity.helper';
import { MLArticleReportEntity } from '../../../_core/domains/entities/meeyland/ml.article.entity';

@Component({
    templateUrl: './popup.report.article.component.html',
    styleUrls: ['./popup.report.article.component.scss'],
})
export class MLPopupReportArticleComponent implements OnInit {
    @Input() params: any;
    report: MLArticleReportEntity;

    constructor() {
    }

    ngOnInit() {
        let item = this.params && this.params['item'];
        if (item) {
            this.report = EntityHelper.createEntity(MLArticleReportEntity, item);
        }
    }
}