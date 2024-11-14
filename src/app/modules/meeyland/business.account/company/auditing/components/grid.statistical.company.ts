import { HttpEventType } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AppConfig } from '../../../../../../_core/helpers/app.config';
import { GridData } from '../../../../../../_core/domains/data/grid.data';
import { DataType } from '../../../../../../_core/domains/enums/data.type';
import { TableData } from '../../../../../../_core/domains/data/table.data';
import { ActionData } from '../../../../../../_core/domains/data/action.data';
import { ExportType } from '../../../../../../_core/domains/enums/export.type';
import { UtilityExHelper } from '../../../../../../_core/helpers/utility.helper';
import { ModalSizeType } from '../../../../../../_core/domains/enums/modal.size.type';
import { GridComponent } from '../../../../../../_core/components/grid/grid.component';
import { ActionType, ControllerType } from '../../../../../../_core/domains/enums/action.type';
import { MLCompanyAuditingEntity } from '../../../../../../_core/domains/entities/meeyland/ml.company.entity';

@Component({
    selector: 'ml-company-auditing-statistical-grid',
    templateUrl: '../../../../../../_core/components/grid/grid.component.html',
})
export class MLGridStatisticalCompany extends GridComponent {
    @Input() params: any;
    @Output() rowClick: EventEmitter<any> = new EventEmitter<any>();
    id: any;

    obj: GridData = {
        Reference: MLCompanyAuditingEntity,
        Size: ModalSizeType.Large,
        UpdatedBy: false,
        Imports: [],
        Exports: [],
        Filters: [],
        Features: [
            ActionData.reload(() => {
                this.loadItems();
            }),
        ],
        MoreFeatures: {
            Name: "xuất dữ liệu",
            Icon: "la la-download",
            Actions: [
                {
                    name: 'Danh sách thông tin quy hoạch',
                    icon: "la la-download",
                    systemName: this.ActionType.MLCompanyAuditingExport,
                    controllerName: 'MLCompany',
                    click: () => this.export()
                },
                {
                    name: 'Số lượt tra cứu theo User',
                    icon: "la la-download",
                    systemName: this.ActionType.MLCompanyAuditingExportUser,
                    controllerName: 'MLCompany',
                    click: () => this.exportByUser()
                },
            ],
        },
        Actions: [
            {
                icon: 'la la-eye',
                name: ActionType.View,
                className: 'btn btn-warning',
                systemName: ActionType.ViewDetail,
                controllerName: ControllerType.MLCompany,
                click: (item: any) => this.rowClick.emit(item)
            },
        ],
        SearchText: 'SĐT, Email, MeeyId...',
        InlineFilters: ['DateTime'],
        NotKeepPrevData: true,
        DisableAutoLoad: true,
    };

    constructor() {
        super();
    }

    async ngOnInit() {
        this.id = this.getParam('id');

        this.properties = [
            { Property: 'MeeyId', Title: 'MeeyId', Type: DataType.String },
            {
                Property: 'CustomerInfo', Title: 'Thông tin khách hàng', Type: DataType.String,
                Format: ((item: any) => {
                    return UtilityExHelper.renderUserInfoFormat(item.Name, item.Phone, item.Email, true);
                })
            },
            {
                Property: 'AmountText', Title: 'Số lượng tra đã tra thành công theo khoảng thời gian đã chọn', Type: DataType.String,
                Format: ((item: any) => {
                    if (!item.Amount) return '';
                    return item.Amount + ' lượt';
                })
            },
            {
                Property: 'TotalAvailableText', Title: 'Số lượng tra cứu còn lại', Type: DataType.String,
                Format: ((item: any) => {
                    if (!item.TotalAvailable) return '';
                    return item.TotalAvailable + ' lượt';
                })
            },
        ];

        let current = new Date();
        let minDate = new Date(current.getFullYear(), current.getMonth(), 1);
        this.itemData.Filters = (this.itemData && this.itemData.Filters && this.itemData.Filters.filter(c => c.Name != 'DateTime')) || [];
        this.itemData.Filters.push({
            Name: 'DateTime',
            Value: minDate,
            Value2: current
        });

        this.obj.Url = '/admin/mlcompany/AuditingItems/' + this.id;
        this.render(this.obj);
    }

    loadComplete(): void {
        this.summaryText = 'Tổng: <b>' + this.itemTotal + ' lượt</b>';
    }

    quickView(item: any, type: string) {
        if (type === 'user') {
            let url = AppConfig.getProtocol() + '//' + AppConfig.getDomain() + '/admin/mluser/view?meeyId=' + item.MeeyId;
            window.open(url, "_blank");
        }
    }

    export() {
        this.loading = true
        let urlExport = '/admin/mlcompany/ExportHistoryAuditing/' + this.id;
        let objData: TableData = this.itemData;
        objData.Export = {
            Type: ExportType.Excel,
        }
        objData.Name = "Thông tin quy hoạch"
        let fileName = "Thông tin quy hoạch_" + new Date().getTime();
        return this.service.downloadFileByUrl(urlExport, objData).toPromise().then(data => {
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
            this.loading = false
        });
    }

    exportByUser() {
        this.loading = true
        let urlExport = '/admin/mlcompany/ExportAuditingUser/' + this.id;
        let objData: TableData = this.itemData;
        objData.Export = {
            Type: ExportType.Excel,
        }
        objData.Name = "Số lượt tra cứu theo tài khoản"
        let fileName = "Số lượt tra cứu theo tài khoản_" + new Date().getTime();
        return this.service.downloadFileByUrl(urlExport, objData).toPromise().then(data => {
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
            this.loading = false
        });
    }
}
