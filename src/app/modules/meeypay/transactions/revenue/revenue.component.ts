import { RouterModule } from "@angular/router";
import { ShareModule } from "../../../share.module";
import { UtilityModule } from "../../../utility.module";
import { Component, NgModule, OnInit } from "@angular/core";
import { AppConfig } from "../../../../_core/helpers/app.config";
import { MPTransactionService } from "../transactions.service";
import { GridData } from "../../../../_core/domains/data/grid.data";
import { DataType } from "../../../../_core/domains/enums/data.type";
import { PipeType } from "../../../../_core/domains/enums/pipe.type";
import { UtilityExHelper } from "../../../../_core/helpers/utility.helper";
import { AdminAuthGuard } from "../../../../_core/guards/admin.auth.guard";
import { ConstantHelper } from "../../../../_core/helpers/constant.helper";
import { ModalSizeType } from "../../../../_core/domains/enums/modal.size.type";
import { EditRevenueComponent } from "./edit.revenue/edit.revenue.component";
import { GridComponent } from "../../../../_core/components/grid/grid.component";
import { ActionType, ControllerType } from "../../../../_core/domains/enums/action.type";
import { MPRevenueEntity } from "../../../../_core/domains/entities/meeypay/mp.revenue.entity";
import { ModalViewProfileComponent } from "../../../../_core/modal/view.profile/view.profile.component";
import { MPRevenueStatusType } from "../../../../_core/domains/entities/meeypay/enums/mp.revenue.status.type";

@Component({
    templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class RevenueComponent extends GridComponent implements OnInit {
    obj: GridData = {
        Filters: [],
        Imports: [],
        Exports: [],
        Actions: [
            {
                icon: 'la la-eye',
                name: ActionType.ViewDetail,
                className: 'btn btn-warning',
                systemName: ActionType.ViewDetail,
                hidden: (item: any) => {
                    return !item[ActionType.ViewDetail];
                },
                click: (item: any) => {
                    let originalItem = this.originalItems.find(c => c.Id == item.Id);
                    this.view(originalItem);
                },
            },
            {
                icon: 'la la-pencil',
                name: ActionType.Edit,
                systemName: ActionType.Edit,
                className: 'btn btn-primary',
                hidden: (item: any) => {
                    return !(item[ActionType.Edit] && item.StatusType == MPRevenueStatusType.Init);
                },
                click: (item: any) => {
                    let originalItem = this.originalItems.find(c => c.Id == item.Id);
                    this.edit(originalItem);
                },
            },
            {
                icon: 'la la-trash',
                name: ActionType.Delete,
                className: 'btn btn-danger',
                systemName: ActionType.Delete,
                hidden: (item: any) => {
                    return !(item[ActionType.Delete] && item.StatusType == MPRevenueStatusType.Init);
                },
                click: (item: any) => {
                    let originalItem = this.originalItems.find(c => c.Id == item.Id);
                    this.delete(originalItem);
                }
            }
        ],
        UpdatedBy: false,
        DisableAutoLoad: true,
        Size: ModalSizeType.Medium,
        Reference: MPRevenueEntity,
        SearchText: 'Nhập mã tiền thu, số điện thoại, email...',
        CustomFilters: ['Status', 'Note', 'Amount', 'ReceiveDate', 'UserTransfer', 'SaleId', 'TransactionCode']
    };

    constructor() {
        super();
    }

    async ngOnInit(): Promise<void> {
        let allowViewDetail = await this.authen.permissionAllow(ControllerType.MPRevenue, ActionType.ViewDetail);
        let allowViewDetailTransaction = await this.authen.permissionAllow(ControllerType.MPTransactions, ActionType.ViewDetail);
        this.properties = [
            {
                Property: 'Code', Title: 'Mã tiền thu', Type: DataType.String,
                Format: ((item: any) => {
                    let text = '',
                        allow = item[ActionType.ViewDetail] && allowViewDetail;
                    if (item.Code) {
                        text += allow
                            ? '<a routerLink="quickView" type="view" tooltip="Xem chi tiết">' + item.Code + '</a>'
                            : '<p>' + item.Code + '</p>';
                    }
                    return text;
                })
            },
            {
                Property: 'BankId', Title: 'Nguồn tiền', Type: DataType.String,
                Format: ((item: any) => {
                    let text: string = '';
                    if (item.BankName) text += '<p>' + item.BankName + '</p>';
                    if (item.BankNumber) text += '<p>' + item.BankNumber + '</p>';
                    return text;
                })
            },
            { Property: 'Amount', Title: 'Số tiền (vnđ)', Type: DataType.Number, Align: 'right' },
            { Property: 'ReceiveDate', Title: 'Ngày nhận', Type: DataType.DateTime, PipeType: PipeType.Date, Align: 'center' },
            { Property: 'Note', Title: 'Nội dung chuyển tiền', Type: DataType.String },
            {
                Property: 'Status', Type: DataType.String, Align: 'center',
                Format: ((item: any) => {
                    let text: string = '';
                    item.StatusType = item.Status;
                    switch (item.Status) {
                        case MPRevenueStatusType.Init: {
                            text = '<button class="btn btn-sm btn-success" routerLink="quickView" type="transaction">Tạo giao dịch</button>';
                        } break;
                        case MPRevenueStatusType.Pending: {
                            let option = ConstantHelper.MP_REVENUE_STATUS_TYPES.find(c => c.value == item.Status);
                            if (option) text = '<p class="' + (option && option.color) + '">Chờ duyệt</p>';
                        } break;
                        case MPRevenueStatusType.Matched: {
                            let option = ConstantHelper.MP_REVENUE_STATUS_TYPES.find(c => c.value == item.Status);
                            if (option) text = '<p class="' + (option && option.color) + '">Đã khớp</p>';
                        } break;
                    }
                    return text;
                })
            },
            {
                Property: 'CustomerName', Title: 'Thông tin giao dịch', Type: DataType.String,
                Format: ((item: any) => {
                    let text: string = '';
                    if (item.CustomerName) {
                        if (item.CustomerCode) text += '<p><a routerLink="quickView" type="customer">' + item.CustomerName + '</a></p>';
                        else text += '<p>' + item.CustomerName + '</p>';
                    }
                    if (item.TransactionCode) {
                        text += allowViewDetailTransaction
                            ? '<p>Mã GD: <a routerLink="quickView" type="view-transaction">' + item.TransactionCode + '</a></p>'
                            : '<p>Mã GD: ' + item.TransactionCode + '</p>';
                    }
                    return text;
                })
            },
            {
                Property: 'SaleId', Title: 'Nhân viên chăm sóc', Type: DataType.String,
                Format: ((item: any) => {
                    let text: string = '';
                    if (item.SaleEmail) text += '<p>Sale: <a routerLink="quickView" type="sale">' + UtilityExHelper.escapeHtml(item.SaleEmail) + '</a></p>';
                    if (item.CreatedBy) text += '<p>Người tạo: <a routerLink="quickView" type="user">' + UtilityExHelper.escapeHtml(item.CreatedBy) + '</a></p>';
                    return text;
                })
            },
        ];
        this.render(this.obj);
    }

    addNew() {
        this.dialogService.WapperAsync({
            cancelText: 'Hủy',
            title: 'Thêm tiền thu',
            confirmText: 'Thêm mới',
            size: ModalSizeType.Medium,
            object: EditRevenueComponent,
        }, () => this.loadItems());
    }
    edit(item: any) {
        this.dialogService.WapperAsync({
            cancelText: 'Hủy',
            title: 'Sữa mã tiền thu',
            size: ModalSizeType.Medium,
            confirmText: 'Lưu thay đổi',
            objectExtra: { id: item.Id },
            object: EditRevenueComponent,
        }, () => this.loadItems());
    }
    view(item: any) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: 'Xem mã tiền thu',
            size: ModalSizeType.Medium,
            object: EditRevenueComponent,
            objectExtra: { id: item.Id, viewer: true },
        });
    }

    quickView(item: any, type: string) {
        let originalItem = this.originalItems.find(c => c.Id == item.Id);
        if (originalItem) {
            switch (type) {
                case 'view': this.view(originalItem); break;
                case 'sale': this.quickViewProfile(originalItem['SaleId']); break;
                case 'support': this.quickViewProfile(originalItem['SupportId']); break;
                case 'user': this.quickViewProfileEmail(originalItem['CreatedBy']); break;
                case 'transaction': this.quickAddTransaction(originalItem['Code']); break;
                case 'customer': this.quickViewCustomer(originalItem['CustomerId']); break;
                case 'view-transaction': this.quickViewTransaction(originalItem['TransactionCode']); break;
            }
        }
    }
    quickViewProfile(id: number) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            objectExtra: { id: id },
            size: ModalSizeType.Large,
            title: 'Thông tin tài khoản',
            object: ModalViewProfileComponent,
        });
    }
    quickViewCustomer(id: number) {
        let url = AppConfig.getProtocol() + '//' + AppConfig.getDomain() + '/admin/meeycrm/customer/view?id=' + id;
        window.open(url, "_blank");
    }
    quickAddTransaction(code: string) {
        let url = AppConfig.getProtocol() + '//' + AppConfig.getDomain() + '/admin/mptransactions/add?code=' + code;
        window.open(url, "_blank");
    }
    quickViewTransaction(code: string) {
        let url = AppConfig.getProtocol() + '//' + AppConfig.getDomain() + '/admin/mptransactions/view?id=' + code;
        window.open(url, "_blank");
    }
    quickViewProfileEmail(email: string) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            size: ModalSizeType.Large,
            title: 'Thông tin tài khoản',
            objectExtra: { email: email },
            object: ModalViewProfileComponent,
        });
    }
}

@NgModule({
    declarations: [
        RevenueComponent,
        EditRevenueComponent
    ],
    imports: [
        ShareModule,
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: RevenueComponent, pathMatch: 'full', data: { state: 'mprevenue' }, canActivate: [AdminAuthGuard] },
        ])
    ],
    providers: [MPTransactionService]
})
export class RevenueModule { }