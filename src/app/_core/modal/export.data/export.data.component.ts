declare var toastr: any;
import * as _ from 'lodash';
import { HttpEventType } from '@angular/common/http';
import { EnumHelper } from '../../helpers/enum.helper';
import { validation } from '../../decorators/validator';
import { Component, Input, OnInit } from '@angular/core';
import { TableData } from '../../domains/data/table.data';
import { ExportType } from '../../domains/enums/export.type';
import { DecoratorHelper } from '../../helpers/decorator.helper';
import { AdminApiService } from '../../services/admin.api.service';
import { AdminDataService } from '../../services/admin.data.service';
import { ExportDataDto } from '../../domains/objects/export.data.dto';

@Component({
    templateUrl: 'export.data.component.html',
})
export class ModalExportDataComponent implements OnInit {
    @Input() params: any;
    ExportType = ExportType;
    item: ExportDataDto = new ExportDataDto();

    constructor(
        public data: AdminDataService,
        public service: AdminApiService) {
        this.item.Limit = 1000;
    }

    ngOnInit() {
        if (this.params) {
            this.item.Data = this.params['Data'];
            this.item.Type = this.params['Type'];
            this.item.Reference = this.params['Reference'];
        }
    }

    public async confirm(): Promise<boolean> {
        let valid = await validation(this.item);
        if (!valid) return false;

        let table = DecoratorHelper.decoratorClass(this.item.Reference),
            objData: TableData = _.cloneDeep(this.item.Data);
        objData.Export = {
            Type: this.item.Type,
            Limit: this.item.Limit,
            PageSize: this.item.PageSize,
            DateRange: this.item.DateRange,
            Landscape: this.item.Landscape,
        };
        return this.service.downloadFile(table.name, objData).toPromise().then(data => {
            switch (data.type) {
                case HttpEventType.DownloadProgress:
                    break;
                case HttpEventType.Response:
                    let extension = this.item.Type == ExportType.Excel
                        ? 'xlsx'
                        : EnumHelper.exportName(ExportType, this.item.Type).toLowerCase();
                    const downloadedFile = new Blob([data.body], { type: data.body.type });
                    const a = document.createElement('a');
                    a.setAttribute('style', 'display:none;');
                    document.body.appendChild(a);
                    a.download = table.name + '.' + extension;
                    a.href = URL.createObjectURL(downloadedFile);
                    a.target = '_blank';
                    a.click();
                    document.body.removeChild(a);
                    break;
            }
            return true;
        }, () => {
            return false;
        });
    }

    downloadFile(data: any) {
        let blob = new Blob([data], { type: 'text/csv' });
        let url = window.URL.createObjectURL(blob);
        window.open(url);
    }
}
