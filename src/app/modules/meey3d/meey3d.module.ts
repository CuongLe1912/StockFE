import { NgModule } from "@angular/core";
import { UtilityModule } from "../utility.module";
import { EditTourComponent } from "./tour/edit.tour.component/edit.tour.component";
import { RouterModule } from "@angular/router";
import { AdminAuthGuard } from "../../_core/guards/admin.auth.guard";
import { M3dTourComponent } from "./tour/3d.tour.component";
import { M3dListCustomerComponent } from "./tour/list.customer.component/list.customer.component";
import { EditTourCustomerComponent } from "./tour/edit.customer.component/edit.customer.component";
import { M3dDashboardComponent } from "./dashboard/3d.dashboard.component";
import { M3DService } from "./meey3d.service";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { M3DChardDashboardComponent } from "./chart.dashboard/3d.chart.dashboard.component";
import { NgApexchartsModule } from "ng-apexcharts";

@NgModule({
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: 'tour', component: M3dTourComponent, pathMatch: 'full', data: { state: 'm3d_tour' }, canActivate: [AdminAuthGuard] },
            { path: 'tour/view', component: EditTourComponent, pathMatch: 'full', data: { state: 'm3d_tour_view' }, canActivate: [AdminAuthGuard] },
            { path: 'tour/edit', component: EditTourComponent, pathMatch: 'full', data: { state: 'm3d_tour_edit' }, canActivate: [AdminAuthGuard] },
            { path: 'contactinfo', component: M3dListCustomerComponent, pathMatch: 'full', data: { state: 'm3d_contactinfo' }, canActivate: [AdminAuthGuard] },
            { path: 'dashboard', component: M3dDashboardComponent, pathMatch: 'full', data: { state: 'm3d_dashboard' }, canActivate: [AdminAuthGuard] },
        ]),
        NgApexchartsModule,   
    ],
    declarations: [
        M3dTourComponent,
        EditTourComponent,
        M3dListCustomerComponent,
        EditTourCustomerComponent,
        M3dDashboardComponent,
        M3DChardDashboardComponent
    ],
    providers: [M3DService]
})

export class Meey3DModule { }
