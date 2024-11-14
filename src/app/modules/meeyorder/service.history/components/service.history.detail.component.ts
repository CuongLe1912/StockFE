import * as _ from 'lodash';
import { AppInjector } from "../../../../app.module";
import { Component, Input, OnInit } from "@angular/core";
import { AppConfig } from "../../../../_core/helpers/app.config";
import { GridData } from "../../../../_core/domains/data/grid.data";
import { DataType } from "../../../../_core/domains/enums/data.type";
import { MOServiceHistoryService } from "../service.history.service";
import { OptionItem } from "../../../../_core/domains/data/option.item";
import { UtilityExHelper } from "../../../../_core/helpers/utility.helper";
import { ConstantHelper } from "../../../../_core/helpers/constant.helper";
import { MOServiceHistoryEntity } from "../entities/service.history.entity";
import { ModalSizeType } from "../../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../../_core/components/grid/grid.component";
import { NavigationStateData } from "../../../../_core/domains/data/navigation.state";
import { MOServiceHistoryDetailModalComponent } from './service.history.detail.modal.component';

@Component({
    selector: 'mo-service-history-detail',
    templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class MOServiceHistoryDetailComponent extends GridComponent implements OnInit {
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
        AsynLoad: () => this.asynLoad()
    };
    historyData: any = [];
    @Input() params: any;
    @Input() serviceCode: number;

    service: MOServiceHistoryService;

    constructor() {
        super();
        this.service = AppInjector.get(MOServiceHistoryService);
    }

    async ngOnInit() {
        let serviceCode = (this.params && this.params["serviceCode"]) || null;
        this.properties = [
            {
                Property: 'Index', Title: 'STT', Type: DataType.String,
            },
            {
                Property: 'order_in_processing_id', Title: 'ID Dịch vụ', Type: DataType.String,
            },
            // {
            //     Property: 'Product', Title: 'ID Dịch vụ', Type: DataType.String,
            //     Format: ((item: any) => {
            //         let text: string = '';
            //         if (!item.producting) return ''
            //         if (item.producting.name) text += '<p>' + item.producting.name + '</p>';
            //         if (item.producting.code) text += '<p>' + item.producting.code + '</p>';

            //         return text;
            //     })
            // },
            {
                Property: 'UserBuy', Title: 'Người mua', Type: DataType.String,
                Format: ((item: any) => {
                    let text: string = '';
                    if (!item?.order_in_processing?.create_by) return ''
                    let user = item?.order_in_processing?.create_by
                    if (user.name)
                        text += '<p><a routerLink="quickView" type="userbuy">' + UtilityExHelper.escapeHtml(user.name) + '</a></p>';
                    if (user.phone) text += '<p><i class=\'la la-phone\'></i> ' + UtilityExHelper.escapeHtml(user.phone) + '</p>';
                    if (user.email) text += '<p><i class=\'la la-inbox\'></i> ' + UtilityExHelper.escapeHtml(user.email) + '</p>';
                    if (user.username) text += '<p><i class=\'la la-user\'></i> ' + UtilityExHelper.escapeHtml(user.username) + '</p>';

                    return text;
                })
            },
            {
                Property: 'Source', Title: 'Nguồn gốc', Type: DataType.String,
                Format: ((item: any) => {
                    let text: string = '';
                    if (!item?.order_in_processing?.order) return ''
                    let order = item?.order_in_processing?.order
                    if (order.code)
                        text += '<p>Đơn hàng: <a routerLink="quickView" type="order">' + UtilityExHelper.escapeHtml(order.code) + '</a></p>';
                    if (order?.client?.name) text += '<p> ' + UtilityExHelper.escapeHtml(order.client.name) + '</p>';
                    if (order.createdAt) text += '<p> ' + UtilityExHelper.dateTimeString(order.createdAt) + '</p>';

                    return text;
                })
            },
            // {
            //     Property: 'Price', Title: 'Số tiền (vnđ)', Type: DataType.String,
            //     Format: ((item: any) => {
            //         if (!item?.order_in_processing?.order?.price) return ''

            //         return item?.order_in_processing?.order?.price.toLocaleString("vi-VN", { maximumFractionDigits: 2 });
            //     })
            // },
            {
                Property: 'Unit', Title: 'Thời gian hết hạn', Type: DataType.String,
                Format: ((item: any) => {
                    if (!item?.order_in_processing?.expire_date) return 'Không giới hạn'
                    return UtilityExHelper.dateTimeString(item.order_in_processing.expire_date);
                })
            },
            {
                Property: 'AcceptUser', Title: 'Cho User khác', Type: DataType.String,
                Format: ((item: any) => {
                    return 'Cho phép';
                })
            },
            // {
            //     Property: 'UserUse', Title: 'Người được dùng', Type: DataType.String,
            //     Format: ((item: any) => {
            //         let text: string = '';
            //         if (!item?.order_in_processing?.meey_id) return ''
            //         let user = item?.order_in_processing?.meey_id
            //         if (user.name)
            //             text += '<p><a routerLink="quickView" type="useruse">' + UtilityExHelper.escapeHtml(user.name) + '</a></p>';
            //         if (user.phone) text += '<p><i class=\'la la-phone\'></i> ' + UtilityExHelper.escapeHtml(user.phone) + '</p>';
            //         if (user.email) text += '<p><i class=\'la la-inbox\'></i> ' + UtilityExHelper.escapeHtml(user.email) + '</p>';
            //         if (user.username) text += '<p><i class=\'la la-user\'></i> ' + UtilityExHelper.escapeHtml(user.username) + '</p>';

            //         return text;
            //     })
            // },
            {
                Property: 'Status', Title: 'Trạng thái', Type: DataType.String,
                Format: ((item: any) => {
                    if (!item?.order_in_processing?.status) return ''
                    let status = item?.order_in_processing?.status
                    let option: OptionItem = ConstantHelper.MO_TRANSFER_STATUS_TYPES.find((c) => c.value == status);
                    let text = option && option.label;
                    return text;
                })
            },
            {
                Property: 'LinkDetail', Title: 'Lịch sử chuyển', Type: DataType.String,
                Format: ((item: any) => {
                    return '<p><a routerLink="quickView" type="detail">Xem chi tiết</a></p>';
                })
            },
        ]
        if (serviceCode) {
            this.serviceCode = serviceCode
        }

        let filters = [];
        if (this.serviceCode) {
            filters.push({
                Name: "Code",
                Value: this.serviceCode,
            });
        }
        this.itemData.Filters = filters;

        this.obj.Url = '/admin/moservicehistory/Detail';
        this.render(this.obj);
    }

    asynLoad() {
        this.items.forEach((item: any, index: number) => {
            item.Index = index + 1;
        });
    }

    async quickView(item: any, type: string) {
        if (!type || type == 'userbuy') {
            let obj: NavigationStateData = {
                prevUrl: '/admin/mluser',
            };
            let url = AppConfig.getProtocol() + '//' + AppConfig.getDomain() + '/admin/mluser/view?meeyId=' + item?.order_in_processing?.create_by._id;
            this.setUrlState(obj, 'mluser');
            window.open(url, "_blank");
        } else if (!type || type == 'useruse') {
            let obj: NavigationStateData = {
                prevUrl: '/admin/mluser',
            };
            let url = AppConfig.getProtocol() + '//' + AppConfig.getDomain() + '/admin/mluser/view?meeyId=' + item?.order_in_processing?.meey_id._id;
            this.setUrlState(obj, 'mluser');
            window.open(url, "_blank");
        } else if (!type || type == 'order') {
            let obj: NavigationStateData = {
                prevUrl: '/admin/moorders',
            };
            let url = AppConfig.getProtocol() + '//' + AppConfig.getDomain() + '/admin/moorders/view-detail?id=' + item?.order_in_processing?.order?.id;
            this.setUrlState(obj, 'moorders');
            window.open(url, "_blank");
        } else if (!type || type == 'detail') {
            let order = item?.order_in_processing?.order
            this.dialogService.WapperAsync({
                restrict: true,
                cancelText: "Đóng",
                confirmText: 'Quay lại',
                size: ModalSizeType.ExtraLarge,
                title: 'Lịch sử chuyển dịch vụ',
                object: MOServiceHistoryDetailModalComponent,
                objectExtra: {
                    service: item,
                },
            }, async () => {
                setTimeout(() => {
                    this.dialogService.WapperAsync({
                        cancelText: "Đóng",
                        title: 'Danh sách dịch vụ',
                        size: ModalSizeType.ExtraLarge,
                        object: MOServiceHistoryDetailComponent,
                        objectExtra: {
                            serviceCode: this.serviceCode,
                        },
                    });
                }, 300);
            });
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