import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UtilityModule } from '../../../modules/utility.module';
import { MOServiceHistoryService } from './service.history.service';
import { AdminAuthGuard } from '../../../_core/guards/admin.auth.guard';
import { MOServiceHistoryComponent } from './service.history.component';
import { MOServiceHistoryDetailComponent } from './components/service.history.detail.component';
import { MOServiceHistoryDetailModalComponent } from './components/service.history.detail.modal.component';
import { MOServiceHistoryDetailServiceComponent } from './components/service.history.detail.service.component';

@NgModule({
  imports: [
    CommonModule,
    UtilityModule,
    RouterModule.forChild([
      { path: '', component: MOServiceHistoryComponent, pathMatch: 'full', data: { state: 'service.history' }, canActivate: [AdminAuthGuard] },
    ]),
  ],
  declarations: [
    MOServiceHistoryComponent,
    MOServiceHistoryDetailComponent,
    MOServiceHistoryDetailModalComponent,
    MOServiceHistoryDetailServiceComponent
  ],
  providers: [MOServiceHistoryService]
})
export class MOServiceHistoryModule { }