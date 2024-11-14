import { Component, Input, OnInit } from "@angular/core";
import { GridComponent } from "../../../../_core/components/grid/grid.component";
import { GridData } from "../../../../_core/domains/data/grid.data";
import { DataType } from "../../../../_core/domains/enums/data.type";
import { ModalSizeType } from "../../../../_core/domains/enums/modal.size.type";
import { MOOrdersEntity } from "../../../../_core/domains/entities/meeyorder/order.entity";
import { AppInjector } from "../../../../app.module";
import { UtilityExHelper } from "../../../../_core/helpers/utility.helper";
import { OptionItem } from "../../../../_core/domains/data/option.item";
import { ConstantHelper } from "../../../../_core/helpers/constant.helper";
import { MOServiceHistoryService } from "../service.history.service";
import { MOServiceHistoryEntity } from "../entities/service.history.entity";
import { NavigationStateData } from "../../../../_core/domains/data/navigation.state";
import { AppConfig } from "../../../../_core/helpers/app.config";

@Component({
    selector: 'mo-service-history-detail-service',
    templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class MOServiceHistoryDetailServiceComponent extends GridComponent implements OnInit {
    obj: GridData = {
        Exports: [],
        Imports: [],
        Filters: [],
        Actions: [],
        Features: [],
        IsPopup: true,
        UpdatedBy: false,
        HideSearch: true,
        NotKeepPrevData: true,
        HideHeadActions: true,
        HideCustomFilter: true,
        Reference: MOServiceHistoryEntity,
        Size: ModalSizeType.ExtraLarge,
        HidePaging: true,
        AsynLoad: () => this.asynLoad()
    };
    historyData: any = [];
    @Input() params: any;
    @Input() serviceId: number;

    service: MOServiceHistoryService;

    constructor() {
        super();
        this.service = AppInjector.get(MOServiceHistoryService);
    }

    async ngOnInit() {
        this.properties = [
            {
                Property: 'Index', Title: 'STT', Type: DataType.String,
            },
            {
                Property: 'UserFrom', Title: 'Người sở hữu trước', Type: DataType.String,
                Format: ((item: any) => {
                    let text: string = '';
                    if (!item?.from) return ''
                    let user = item?.from
                    if (user.name)
                        text += '<p><a routerLink="quickView" type="userfrom">' + UtilityExHelper.escapeHtml(user.name) + '</a></p>';
                    if (user.phone) text += '<p><i class=\'la la-phone\'></i> ' + UtilityExHelper.escapeHtml(user.phone) + '</p>';
                    if (user.email) text += '<p><i class=\'la la-inbox\'></i> ' + UtilityExHelper.escapeHtml(user.email) + '</p>';
                    if (user.username) text += '<p><i class=\'la la-user\'></i> ' + UtilityExHelper.escapeHtml(user.username) + '</p>';

                    return text;
                })
            },
            {
                Property: 'UserTo', Title: 'Người sở hữu sau', Type: DataType.String,
                Format: ((item: any) => {
                    let text: string = '';
                    if (!item?.to) return ''
                    let user = item?.to
                    if (user.name)
                        text += '<p><a routerLink="quickView" type="userto">' + UtilityExHelper.escapeHtml(user.name) + '</a></p>';
                    if (user.phone) text += '<p><i class=\'la la-phone\'></i> ' + UtilityExHelper.escapeHtml(user.phone) + '</p>';
                    if (user.email) text += '<p><i class=\'la la-inbox\'></i> ' + UtilityExHelper.escapeHtml(user.email) + '</p>';
                    if (user.username) text += '<p><i class=\'la la-user\'></i> ' + UtilityExHelper.escapeHtml(user.username) + '</p>';

                    return text;
                })
            },
            {
                Property: 'ServiceId', Title: 'Mã yêu cầu', Type: DataType.String,
                Format: ((item: any) => {
                    let text: string = '';
                    if (item.processing_tranfer?.id) text += '<p>Mã: ' + item.processing_tranfer?.id + '</p>';
                    if (item.processing_tranfer?.client?.name) text += '<p>' + UtilityExHelper.escapeHtml(item.processing_tranfer.client.name) + '</p>';
                    return text;
                })
            },
            {
                Property: 'CreateAt', Title: 'Thời gian', Type: DataType.String,
                Format: ((item: any) => {
                    if (!item?.createdAt) return ''
                    return UtilityExHelper.dateTimeString(item.createdAt);
                })
            },
        ]

        let serviceId = (this.params && this.params["serviceId"]) || null;
        if (serviceId) {
            this.serviceId = serviceId
        }

        let filters = [];
        if (this.serviceId) {
            filters.push({
                Name: "ServiceId",
                Value: this.serviceId,
            });
        }
        this.itemData.Filters = filters;

        this.obj.Url = '/admin/moservicehistory/ServiceById';
        this.render(this.obj);
    }

    asynLoad() {
        this.items.forEach((item: any, index: number) => {
            item.Index = index + 1;
        });
    }

    async quickView(item: any, type: string) {
        if (!type || type == 'userfrom') {
            let obj: NavigationStateData = {
                prevUrl: '/admin/mluser',
            };
            let url = AppConfig.getProtocol() + '//' + AppConfig.getDomain() + '/admin/mluser/view?meeyId=' + item?.from._id;
            this.setUrlState(obj, 'mluser');
            window.open(url, "_blank");
        } else if (!type || type == 'userto') {
            let obj: NavigationStateData = {
                prevUrl: '/admin/mluser',
            };
            let url = AppConfig.getProtocol() + '//' + AppConfig.getDomain() + '/admin/mluser/view?meeyId=' + item?.to._id;
            this.setUrlState(obj, 'mluser');
            window.open(url, "_blank");
        }
    }
    public setUrlState(state: NavigationStateData, controller: string = null) {
        if (!controller) controller = this.getController();
        let stateKey = 'params',
            navigation = this.router.getCurrentNavigation(),
            sessionKey = 'session_' + stateKey + '_' + controller;
        if (state) sessionStorage.setItem(sessionKey, JSON.stringify(state));
    }

}