import * as _ from 'lodash';
import { formatDate } from '@angular/common';
import { MSSeoService } from '../../seo.service';
import { AppInjector } from '../../../../app.module';
import { HttpEventType } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';

@Component({
    templateUrl: './alert.import.textlink.component.html',
    styleUrls: ['./alert.import.textlink.component.scss'],
})
export class MSAlertImportTagComponent implements OnInit {
    items: any[];
    type: number;
    error: number;
    success: number;
    loading: boolean;
    @Input() params: any;
    service: MSSeoService;

    constructor() {
        this.service = AppInjector.get(MSSeoService);
        //this.event = AppInjector.get(AdminEventService);
    }

    ngOnInit() {
        if (this.params) {
            this.type = this.params['type'];
            this.items = this.params['items'];
            this.success = this.params['success'] || 0;
            this.error = this.params['error'] || 0;
        }
    }

    async confirm() {
        if (this.items && this.items.length > 0) {
            this.loading = true;
            let currentDate = formatDate(new Date(), 'dd.MM.yyyy', 'en');
            let fileName = "Ket_qua_import_" + currentDate;
            return this.service.downloadFileByUrl('/admin/msseo/exportResult', this.items).toPromise().then(data => {
                this.loading = false
                switch (data.type) {
                    case HttpEventType.DownloadProgress:
                        break;
                    case HttpEventType.Response:
                        let extension = 'xlsx';
                        const downloadedFile = new Blob([data.body], { type: data.body.type });
                        const a = document.createElement('a');
                        a.setAttribute('style', 'display:none;');
                        document.body.appendChild(a);
                        a.download = fileName + '.' + extension;
                        a.href = URL.createObjectURL(downloadedFile);
                        a.target = '_blank';
                        a.click();
                        document.body.removeChild(a);
                        break;
                }
                return true;
            }).catch(ex => {
                this.loading = true
            });
        } else {
            ToastrHelper.Error('Không có dữ liệu xuất excel');
        }
    }
}