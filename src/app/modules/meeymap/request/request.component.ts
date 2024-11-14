import * as _ from 'lodash';
import { RouterModule } from "@angular/router";
import { ShareModule } from "../../share.module";
import { UtilityModule } from "../../utility.module";
import { Component, NgModule, OnInit } from "@angular/core";
import { MeeymapService } from "../meeymap.service";
import { GridData } from '../../../_core/domains/data/grid.data';
import { DataType } from '../../../_core/domains/enums/data.type';
import { MMAddNoteRequestComponent } from '../add.note.request/add.note.request.component';
import { ActionData } from '../../../_core/domains/data/action.data';
import { ActionType } from '../../../_core/domains/enums/action.type';
import { ExportType } from '../../../_core/domains/enums/export.type';
import { ConstantHelper } from "../../../_core/helpers/constant.helper";
import { UtilityExHelper } from '../../../_core/helpers/utility.helper';
import { BaseEntity } from '../../../_core/domains/entities/base.entity';
import { AdminAuthGuard } from "../../../_core/guards/admin.auth.guard";
import { ModalSizeType } from '../../../_core/domains/enums/modal.size.type';
import { AppInjector } from '../../../app.module';
import { ResultApi } from '../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../_core/helpers/toastr.helper';
import { GridComponent } from '../../../_core/components/grid/grid.component';
import { NavigationStateData } from '../../../_core/domains/data/navigation.state';
import { ModalExportDataComponent } from '../../../_core/modal/export.data/export.data.component';
import { MMRequestEntity } from '../../../_core/domains/entities/meeymap/mm.request.entity';
import { MMRequestStatusType } from '../../../_core/domains/entities/meeymap/enums/mm.request.status.type';
import { AppConfig } from "../../../_core/helpers/app.config";

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class RequestComponent extends GridComponent implements OnInit {
    obj: GridData = {
        Imports: [],
        // Exports: [
        //     {
        //         name: 'Excel',
        //         systemName: ActionType.Export,
        //         click: () => {
        //             this.dialogService.WapperAsync({
        //                 confirmText: 'Xuất dữ liệu',
        //                 title: 'Xuất dữ liệu [Excel]',
        //                 object: ModalExportDataComponent,
        //                 objectExtra: {
        //                     Data: this.itemData,
        //                     Type: ExportType.Excel,
        //                     Reference: MMRequestEntity,
        //                 }
        //             });
        //         },
        //         icon: 'kt-nav__link-icon la la-file-excel-o',
        //     }
        // ],
        Exports: [],
        MoreFeatures: {
            Name: "Xuất dữ liệu",
            Icon: "la la-download",
            Actions: [
                {
                    name: 'Excel',
                    icon: "la la-file-excel-o",
                    systemName: ActionType.Export,
                    click: () => {
                        this.dialogService.WapperAsync({
                            confirmText: 'Xuất dữ liệu',
                            title: 'Xuất dữ liệu [Excel]',
                            object: ModalExportDataComponent,
                            objectExtra: {
                                Data: this.itemData,
                                Type: ExportType.Excel,
                                Reference: MMRequestEntity,
                            }
                        });
                    },
                }
            ],
        },
        Filters: [],
        Actions: [
            {
                icon: 'la la-cart-plus',
                name: ActionType.ReceiveCustomer,
                className: 'btn btn-success',
                systemName: ActionType.ReceiveCustomer,
                hidden: (item: any) => {
                    return !(item.Status == MMRequestStatusType.Waiting);
                },
                click: (item: any) => {
                    let cloneItem = this.cloneItems && this.cloneItems.find(c => c.Id == item.Id);
                    this.confirmReceiveCustomer(cloneItem);
                },
            },
            {
                icon: 'la la-sticky-note-o',
                name: ActionType.Notes,
                className: 'btn btn-warning',
                systemName: ActionType.Notes,
                hidden: (item: any) => {
                    return !(item.Status == MMRequestStatusType.Process && item.Carer == this.authen.account.Email);
                },
                click: (item: any) => {
                    let cloneItem = this.cloneItems && this.cloneItems.find(c => c.Id == item.Id);
                    this.confirmNotes(cloneItem);
                },
            },
        ],
        Features: [
            ActionData.reload(() => { this.loadItems(); }),
        ],
        UpdatedBy: false,
        Size: ModalSizeType.ExtraLarge,
        PageSizes: [5, 10, 20, 50, 100],
        Reference: MMRequestEntity,
        Title: 'Tra cứu lịch sử giao dịch',
        SearchText: 'Nhập số điện thoại, email, meey ID, mã yêu cầu',
        CustomFilters: ['State', 'RequestDate', 'Code'],
        DisableAutoLoad: true
    };
    service: MeeymapService;

    constructor() {
        super();
        this.service = AppInjector.get(MeeymapService);
        this.properties = [
            {
                Property: 'Id', Title: 'Mã yêu cầu', Type: DataType.String,
            },
            {
                Property: 'UserInfo', Title: 'Thông tin đăng ký', Type: DataType.String,
                Format: (item: any) => {
                    let text: string = '';
                    if (item.CompanyName) text += '<p>' + (item.CompanyName) + '</p>';
                    if (item.CompanyRepresent) text += '<p>' + (item.CompanyRepresent) + '</p>';
                    if (item.CompanyPhone) text += '<p><i class=\'la la-phone\'></i><span>' + (item.CompanyPhone) + '</span></p>';
                    if (item.CompanyEmail) text += '<p><i class=\'la la-inbox\'></i><span>' + (item.CompanyEmail) + '</span></p>';
                    return text;
                }
            },
            {
                Property: 'Action', Title: 'Hành động', Type: DataType.String,
                Format: ((item: any) => {
                    let text: string = '';
                    if (item.ActionId != null && item.ActionId != undefined) {
                        let option = ConstantHelper.MM_REQUEST_ACTION_TYPES.find(c => c.value == item.ActionId);
                        if (option) text += '<p>' + (option && option.label) + '</p>';
                    }
                    return text;
                })
            },
            { Property: 'PacketName', Title: 'Gói', Type: DataType.String },
            {
                Property: 'Type', Title: 'Loại TK lúc đăng ký', Type: DataType.String,
                Format: ((item: any) => {
                    let text: string = '';
                    if (item.TypeId != null && item.TypeId != undefined) {
                        let option = ConstantHelper.MM_REQUEST_TYPES.find(c => c.value == item.TypeId);
                        if (option) text += '<p>' + (option && option.label) + '</p>';
                    }
                    return text;
                })
            },
            {
                Property: 'MeeyId', Title: 'Meey Id', Type: DataType.String,
                Format: (item: any) => {
                    let text: string = '';
                    if (item.MeeyId) {
                        if (item.MeeyName) text += '<p routerLink="quickView" type="viewMeeyId"><a>' + item.MeeyName + '</a></p>';
                        if (item.MeeyPhone) text += '<p><i class=\'la la-phone\'></i><span>' + (item.MeeyPhone) + '</span></p>';
                        if (item.MeeyEmail) text += '<p><i class=\'la la-inbox\'></i><span>' + (item.MeeyEmail) + '</span></p>';
                    }
                    return text;
                }
            },
            { Property: 'CreatedDate', Title: 'Thời gian yêu cầu', Type: DataType.DateTime },
            {
                Property: 'State', Title: 'Trạng thái', Type: DataType.String,
                Format: ((item: any) => {
                    let text: string = '';
                    if (item.Status != null && item.Status != undefined) {
                        let option = ConstantHelper.MM_REQUEST_STATUS_TYPES.find(c => c.value == item.Status);
                        if (option) text += '<p style="' + (option && option.color) + '">' + (option && option.label) + '</p>';
                        if (option && option.value == MMRequestStatusType.Process) text += `<br/><p>Bởi: ${item.Carer ? item.Carer : ''}</p><p>${UtilityExHelper.dateTimeString(item.CareDate)}</p>`;
                        if (option && option.value == MMRequestStatusType.Success) text += `<br/><p>Bởi: ${item.Carer ? item.Carer : ''}</p><p>${UtilityExHelper.dateTimeString(item.CareDate)}</p><span>${item.Note ? `"${item.Note}"` : ''}</span>`;
                        // if (option && option.value == MMRequestStatusType.Success) text += `<br/><p>Bởi: ${item.Carer ? item.Carer : ''}</p><p>${UtilityExHelper.dateTimeString(item.CareDate)}</p><span tooltip="${item.Note}">${item.Note ? `"${item.Note}"` : ''}</span>`;
                    }
                    return text;
                })
            },
        ];
    }

    async ngOnInit() {
        await this.render(this.obj);
    }

    public async confirmReceiveCustomer(cloneItem) {
        this.dialogService.ConfirmAsync('Bạn có muốn nhận chăm sóc không? ', async () => {
            await this.confirmUpdateStatus(cloneItem);
        }, () => { }, 'Xác nhận chăm sóc')
    }

    public async confirmNotes(cloneItem) {
        this.confirmAddNoteUpdateStatus(cloneItem, false)
    }

    public async confirmUpdateStatus(cloneItem): Promise<boolean> {
        return await this.service.updateStatus(cloneItem).then((result: ResultApi) => {
            if (ResultApi.IsSuccess(result)) {
                ToastrHelper.Success('Đã nhận chăm sóc');
                cloneItem.Status = MMRequestStatusType.Process;
                this.confirmAddNoteUpdateStatus(cloneItem, true);
                return true;
            }
            return false;
        }, (e) => {
            ToastrHelper.Exception(e);
            return false;
        });
    }

    public async confirmAddNoteUpdateStatus(cloneItem, isLoad) {
        this.dialogService.WapperAsync({
            title: 'Hỗ trợ yêu cầu',
            cancelText: 'Đóng',
            confirmText: 'Hoàn thành chăm sóc',
            object: MMAddNoteRequestComponent,
            size: ModalSizeType.Medium,
            objectExtra: {
                item: cloneItem
            }
        }, async () => { this.loadItems() }, async () => { }, async () => { }, async () => { isLoad ? this.loadItems() : '' });
    }

    public setUrlState(state: NavigationStateData, controller: string = null) {
        if (!controller) controller = this.getController();
        let stateKey = 'params',
            navigation = this.router.getCurrentNavigation(),
            sessionKey = 'session_' + stateKey + '_' + controller;
        if (state) sessionStorage.setItem(sessionKey, JSON.stringify(state));
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
            }
        }
    }
}

@NgModule({
    declarations: [
        RequestComponent,
        MMAddNoteRequestComponent
    ],
    imports: [
        ShareModule,
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: RequestComponent, pathMatch: 'full', data: { state: 'mm_support_khdn' }, canActivate: [AdminAuthGuard] },
        ])
    ],
    providers: [MeeymapService]
})

export class MMRequestModule { }