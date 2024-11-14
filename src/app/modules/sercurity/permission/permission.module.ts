import { RouterModule } from "@angular/router";
import { Component, NgModule } from "@angular/core";
import { UtilityModule } from "../../utility.module";
import { GridData } from "../../../_core/domains/data/grid.data";
import { DataType } from "../../../_core/domains/enums/data.type";
import { ActionData } from "../../../_core/domains/data/action.data";
import { ActionType } from "../../../_core/domains/enums/action.type";
import { AdminAuthGuard } from "../../../_core/guards/admin.auth.guard";
import { ProductionType } from "../../../_core/domains/enums/project.type";
import { ModalSizeType } from "../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../_core/components/grid/grid.component";
import { PermissionEntity } from "../../../_core/domains/entities/permission.entity";

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class PermissionComponent extends GridComponent {
    obj: GridData = {
        Imports: [],
        Exports: [],
        Checkable: true,
        DisableAutoLoad: true,
        Size: ModalSizeType.Large,
        Reference: PermissionEntity,
        Features: [
            ActionData.addNew(() => this.addNew()),
            ActionData.reload(() => this.loadItems()),
            ActionData.resetCache(() => this.resetCache()),
        ],
        MoreFeatures: {
            Name: 'Đồng bộ',
            Icon: 'la la-recycle',
            Actions: [
                {
                    toggleCheckbox: true,
                    name: 'Đồng bộ STAG',
                    icon: 'la la-retweet',
                    className: 'btn btn-warning',
                    systemName: ActionType.Empty,
                    click: () => {
                        this.syncItems(ProductionType.Stag);
                    }
                },
                {
                    toggleCheckbox: true,
                    name: 'Đồng bộ PROD',
                    icon: 'la la-retweet',
                    className: 'btn btn-warning',
                    systemName: ActionType.Empty,
                    click: () => {
                        this.syncItems(ProductionType.Production);
                    }
                }
            ]
        }
    };

    constructor() {
        super();
        this.properties = [
            { Property: 'Id', Title: 'Id', Type: DataType.Number },
            { Property: 'Group', Title: 'Nhóm', Type: DataType.String },
            { Property: 'Title', Title: 'Tiêu đề', Type: DataType.String },
            { Property: 'Name', Title: 'Tên chức năng', Type: DataType.String },
            { Property: 'Types', Title: 'Danh sách loại', Type: DataType.Boolean },
            { Property: 'Organization', Title: 'Website', Type: DataType.String },
            { Property: 'Controller', Title: 'Controller', Type: DataType.String },
            { Property: 'Action', Title: 'Action', Type: DataType.String },
        ];
        this.render(this.obj);
    }
}

@NgModule({
    declarations: [PermissionComponent],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: PermissionComponent, pathMatch: 'full', data: { state: 'permission'}, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class PermissionModule { }