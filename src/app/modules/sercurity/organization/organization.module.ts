import { RouterModule } from "@angular/router";
import { Component, NgModule } from "@angular/core";
import { UtilityModule } from "../../utility.module";
import { GridData } from "../../../_core/domains/data/grid.data";
import { AdminAuthGuard } from "../../../_core/guards/admin.auth.guard";
import { ModalSizeType } from "../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../_core/components/grid/grid.component";
import { OrganizationEntity } from "../../../_core/domains/entities/organization.entity";

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class OrganizationComponent extends GridComponent {
    obj: GridData = {
        Size: ModalSizeType.Large,
        Reference: OrganizationEntity,
    };

    constructor() {
        super();
        this.render(this.obj);
    }
}

@NgModule({
    declarations: [OrganizationComponent],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: OrganizationComponent, pathMatch: 'full', data: { state: 'organization'}, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class OrganizationModule { }