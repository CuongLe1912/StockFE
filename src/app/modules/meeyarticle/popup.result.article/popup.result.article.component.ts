import * as _ from 'lodash';
import { Component, Input, OnInit } from '@angular/core';

@Component({
    templateUrl: './popup.result.article.component.html',
    styleUrls: ['./popup.result.article.component.scss'],
})
export class MLPopupResultArticleComponent implements OnInit {
    items: any[];
    error: number = 0;
    success: number = 0;
    @Input() params: any;

    constructor() {
    }

    ngOnInit() {
        this.items = this.params && this.params['items'];
        if (this.items && this.items.length > 0) {
            this.error = this.items.filter(c => c['Status'] == 'Thất bại').length;
            this.success = this.items.filter(c => c['Status'] == 'Thành công').length;
        }
    }
}