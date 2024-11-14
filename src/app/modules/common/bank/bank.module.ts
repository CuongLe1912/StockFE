import { RouterModule } from "@angular/router";
import { Component, NgModule } from "@angular/core";
import { UtilityModule } from "../../utility.module";
import { GridData } from "../../../_core/domains/data/grid.data";
import { ActionData } from "../../../_core/domains/data/action.data";
import { AdminAuthGuard } from "../../../_core/guards/admin.auth.guard";
import { BankEntity } from "../../../_core/domains/entities/bank.entity";
import { ModalSizeType } from "../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../_core/components/grid/grid.component";

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class BankComponent extends GridComponent {
    obj: GridData = {
        Imports: [],
        Exports: [],
        Reference: BankEntity,
        Size: ModalSizeType.Medium,
        Features: [
            ActionData.addNew(() => this.addNew()),
            ActionData.reload(() => this.loadItems()),
            ActionData.resetCache(() => this.resetCache()),
        ]
    };

    constructor() {
        super();
        this.render(this.obj);
    }    
}

@NgModule({
    declarations: [BankComponent],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: BankComponent, pathMatch: 'full', data: { state: 'bank'}, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class BankModule { }