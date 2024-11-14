import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAFPolicyComponent } from './policy.component';
import { UtilityModule } from '../../utility.module';
import { RouterModule } from '@angular/router';
import { AdminAuthGuard } from '../../../_core/guards/admin.auth.guard';
import { MAFPolicyService } from './policy.service';
import { MAFViewPolicyComponent } from './view/view.component';

@NgModule({
  imports: [
    CommonModule,
    UtilityModule,
    RouterModule.forChild([
      { path: '', component: MAFPolicyComponent, pathMatch: 'full', data: { state: 'policy' }, canActivate: [AdminAuthGuard] },
      { path: 'view', component: MAFViewPolicyComponent, pathMatch: 'full', data: { state: 'view_policy' }, canActivate: [AdminAuthGuard] },
    ]),
  ],
  declarations: [
    MAFPolicyComponent,
    MAFViewPolicyComponent,
  ],
  providers: [MAFPolicyService],
})
export class MAFPolicyModule { }
