import * as _ from 'lodash';
import { Component, OnInit } from "@angular/core";
import { HttpEventType } from '@angular/common/http';
import { AppConfig } from "../../../../_core/helpers/app.config";
import { GridData } from "../../../../_core/domains/data/grid.data";
import { DataType } from "../../../../_core/domains/enums/data.type";
import { TableData } from '../../../../_core/domains/data/table.data';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { ActionData } from '../../../../_core/domains/data/action.data';
import { ExportType } from '../../../../_core/domains/enums/export.type';
import { ActionType } from "../../../../_core/domains/enums/action.type";
import { ConstantHelper } from "../../../../_core/helpers/constant.helper";
import { UtilityExHelper } from "../../../../_core/helpers/utility.helper";
import { BaseEntity } from "../../../../_core/domains/entities/base.entity";
import { ModalSizeType } from "../../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../../_core/components/grid/grid.component";
import { NavigationStateData } from "../../../../_core/domains/data/navigation.state";
import { ModalViewProfileComponent } from '../../../../_core/modal/view.profile/view.profile.component';
import { MCRMViewCallManagementcomponent } from "../view.call.management/view.call.management.component";
import { MCRMCallManagementCustomerEntity } from "../../../../_core/domains/entities/meeycrm/mcrm.call.management.entity";

@Component({
    templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class MCRMCallManagementCustomerComponent extends GridComponent implements OnInit {
    loading: boolean;
    obj: GridData = {
        Exports: [],
        Imports: [],
        Filters: [],
        Features: [
            {
                name: "Xuất dữ liệu",
                icon: "la la-download",
                className: 'btn btn-success',
                systemName: ActionType.Export,
                click: () => {
                    if (this.itemData?.Paging?.Total > 50000) {
                        this.dialogService.Alert('Thông báo', 'File export tối đa 50 nghìn dòng!');
                        this.export();
                    } else this.export()
                },
            },
            ActionData.reload(() => this.loadItems())
        ],
        UpdatedBy: false,
        NotKeepPrevData: true,
        DisableAutoLoad: true,
        Reference: MCRMCallManagementCustomerEntity,
        Actions: [
            {
                icon: 'la la-eye',
                name: ActionType.ViewDetail,
                className: 'btn btn-warning',
                controllerName: 'MCRMCallLog',
                systemName: ActionType.ViewDetail,
                click: (item: any) => {
                    let originalItem = this.originalItems.find(c => c.Id == item.Id);
                    this.viewDetail(originalItem.Id);
                },
                ctrClick: (item: any) => {
                    let originalItem = this.originalItems.find(c => c.Id == item.Id);
                    this.viewDetail(originalItem.Id);
                }
            },
        ],
        CustomFilters: ["OperatorId", "Status", "IdOrPhone", "Type", "CallTime"]
    };

    constructor() {
        super();
        this.properties = [
            { Property: 'Id', Title: 'Id', Type: DataType.Number },
            {
                Property: 'MeeyId', Title: 'Khách hàng', Type: DataType.String,
                Format: ((item: any) => {
                    let text = '';
                    if (item.CustomerName) {
                        text += '<p routerLink="quickView" type="viewCRM">CRM: <a>' + item.CustomerName + '</a></p>';
                    }
                    if (item.MeeyId) {
                        let meeyId = item.MeeyId || '';
                        while (meeyId.indexOf('/') >= 0) meeyId = meeyId.replace('/', ',');
                        while (meeyId.indexOf(';') >= 0) meeyId = meeyId.replace(';', ',');
                        meeyId = meeyId.split(',').map(c => c.trim()).filter((v, i, a) => a.indexOf(v) === i).join(', ');
                        meeyId = UtilityExHelper.trimChars(meeyId, [' ', ',']);
                        if (meeyId) text += '<p routerLink="quickView" type="viewMeeyId">MeeyId: <a>' + meeyId + '</a></p>';
                    }
                    if (item.Phone) {
                        let phone = item.Phone || '';
                        while (phone.indexOf('/') >= 0) phone = phone.replace('/', ',');
                        while (phone.indexOf(';') >= 0) phone = phone.replace(';', ',');
                        phone = phone.split(',').map(c => c.trim()).filter((v, i, a) => a.indexOf(v) === i).join(', ');
                        phone = UtilityExHelper.trimChars(phone, [' ', ',']);
                        if (phone) text += '<p>SĐT: ' + phone + '</p>';
                    }
                    return text;
                })
            },
            {
                Property: 'StatusName', Title: 'Trạng thái cuộc gọi', Type: DataType.String,
                Format: ((item: any) => {
                    let text: string = '';
                    if (item.StatusName) text += '<p>' + item.StatusName + '</p>';
                    return text;
                })
            },
            {
                Property: 'CallTime', Title: 'Ngày thực hiện', Type: DataType.String,
                Format: ((item: any) => {
                    let text = '';
                    if (item.CallTime) {
                        let date = UtilityExHelper.dateTimeString(item.CallTime);
                        text += '<p>' + date + '</p>';
                    }
                    return text;
                })
            },
            {
                Property: 'Type', Title: 'Loại cuộc gọi', Type: DataType.String,
                Format: ((item: any) => {
                    let text: string = '';
                    if (item.Type != null && item.Type != undefined) {
                        let option = ConstantHelper.ML_CUSTOMER_NOTE_CALL_TYPES.find(c => c.value == item.Type);
                        if (option) text += '<p>' + (option && option.label) + '</p>';
                    }
                    return text;
                })
            },
            {
                Property: 'SaleName', Title: 'Người thực hiện', Type: DataType.String,
                Format: ((item: any) => {
                    let text = '';
                    if (item.SaleName) text += '<p>Sale: <a routerLink="quickView" type="sale">' + UtilityExHelper.escapeHtml(item.SaleName) + '</a></p>';
                    if (item.SupportName) text += '<p>CSKH: <a routerLink="quickView" type="support">' + UtilityExHelper.escapeHtml(item.SupportName) + '</a></p>';
                    if (item.OperatorName) text += '<p>Người thực hiện: <a routerLink="quickView" type="operator">' + UtilityExHelper.escapeHtml(item.OperatorName) + '</a></p>';
                    return text;
                })
            },
            {
                Property: 'Recordingfile', Title: 'Tải tệp', Type: DataType.String, Align: 'center',
                Format: ((item: any) => {
                    let text: string = '';
                    if (item.Recordingfile) {
                        text += '<div class="d-flex align-items-center">';
                        text += '<a class="btn btn-icon btn-light-primary btn-circle" style="margin-right: 10px" routerLink="quickView" type="audio"><i class="la la-download"></i></a>';
                        text += '<audio controls><source src="' + item.Recordingfile + '" type="audio/ogg"><source src="' + item.Recordingfile + '" type="audio/mpeg"></audio>'
                        text += '</div>';
                    }
                    return text;
                })
            },
        ];
    }

    async ngOnInit() {
        this.obj.Url = '/admin/MCRMCallLog/Items';

        this.setPageSize(20);
        await this.render(this.obj);
    }

    viewDetail(item: any) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            size: ModalSizeType.Large,
            objectExtra: { item: item },
            object: MCRMViewCallManagementcomponent,
            title: 'Thông tin cuộc gọi',
        })
    }
    viewCRM(item: BaseEntity) {
        let obj: NavigationStateData = {
            id: item['CustomerId'],
            object: item,
            prevData: this.itemData,
            prevUrl: '/admin/meeycrm/calllogcustomer',
        };
        this.router.navigate(['/admin/meeycrm/customer/view'], { state: { params: JSON.stringify(obj) } });
    }

    quickView(item: BaseEntity, type: string) {
        let originalItem = this.originalItems.find(c => c.Id == item.Id);
        if (originalItem) {
            switch (type) {
                case 'viewMeeyId': {
                    let obj: NavigationStateData = {
                        prevUrl: '/admin/mluser',
                    };
                    let url = AppConfig.getProtocol() + '//' + AppConfig.getDomain() + '/admin/mluser/view?meeyId=' + originalItem['MeeyId'];
                    this.setUrlState(obj, 'mluser');
                    window.open(url, "_blank");
                } break;
                case 'viewCRM': this.viewCRM(originalItem); break;
                case 'sale': this.quickViewProfile(item['SaleId']); break;
                case 'operator': this.quickViewProfile(item['OperatorId']); break;
                case 'audio': this.downloadAutio(originalItem['Recordingfile']); break;
            }
        }
    }
    public quickViewProfile(id: number) {
        if (id) {
            this.dialogService.WapperAsync({
                cancelText: 'Đóng',
                objectExtra: { id: id },
                size: ModalSizeType.Large,
                title: 'Thông tin tài khoản',
                object: ModalViewProfileComponent,
            });
        }
    }
    public setUrlState(state: NavigationStateData, controller: string = null) {
        if (!controller) controller = this.getController();
        let stateKey = 'params',
            navigation = this.router.getCurrentNavigation(),
            sessionKey = 'session_' + stateKey + '_' + controller;
        if (state) sessionStorage.setItem(sessionKey, JSON.stringify(state));
    }

    downloadAutio(file: string) {
        window.open(file, "_blank");
    }

    loadComplete() {
        this.summaryText = 'Tổng thời gian: <b>' + UtilityExHelper.toHourMinuteSecond(this.itemTotal) + '</b>';
    }
    async export() {
        if (this.items && this.items.length > 0) {
            this.loading = true
            let objData: TableData = this.itemData;
            objData.Export = {
                Type: ExportType.Excel,
            }
            let urlExport = '/admin/MCRMCallLog/ExportData';
            let fileName = "dsCuocGoi_" + new Date().getTime();
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
        else {
            ToastrHelper.Error('Không có dữ liệu xuất excel');
        }
    }
}