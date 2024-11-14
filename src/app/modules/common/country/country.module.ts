import { RouterModule } from "@angular/router";
import { Component, NgModule } from "@angular/core";
import { UtilityModule } from "../../utility.module";
import { GridData } from "../../../_core/domains/data/grid.data";
import { AdminAuthGuard } from "../../../_core/guards/admin.auth.guard";
import { ModalSizeType } from "../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../_core/components/grid/grid.component";
import { CountryEntity } from "../../../_core/domains/entities/country.entity";

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class CountryComponent extends GridComponent {
    obj: GridData = {
        Reference: CountryEntity,
        Size: ModalSizeType.Large,
    };

    constructor() {
        super();
        this.render(this.obj);
    }
}

@NgModule({
    declarations: [CountryComponent],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: CountryComponent, pathMatch: 'full', data: { state: 'country'}, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class CountryModule { }