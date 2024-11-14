import * as _ from 'lodash';
import { formatDate } from '@angular/common';
import { MSSeoService } from '../seo.service';
import { AppInjector } from '../../../app.module';
import { Component, OnInit } from "@angular/core";
import { HttpEventType } from '@angular/common/http';
import { validation } from '../../../_core/decorators/validator';
import { TableData } from '../../../_core/domains/data/table.data';
import { ToastrHelper } from '../../../_core/helpers/toastr.helper';
import { ExportType } from '../../../_core/domains/enums/export.type';
import { CompareType } from '../../../_core/domains/enums/compare.type';
import { EditComponent } from '../../../_core/components/edit/edit.component';
import { AdminDialogService } from '../../../_core/services/admin.dialog.service';
import { MSSeoEntity } from '../../../_core/domains/entities/meeyseo/ms.seo.entity';

@Component({
    templateUrl: './export.tag.component.html',
    styleUrls: [
        './export.tag.component.scss',
        '../../../../assets/css/modal.scss'
    ],
})
export class ExportTagComponent extends EditComponent implements OnInit {
    loading: boolean;
    isActive: boolean = true;
    isImport: boolean;
    isDownload: boolean;
    service: MSSeoService;
    dialog: AdminDialogService;
    item: MSSeoEntity = new MSSeoEntity();
    itemData: TableData = new TableData();

    constructor() {
        super();
        this.service = AppInjector.get(MSSeoService);
        this.dialog = AppInjector.get(AdminDialogService);
    }

    async ngOnInit(): Promise<void> {
        this.itemData = this.params && this.params['itemData'];
    }

    public async confirm() {
        let valid = await validation(this.item, ['ExportFrom', 'ExportTo']);
        if (valid) {
            let obj: TableData = _.cloneDeep(this.itemData) || new TableData();
            if (obj) {
                let limit = this.item.ExportTo - this.item.ExportFrom + 1;
                if (limit > 5000) {
                    ToastrHelper.Error('Số lượng export không được vượt quá 5000.');
                    return false;
                }
                obj.Export = {
                    Limit: limit,
                    Type: ExportType.Excel,
                };
                obj.Paging.Index = 1;
                obj.Paging.Size = obj.Export.Limit;
                if (!obj.Filters) obj.Filters = [];
                obj.Filters.push({
                    Name: 'Start',
                    Value: this.item.ExportFrom,
                    Compare: CompareType.N_Equals,
                });
                obj.Filters.push({
                    Name: 'End',
                    Value: this.item.ExportTo,
                    Compare: CompareType.N_Equals,
                });
            }

            this.processing = true;
            return await this.service.downloadFile('msseo', obj).toPromise().then(data => {
                switch (data.type) {
                    case HttpEventType.DownloadProgress:
                        break;
                    case HttpEventType.Response:
                        let currentDate = formatDate(new Date(), 'dd.MM.yyyy', 'en');
                        let extension = 'xlsx';
                        const downloadedFile = new Blob([data.body], { type: data.body.type });
                        const a = document.createElement('a');
                        a.setAttribute('style', 'display:none;');
                        document.body.appendChild(a);
                        a.download = 'Export_tag_' + currentDate + '.' + extension;
                        a.href = URL.createObjectURL(downloadedFile);
                        a.target = '_blank';
                        a.click();
                        document.body.removeChild(a);
                        break;
                }
                this.processing = false;
                return true;
            }, () => {
                ToastrHelper.Error('Lỗi hệ thống khi xuất dữ liệu, vui lòng thử lại sau');
                this.processing = false;
                return false;
            });
        } return false;
    }
}