import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NgApexchartsModule } from "ng-apexcharts";
import { AdminAuthGuard } from "../../../_core/guards/admin.auth.guard";
import { ShareModule } from "../../share.module";
import { UtilityModule } from "../../utility.module";
import { AddModalInvestorTypeComponent } from "./add-modal/add-modal.component";
import { InvestorTypeComponent } from "./mpo.investor.type.component";
import { InvestorTypeService } from "./mpo.investor.type.service";


@NgModule({
    declarations:[
        InvestorTypeComponent,
        AddModalInvestorTypeComponent,
    ],
    providers: [InvestorTypeService],
    imports:[
        ShareModule,
        UtilityModule,
        NgApexchartsModule,
        RouterModule.forChild([
            { path: '', component: InvestorTypeComponent, pathMatch: 'full', canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class InvestorTypeModule { }