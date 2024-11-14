import { RouterModule } from "@angular/router";
import { Component, NgModule } from "@angular/core";
import { UtilityModule } from "../../utility.module";
import { GridData } from "../../../_core/domains/data/grid.data";
import { AdminAuthGuard } from "../../../_core/guards/admin.auth.guard";
import { ModalSizeType } from "../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../_core/components/grid/grid.component";
import { MSMetaSeoTemplateEntity } from "../../../_core/domains/entities/ms.meta.seo.template.entity";

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class MSMetaSeoTemplateComponent extends GridComponent {
    obj: GridData = {
        Size: ModalSizeType.ExtraLarge,
        Reference: MSMetaSeoTemplateEntity,
    };

    constructor() {
        super();
        this.render(this.obj);
    }
}

@NgModule({
    declarations: [
        MSMetaSeoTemplateComponent,
    ],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: MSMetaSeoTemplateComponent, pathMatch: 'full', data: { state: 'metaseotemplate' }, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class MSMetaSeoTemplateModule { }