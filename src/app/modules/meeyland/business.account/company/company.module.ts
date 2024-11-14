import { RouterModule } from "@angular/router";
import { Component, NgModule, OnInit } from "@angular/core";
import { ShareModule } from "../../../../modules/share.module";
import { UtilityModule } from "../../../../modules/utility.module";
import { GridData } from "../../../../_core/domains/data/grid.data";
import { DataType } from "../../../../_core/domains/enums/data.type";
import { MLCompanyViewComponent } from "./view/view.company.component";
import { MLBusinessAccountService } from "../business.account.service";
import { ActionData } from "../../../../_core/domains/data/action.data";
import { ActionType } from "../../../../_core/domains/enums/action.type";
import { UtilityExHelper } from "../../../../_core/helpers/utility.helper";
import { AdminAuthGuard } from "../../../../_core/guards/admin.auth.guard";
import { MLEmployeeListComponent } from "./components/employee.list.component";
import { MLCompanyApproveComponent } from "./approve/approve.company.component";
import { ModalSizeType } from "../../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../../_core/components/grid/grid.component";
import { MLAuditingCompanyComponent } from "./auditing/auditing.company.component";
import { NavigationStateData } from "../../../../_core/domains/data/navigation.state";
import { MLGridStatisticalCompany } from "./auditing/components/grid.statistical.company";
import { MLCompanyEntity } from "../../../../_core/domains/entities/meeyland/ml.company.entity";
import { ReceiveCustomerComponent } from "./components/receive.customer/receive.customer.component";
import { MLGridStatisticalDetailCompany } from "./auditing/components/grid.statistical.detail.company";
import { ModalViewProfileComponent } from "../../../../_core/modal/view.profile/view.profile.component";
import { MLCompanyStatusType } from "../../../../_core/domains/entities/meeyland/enums/ml.company.status.type";

@Component({
    templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class MLCompanyComponent extends GridComponent implements OnInit {
    obj: GridData = {
        Actions: [],
        Imports: [],
        Exports: [],
        Filters: [],
        Features: [
            ActionData.reload(() => { this.loadItems(); })
        ],
        MoreActions: [
            {
                name: 'Kiểm duyệt',
                icon: 'la la-list-alt',
                systemName: ActionType.Verify,
                hidden: ((item: any) => {
                    return !(item.StatusType == MLCompanyStatusType.Pending && item[ActionType.Verify])
                }),
                click: ((item: any) => {
                    this.verify(item);
                })
            },
            {
                icon: 'la la-signal',
                name: 'Đối soát - Lượt tra cứu',
                systemName: ActionType.Auditing,
                hidden: ((item: any) =>{
                    return !item.IsBank;
                }),
                click: ((item: any) => {
                    this.auditing(item);
                })
            },
            {
                icon: 'la la-group',
                name: 'Xem nhân viên',
                systemName: ActionType.View,
                controllerName: 'mlemployee',
                hidden: ((item: any) => {
                    return !(item[ActionType.View])
                }),
                click: ((item: any) => {
                    this.employee(item);
                })
            },
            {
                icon: 'la la-info',
                name: 'Xem yêu cầu đăng ký',
                systemName: ActionType.ViewRequestRegister,
                hidden: ((item: any) => {
                    return !(item[ActionType.ViewRequestRegister])
                }),
                click: ((item: MLCompanyEntity) => {
                    this.view(item);
                })
            }
        ],
        UpdatedBy: false,
        Reference: MLCompanyEntity,
        Size: ModalSizeType.ExtraLarge,
        Title: 'Tài khoản doanh nghiệp',
        PageSizes: [5, 10, 20, 50, 100],
        CustomFilters: ['Status', 'DateTime', 'TypeCompany'],
        SearchText: 'Nhập tên, email, số điện thoại',
    };

    constructor() {
        super();
    }

    async ngOnInit() {
        let allowViewMember = await this.authen.permissionAllow('mlemployee', ActionType.View);
        let allowViewRequestRegister = await this.authen.permissionAllow('mlcompany', ActionType.ViewRequestRegister);
        this.properties = [
            {
                Property: 'MeeyId', Title: 'MeeyId', Type: DataType.String,
                Format: ((item: any) => {
                    item['StatusType'] = item['Status'];
                    return UtilityExHelper.renderIdFormat(item.Id, item.MeeyId);
                })
            },
            allowViewRequestRegister
                ? {
                    Property: 'Name', Title: 'Tên đăng nhập', Type: DataType.String,
                    Format: ((item: any) => {
                        let text = '<a routerLink="view">' + item.Name + '</a>';
                        if (item.Phone) text += '<p><i class=\'la la-phone\'></i> ' + item.Phone + '</p>';
                        if (item.Email) text += '<p><i class=\'la la-inbox\'></i> ' + item.Email + '</p>';
                        return text;
                    })
                }
                : {
                    Property: 'Name', Title: 'Tên đăng nhập', Type: DataType.String,
                    Format: ((item: any) => {
                        let text = '<p>' + item.Name + '</p>';
                        if (item.Phone) text += '<p><i class=\'la la-phone\'></i> ' + item.Phone + '</p>';
                        if (item.Email) text += '<p><i class=\'la la-inbox\'></i> ' + item.Email + '</p>';
                        return text;
                    })
                },
            { Property: 'User', Title: 'Nhân viên Duyệt/Từ chối', Type: DataType.String },
            {
                Property: 'SaleEmail', Title: 'Nhân viên chăm sóc', Type: DataType.String,
                Format: ((item: any) => {
                    let text: string = '';
                    item['Sale'] = item.SaleEmail;
                    text += '<p>Sale: <a routerLink="quickView" type="sale">' + UtilityExHelper.escapeHtml(item.SaleEmail) + '</a></p>';
                    text += '<p>CSKH: <a routerLink="quickView" type="support">' + UtilityExHelper.escapeHtml(item.SupportEmail) + '</a></p>';
                    return text;
                })
            },
            allowViewMember
                ? {
                    Property: 'Amount', Title: 'Số lượng NV hiện tại', Type: DataType.String, Align: 'center',
                    Format: ((item: any) => {
                        return item.Amount + ' nhân viên'
                    }),
                    Click: ((item: any) => {
                        this.employee(item);
                    })
                }
                : {
                    Property: 'Amount', Title: 'Số lượng NV hiện tại', Type: DataType.String, Align: 'center',
                    Format: ((item: any) => {
                        return item.Amount + ' nhân viên'
                    })
                },
            {
                Property: 'TypeCompany', Title: 'Phân loại DN', Type: DataType.String,
                Format: (item) => {
                    if (item.IsBank) return 'Dùng cổng riêng';
                    return 'DN thường';
                }
            },
            { Property: 'Status', Title: 'Trạng thái', Type: DataType.String, Align: 'center' },
            { Property: 'DateTime', Title: 'Ngày thực hiện', Type: DataType.DateTime, Align: 'center' },
        ];
        this.render(this.obj);
    }

    receiveCustomer(item: any) {
        this.dialogService.WapperAsync({
            cancelText: 'Hủy',
            confirmText: 'Nhận khách',
            size: ModalSizeType.Medium,
            objectExtra: { id: item.Id },
            object: ReceiveCustomerComponent,
            title: 'Nhận khách hàng [' + item.Name + ']',
        }, async () => {
            this.loadItems();
        });
    }

    renderSubTable(item: any) {
        this.renderSubTableComponent(item, MLEmployeeListComponent, {
            id: item.Id
        });
    }

    view(item: MLCompanyEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            objectExtra: { id: item.Id },
            size: ModalSizeType.ExtraLarge,
            object: MLCompanyViewComponent,
            title: 'Xem yêu cầu đăng ký tài khoản doanh nghiệp',
        });
    }

    verify(item: MLCompanyEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            rejectText: 'Từ chối',
            confirmText: 'Xác nhận',
            objectExtra: { id: item.Id },
            size: ModalSizeType.ExtraLarge,
            object: MLCompanyApproveComponent,
            title: 'Kiểm duyệt yêu cầu đăng ký tài khoản doanh nghiệp'
        }, async () => {
            this.loadItems();
        }, async () => {
            this.loadItems();
        });
    }

    employee(item: MLCompanyEntity) {
        let obj: NavigationStateData = {
            id: item.Id,
            prevUrl: '/admin/mlcompany',
        };
        this.router.navigateByUrl('/admin/mlemployee?id=' + item.Id, { state: { params: JSON.stringify(obj) } });
    }

    auditing(item: MLCompanyEntity) {
        let obj: NavigationStateData = {
            id: item.Id,
            prevUrl: '/admin/mlcompany',
        };
        this.router.navigateByUrl('/admin/mlcompany/auditing?id=' + item.Id, { state: { params: JSON.stringify(obj) } });
    }

    quickView(item: any, type: string) {
        switch (type) {
            case 'sale': this.quickViewProfile(item['SaleId']); break;
            case 'support': this.quickViewProfile(item['SupportId']); break;
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
}

@NgModule({
    declarations: [
        MLCompanyComponent,
        ReceiveCustomerComponent,
        MLAuditingCompanyComponent,
        MLGridStatisticalCompany,
        MLGridStatisticalDetailCompany,
    ],
    imports: [
        ShareModule,
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: MLCompanyComponent, pathMatch: 'full', data: { state: 'ml_company' }, canActivate: [AdminAuthGuard] },
            { path: 'auditing', component: MLAuditingCompanyComponent, pathMatch: 'full', data: { state: 'ml_auditing' }, canActivate: [AdminAuthGuard] },
        ])
    ],
    providers: [MLBusinessAccountService]
})
export class MLCompanyModule { }