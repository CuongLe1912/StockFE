import { RouterModule } from "@angular/router";
import { Component, NgModule } from "@angular/core";
import { UtilityModule } from "../../utility.module";
import { GridData } from "../../../_core/domains/data/grid.data";
import { AdminAuthGuard } from "../../../_core/guards/admin.auth.guard";
import { GridComponent } from "../../../_core/components/grid/grid.component";
import { SmsTemplateEntity } from "../../../_core/domains/entities/sms.template.entity";

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class SmsTemplateComponent extends GridComponent {
    obj: GridData = {
        Imports: [],
        Reference: SmsTemplateEntity,
    };

    constructor() {
        super();
        this.render(this.obj);
    }    
}

@NgModule({
    declarations: [SmsTemplateComponent],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: SmsTemplateComponent, pathMatch: 'full', data: { state: 'smstemplate'}, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class SmsTemplateModule { }