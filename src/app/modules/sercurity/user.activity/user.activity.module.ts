import { RouterModule } from "@angular/router";
import { Component, NgModule } from "@angular/core";
import { UtilityModule } from "../../utility.module";
import { GridData } from "../../../_core/domains/data/grid.data";
import { AdminAuthGuard } from "../../../_core/guards/admin.auth.guard";
import { ModalSizeType } from "../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../_core/components/grid/grid.component";
import { UserActivityEntity } from "../../../_core/domains/entities/user.activity.entity";

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class UserActivityComponent extends GridComponent {
    obj: GridData = {
        Size: ModalSizeType.Large,
        Reference: UserActivityEntity,
    };

    constructor() {
        super();
        this.render(this.obj);
    }
}

@NgModule({
    declarations: [UserActivityComponent],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: UserActivityComponent, pathMatch: 'full', data: { state: 'user_activity'}, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class UserActivityModule { }