import { RouterModule } from "@angular/router";
import { ShareModule } from "../../share.module";
import { Component, NgModule } from "@angular/core";
import { UtilityModule } from "../../utility.module";
import { GridData } from "../../../_core/domains/data/grid.data";
import { AdminAuthGuard } from "../../../_core/guards/admin.auth.guard";
import { ModalSizeType } from "../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../_core/components/grid/grid.component";
import { PrefixNumberEntity } from "../../../_core/domains/entities/prefix.number.entity";

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class PrefixNumberComponent extends GridComponent {
    obj: GridData = {
        Size: ModalSizeType.Large,
        Reference: PrefixNumberEntity,
    };

    constructor() {
        super();
        this.render(this.obj);
    }
}

@NgModule({
    declarations: [PrefixNumberComponent],
    imports: [
        ShareModule,
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: PrefixNumberComponent, pathMatch: 'full', data: { state: 'endpoint' }, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class PrefixNumberModule { }