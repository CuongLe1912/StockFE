import { AppConfig } from "../../../../_core/helpers/app.config";
import { GridData } from "../../../../_core/domains/data/grid.data";
import { DataType } from "../../../../_core/domains/enums/data.type";
import { OptionItem } from "../../../../_core/domains/data/option.item";
import { ConstantHelper } from "../../../../_core/helpers/constant.helper";
import { UtilityExHelper } from "../../../../_core/helpers/utility.helper";
import { MOOrderLookupHistoryComponent } from "./lookup.history.component";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ModalSizeType } from "../../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../../_core/components/grid/grid.component";
import { NavigationStateData } from "../../../../_core/domains/data/navigation.state";
import { MOOrdersEntity } from "../../../../_core/domains/entities/meeyorder/order.entity";
import { ProviderType } from "../../../../_core/domains/entities/meeyorder/enums/provider.config.type";
import { MOOderProcessingStatusType } from "../../../../_core/domains/entities/meeyorder/enums/order.status.type";

@Component({
    selector: 'mo-order-processing-grid',
    templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class MOOrderProcessingGridComponent extends GridComponent implements OnInit {

    obj: GridData = {
        Exports: [],
        Imports: [],
        Filters: [],
        Actions: [],
        Features: [],
        IsPopup: true,
        UpdatedBy: false,
        HideSearch: true,
        Title: "Thông báo",
        NotKeepPrevData: true,
        HideHeadActions: true,
        HideCustomFilter: true,
        Reference: MOOrdersEntity,
        Size: ModalSizeType.ExtraLarge,
        TimerReload: {
            Timer: 300,
            AutoReload: true,
            AllowReload: true,
        },
    };

    @Input() params: any;
    @Input() orderId: any;
    @Input() productId: any;
    @Input() providerId: number;
    @Input() productingId: number;
    @Output() expireDateChange: EventEmitter<any> = new EventEmitter<any>();

    listCodeShow = ['TINVIP390', 'TINVIP330', 'TINVIP315', 'TINVIP37', 'TINVIP3', 'TINVIP290', 'TINVIP230', 'TINVIP215', 'TINVIP27', 'TINVIP2', 'TINVIP190', 'TINVIP130', 'TINVIP115', 'TINVIP17', 'TINVIP1']

    constructor() {
        super();
    }

    async ngOnInit() {
        let orderId = (this.params && this.params["orderId"]) || null;
        this.orderId = this.orderId | orderId;
        let productId = (this.params && this.params["productId"]) || null;
        this.productId = this.productId | productId;
        let productingId = (this.params && this.params["productingId"]) || null;
        this.productingId = this.productingId | productingId
        let providerId = (this.params && this.params["providerId"]) || null;
        if (!this.providerId) this.providerId = providerId

        let typeSource = 'map'
        let codeLinkText = 'Tra cứu'
        let dateUserText = 'Thời gian sử dụng'
        let expireDateText = 'Thời hạn sử dụng'
        if (this.providerId === ProviderType.MeeyLand) {
            typeSource = 'land'
            codeLinkText = 'Mã đăng tin'
            dateUserText = 'Thời gian sử dụng thực tế (hẹn giờ chạy)'
            expireDateText = 'Thời hạn kích hoạt'
        } else if (this.providerId === ProviderType.MeeyMap) {
            typeSource = 'map'
            codeLinkText = 'Tra cứu'
            dateUserText = 'Thời gian sử dụng thực tế'
            expireDateText = 'Thời hạn sử dụng'
        }

        this.properties = [
            {
                Property: 'index', Title: 'STT', Type: DataType.String, Align: 'center',
            },
            {
                Property: 'StatusUse', Title: 'Trạng thái', Type: DataType.String, Align: 'center',
                Format: ((item: any) => {
                    if (item.status == null) return ""
                    let option: OptionItem = ConstantHelper.MO_ORDER_PROCESSING_STATUS_TYPES.find((c) => c.value == item.status);
                    let text = '<p class="' + (option && option.color) + '">' + (option && option.label) + "</p>";
                    return text;
                })
            },
            {
                Property: 'codeLink', Title: codeLinkText, Type: DataType.String,
                Format: ((item: any) => {
                    if (!item.hyper_link) return ''
                    let hyperLink = item.hyper_link;
                    try {
                        hyperLink = JSON.parse(item.hyper_link.toString())
                    } catch (ex) { }
                    if (hyperLink) {
                        let text = ''
                        if (hyperLink.refId) text += `<a routerLink="quickView" type="view">${hyperLink.refId}</a>`
                        if (hyperLink.content) text += ' - ' + hyperLink.content
                        return text
                    }
                    return ''
                })
            },
            {
                Property: 'User', Title: 'Người sử dụng', Type: DataType.String, Align: 'center',
                Format: ((item: any) => {
                    return '<a routerLink="quickView" type="view-meeyId" tooltip="Xem chi tiết">' + item.customer.Name + '</a>';
                }),
            },
            {
                Property: 'DateUser', Title: dateUserText, Type: DataType.String, Align: 'center',
                Format: ((item: any) => {
                    if (this.providerId == ProviderType.MeeyMap) {
                        if (item.status && (item.status == MOOderProcessingStatusType.USED || item.status == MOOderProcessingStatusType.USING))
                            return UtilityExHelper.dateTimeString(item.start_date) + ' - ' + UtilityExHelper.dateTimeString(item.end_date);
                        else
                            return '';
                    } else {
                        if (!item.start_date) return ''
                        let checkCodeTime = false;
                        if (item?.product_raw_data?.code) {
                            if (this.listCodeShow.includes(item?.product_raw_data?.code))
                                checkCodeTime = true;
                        }
                        if (item.end_date && item.status && item.status == MOOderProcessingStatusType.USED && !checkCodeTime)
                            return UtilityExHelper.dateTimeString(item.end_date)
                        if (!item.end_date || typeSource == 'map') return UtilityExHelper.dateTimeString(item.start_date)
                        return UtilityExHelper.dateTimeString(item.start_date) + ' - ' + UtilityExHelper.dateTimeString(item.end_date);
                    }
                })
            },
            {
                Property: 'source', Title: 'Nơi sử dụng', Type: DataType.String, Align: 'center',
            },
            {
                Property: 'id', Title: 'ID dịch vụ', Type: DataType.String, Align: 'center',
            }
        ];
        if (this.providerId != ProviderType.MeeyMap) {
            this.properties.push(
                {
                    Property: 'expireDate', Title: expireDateText, Type: DataType.String, Align: 'center',
                    Format: ((item: any) => {
                        if (item.end_date && typeSource == 'map')
                            return UtilityExHelper.dateTimeString(item.start_date) + ' - ' + UtilityExHelper.dateTimeString(item.end_date);

                        if (!item.expire_date) return 'Không giới hạn';
                        if (item.expire_date.indexOf('1970') >= 0) return 'Không giới hạn';
                        return UtilityExHelper.dateTimeString(item.expire_date)
                    })
                });
        }

        let filters = [];
        if (this.orderId) {
            filters.push({
                Name: "OrderId",
                Value: this.orderId,
            });
        }
        if (this.productId) {
            filters.push({
                Name: "ProductId",
                Value: this.productId,
            });
        }
        if (this.productingId) {
            filters.push({
                Name: "ProductingId",
                Value: this.productingId,
            });
        }
        this.itemData.Filters = filters;
        this.obj.Url = '/admin/moorders/ListProcessing';
        this.render(this.obj);
    }

    loadComplete(): void {
        if (this.originalItems && this.originalItems.length > 0) {
            this.originalItems.filter((c: any) => c.hyper_link).forEach((itemOrg: any) => {
                if (itemOrg.hyper_link.expire)
                    this.expireDateChange.emit(itemOrg.hyper_link?.expire);
                if (itemOrg.provider_id == ProviderType.MeeyMap) {
                    let item: any = this.items.find((c: any) => c.id == itemOrg.id);
                    if (itemOrg.hyper_link.total) {
                        item.codeLink = 'Đã xem ' + itemOrg.hyper_link.total + ' lô đất' + ' <a routerLink="quickView" type="view-lookup" tooltip="Xem chi tiết">Xem chi tiết</a>';
                    }
                }
            });
        }

    }

    getDurationText(item: any) {
        if (!item.duration) return "Không giới hạn"
        let unitDuration = 'ngày'
        if (item.unitDuration) {
            let option: OptionItem = ConstantHelper.MO_UNIT_DURATION_TYPES.find((c) => c.value == item.unitDuration);
            if (option) {
                unitDuration = option.label
            }
        }

        return item.duration + " " + unitDuration
    }

    async quickView(item: any, type: string) {
        if (!type || type == 'view') {
            if (!item.hyper_link) return ''
            let hyperLink = item.hyper_link;
            try {
                hyperLink = JSON.parse(item.hyper_link.toString())
            } catch (ex) { }
            if (hyperLink && hyperLink.refId) {
                if (item.provider_id === ProviderType.MeeyLand) {
                    let obj: NavigationStateData = {
                        prevUrl: '/admin/mlarticle',
                    };
                    let url = AppConfig.getProtocol() + '//' + AppConfig.getDomain() + '/admin/mlarticle/view?code=' + hyperLink.refId;
                    this.setUrlState(obj, 'mlarticle');
                    window.open(url, "_blank");
                } else if (item.provider_id === ProviderType.MeeyMap) {
                    let obj: NavigationStateData = {
                        prevUrl: '/admin/mmlookuphistory',
                    };
                    let url = AppConfig.getProtocol() + '//' + AppConfig.getDomain() + '/admin/mmlookuphistory/view?meeyId=' + hyperLink.refId;
                    this.setUrlState(obj, 'mmlookuphistory');
                    window.open(url, "_blank");
                }
            }
        }
        if (type == 'view-meeyId') {
            let meeyId = item.customer.MeeyId;
            let url = AppConfig.getProtocol() + '//' + AppConfig.getDomain() + '/admin/mluser/view?meeyid=' + meeyId;
            window.open(url, "_blank");
        }
        if (type == 'view-lookup') {
            let hyperLink = item.hyper_link;
            if (hyperLink) {
                let endTime = item.end_date,
                    userId = hyperLink?.userId,
                    startTime = item.start_date;
                this.dialogService.WapperAboveAsync({
                    size: ModalSizeType.ExtraLarge,
                    title: 'Danh sách tra cứu quy hoạch',
                    object: MOOrderLookupHistoryComponent,
                    objectExtra: {
                        userId: userId,
                        endTime: endTime,
                        startTime: startTime
                    },
                });
            }
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
