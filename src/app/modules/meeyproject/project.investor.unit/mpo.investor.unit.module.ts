import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NgApexchartsModule } from "ng-apexcharts";
import { AdminAuthGuard } from "../../../_core/guards/admin.auth.guard";
import { ShareModule } from "../../share.module";
import { UtilityModule } from "../../utility.module";
import { InvestorUnitComponent } from "./mpo.investor.unit.component";
import { InvestorUnitService } from "./mpo.investor.unit.service";

@NgModule({
    declarations:[
        InvestorUnitComponent,
    ],
    providers: [InvestorUnitService],
    imports:[
        ShareModule,
        UtilityModule,
        NgApexchartsModule,
        RouterModule.forChild([
            { path: '', component: InvestorUnitComponent, pathMatch: 'full', canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class InvestorUnitModule { }