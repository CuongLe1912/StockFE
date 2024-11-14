import { RouterModule } from "@angular/router";
import { Component, NgModule } from "@angular/core";
import { UtilityModule } from "../../utility.module";
import { GridData } from "../../../_core/domains/data/grid.data";
import { DataType } from "../../../_core/domains/enums/data.type";
import { ActionData } from "../../../_core/domains/data/action.data";
import { AdminAuthGuard } from "../../../_core/guards/admin.auth.guard";
import { UtilityExHelper } from "../../../_core/helpers/utility.helper";
import { ModalSizeType } from "../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../_core/components/grid/grid.component";
import { PricePropertyEntity } from "../../../_core/domains/entities/price.property.entity";

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class PricePropertyComponent extends GridComponent {
    obj: GridData = {
        Imports: [],
        Exports: [],
        DisableAutoLoad: true,
        Size: ModalSizeType.Large,
        Reference: PricePropertyEntity,
        Features: [
            ActionData.reload(() => this.loadItems()),
        ],
        CustomFilters: ['ProjectId', 'BuildingId', 'FloorId', 'PropertyId']
    };

    constructor() {
        super();
        this.properties = [
            { Property: 'Id', Title: 'Id', Type: DataType.Number },
            { Property: 'ProjectName', Title: 'Dự án', Type: DataType.String },
            { Property: 'BuildingName', Title: 'Tòa nhà', Type: DataType.String },
            { Property: 'FloorName', Title: 'Tầng', Type: DataType.String },
            { Property: 'PropertyName', Title: 'Căn hộ', Type: DataType.String },
            { Property: 'SquareMeters', Title: 'Diện tích', Type: DataType.String },
            {
                Property: 'TotalPrice', Title: 'Định giá', Type: DataType.String,
                Format: (item: any) => {
                    if (item && item.TotalPrice) {
                        let number = Number(item.TotalPrice.toString().replace('đ', '').trim()),
                            text = UtilityExHelper.formatNumbertoString(number);
                        return text;
                    }
                    return item && item.TotalPrice;
                }
            },
            {
                Property: 'UnitPrice', Title: 'Định giá/m2', Type: DataType.String,
                Format: (item: any) => {
                    if (item && item.UnitPrice) {
                        let number = Number(item.UnitPrice.toString().replace('đ', '').trim()),
                            text = UtilityExHelper.formatNumbertoString(number);
                        return text;
                    }
                    return item && item.UnitPrice;
                }
            },
            { Property: 'RentalPrice', Title: 'Định giá cho thuê', Type: DataType.String },
            { Property: 'SellingPrice', Title: 'Định giá bán', Type: DataType.String },
        ];
        this.render(this.obj);
    }
}

@NgModule({
    declarations: [PricePropertyComponent],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: PricePropertyComponent, pathMatch: 'full', data: { state: 'price_property' }, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class PricePropertyModule { }