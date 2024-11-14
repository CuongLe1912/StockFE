import { HttpEventType } from '@angular/common/http';
import { MeeyCrmService } from '../../meeycrm.service';
import { Component, Input, OnInit } from '@angular/core';
import { GridData } from '../../../../_core/domains/data/grid.data';
import { DataType } from '../../../../_core/domains/enums/data.type';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { UtilityExHelper } from '../../../../_core/helpers/utility.helper';
import { ModalSizeType } from '../../../../_core/domains/enums/modal.size.type';
import { GridComponent } from '../../../../_core/components/grid/grid.component';
import { MCRMCustomerEntity } from '../../../../_core/domains/entities/meeycrm/mcrm.customer.entity';

@Component({
    templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class MCRMCustomerListImportComponent extends GridComponent implements OnInit {
    items: any[];
    obj: GridData = {
        Actions: [],
        Exports: [],
        Imports: [],
        Filters: [],
        IsPopup: true,
        UpdatedBy: false,
        HidePaging: true,
        HideSearch: true,
        NotKeepPrevData: true,
        HideHeadActions: true,
        DisableAutoLoad: true,
        HideCustomFilter: true,
        HideSkeletonLoading: true,
        Size: ModalSizeType.Large,
        Reference: MCRMCustomerEntity,
    };
    processing = false;
    @Input() params: any;
    crmService: MeeyCrmService;

    constructor() {
        super();
    }

    async ngOnInit() {
        this.properties = [
            { Property: 'Name', Title: 'Khách hàng', Type: DataType.String },
            { Property: 'Email', Title: 'Email', Type: DataType.String },
            { Property: 'Phone', Title: 'Số điện thoại', Type: DataType.String },
            {
                Property: 'Sale', Title: 'Nhân viên chăm sóc', Type: DataType.String,
                Format: ((item: any) => {
                    let text: string = '';
                    item['SaleEmail'] = item.Sale;
                    item['SupportEmail'] = item.Support;
                    text += '<p>Sale: ' + UtilityExHelper.escapeHtml(item.Sale) + '</a></p>';
                    text += '<p>CSKH: ' + UtilityExHelper.escapeHtml(item.Support) + '</a></p>';
                    return text;
                })
            },
            { Property: 'Status', Title: 'Trạng thái', Type: DataType.String },
        ];
        this.setPageSize(200);
        this.items = this.getParam('items');
        await this.render(this.obj, this.items);
    }

    async confirm() {
        this.processing = true;
        let urlExport = '/admin/MCRMCustomer/ExportItems/';
        let fileName = "Danh sách khách hàng CRM_" + new Date().getTime();
        return await this.service.downloadFileByUrl(urlExport, this.originalItems).toPromise().then(data => {
            switch (data.type) {
                case HttpEventType.DownloadProgress:
                    break;
                case HttpEventType.Response:
                    const downloadedFile = new Blob([data.body], { type: data.body.type });
                    const a = document.createElement('a'); document.body.appendChild(a);
                    a.href = URL.createObjectURL(downloadedFile);
                    a.setAttribute('style', 'display:none;');
                    a.download = fileName + '.' + 'xlsx';
                    a.target = '_blank';
                    a.click();
                    document.body.removeChild(a);
                    break;
            }                    
            this.processing = false;
            ToastrHelper.Success('Xuất dữ liệu thành công');
            return true;
        }).catch(e => {
            ToastrHelper.Exception(e);
            this.processing = false;
            return false;
        });
    }
}