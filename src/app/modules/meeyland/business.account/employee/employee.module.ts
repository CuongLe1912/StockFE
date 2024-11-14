import { RouterModule } from "@angular/router";
import { Component, NgModule, OnInit } from "@angular/core";
import { ShareModule } from "../../../../modules/share.module";
import { UtilityModule } from "../../../../modules/utility.module";
import { GridData } from "../../../../_core/domains/data/grid.data";
import { DataType } from "../../../../_core/domains/enums/data.type";
import { ResultApi } from "../../../../_core/domains/data/result.api";
import { EntityHelper } from "../../../../_core/helpers/entity.helper";
import { MLBusinessAccountService } from "../business.account.service";
import { ActionData } from "../../../../_core/domains/data/action.data";
import { AdminAuthGuard } from "../../../../_core/guards/admin.auth.guard";
import { UtilityExHelper } from "../../../../_core/helpers/utility.helper";
import { ModalSizeType } from "../../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../../_core/components/grid/grid.component";
import { MLEditEmployeeComponent } from "./edit.employee/edit.employee.component";
import { MLRemoveEmployeeComponent } from "./remove.employee/remove.employee.component";
import { ActionType, ControllerType } from "../../../../_core/domains/enums/action.type";
import { MLHistoryEmployeeComponent } from "./history.employee/history.employee.component";
import { MLCompanyEntity } from "../../../../_core/domains/entities/meeyland/ml.company.entity";
import { MLEmployeeEntity } from "../../../../_core/domains/entities/meeyland/ml.employee.entity";
import { ModalViewProfileComponent } from "../../../../_core/modal/view.profile/view.profile.component";
import { MLPopupViewUserComponent } from "../../../../modules/meeyuser/popup.view.user/popup.view.user.component";
import { MLEmployeeImportSaleComponent } from "./import.sale.company/import.sale.company.component";
import { MLEmployeeErrorImportSaleComponent } from "./confirm.import.sale.company/list.error.import.sale.company.component";
import { MLEmployeeConfirmImportSaleComponent } from "./confirm.import.sale.company/confirm.import.sale.company.component";
import { MLEmployeeListImportSaleComponent } from "./confirm.import.sale.company/list.import.service.agency.sale.component";

@Component({
    templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class MLEmployeeComponent extends GridComponent implements OnInit {
    id: number;
    obj: GridData = {
        Filters: [],
        Imports: [],
        Exports: [],
        Features: [
            {
                icon: 'la la-upload',
                name: ActionType.Upload,
                className: 'btn btn-warning',
                systemName: ActionType.AddNew,
                controllerName: ControllerType.MLEmployee,
                click: () => {
                  this.import();
                },
              },
            {
                name: 'Quay lại',
                icon: 'la la-hand-o-left',
                systemName: ActionType.View,
                className: 'btn btn-outline-secondary',
                controllerName: ControllerType.MLCompany,
                click: () => {
                    this.back();
                }
            },
            ActionData.addNew(() => { this.addNew(); }),
            ActionData.reload(() => { this.loadItems(); })
        ],
        Actions: [
            {
                name: 'Lịch sử',
                icon: 'la la-history',
                className: 'btn btn-info',
                systemName: this.ActionType.History,
                click: ((item: any) => {
                    this.history(item);
                })
            },
            {
                icon: 'la la-trash',
                name: 'Xóa nhân viên',
                className: 'btn btn-danger',
                systemName: this.ActionType.Delete,
                hidden: ((item: any) => {
                    return item.Status != 'active' && item.Status != 'locked' && item.Status != 'pending';
                }),
                click: ((item: any) => {
                    this.deleteVerify(item);
                })
            }
        ],
        MoreActions: [],
        UpdatedBy: false,
        Reference: MLEmployeeEntity,
        Title: 'Danh sách nhân viên',
        PageSizes: [5, 10, 20, 50, 100],
        Size: ModalSizeType.ExtraLarge,
        CustomFilters: ['Status', 'DateTime'],
        SearchText: 'Nhập tên, email, số điện thoại',
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
        this.breadcrumbs = [
            { Name: 'Khách hàng' },
            { Name: 'Tài khoản doanh nghiệp', Link: '/admin/mlcompany' },
        ];
    }

    async ngOnInit() {
        this.id = this.getParam('id');
        
        if (this.id) {
            this.obj.Url = '/admin/mlemployee/items?companyId=' + this.id;
            await this.loadItem();
            this.render(this.obj);
        }
        // refresh
        if (!this.subscribeRefreshGrids) {
            this.subscribeRefreshGrids = this.event.RefreshGrids.subscribe(async () => {
                await this.loadItems();
                // setTimeout(() => {                
                // }, 5000);
            });
        }
    }

    back() {
        if (this.state) {
            this.router.navigate([this.state.prevUrl], { state: { params: JSON.stringify(this.state) } });
        }
        else
            this.router.navigateByUrl('/admin/mlcompany');
    }

    addNew() {
        this.dialogService.WapperAsync({
            cancelText: 'Bỏ qua',
            title: 'Thêm nhân viên',
            size: ModalSizeType.Medium,
            objectExtra: { id: this.id },
            confirmText: 'Thêm nhân viên',
            object: MLEditEmployeeComponent,
        }, async () => {
            this.loadItems();
        });
    }

    private async loadItem() {
        if (this.id) {
            await this.service.item('MLCompany', this.id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    let item: MLCompanyEntity = EntityHelper.createEntity(MLCompanyEntity, result.Object as MLCompanyEntity);
                    if(this.breadcrumbs.findIndex(c => c.Name == item.Name) == -1)
                        this.breadcrumbs.push({ Name: item.Name });
                }
            });
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

    deleteVerify(item: MLEmployeeEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Hủy bỏ',
            confirmText: 'Đồng ý',
            size: ModalSizeType.Medium,
            objectExtra: {
                id: item.Id,
                balance: item['Balance']
            },
            title: 'Xác nhận xóa nhân viên',
            object: MLRemoveEmployeeComponent,
        }, async () => {
            this.loadItems();
        });
    }
    import() {
        this.dialogService.WapperAsync({
            cancelText: 'Bỏ qua',
            confirmText: 'Import',
            title: 'Import danh sách nhân viên',
            size: ModalSizeType.Medium,
            objectExtra: {
                companyId: this.id,
                
            },
            object: MLEmployeeImportSaleComponent,
        }, async () => {
            this.loadItems();
        });
    }
}

@NgModule({
    declarations: [
        MLEmployeeComponent,
        MLEditEmployeeComponent,
        MLRemoveEmployeeComponent,
        MLHistoryEmployeeComponent,
        MLEmployeeImportSaleComponent,
        MLEmployeeListImportSaleComponent,
        MLEmployeeErrorImportSaleComponent,
        MLEmployeeConfirmImportSaleComponent,
    ],
    imports: [
        ShareModule,
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: MLEmployeeComponent, pathMatch: 'full', data: { state: 'ml_employee' }, canActivate: [AdminAuthGuard] },
        ])
    ],
    providers: [MLBusinessAccountService]
})
export class MLEmployeeModule { }