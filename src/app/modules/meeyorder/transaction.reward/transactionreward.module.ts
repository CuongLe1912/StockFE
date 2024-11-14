import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilityModule } from '../../utility.module';
import { RouterModule } from '@angular/router';
import { AdminAuthGuard } from '../../../_core/guards/admin.auth.guard';
import { MOTransactionRewardService } from './transactionreward.service';
import { MOTransactionRewardDetailComponent } from './view/transaction.view.component';

import { NgApexchartsModule } from 'ng-apexcharts';
import { MOTransactionrewardComponent } from './transactionreward.component';
import { MOTransactionWalletComponent } from './view/transaction.wallet.component';
import { MOTransactionRefComponent } from './view/transaction.ref.component';
import { MOTransactionHistoryComponent } from './view/transaction.history.component';
import { StatisticalsComponent } from './statisticals/statisticals.component';

@NgModule({
  imports: [
    CommonModule,
    UtilityModule,
    NgApexchartsModule,
    RouterModule.forChild([
      { path: '', component: MOTransactionrewardComponent, pathMatch: 'full', data: { state: 'transactionreward' }, canActivate: [AdminAuthGuard] },
      { path: 'view', component: MOTransactionRewardDetailComponent, pathMatch: 'full', data: { state: 'transactionreward_view_detail' }, canActivate: [AdminAuthGuard] },            
      // { path: 'add', component: MPAddTransactionComponent, pathMatch: 'full', data: { state: 'transactionreward__add' }, canActivate: [AdminAuthGuard] },

      
    ]),
  ],
  declarations: [
    MOTransactionRewardDetailComponent,
    MOTransactionrewardComponent,
    MOTransactionWalletComponent,
    MOTransactionHistoryComponent,
    MOTransactionRefComponent,
    StatisticalsComponent
  ],
  providers: [MOTransactionRewardService],
})
export class MOTransactionRewardModule { }
