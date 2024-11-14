import * as _ from 'lodash';
import { AppInjector } from '../../../../app.module';
import { MeeyCrmService } from '../../meeycrm.service';
import { Component, Input, OnInit } from "@angular/core";
import { AppConfig } from '../../../../_core/helpers/app.config';
import { GridData } from "../../../../_core/domains/data/grid.data";
import { DataType } from "../../../../_core/domains/enums/data.type";
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ConstantHelper } from "../../../../_core/helpers/constant.helper";
import { UtilityExHelper } from "../../../../_core/helpers/utility.helper";
import { BaseEntity } from "../../../../_core/domains/entities/base.entity";
import { ModalSizeType } from "../../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../../_core/components/grid/grid.component";
import { NavigationStateData } from "../../../../_core/domains/data/navigation.state";
import { ActionType, ControllerType } from "../../../../_core/domains/enums/action.type";
import { MCRMCustomerEntity } from "../../../../_core/domains/entities/meeycrm/mcrm.customer.entity";
import { ModalViewProfileComponent } from "../../../../_core/modal/view.profile/view.profile.component";
import { MCRMCustomerNoteCallStatusType, MCRMCustomerStatusType } from "../../../../_core/domains/entities/meeycrm/enums/mcrm.customer.type";
import { ViewMCRMRequestGroupComponent } from '../../customer.request/request.group/components/view.request.group/view.request.group.component';

@Component({
    templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class MCRMCustomerListChildComponent extends GridComponent implements OnInit {
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
        Reference: MCRMCustomerEntity,
    };
    @Input() params: any;
    crmService: MeeyCrmService;

    constructor() {
        super();
        this.crmService = AppInjector.get(MeeyCrmService);
    }

    async ngOnInit() {
        let allowViewDetail = await this.authen.permissionAllow(ControllerType.MCRMCustomer, ActionType.ViewDetail)
        this.properties = [
            {
                Property: 'MeeyId', Title: 'Khách hàng', Type: DataType.String,
                Format: ((item: any) => {
                    let text = '',
                        allow = item[ActionType.ViewDetail] && allowViewDetail;
                    if (item.Name) {
                        text += allow
                            ? '<p routerLink="quickView" type="view"><a>' + item.Name + '</a></p>'
                            : '<p>' + item.Name + '</p>';
                    }
                    if (item.Code) {
                        text += allow
                            ? '<p routerLink="quickView" type="view">CRM Id: <a>' + item.Code + '</a></p>'
                            : '<p>CRM Id: ' + item.Code + '</p>';
                    }
                    if (item.CustomerType != null && item.CustomerType != undefined) {
                        let option = ConstantHelper.ML_CUSTOMER_TYPES.find(c => c.value == item.CustomerType);
                        if (option) text += '<p><i class=\'la la-user\'></i> ' + option.label + '</p>';
                    }
                    if (item.Source) {
                        text += '<p><i class=\'la la-globe\'></i> ' + item.Source + '</p>';
                    }
                    if (item.CreatedDate) {
                        let date = UtilityExHelper.dateTimeString(item.CreatedDate);
                        text += '<p><i class=\'la la-calendar\'></i> ' + date + '</p>';
                    }
                    return text;
                })
            },
            {
                Property: 'Sale', Title: 'Nhân viên chăm sóc', Type: DataType.String,
                Format: ((item: any) => {
                    let text: string = '';
                    item['SaleEmail'] = item.Sale;
                    item['SupportEmail'] = item.Support;
                    text += '<p>Sale: <a routerLink="quickView" type="sale">' + UtilityExHelper.escapeHtml(item.Sale) + '</a></p>';
                    text += '<p>CSKH: <a routerLink="quickView" type="support">' + UtilityExHelper.escapeHtml(item.Support) + '</a></p>';
                    return text;
                })
            },
            {
                Property: 'CustomerStatusType', Title: 'Trạng thái', Type: DataType.String, Align: 'center',
                Format: ((item: MCRMCustomerEntity) => {
                    let text: string = '';
                    item['CustomerStatusTypeOrg'] = item.CustomerStatusType;
                    if (item.CustomerStatusType != null && item.CustomerStatusType != undefined) {
                        let option = ConstantHelper.ML_CUSTOMER_STATUS_TYPES.find(c => c.value == item.CustomerStatusType);
                        if (option) text = '<p class="' + (option && option.color) + '">' + (option && option.label) + '</p>';
                    }
                    if (item.CustomerPotentialType != null && item.CustomerPotentialType != undefined) {
                        let option = ConstantHelper.ML_CUSTOMER_POTETIAL_TYPES.find(c => c.value == item.CustomerPotentialType);
                        if (option) text += '<p>' + (option && option.label) + '</p>';
                    }
                    return text;
                })
            },
            {
                Property: 'Address', Title: 'Địa chỉ', Type: DataType.String,
                Format: ((item: any) => {
                    let text = '';
                    if (item.Ward) text += '<span>' + item.Ward + '</span> - ';
                    if (item.District) text += '<span>' + item.District + '</span> - ';
                    if (item.City) text += '<span>' + item.City + '</span> - ';
                    text = UtilityExHelper.trimChars(text, [' ', '-']);
                    return text;
                })
            },
            {
                Property: 'LastTimeSupport', Title: 'Ngày chăm sóc gần nhất', Type: DataType.String,
                Format: ((item: any) => {
                    let text = '';
                    if (item.LastTimeSupport) {
                        let date = UtilityExHelper.dateTimeString(item.LastTimeSupport);
                        text += '<p><i class=\'la la-calendar\'></i> ' + date + '</p>';
                    }
                    return text;
                })
            },
            {
                Property: 'RequestCode', Title: 'Mã gộp', Type: DataType.String,
                Click: (item: any) => {
                    this.viewRequest(item);
                }
            }
        ];
        this.setPageSize(200);

        let rootId = this.params && this.params['rootId'];
        this.obj.Url = '/admin/MCRMCustomer/ChildItems/' + rootId;
        await this.render(this.obj);
    }

    view(item: BaseEntity) {
        let obj: NavigationStateData = {
            id: item.Id,
            object: item,
            prevData: this.itemData,
            prevUrl: '/admin/meeycrm/customer',
        };
        let url = AppConfig.getProtocol() + '//' + AppConfig.getDomain() + '/admin/meeycrm/customer/view?id=' + item.Id;
        this.setUrlState(obj, 'mcrmcustomer');
        window.open(url, "_blank");
    }
    viewRequest(item: any) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            size: ModalSizeType.ExtraLarge,
            object: ViewMCRMRequestGroupComponent,
            objectExtra: { 
                viewDetail: true,
                id: item.RequestId,
            },
            title: 'Yêu cầu gộp khách hàng [' + item.RequestCode + ']',
        });
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
    quickView(item: BaseEntity, type: string) {
        let originalItem = this.originalItems.find(c => c.Id == item.Id);
        if (originalItem) {
            switch (type) {
                case 'view': this.view(item); break;
                case 'sale': this.quickViewProfile(item['SaleId']); break;
                case 'support': this.quickViewProfile(item['SupportId']); break;
            }
        }
    }
    private setUrlState(state: NavigationStateData, controller: string = null) {
        if (!controller) controller = this.getController();
        let stateKey = 'params',
            sessionKey = 'session_' + stateKey + '_' + controller;
        if (state) sessionStorage.setItem(sessionKey, JSON.stringify(state));
    }
}