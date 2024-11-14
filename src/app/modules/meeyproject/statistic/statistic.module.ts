import { NgModule } from '@angular/core';
import { MPOStatisticComponent } from './statistic.component';
import { ShareModule } from '../../share.module';
import { UtilityModule } from '../../utility.module';
import { RouterModule } from '@angular/router';
import { AdminAuthGuard } from '../../../_core/guards/admin.auth.guard';

@NgModule({
  imports: [
    ShareModule,
    UtilityModule,
    RouterModule.forChild([
      { path: '', component: MPOStatisticComponent, pathMatch: 'full', canActivate: [AdminAuthGuard] },
    ])
  ],
  declarations: [MPOStatisticComponent]
})
export class MPOStatisticModule { }
