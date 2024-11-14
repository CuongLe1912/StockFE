import * as _ from 'lodash';
import { Component, OnInit } from '@angular/core';
import { GridData } from "../../../../_core/domains/data/grid.data";
import { DataType } from '../../../../_core/domains/enums/data.type';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ActionData } from '../../../../_core/domains/data/action.data';
import { MethodType } from '../../../../_core/domains/enums/method.type';
import { ActionType } from "../../../../_core/domains/enums/action.type";
import { UtilityExHelper } from "../../../../_core/helpers/utility.helper";
import { ModalSizeType } from "../../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../../_core/components/grid/grid.component";
import { NavigationStateData } from "../../../../_core/domains/data/navigation.state";
import { MCRMCustomerBankHistoryComponent } from './grid.customer.bank.history.component';
import { MLCompanyEntity } from '../../../../_core/domains/entities/meeyland/ml.company.entity';
import { MCRMCustomerBankEditComponent } from './customer.bank.edit/customer.bank.edit.component';
import { ModalViewProfileComponent } from "../../../../_core/modal/view.profile/view.profile.component";
import { MLCompanyStatusType } from '../../../../_core/domains/entities/meeyland/enums/ml.company.status.type';
import { MLCompanyViewComponent } from '../../../../modules/meeyland/business.account/company/view/view.company.component';
import { MLEmployeeListComponent } from '../../../../modules/meeyland/business.account/company/components/employee.list.component';
import { MLCompanyApproveComponent } from '../../../../modules/meeyland/business.account/company/approve/approve.company.component';
import { MCRMCustomerBankAddTurnAuditingComponent } from './customer.bank.add.turn.auditing/customer.bank.add.turn.auditing.component';

@Component({
    selector: 'mcrm-grid-customer-bank',
    templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class MCRMGridCustomerBankComponent extends GridComponent implements OnInit {
    obj: GridData = {
        Actions: [],
        Imports: [],
        Exports: [],
        Filters: [],
        Features: [
            ActionData.addNew(() => this.addNew()),
            ActionData.reload(() => this.loadItems())
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
                icon: 'la la-pencil',
                name: 'Sửa thông tin doanh nghiệp',
                systemName: ActionType.Edit,
                click: (item: any) => {
                    this.edit(item);
                }
            },
            {
                icon: 'la la-expand',
                name: 'Cấp phát - Lượt tra cứu',
                systemName: ActionType.AddNew,
                click: ((item: any) => {
                    this.addAuditing(item);
                })
            },
            {
                icon: 'la la-signal',
                name: 'Đối soát - Lượt tra cứu',
                systemName: ActionType.Auditing,
                click: ((item: any) => {
                    this.auditing(item);
                })
            },
            {
                icon: 'la la-history',
                name: 'Xem lịch sử',
                systemName: ActionType.History,
                click: ((item: any) => {
                    this.history(item);
                })
            },
        ],
        UpdatedBy: false,
        Reference: MLCompanyEntity,
        Size: ModalSizeType.ExtraLarge,
        Title: 'Tài khoản doanh nghiệp',
        PageSizes: [5, 10, 20, 50, 100],
        CustomFilters: ['Status', 'SaleId', 'SupportId'],
        SearchText: 'Nhập tên, email, số điện thoại',
        NotKeepPrevData: true,
        AsynLoad: () => this.asynLoad(),
    };

    constructor() {
        super();
    }

    async ngOnInit() {
        let allowViewMember = await this.authen.permissionAllow('mlemployee', ActionType.View);
        this.properties = [
            {
                Property: 'MeeyIdText', Title: 'MeeyId', Type: DataType.String,
                Format: ((item: any) => {
                    item['StatusType'] = item['Status'];
                    return UtilityExHelper.renderIdFormat(item.Id, item.MeeyId);
                })
            },
            {
                Property: 'NameText', Title: 'Khách hàng', Type: DataType.String,
                Format: ((item) => {
                    if (!item.Name) return ''
                    let text = '<a routerLink="view">' + item.Name + '</a>';
                    return text;
                })
            },
            { Property: 'Status', Title: 'Trạng thái', Type: DataType.String, Align: 'center' },
            { Property: 'TaxCode', Title: 'Mã số thuế', Type: DataType.String },
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
                    Property: 'Amount', Title: 'Số nhân viên', Type: DataType.String, Align: 'center',
                    Format: ((item: any) => {
                        return item.Amount + ' nhân viên'
                    }),
                    Click: ((item: any) => {
                        this.employee(item);
                    })
                }
                : {
                    Property: 'Amount', Title: 'Số nhân viên', Type: DataType.String, Align: 'center',
                    Format: ((item: any) => {
                        return item.Amount + ' nhân viên'
                    })
                },
            {
                Property: 'Customer', Title: 'Thông tin liên lạc', Type: DataType.String,
                Format: ((item: any) => {
                    let text = '';
                    if (item.Phone) text += '<p><i class=\'la la-phone\'></i> ' + item.Phone + '</p>';
                    if (item.Email) text += '<p><i class=\'la la-inbox\'></i> ' + item.Email + '</p>';
                    if (item.Address) text += '<p><i class=\'fa fa-address-card\'></i> ' + item.Address + '</p>';
                    return text;
                })
            },
            {
                Property: 'Domain', Title: 'Tên Domain', Type: DataType.String,
                Format: (item) => {
                    if (!item.Domain) return '';
                    return '<a href="' + item.Domain + '" target="_blank">' + item.Domain + '</a>';
                }
            },
            {
                Property: 'CountGroup', Title: 'Số lượt tra cứu đã dùng', Type: DataType.String,
                Format: ((item: any) => {
                    return '<div class="kt-spinner kt-spinner--v2 kt-spinner--primary"></div>';
                })
            },

        ];

        this.itemData.Filters = (this.itemData && this.itemData.Filters && this.itemData.Filters.filter(c => c.Name != 'TypeCompany')) || [];
        this.itemData.Filters.push({
            Name: 'TypeCompany',
            Value: true,
        });
        this.render(this.obj);
    }

    renderSubTable(item: any) {
        this.renderSubTableComponent(item, MLEmployeeListComponent, {
            id: item.Id
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
            prevUrl: '/admin/meeycrm/customer',
            object: {
                tab: 'customer-bank',
            }
        };
        this.router.navigate(['/admin/mlemployee'], { state: { params: JSON.stringify(obj) } });
    }

    auditing(item: MLCompanyEntity) {
        let obj: NavigationStateData = {
            id: item.Id,
            prevUrl: '/admin/meeycrm/customer',
            object: {
                tab: 'customer-bank',
            }
        };
        this.router.navigateByUrl('/admin/mlcompany/auditing?id=' + item.Id, { state: { params: JSON.stringify(obj) } });
    }

    addNew() {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            confirmText: 'Xác nhận',
            size: ModalSizeType.ExtraLarge,
            title: 'Thêm mới Doanh Nghiệp Bank',
            object: MCRMCustomerBankEditComponent,
        }, () => this.loadItems());
    }

    edit(item: any) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: 'Sửa Doanh Nghiệp Bank',
            object: MCRMCustomerBankEditComponent,
            confirmText: 'Cập nhật',
            objectExtra: { id: item.Id },
            size: ModalSizeType.ExtraLarge,
        }, () => this.loadItems());
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

    addAuditing(item: MLCompanyEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            confirmText: 'Xác nhận',
            objectExtra: { item: item },
            size: ModalSizeType.Large,
            title: 'Cấp phát lượt tra cứu',
            object: MCRMCustomerBankAddTurnAuditingComponent,
        });
    }

    public history(item: MLCompanyEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            objectExtra: { meeyId: item.UserMeeyId },
            size: ModalSizeType.Large,
            title: 'Xem lịch sử',
            object: MCRMCustomerBankHistoryComponent,
        });
    }

    asynLoad() {
        const list = this.items && this.items.map(c => { return c["MeeyId"] });
        const params = {
            users: list,
        }

        this.service.callApi("MLCompany", "AuditingBanks", params, MethodType.Post).then((result: ResultApi) => {
            if (ResultApi.IsSuccess(result)) {
                if (result.Object) {
                    const countGroup = result.Object;
                    this.items.forEach((item: any) => {
                        const key = Object.keys(countGroup).find(c => c == item.MeeyId);
                        const count = countGroup[key];
                        item.CountGroup = count ? count : 0;
                    })
                }
            }
        });
    }
}