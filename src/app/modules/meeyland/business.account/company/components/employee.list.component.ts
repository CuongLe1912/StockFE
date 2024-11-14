import { Component, Input, OnInit } from "@angular/core";
import { GridData } from "../../../../../_core/domains/data/grid.data";
import { DataType } from "../../../../../_core/domains/enums/data.type";
import { UtilityExHelper } from "../../../../../_core/helpers/utility.helper";
import { GridComponent } from "../../../../../_core/components/grid/grid.component";
import { ModalSizeType } from "../../../../../_core/domains/enums/modal.size.type";
import { MLEmployeeEntity } from "../../../../../_core/domains/entities/meeyland/ml.employee.entity";
import { MLHistoryEmployeeComponent } from "../../employee/history.employee/history.employee.component";
import { ModalViewProfileComponent } from "../../../../../_core/modal/view.profile/view.profile.component";
import { MLPopupViewUserComponent } from "../../../../../modules/meeyuser/popup.view.user/popup.view.user.component";

@Component({
    templateUrl: '../../../../../_core/components/grid/grid.component.html',
})
export class MLEmployeeListComponent extends GridComponent implements OnInit {
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
        Reference: MLEmployeeEntity,
    };

    constructor() {
        super();
        this.properties = [
            {
                Property: 'MeeyId', Title: 'MeeyId', Type: DataType.String,
                Format: ((item: any) => {
                    return UtilityExHelper.renderIdFormat(item.Id, item.MeeyId);
                })
            },
            {
                Property: 'Name', Title: 'Thành viên', Type: DataType.String,
                Format: ((item: any) => {
                    return UtilityExHelper.renderUserInfoFormat(item.Name, item.Phone, item.Email, true);
                })
            },
            {
                Property: 'DateTime', Title: 'Trạng thái', Type: DataType.String, Align: 'center',
                Format: ((item: any) => {
                    let text = item.Status;
                    switch (item.Status) {
                        case 'active': text = '<p style="padding: 5px ; width: 100px;" class="kt-badge kt-badge--inline kt-badge--success">Đang hoạt động</p>';
                            break;
                        case 'pending': text = '<p style="padding: 5px; width: 100px;" class="kt-badge kt-badge--inline kt-badge--warning">Chờ xác nhận</p>';
                            break;
                        case 'canceled': text = '<p style="padding: 5px; width: 100px;" class="kt-badge kt-badge--inline kt-badge--danger">Hủy lời mời</p>';
                            break;
                        case 'rejected': text = '<p style="padding: 5px; width: 100px;" class="kt-badge kt-badge--inline kt-badge--danger">Từ chối</p>';
                            break;
                        case 'locked': text = '<p style="padding: 5px; width: 100px;" class="kt-badge kt-badge--inline kt-badge--danger">Đã khóa</p>';
                            break;
                        case 'deleted': text = '<p style="padding: 5px; width: 100px;" class="kt-badge kt-badge--inline kt-badge--danger">Đã xóa</p>';
                            break;
                    }
                    if (item.DateTime) {
                        let date = UtilityExHelper.dateString(item.DateTime);
                        text += '<p style="margin-top: 5px"><i class=\'la la-calendar-check-o\'></i> ' + date + '</p>';
                    }
                    return text;
                })
            },
            {
                Property: 'SaleEmail', Title: 'Nhân viên chăm sóc', Type: DataType.String,
                Format: ((item: any) => {
                    let text: string = '';
                    text += '<p>Sale: <a routerLink="quickView" type="sale">' + UtilityExHelper.escapeHtml(item.SaleEmail) + '</a></p>';
                    text += '<p>CSKH: <a routerLink="quickView" type="support">' + UtilityExHelper.escapeHtml(item.SupportEmail) + '</a></p>';
                    return text;
                })
            },
            {
                Property: 'MainTranferAmount', Title: 'Số tiền đã chuyển', Type: DataType.String, ColumnWidth: 220,
                Format: ((item: any) => {
                    let text: string = '',
                        mainMoney = item.MainTranferAmount == null ? '--' : item.MainTranferAmount.toLocaleString("vi-VN", { maximumFractionDigits: 2 }) + ' đ',
                        bonusMoney = item.BonusTranferAmount == null ? '--' : item.BonusTranferAmount.toLocaleString("vi-VN", { maximumFractionDigits: 2 }) + ' đ';
                    text += '<p style="color: #5867dd;" class="d-flex align-items-center justify-content-between"><span style="width: 120px; display: inline-block;"><i class=\'la la-caret-right\'></i><b>TK Chính: </span><span>' + mainMoney + '</span></b></p>';
                    text += '<p class="d-flex align-items-center justify-content-between"><span style="width: 120px; display: inline-block;"><i class=\'la la-caret-right\'></i>TKKM2: </span><span>' + bonusMoney + '</span></p>';
                    return text;
                })
            },
            {
                Property: 'MainBalance', Title: 'Số tiền còn lại', Type: DataType.String, ColumnWidth: 220,
                Format: ((item: any) => {
                    let text: string = '',
                        mainMoney = item.MainBalance == null ? '--' : item.MainBalance.toLocaleString("vi-VN", { maximumFractionDigits: 2 }) + ' đ',
                        bonusMoney = item.BonusBalance == null ? '--' : item.BonusBalance.toLocaleString("vi-VN", { maximumFractionDigits: 2 }) + ' đ';
                    text += '<p style="color: #5867dd;" class="d-flex align-items-center justify-content-between"><span style="width: 120px; display: inline-block;"><i class=\'la la-caret-right\'></i> <b>TK Chính: </span><span>' + mainMoney + '</span></b></p>';
                    text += '<p class="d-flex align-items-center justify-content-between"><span style="width: 120px; display: inline-block;"><i class=\'la la-caret-right\'></i> TKKM2: </span><span>' + bonusMoney + '</span></p>';
                    item['Balance'] = item.MainBalance || item.BonusBalance ? text : null;
                    return text;
                })
            },
        ];
    }

    async ngOnInit() {
        let id = this.params && this.params['id'];
        if (id) {
            this.obj.Url = '/admin/mlemployee/items?companyId=' + id;
            this.render(this.obj);
        }
    }

    quickView(item: any, type: string) {
        switch (type) {
            case 'sale': this.quickViewProfile(item['SaleId']); break;
            case 'support': this.quickViewProfile(item['SupportId']); break;
            default: {
                this.dialogService.WapperAsync({
                    cancelText: 'Đóng',
                    size: ModalSizeType.Large,
                    object: MLPopupViewUserComponent,
                    title: 'Xem thông tin người dùng',
                    objectExtra: { meeyId: item.MeeyUserId }
                });
            }
        }
    }
    public quickViewProfile(id: number) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            objectExtra: { id: id },
            size: ModalSizeType.Large,
            title: 'Thông tin tài khoản',
            object: ModalViewProfileComponent,
        });
    }
    
    history(item: MLEmployeeEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            objectExtra: { id: item.Id },
            title: 'Xem lịch sử nhân viên',
            size: ModalSizeType.ExtraLarge,
            object: MLHistoryEmployeeComponent,
        });
    }
}