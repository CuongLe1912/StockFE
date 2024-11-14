import { RouterModule } from "@angular/router";
import { Component, NgModule } from "@angular/core";
import { UtilityModule } from "../../utility.module";
import { GridData } from "../../../_core/domains/data/grid.data";
import { AdminAuthGuard } from "../../../_core/guards/admin.auth.guard";
import { ModalSizeType } from "../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../_core/components/grid/grid.component";
import { SmtpAccountEntity } from "../../../_core/domains/entities/smtp.account.entity";

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class SmtpAccountComponent extends GridComponent {
    obj: GridData = {
        Size: ModalSizeType.Large,
        Reference: SmtpAccountEntity,
    };

    constructor() {
        super();
        this.render(this.obj);
    }    
}

@NgModule({
    declarations: [SmtpAccountComponent],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: SmtpAccountComponent, pathMatch: 'full', data: { state: 'smtpaccount'}, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class SmtpAccountModule { }