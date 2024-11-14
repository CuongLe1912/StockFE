import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UtilityModule } from '../../../modules/utility.module';
import { AdminAuthGuard } from '../../../_core/guards/admin.auth.guard';
import { MAFRankCumulativeComponent } from './rank.cumulative.component';
import { MAFRankCumulativeService } from './rank.cumulative.service';
import { MAFGridHistoryChangeComponent } from './components/grid.history.change';

@NgModule({
  imports: [
    CommonModule,
    UtilityModule,
    RouterModule.forChild([
      { path: '', component: MAFRankCumulativeComponent, pathMatch: 'full', data: { state: 'rankcumulative' }, canActivate: [AdminAuthGuard] },
      { path: 'edit', component: MAFRankCumulativeComponent, pathMatch: 'full', data: { state: 'cumulative_edit' }, canActivate: [AdminAuthGuard] },
    ]),
  ],
  declarations: [
    MAFRankCumulativeComponent,
    MAFGridHistoryChangeComponent,
  ],
  providers: [MAFRankCumulativeService],
})
export class MAFRankCumulativeModule { }