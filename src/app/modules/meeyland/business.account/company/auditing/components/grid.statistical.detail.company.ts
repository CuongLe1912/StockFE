import { Component, Input } from '@angular/core';
import { GridData } from '../../../../../../_core/domains/data/grid.data';
import { ActionData } from '../../../../../../_core/domains/data/action.data';
import { ModalSizeType } from '../../../../../../_core/domains/enums/modal.size.type';
import { GridComponent } from '../../../../../../_core/components/grid/grid.component';
import { ActionType } from '../../../../../../_core/domains/enums/action.type';
import { MLCompanyAuditingEntity } from '../../../../../..//_core/domains/entities/meeyland/ml.company.entity';
import { UtilityExHelper } from '../../../../../..//_core/helpers/utility.helper';
import { DataType } from '../../../../../..//_core/domains/enums/data.type';
import { AppConfig } from '../../../../../..//_core/helpers/app.config';
import { MMLookupQuickViewComponent } from '../../../../../..//modules/meeymap/lookup.quickview/lookup.quickview.component';
import { TableData } from '../../../../../..//_core/domains/data/table.data';
import { ExportType } from '../../../../../..//_core/domains/enums/export.type';
import { HttpEventType } from '@angular/common/http';

@Component({
    selector: 'ml-company-auditing-statistical-detail-grid',
    templateUrl: '../../../../../../_core/components/grid/grid.component.html',
})
export class MLGridStatisticalDetailCompany extends GridComponent {
    @Input() params: any;
    id = null;
    meeyId = null;

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
        Actions: [],
        SearchText: 'SĐT, Email, MeeyId...',
        InlineFilters: ['DateTime', 'Address'],
        NotKeepPrevData: true,
        DisableAutoLoad: true,
    };

    constructor() {
        super();
    }

    async ngOnInit() {
        this.id = this.getParam('id');
        this.meeyId = this.getParam('meeyId');
        this.properties = [
            { Property: 'meey_id', Title: 'MeeyId', Type: DataType.String },
            {
                Property: 'CustomerInfo', Title: 'Thông tin khách hàng', Type: DataType.String,
                Format: ((item: any) => {
                    if (!item.user) return '';
                    const user = item.user;
                    return UtilityExHelper.renderUserInfoFormat(user.name, user.phone, user.email, true);
                })
            },
            {
                Property: 'Address', Title: 'Địa chỉ thửa đất đã tra cứu', Type: DataType.String,
                Format: ((item: any) => {
                    if (!item.hyper_link) return '';
                    return item.hyper_link?.content;
                })
            },
            {
                Property: 'Map', Title: 'Xem bản đồ', Type: DataType.String,
                Format: ((item: any) => {
                    if (!item.hyper_link) return '';
                    return 'Xem bản đồ';
                }),
                Click: ((item) => {
                    this.quickViewMap(item);
                })
            },
            { Property: 'start_date', Title: 'Thời gian tra cứu', Type: DataType.DateTime },
        ];

        let current = new Date();
        let minDate = new Date(current.getFullYear(), current.getMonth(), 1);
        this.itemData.Filters = (this.itemData && this.itemData.Filters && this.itemData.Filters.filter(c => c.Name != 'DateTime')) || [];
        this.itemData.Filters.push({
            Name: 'DateTime',
            Value: minDate,
            Value2: current
        });
        
        let url = '/admin/mlcompany/AuditingDetails/' + this.id;
        if (this.meeyId) url += '?meeyId=' + this.meeyId;
        this.obj.Url = url
        this.render(this.obj);
    }

    quickView(item: any, type: string) {
        if (type === 'user') {
            let url = AppConfig.getProtocol() + '//' + AppConfig.getDomain() + '/admin/mluser/view?meeyId=' + item.MeeyId;
            window.open(url, "_blank");
        }
    }

    quickViewMap(item: any) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            size: ModalSizeType.FullScreen,
            object: MMLookupQuickViewComponent,
            title: 'Thông tin quy hoạch sử dụng đất',
            objectExtra: { refId: item?.hyper_link?.refId, popup: true }
        });
    }

    export() {
        this.loading = true
        let urlExport = '/admin/mlcompany/ExportHistoryAuditing/' + this.id;
        if (this.meeyId) urlExport += '?meeyId=' + this.meeyId;
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
        if (this.meeyId) urlExport += '?meeyId=' + this.meeyId;
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
