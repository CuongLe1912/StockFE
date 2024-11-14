import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MOOrdersService } from './orders.service';
import { NgApexchartsModule } from 'ng-apexcharts';
import { UtilityModule } from '../../utility.module';
import { MOOrderComponent } from './orders.component';
import { MOAddOrderComponent } from './add.order/add.order.component';
import { AdminAuthGuard } from '../../../_core/guards/admin.auth.guard';
import { MOOrderDetailComponent } from './view.detail/view.detail.component';
import { MOApproveOrderComponent } from './approve.order/approve.order.component';
import { MOOrderLookupHistoryComponent } from './components/lookup.history.component';
import { MOOrderStatisticalComponent } from './components/order.statistical.component';
import { MOOrderServiceGridComponent } from './components/order.service.grid.component';
import { MOOrderPaymentGridComponent } from './components/order.payment.grid.component';
import { MOOrderHistoryGridComponent } from './components/order.history.grid.component';
import { MOOrderProcessingGridComponent } from './components/order.processing.grid.component';
import { MLOrderStatisticalComponent } from './order.statistical/order.statistical.component';
import { MOOrderApproveRejectComponent } from './components/order.approve/order.approve.component';
import { MOOrderLookupQuickViewComponent } from './components/lookup.quickview/lookup.quickview.component';
import { OrderProcessingDetailComponent } from './components/order.processing.detail/order.processing.detail.component';

@NgModule({
  imports: [
    CommonModule,
    UtilityModule,
    NgApexchartsModule,
    RouterModule.forChild([
      { path: '', component: MOOrderComponent, pathMatch: 'full', data: { state: 'orders' }, canActivate: [AdminAuthGuard] },
      { path: 'add', component: MOAddOrderComponent, pathMatch: 'full', data: { state: 'add' }, canActivate: [AdminAuthGuard] },
      { path: 'view-detail', component: MOOrderDetailComponent, pathMatch: 'full', data: { state: 'view_detail' }, canActivate: [AdminAuthGuard] },
      { path: 'approve', component: MOApproveOrderComponent, pathMatch: 'full', data: { state: 'approve' }, canActivate: [AdminAuthGuard] },
    ]),
  ],
  declarations: [
    MOOrderComponent,
    MOAddOrderComponent,
    MOOrderDetailComponent,
    MOApproveOrderComponent,
    MOOrderServiceGridComponent,
    MOOrderPaymentGridComponent,
    MOOrderHistoryGridComponent,
    MOOrderStatisticalComponent,
    MLOrderStatisticalComponent,
    MOOrderLookupHistoryComponent,
    MOOrderApproveRejectComponent,
    OrderProcessingDetailComponent,
    MOOrderProcessingGridComponent,
    MOOrderLookupQuickViewComponent,
  ],
  providers: [MOOrdersService],
})
export class MOOrdersModule { }
