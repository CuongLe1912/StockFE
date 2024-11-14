import * as _ from 'lodash';
import { AppInjector } from '../../../../app.module';
import { MeeyCrmService } from '../../meeycrm.service';
import { AppConfig } from '../../../../_core/helpers/app.config';
import { GridData } from '../../../../_core/domains/data/grid.data';
import { DataType } from '../../../../_core/domains/enums/data.type';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { ActionType } from '../../../../_core/domains/enums/action.type';
import { UtilityExHelper } from '../../../../_core/helpers/utility.helper';
import { ConstantHelper } from '../../../../_core/helpers/constant.helper';
import { BaseEntity } from '../../../../_core/domains/entities/base.entity';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalSizeType } from '../../../../_core/domains/enums/modal.size.type';
import { GridComponent } from '../../../../_core/components/grid/grid.component';
import { MafAffiliateEntity } from '../../../../_core/domains/entities/meeyaffiliate/affiliate.entity';
import { MCRMCustomerRequestStatusType } from '../../../../_core/domains/entities/meeycrm/enums/mcrm.customer.type';

@Component({
    selector: 'mcrm-customer-list-assign',
    templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class MCRMListAssignComponent extends GridComponent implements OnInit {
    crmId: string;
    obj: GridData = {
        Imports: [],
        Exports: [],
        Filters: [],
        Actions: [],
        Features: [],
        IsPopup: true,
        UpdatedBy: false,
        HideSearch: true,
        HidePaging: true,
        NotKeepPrevData: true,
        HideHeadActions: true,
        HideCustomFilter: true,
        Reference: MafAffiliateEntity,
        Size: ModalSizeType.ExtraLarge,
    };
    @Input() rootId: number;
    @Input() viewer: boolean;
    crmService: MeeyCrmService;
    @Input() action: ActionType;
    @Input() customers: MafAffiliateEntity[];
    @Input() statusRequest: MCRMCustomerRequestStatusType;
    @Output() selected: EventEmitter<any> = new EventEmitter<any>();
    @Output() removed: EventEmitter<any[]> = new EventEmitter<any[]>();

    constructor() {
        super();
        this.crmService = AppInjector.get(MeeyCrmService);
        this.properties = [
            { Property: 'Index', Title: 'STT', Type: DataType.Number, Align: 'center', ColumnWidth: 80, DisableOrder: true },
            {
                Property: 'MeeyId', Title: 'Khách hàng', Type: DataType.String, ColumnWidth: 120, DisableOrder: true,
                Format: ((item: any) => {
                    item['OrgMeeyId'] = item.MeeyId;
                    let text = '';
                    if (item.Name) text += '<p>' + item.Name + '</p>';
                    if (item.Name) text += '<p>MeeyID: <a routerLink="quickView" type="user">' + item.MeeyId + '</a></p>';
                    return text;
                })
            },
            {
                Property: 'Phone', Title: 'Thông tin liên lạc', Type: DataType.String,
                Format: ((item: any) => {
                    let text = '';
                    if (item.Phone) {
                        let phone = item.Phone || '';
                        while (phone.indexOf('/') >= 0) phone = phone.replace('/', ',');
                        while (phone.indexOf(';') >= 0) phone = phone.replace(';', ',');
                        phone = phone.split(',').map(c => c.trim()).filter((v, i, a) => a.indexOf(v) === i).join(', ');
                        phone = UtilityExHelper.trimChars(phone, [' ', ',']);
                        if (phone) text += '<p><i class=\'la la-phone\'></i> ' + phone + '</p>';
                    }
                    if (item.Email) {
                        let email = item.Email || '';
                        while (email.indexOf('/') >= 0) email = email.replace('/', ',');
                        while (email.indexOf(';') >= 0) email = email.replace(';', ',');
                        email = email.split(',').map(c => c.trim()).filter((v, i, a) => a.indexOf(v) === i).join(', ');
                        email = UtilityExHelper.trimChars(email, [' ', ',']);
                        if (email) text += '<p><i class=\'la la-inbox\'></i> ' + email + '</p>';
                    }
                    return text;
                })
            },
            // {
            //     Property: 'ParentText', Title: 'Người giới thiệu', Type: DataType.String,
            //     Format: ((item) => {
            //         if (!item?.Parent) return '';
            //         let text: string = '';
            //         if (item.Parent?.Name)
            //             text += '<p><a routerLink="quickView" type="parent">' + UtilityExHelper.escapeHtml(item.Parent.Name) + '</a></p>';
            //         if (item.Parent?.Phone) text += '<p><i class=\'la la-phone\'></i> ' + UtilityExHelper.escapeHtml(item.Parent.Phone);
            //         if (item.Branch) text += ' - ' + item.Branch;
            //         text += '</p>';
            //         return text;
            //     })
            // },
            {
                Property: 'Sale', Title: 'Nhân viên chăm sóc', Type: DataType.String, DisableOrder: true,
                Format: ((item: any) => {
                    let text: string = '';
                    text += '<p>Sale: ' + UtilityExHelper.escapeHtml(item.Sale) + '</p>';
                    text += '<p>CSKH: ' + UtilityExHelper.escapeHtml(item.Support) + '</p>';
                    return text;
                })
            },
            {
                Property: 'CustomerStatusType', Title: 'Trạng thái', Type: DataType.String, Align: 'center', DisableOrder: true,
                Format: ((item: any) => {
                    let text: string = '';
                    if (item.CustomerStatusType) {
                        let option = ConstantHelper.ML_CUSTOMER_STATUS_TYPES.find(c => c.value == item.CustomerStatusType);
                        if (option) text = '<p class="' + (option && option.color) + '">' + (option && option.label) + '</p>';
                    }
                    if (item.CustomerPotentialType) {
                        let option = ConstantHelper.ML_CUSTOMER_POTETIAL_TYPES.find(c => c.value == item.CustomerPotentialType);
                        if (option) text += '<p>' + (option && option.label) + '</p>';
                    }
                    return text;
                })
            },
        ];
    }

    async ngOnInit() {
        if (this.action) {
            if (this.action == ActionType.GroupCustomer) {
                this.properties.push({
                    Property: this.action, Title: 'Khách hàng gốc', Type: DataType.String, Align: 'center',
                    Click: ((item: any) => {
                        let originalItem = this.originalItems.find(c => c.Id == item.Id);
                        this.selected.emit(originalItem);
                    }),
                    Format: ((item: any) => {
                        let checked = item.Id == this.rootId;
                        let disabled = ''
                        if (this.viewer) {
                            disabled = 'disabled'
                        }
                        let text = '<label class="kt-radio kt-radio--bold" style="padding-left: 20px; margin-bottom: 15px;"><input type="radio" name="group_customer" ' + disabled + (checked ? ' checked' : '') + '><span></span></label>';
                        return text;
                    })
                });
            } else {
                let message = this.action == ActionType.AssignSale
                    ? 'Khách hàng thuộc Sale khác'
                    : this.action == ActionType.AssignSupport ? 'Khách hàng thuộc CSKH khác' : '';
                this.properties.unshift(
                    {
                        Property: this.action, Title: 'Cho phép', Type: DataType.String, Align: 'center', ColumnWidth: 100, DisableOrder: true,
                        Format: (item: any) => {
                            let checked = item[this.action];
                            let text = '<p class="d-flex align-items-center justify-content-center">'
                                + (checked ? '<i class="la la-check-circle icon-lg text-success"></i>' : '<i class="la la-ban icon-lg text-danger"></i>')
                                + '</p>';
                            if (!checked) text += '<p style="font-size: small;" class="text-danger">(' + message + ')</p>';
                            return text;
                        }
                    },
                );
            }
        }
        this.items = _.cloneDeep(this.customers) || [];
        // this.items.forEach((item: any, index: number) => {
        //     item.Index = index + 1;
        // });
        this.reloadItems(this.items);
    }

    private renderAction() {
        if (this.items && this.items.length > 1 && !this.viewer) {
            let action = {
                icon: 'la la-trash',
                name: ActionType.Delete,
                className: 'btn btn-danger',
                systemName: ActionType.Empty,
                hidden: (item: any) => {
                    return !this.items || this.items.length <= 1;
                },
                click: (item: any) => {
                    this.dialogService.Confirm('Bạn có chắc chắn muốn xóa khách hàng này khỏi danh sách điều chuyển?', () => {
                        this.originalItems = this.originalItems.filter(c => c.Id != item.Id);
                        this.originalItems.forEach((item: any, index: number) => {
                            item.Index = index + 1;
                        });
                        this.items = this.items.filter(c => c.Id != item.Id);
                        this.items.forEach((item: MafAffiliateEntity, index: number) => {
                            item.Index = index + 1;
                        });
                        this.removed.emit(this.originalItems);
                    })
                }
            };
            if (this.obj.Actions.length == 0)
                this.obj.Actions.push(action);
        }
    }

    async view(item: any) {
        await this.crmService.getCustomerbyMeeyId(item.OrgMeeyId).then((result: ResultApi) => {
            if (ResultApi.IsSuccess(result)) {
                this.crmId = result.Object?.Id;
            }
            }, (e) => {
                ToastrHelper.Exception(e);
            });
        let url = AppConfig.getProtocol() + '//' + AppConfig.getDomain() + '/admin/meeycrm/customer/view?id=' + this.crmId;
        window.open(url, "_blank");
    }

    reloadItems(customers: BaseEntity[]) {
        if (customers && customers.length > 0) {
            customers.forEach((item: MafAffiliateEntity, index: number) => {
                item.Index = index + 1;
            });
        }
        this.items = customers;
        this.renderAction();
        this.render(this.obj, this.items);
    }

    quickView(item: any, type: string) {
        let originalItem = this.originalItems.find(c => c.Id == item.Id);
        if (originalItem) {
            switch (type) {
                case 'user': this.view(item); break;
            }
        }
    }
}