import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAFAffiliateSyntheticComponent } from './synthetic.component';
import { UtilityModule } from '../../utility.module';
import { RouterModule } from '@angular/router';
import { AdminAuthGuard } from '../../../_core/guards/admin.auth.guard';
import { MAFNavMenuComponent } from './components/nav.menu/nav.menu.component';
import { MAFCommissionIndividualComponent } from './components/commission.individual.component';
import { MAFCommissionBusinessesComponent } from './components/commission.businesses.component';
import { MAFApprovePaymentCommissionComponent } from './components/approve.payment.commission/approve.payment.commission.component';
import { MAFViewSyntheticComponent } from './components/view.synthetic.component';
import { MAFNavDetailMenuComponent } from './components/nav.detail.menu/nav.detail.menu.component';
import { MAFApproveInvoiceComponent } from './components/approve.invoice/approve.invoice.component';

@NgModule({
  imports: [
    CommonModule,
    UtilityModule,
    RouterModule.forChild([
      { path: '', component: MAFAffiliateSyntheticComponent, pathMatch: 'full', data: { state: 'synthetic' }, canActivate: [AdminAuthGuard] },
      { path: 'individual', component: MAFCommissionIndividualComponent, pathMatch: 'full', data: { state: 'individual' }, canActivate: [AdminAuthGuard] },
      { path: 'businesses', component: MAFCommissionBusinessesComponent, pathMatch: 'full', data: { state: 'individual' }, canActivate: [AdminAuthGuard] },
      { path: 'view', component: MAFViewSyntheticComponent, pathMatch: 'full', data: { state: 'view' }, canActivate: [AdminAuthGuard] },
    ]),
  ],
  declarations: [
    MAFAffiliateSyntheticComponent,
    MAFNavMenuComponent,
    MAFNavDetailMenuComponent,
    MAFCommissionIndividualComponent,
    MAFCommissionBusinessesComponent,
    MAFApprovePaymentCommissionComponent,
    MAFViewSyntheticComponent,
    MAFApproveInvoiceComponent,
  ]
})
export class MAFAffiliateSyntheticModule { }
