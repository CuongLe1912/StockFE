import { RouterModule } from "@angular/router";
import { Component, NgModule } from "@angular/core";
import { UtilityModule } from "../../utility.module";
import { GridData } from "../../../_core/domains/data/grid.data";
import { AdminAuthGuard } from "../../../_core/guards/admin.auth.guard";
import { ModalSizeType } from "../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../_core/components/grid/grid.component";
import { NotifyEntity } from "../../../_core/domains/entities/notify.entity";

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class NotifyComponent extends GridComponent {
    obj: GridData = {
        Reference: NotifyEntity,
        Size: ModalSizeType.Large,
    };

    constructor() {
        super();
        this.render(this.obj);
    }
}

@NgModule({
    declarations: [NotifyComponent],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: NotifyComponent, pathMatch: 'full', data: { state: 'notify'}, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class NotifyModule { }