import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UtilityModule } from '../../utility.module';
import {MAFViewComponent} from "./view/view.component";
import { MAFTreeComponent } from './tree/tree.component';
import { MAFAffiliateService } from './affiliate.service';
import { MAFAffiliateComponent } from './affiliate.component';
import { MAFRequestComponent } from './request/request.component';
import { TreeViewModule } from '@syncfusion/ej2-angular-navigations';
import { MAFViewRequestComponent } from './request/view/view.component';
import { AdminAuthGuard } from '../../../_core/guards/admin.auth.guard';
import { MAFAffiliateNodeV1Component } from './nodeV1/nodev1.component';
import { MAFViewBranchComponent } from './view.branch/view.branch.component';
import {MAFViewUsersComponent} from "./view/components/view.users.component";
import { MAFAddNodeComponent } from './components/add.node/add.node.component';
import {MAFViewHistoryComponent} from "./view/components/view.history.component";
import { MAFAddTreeComponent } from './tree/components/add.tree/add.tree.component';
import {MAFViewCommissionComponent} from "./view/components/view.commission.component";
import {MAFViewTransactionComponent} from "./view/components/view.transaction.component";
import { MAFApproveRankComponent } from './components/approve.rank/approve.rank.component';
import { MAFChangeTreeComponent } from './tree/components/change.tree/change.tree.component';
import { MAFViewContractComponent } from './view/components/view.contract/view.contract.component';
import { MAFChangeMeeyIdComponent } from './tree/components/change.meeyid/change.meeyid.component';
import { MAFViewBranchDetailListComponent } from './view.branch/components/view.branch.detail.list.component';
import { MAFViewBranchDetailComponent } from './view.branch/components/view.branch.detail/view.branch.detail.component';
import { MAFAssignAffiliateComponent } from './assign.affiliate/assign.affiliate.component';
import { MAFAffiliateListComponent } from './components/affiliate.list.component';

@NgModule({
  imports: [
    CommonModule,
    UtilityModule,
    RouterModule.forChild([
      { path: '', component: MAFAffiliateComponent, pathMatch: 'full', data: { state: 'affiliate' }, canActivate: [AdminAuthGuard] },
      { path: 'tree', component: MAFTreeComponent, pathMatch: 'full', data: { state: 'tree' }, canActivate: [AdminAuthGuard] },
      { path: 'view', component: MAFViewComponent, pathMatch: 'full', data: { state: 'view' }, canActivate: [AdminAuthGuard] },
      { path: 'request', component: MAFRequestComponent, pathMatch: 'full', data: { state: 'request' }, canActivate: [AdminAuthGuard] },
      { path: 'viewBranch', component: MAFViewBranchComponent, pathMatch: 'full', data: { state: 'viewBranch' }, canActivate: [AdminAuthGuard] },
      { path: 'nodev1', component: MAFAffiliateNodeV1Component, pathMatch: 'full', data: { state: 'nodev1' }, canActivate: [AdminAuthGuard] },
    ]),
    TreeViewModule
  ],
  declarations: [
    MAFViewComponent,
    MAFTreeComponent,
    MAFAddTreeComponent,
    MAFAddNodeComponent,
    MAFRequestComponent,
    MAFAffiliateComponent,
    MAFViewUsersComponent,
    MAFChangeTreeComponent,
    MAFViewBranchComponent,
    MAFApproveRankComponent,
    MAFViewRequestComponent,
    MAFViewHistoryComponent,
    MAFViewContractComponent,
    MAFChangeMeeyIdComponent,
    MAFAffiliateListComponent,
    MAFViewCommissionComponent,
    MAFAffiliateNodeV1Component,
    MAFViewTransactionComponent,
    MAFAssignAffiliateComponent,
    MAFViewBranchDetailComponent,
    MAFViewBranchDetailListComponent,
  ],
  providers: [MAFAffiliateService],
})
export class MAFAffiliateModule { }
