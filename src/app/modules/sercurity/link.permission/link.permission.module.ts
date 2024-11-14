import { RouterModule } from "@angular/router";
import { Component, NgModule } from "@angular/core";
import { UtilityModule } from "../../utility.module";
import { GridData } from "../../../_core/domains/data/grid.data";
import { ActionData } from "../../../_core/domains/data/action.data";
import { ActionType } from "../../../_core/domains/enums/action.type";
import { AdminAuthGuard } from "../../../_core/guards/admin.auth.guard";
import { ProductionType } from "../../../_core/domains/enums/project.type";
import { ModalSizeType } from "../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../_core/components/grid/grid.component";
import { LinkPermissionEntity } from "../../../_core/domains/entities/link.permission.entity";

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class LinkPermissionComponent extends GridComponent {
    obj: GridData = {
        Imports: [],
        Exports: [],
        Checkable: true,
        DisableAutoLoad: true,
        Size: ModalSizeType.Large,
        Reference: LinkPermissionEntity,
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
        this.render(this.obj);
    }
}

@NgModule({
    declarations: [LinkPermissionComponent],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: LinkPermissionComponent, pathMatch: 'full', data: { state: 'link_permission'}, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class LinkPermissionModule { }