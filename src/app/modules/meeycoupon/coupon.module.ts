import { NgModule } from "@angular/core";
import { ShareModule } from "../share.module";
import { RouterModule } from "@angular/router";
import { UtilityModule } from "../utility.module";
import { NgApexchartsModule } from "ng-apexcharts";
import { MeeyCouponService } from "./coupon.service";
import { AdminAuthGuard } from "../../_core/guards/admin.auth.guard";
import { MCAddCouponComponent } from "./coupon/add.coupon/add.coupon.component";
import { MCGridCouponComponent } from "./coupon/components/gird.coupon.component";
import { MCCouponHistoryComponent } from "./coupon/components/history.coupon.component";
import { MCGridUseServiceComponent } from "./coupon/components/gird.useservice.component";
import { MCGridActivatedServiceComponent } from "./coupon/components/grid.activatedserivce.component";
import { MCPopupCustomerListServiceComponent } from "./coupon/components/popup.customerlistservices.component";
import { MCGridCustomerListServiceComponent } from "./coupon/components/grid.customerlistservice.component";


@NgModule({
    declarations:[
        MCAddCouponComponent,
        MCGridCouponComponent,
        MCCouponHistoryComponent,
        MCGridUseServiceComponent,
        MCGridActivatedServiceComponent,
        MCGridCustomerListServiceComponent,
        MCPopupCustomerListServiceComponent,
    ],
    providers: [MeeyCouponService],
    imports:[
        ShareModule,
        UtilityModule,
        NgApexchartsModule,
        RouterModule.forChild([
            { path: '', component: MCGridCouponComponent, pathMatch: 'full', data: { state: 'mc_coupon' }, canActivate: [AdminAuthGuard] },
            { path: 'add', component: MCAddCouponComponent, pathMatch: 'full', data: { state: 'mc_coupon_add' }, canActivate: [AdminAuthGuard] },
            { path: 'edit', component: MCAddCouponComponent, pathMatch: 'full', data: { state: 'ml_coupon_edit' }, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class MeeyCouponModule { }