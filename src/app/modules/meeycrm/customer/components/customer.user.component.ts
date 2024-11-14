import { AppInjector } from "../../../../app.module";
import { Component, Input, OnInit } from "@angular/core";
import { AppConfig } from "../../../../_core/helpers/app.config";
import { GridData } from "../../../../_core/domains/data/grid.data";
import { DataType } from "../../../../_core/domains/enums/data.type";
import { ResultApi } from "../../../../_core/domains/data/result.api";
import { OptionItem } from "../../../../_core/domains/data/option.item";
import { ActionType } from "../../../../_core/domains/enums/action.type";
import { MLUserService } from "../../../../modules/meeyuser/user.service";
import { ConstantHelper } from "../../../../_core/helpers/constant.helper";
import { UtilityExHelper } from "../../../../_core/helpers/utility.helper";
import { BaseEntity } from "../../../../_core/domains/entities/base.entity";
import { ModalSizeType } from "../../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../../_core/components/grid/grid.component";
import { MLUserEntity } from "../../../../_core/domains/entities/meeyland/ml.user.entity";
import { MLUserStatusType } from "../../../../_core/domains/entities/meeyland/enums/ml.user.type";
import { ModalViewProfileComponent } from "../../../../_core/modal/view.profile/view.profile.component";

@Component({
    selector: 'mcrm-customer-user',
    templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class MCRMCustomerUserComponent extends GridComponent implements OnInit {
    obj: GridData = {
        Exports: [],
        Imports: [],
        Filters: [],
        Actions: [
            {
                icon: 'la la-eye',
                name: ActionType.ViewDetail,
                className: 'btn btn-warning',
                systemName: ActionType.ViewDetail,
                hidden: (item: any) => {
                    return item.Viewer;
                },
                click: (item: any) => {
                    this.view(item);
                }
            },
        ],
        IsPopup: true,
        UpdatedBy: false,
        HideSearch: true,
        HidePaging: true,
        HideHeadActions: true,
        HideCustomFilter: true,
        Reference: MLUserEntity,
        Size: ModalSizeType.Small,
        AsynLoad: () => this.asynLoad(),
    };
    @Input() id: number;
    @Input() leadId: number;
    userService: MLUserService;

    constructor() {
        super();
        this.userService = AppInjector.get(MLUserService);
    }

    async ngOnInit() {
        if (this.id) {
            this.obj.Url = '/admin/mluser/ItemsByCustomer/' + this.id;
        } else if (this.leadId) {
            this.obj.Url = '/admin/mluser/ItemsByCustomerLead/' + this.leadId;
        }

        // columns
        this.properties = [
            {
                Property: 'MeeyId', Title: 'Id', Type: DataType.String,
                Format: (item: any) => {
                    return item.Viewer
                        ? UtilityExHelper.renderIdFormat(item.Id, item.MeeyId)
                        : UtilityExHelper.renderIdFormat(item.Id, item.MeeyId, true);
                }
            },
            {
                Property: 'Name', Title: 'Thông tin khách hàng', Type: DataType.String,
                Format: ((item: any) => {
                    item['NameCode'] = item['Name'];
                    let text: string = '';
                    if (item.Name)
                        text += item.Viewer
                            ? '<p>' + UtilityExHelper.escapeHtml(item.Name) + '</p>'
                            : '<p><a routerLink="quickView" type="view">' + UtilityExHelper.escapeHtml(item.Name) + '</a></p>';
                    if (item.Phone) text += '<p><i class=\'la la-phone\'></i> ' + UtilityExHelper.escapeHtml(item.Phone) + '</p>';
                    if (item.Email) text += '<p><i class=\'la la-inbox\'></i> ' + UtilityExHelper.escapeHtml(item.Email) + '</p>';
                    if (item.UserName) text += '<p><i class=\'la la-user\'></i> ' + UtilityExHelper.escapeHtml(item.UserName) + '</p>';
                    if (item.LeadStatusV2) text += '<p style="overflow: visible"><span tooltip="Trạng thái của V2"><i class=\'la la-info\'></i><span> ' + UtilityExHelper.escapeHtml(item.LeadStatusV2) + '</p>';
                    return text;
                })
            },
            {
                Property: 'Sale', Title: 'Nhân viên chăm sóc', Type: DataType.String,
                Format: ((item: any) => {
                    let text: string = '';
                    text += '<p>Sale: <a routerLink="quickView" type="sale">' + UtilityExHelper.escapeHtml(item.SaleEmail) + '</a></p>';
                    text += '<p>CSKH: <a routerLink="quickView" type="support">' + UtilityExHelper.escapeHtml(item.SupportEmail) + '</a></p>';
                    return text;
                })
            },
            {
                Property: 'Status', Title: 'Trạng thái', Type: DataType.String, Align: 'center',
                Format: (item: any) => {
                    item['StatusCode'] = item['Status'];
                    let option: OptionItem = ConstantHelper.ML_USER_STATUS_TYPES.find(c => c.value == item.Status);
                    let text = '<p class="' + (option && option.color) + '">' + (option && option.label) + '</p>';
                    return text;
                }
            },
            {
                Property: 'PhoneVerified', Title: 'Xác nhận SĐT', Type: DataType.String, Align: 'center',
                Format: (item: any) => {
                    item['PhoneVerifiedCode'] = item['PhoneVerified'];

                    if (!item.Phone) return '';
                    if (item.StatusCode == MLUserStatusType.Deleted)
                        return '';

                    let checked = item.PhoneVerified ? true : false;
                    let text = '<p class="d-flex align-items-center justify-content-center">'
                        + '<a routerLink="quickView" type="verified">'
                        + '<span class="switch switch-primary switch-sm ' + (checked ? '' : 'switch-outline') + '" style="pointer-events: none;"><label>'
                        + (checked
                            ? '<input type="checkbox" class="switch-disabled" checked="checked" name="select">'
                            : '<input type="checkbox" name="select">')
                        + '<span></span></label></span></a></p>';
                    return text;
                }
            },
            {
                Property: 'Balance', Title: 'Số dư TK', Type: DataType.String,
                Format: (item: any) => {
                    if (item.MPConnected)
                        return '<div class="kt-spinner kt-spinner--v2 kt-spinner--primary"></div>';
                    else {
                        if (item.Viewer) {
                            return null;
                        } else {
                            let text = '<p style="color: #384AD7;"><b><i class="la la-info" style="margin-right: 2px;"></i></b>Chưa liên kết</p>';
                            return text;
                        }
                    }
                }
            },
            {
                Property: 'CreatedDate', Title: 'Thông tin tạo', Type: DataType.String, Align: 'center',
                Format: (item: any) => {
                    let text: string = '';
                    text += '<p>' + UtilityExHelper.dateTimeString(item.CreatedDate) + '</p>';
                    if (item.Source) text += '<p>' + item.Source + '</p>';
                    return text;
                }
            },
            {
                Property: 'LastLogin', Title: 'Đăng nhập gần nhất', Type: DataType.String, Align: 'center',
                Format: (item: any) => {
                    let text: string = '';
                    text += '<p>' + UtilityExHelper.dateTimeString(item.LastLogin) + '</p>';
                    if (item.LoginSource) text += '<p>' + item.LoginSource + '</p>';
                    return text;
                }
            },
        ];
        await this.render(this.obj);
    }

    asynLoad() {
        let ids = this.items && this.items.filter(c => c['MPConnected']).map(c => c.Id);
        if (ids && ids.length > 0) {
            this.userService.getAllWalletItems(ids).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    let items: MLUserEntity[] = result.Object;
                    this.items.forEach((item: any) => {
                        let itemDb = items.find(c => c.Id == item.Id);
                        if (itemDb) {
                            item['WalletBalance'] = itemDb.Balance || itemDb.DiscountBalance1 || itemDb.DiscountBalance2;
                            if (item.Viewer) {
                                item['Balance'] = '';
                            } else {
                                if (item.MPConnected) {
                                    let text: string = '',
                                        mainMoney = itemDb.Balance == null ? '--' : itemDb.Balance.toLocaleString("vi-VN", { maximumFractionDigits: 2 }) + ' đ',
                                        discountBalance1 = itemDb.DiscountBalance1 == null ? '--' : itemDb.DiscountBalance1.toLocaleString("vi-VN", { maximumFractionDigits: 2 }) + ' đ',
                                        discountBalance2 = itemDb.DiscountBalance2 == null ? '--' : itemDb.DiscountBalance2.toLocaleString("vi-VN", { maximumFractionDigits: 2 }) + ' đ';
                                    if (itemDb.MPPhone) text += '<p>' + UtilityExHelper.escapeHtml(itemDb.MPPhone) + '</p>';
                                    text += '<p style="color: #5867dd;" class="d-flex align-items-center justify-content-between"><span style="width: 120px; display: inline-block;"><i class=\'la la-caret-right\'></i> <b>TK Chính: </span><span>' + mainMoney + '</span></b></p>';
                                    text += '<p class="d-flex align-items-center justify-content-between"><span style="width: 120px; display: inline-block;"><i class=\'la la-caret-right\'></i> TKKM1: </span><span>' + discountBalance1 + '</span></p>';
                                    text += '<p class="d-flex align-items-center justify-content-between"><span style="width: 120px; display: inline-block;"><i class=\'la la-caret-right\'></i> TKKM2: </span><span>' + discountBalance2 + '</span></p>';
                                    item['Balance'] = text;
                                } else {
                                    let text = '<p style="color: #384AD7;"><b><i class="la la-info" style="margin-right: 2px;"></i></b>Chưa liên kết</p>';
                                    item['Balance'] = text;
                                }
                            }
                        }
                    });
                }
            });
        }
    }
    
    view(item: BaseEntity) {
        let url = AppConfig.getProtocol() + '//' + AppConfig.getDomain() + '/admin/mluser/view?id=' + item.Id;
        window.open(url, "_blank");
    }
    quickView(item: any, type: string) {
        switch (type) {
            case 'view': this.view(item); break;
            case 'sale': this.quickViewProfile(item['SaleEmail']); break;
            case 'support': this.quickViewProfile(item['SupportEmail']); break;
        }
    }
    private quickViewProfile(email: string) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            size: ModalSizeType.Large,
            title: 'Thông tin tài khoản',
            objectExtra: { email: email },
            object: ModalViewProfileComponent,
        });
    }
}