import * as _ from 'lodash';
import { Component, Input, OnInit } from "@angular/core";
import { AppConfig } from '../../../../_core/helpers/app.config';

@Component({
    templateUrl: './alert.component.html',
    styleUrls: [
        './alert.component.scss',
        '../../../../../assets/css/modal.scss'
    ],
})
export class AlertVideoComponent implements OnInit {    
    url: string;
    @Input() params: any;
    
    constructor() {
    }

    async ngOnInit() {
        this.url = this.params && this.params['url'];
        if (this.url)
            this.url = AppConfig.MeeyProjectConfig.Url + this.url;
    }

    public async confirm(): Promise<boolean> {
        return true;
    }
}