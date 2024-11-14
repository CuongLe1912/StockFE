import * as _ from 'lodash';
import { Component, Input, OnInit } from '@angular/core';

@Component({
    templateUrl: './reference.article.component.html',
    styleUrls: ['./reference.article.component.scss'],
})
export class MLReferenceArticleComponent implements OnInit {
    item: any;
    @Input() params: any;
    disabled: boolean = true;

    constructor() {
    }

    ngOnInit() {
        this.item = this.params && this.params['item'];
    }
}