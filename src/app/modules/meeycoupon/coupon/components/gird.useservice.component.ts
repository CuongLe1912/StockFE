import { MeeyCouponService } from "../../coupon.service";
import { GridData } from "../../../../_core/domains/data/grid.data";
import { DataType } from "../../../../_core/domains/enums/data.type";
import { ResultApi } from "../../../../_core/domains/data/result.api";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { EntityHelper } from "../../../../_core/helpers/entity.helper";
import { ActionType } from "../../../../_core/domains/enums/action.type";
import { GridComponent } from "../../../../_core/components/grid/grid.component";
import { MOServicesEntity } from "../../../../_core/domains/entities/meeyorder/services.entity";
import { PriceConfigStatusType } from "../../../../_core/domains/entities/meeyorder/enums/price.config.type";

@Component({
    selector: 'mc-grid-useservice',
    templateUrl: "../../../../_core/components/grid/grid.component.html",
})
export class MCGridUseServiceComponent extends GridComponent {
    ids: string;
    service: MeeyCouponService;
    allowViewDetail: boolean = true;
    obj: GridData = {
        Imports: [],
        Exports: [],
        Filters: [],
        IsPopup: true,
        Checkable: true,
        UpdatedBy: false,
        HideSearch: true,
        HidePaging: true,
        DisableAutoLoad: true,
        NotKeepPrevData: false,
        HideCustomFilter: true,
        Reference: MOServicesEntity,
        Features: [
            {
                hide: true,
                icon: 'la la-trash',
                toggleCheckbox: true,
                name: ActionType.Delete,
                className: 'btn btn-danger',
                systemName: ActionType.Empty,
                click: () => {
                    let items = this.originalItems.filter(c => c.Checked);
                    this.deleteChoices(items);
                }
            },
        ],
        Actions: [
            {
                icon: 'la la-trash',
                name: ActionType.Delete,
                className: 'btn btn-danger',
                systemName: ActionType.Empty,
                click: (item: any) => this.delete(item)
            },
        ],
    };
    @Input() items: any[];
    @Output() deleted: EventEmitter<any[]> = new EventEmitter<any[]>();

    constructor() {
        super();
    }
    async ngOnInit() {
        this.ids = this.params && this.params["ids"];
        //console.log(this.ids)
        //await this.loadItem();
        this.properties = [
            { Property: 'Id', Title: 'Id', Type: DataType.String },
            {
                Property: 'Name', Title: 'Tên dịch vụ', Type: DataType.String,
            },
            { Property: 'Code', Title: 'Mã dịch vụ', Type: DataType.String },
            {
                Property: 'Group', Title: 'Nhóm dịch vụ', Type: DataType.String,
                Format: ((item: any) => {
                    if (item.GroupLoad) {
                        return item.GroupLoad;
                    }
                    let ProviderName = ''
                    if (item.Group?.Provider?.Name) {
                        ProviderName = item.Group.Provider.Name + " >> "
                    }
                    if (item.Group.ParentId) {
                        return ProviderName + item.Group.ParentName + " >> " + item.Group.Name;
                    }
                    else {
                        return ProviderName + item.Group.Name
                    }
                })
            },
            {
                Property: 'PriceRoot', Title: 'Giá gốc (đ)', Type: DataType.String,
                Format: ((item: any) => {
                    if (item.Root) {
                        return item.Root.toLocaleString("vi-VN", { maximumFractionDigits: 2 })
                    }
                    if (item.PriceConfig && item.PriceConfig.length > 0) {
                        const priceConfig = item.PriceConfig.find(c => c.Status == PriceConfigStatusType.ACTIVE)
                        if (priceConfig) {
                            return priceConfig.PriceRoot.toLocaleString("vi-VN", { maximumFractionDigits: 2 })
                        }
                    }
                    return "";
                })
            },
            {
                Property: 'PriceDiscount', Title: 'Giá bán', Type: DataType.String,
                Format: ((item: any) => {
                    if (item.Discount) {
                        return item.Discount.toLocaleString("vi-VN", { maximumFractionDigits: 2 })
                    }
                    if (item.PriceConfig && item.PriceConfig.length > 0) {
                        const priceConfig = item.PriceConfig.find(c => c.Status == PriceConfigStatusType.ACTIVE)
                        if (priceConfig) {
                            return priceConfig.PriceDiscount.toLocaleString("vi-VN", { maximumFractionDigits: 2 })
                        }
                    }
                    return "";
                })
            },
        ]
        await this.render(this.obj, this.items);
    }
    private async loadItem() {
        if (this.ids) {
            await this.service.ListServiceByIds(this.ids).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    result.Object.forEach((s) => {
                        let service: MOServicesEntity = EntityHelper.createEntity(
                            MOServicesEntity,
                            s
                        );
                    });
                }
            });
        }
    }

    delete(item: any): void {
        this.items = this.items.filter(c => c.Id != item.Id);
        this.deleted.emit(this.items);
    }

    deleteChoices(items: any[]) {
        this.items = this.items.filter(c => items.findIndex(p => p.Id == c.Id) == -1);
        this.deleted.emit(this.items);
    }
}
