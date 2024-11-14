import { Component, OnInit } from "@angular/core";
import { AppConfig } from "../../../_core/helpers/app.config";
import { GridData } from "../../../_core/domains/data/grid.data";
import { DataType } from "../../../_core/domains/enums/data.type";
import { ActionData } from "../../../_core/domains/data/action.data";
import { MCRMEmployeeListComponent } from "./employee.list.component";
import { UtilityExHelper } from "../../../_core/helpers/utility.helper";
import { MCRMCompanyViewComponent } from "./view/view.company.component";
import { ModalSizeType } from "../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../_core/components/grid/grid.component";
import { MCRMCompanyApproveComponent } from "./approve/approve.company.component";
import { ActionType, ControllerType } from "../../../_core/domains/enums/action.type";
import { MLCompanyEntity } from "../../../_core/domains/entities/meeyland/ml.company.entity";
import { ModalViewProfileComponent } from "../../../_core/modal/view.profile/view.profile.component";
import { MLCompanyStatusType } from "../../../_core/domains/entities/meeyland/enums/ml.company.status.type";
import { MCRMCompanyUpdateStatusComponent } from "./updatestatus/updatestatus.company.component";

@Component({
    selector: 'mcrm-grid-customer-company',
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class MCRMCustomerCompanyComponent extends GridComponent implements OnInit {
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
                controllerName: ControllerType.MLCompany,
                hidden: ((item: any) => {
                    return !(item.StatusType == MLCompanyStatusType.Pending && item[ActionType.Verify])
                }),
                click: ((item: any) => {
                    this.verify(item);
                })
            },
            {
                icon: 'la la-group',
                name: 'Xem nhân viên',
                systemName: ActionType.View,
                controllerName: ControllerType.MLEmployee,
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
                controllerName: ControllerType.MLCompany,
                systemName: ActionType.ViewRequestRegister,
                hidden: ((item: any) => {
                    return !(item[ActionType.ViewRequestRegister])
                }),
                click: ((item: MLCompanyEntity) => {
                    this.view(item);
                })
            }
            // {
            //     name: 'Cập nhật trạng thái',
            //     icon: 'la la-list-alt',
            //     systemName: ActionType.UpdateStatus,
            //     controllerName: ControllerType.MLCompany,
            //     click: ((item: MLCompanyEntity) => {
            //         this.updateStatus(item);
            //     })
            // }
        ],
        UpdatedBy: false,
        Reference: MLCompanyEntity,
        Size: ModalSizeType.ExtraLarge,
        Title: 'Tài khoản doanh nghiệp',
        PageSizes: [5, 10, 20, 50, 100],
        CustomFilters: ['Status', 'DateTime'],
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
                    item['Support'] = item.SupportEmail;
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
            { Property: 'Status', Title: 'Trạng thái', Type: DataType.String, Align: 'center' },
            { Property: 'DateTime', Title: 'Ngày thực hiện', Type: DataType.DateTime, Align: 'center' },
        ];
        await this.render(this.obj);
    }

    renderSubTable(item: any) {
        this.renderSubTableComponent(item, MCRMEmployeeListComponent, {
            id: item.Id
        });
    }

    view(item: MLCompanyEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            objectExtra: { id: item.Id },
            size: ModalSizeType.ExtraLarge,
            object: MCRMCompanyViewComponent,
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
            object: MCRMCompanyApproveComponent,
            title: 'Kiểm duyệt yêu cầu đăng ký tài khoản doanh nghiệp'
        }, async () => {
            this.loadItems();
        }, async () => {
            this.loadItems();
        });
    }

    employee(item: MLCompanyEntity) {
        let url = AppConfig.getProtocol() + '//' + AppConfig.getDomain() + '/admin/mlemployee?id=' + item.Id;
        window.open(url, "_blank");
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
    updateStatus(item: any) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            confirmText: 'Xác nhận',
            objectExtra: { id: item.Id },
            size: ModalSizeType.ExtraLarge,
            object: MCRMCompanyUpdateStatusComponent,
            title: 'Cập nhật trạng thái tài khoản doanh nghiệp'
        }, async () => {
            this.loadItems();
        });
    }
}