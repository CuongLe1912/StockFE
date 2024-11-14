import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ShareModule } from "../../share.module";
import { UtilityModule } from "../../utility.module";
import { MeeylandV2Service } from "./meeyland.v2.service";
import { MeeylandV2Component } from "./meeyland.v2.component";
import { AdminAuthGuard } from "../../../_core/guards/admin.auth.guard";

@NgModule({
    declarations: [
        MeeylandV2Component
    ],
    imports: [
        ShareModule,
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: MeeylandV2Component, pathMatch: 'full', data: { state: 'meeylandv2' }, canActivate: [AdminAuthGuard] },
        ])
    ],
    providers: [MeeylandV2Service]
})
export class MeeylandV2Module { }