import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UtilityModule } from '../../../modules/utility.module';
import { AdminAuthGuard } from '../../../_core/guards/admin.auth.guard';
import { MAFContractComponent } from './contract.component';
import { MAFContractService } from './contract.service';
import { MAFContractViewComponent } from './view/view.component';
import { MAFApproveIndividualComponent } from './components/approve.individual/approve.individual.component';

@NgModule({
  imports: [
    CommonModule,
    UtilityModule,
    RouterModule.forChild([
      { path: '', component: MAFContractComponent, pathMatch: 'full', data: { state: 'mafcontract' }, canActivate: [AdminAuthGuard] },
      { path: 'view', component: MAFContractViewComponent, pathMatch: 'full', data: { state: 'mafviewcontract' }, canActivate: [AdminAuthGuard] },
    ]),
  ],
  declarations: [
    MAFContractComponent,
    MAFContractViewComponent,
    MAFApproveIndividualComponent,
  ],
  providers: [MAFContractService]
})
export class MAFContractModule { }