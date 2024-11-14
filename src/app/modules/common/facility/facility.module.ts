import { RouterModule } from "@angular/router";
import { Component, NgModule } from "@angular/core";
import { UtilityModule } from "../../utility.module";
import { GridData } from "../../../_core/domains/data/grid.data";
import { DataType } from "../../../_core/domains/enums/data.type";
import { ActionData } from "../../../_core/domains/data/action.data";
import { UtilityExHelper } from "../../../_core/helpers/utility.helper";
import { AdminAuthGuard } from "../../../_core/guards/admin.auth.guard";
import { ModalSizeType } from "../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../_core/components/grid/grid.component";
import { FacilityEntity } from "../../../_core/domains/entities/facility.entity";

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class FacilityComponent extends GridComponent {
    obj: GridData = {
        Imports: [],
        Exports: [],
        Size: ModalSizeType.Large,
        Reference: FacilityEntity,
        Features: [
            ActionData.addNew(() => this.addNew()),
            ActionData.reload(() => this.loadItems()),
            ActionData.resetCache(() => this.resetCache()),
        ]
    };

    constructor() {
        super();
        this.properties = [
            { Property: 'Id', Title: 'Id', Type: DataType.Number },
            {
                Property: 'Name', Title: 'Tên', Type: DataType.String,
                Format: ((item: any) => {
                    return '<a routerLink="view">' + UtilityExHelper.escapeHtml(item.Name) + '</a>';
                })
            },
            { Property: 'Lat', Title: 'Lat', Type: DataType.String },
            { Property: 'Lng', Title: 'Lng', Type: DataType.String },
            { Property: 'ImageUrl', Title: 'Ảnh', Type: DataType.String },
            { Property: 'Category', Title: 'Nhóm', Type: DataType.String },
            { Property: 'Address', Title: 'Địa chỉ', Type: DataType.String },
        ];
        this.render(this.obj);
    }    
}

@NgModule({
    declarations: [FacilityComponent],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: FacilityComponent, pathMatch: 'full', data: { state: 'facility'}, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class FacilityModule { }