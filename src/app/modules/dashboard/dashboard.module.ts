import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UtilityModule } from '../utility.module';
import { DashboardService } from './dashboard.service';
import { DashboardComponent } from './dashboard.component';
import { AdminAuthGuard } from '../../_core/guards/admin.auth.guard';

@NgModule({
    declarations: [
        DashboardComponent
    ],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: DashboardComponent, pathMatch: 'full', data: { state: 'dashboard'}, canActivate: [AdminAuthGuard] },
        ])
    ],
    providers: [
        DashboardService
    ]
})
export class DashboardModule { }
