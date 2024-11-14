import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MOServicesComponent } from './services.component';
import { UtilityModule } from '../../utility.module';
import { RouterModule } from '@angular/router';
import { AdminAuthGuard } from '../../../_core/guards/admin.auth.guard';
import { MOServicesService } from './services.service';
import { AddServiceComponent } from './add.service/add.service.component';
import { EditServiceComponent } from './edit.service/edit.service.component';
import { AddComboComponent } from './add.combo/add.combo.component';
import { MOServiceGridComponent } from './components/service.grid.component';
import { PriceConfigServiceComponent } from './price.config.service/price.config.service.component';
import { PriceConfigGridComponent } from './components/price.config.component';
import { PriceConfigComboComponent } from './price.config.combo/price.config.combo.component';
import { MOServiceDetailComponent } from './view.detail/view.detail.component';
import { PriceConfigListServiceComponent } from './price.config.listservice/price.config.listservice.component';
import { ResultPriceConfigGridComponent } from './components/result.price.config.list.component';
import { MOPriceConfigDetailComponent } from './components/price.config.detail.component';
import { ShareModule } from '../../share.module';

@NgModule({
  imports: [
    ShareModule,
    CommonModule,
    UtilityModule,
    RouterModule.forChild([
      { path: '', component: MOServicesComponent, pathMatch: 'full', data: { state: 'services' }, canActivate: [AdminAuthGuard] },
      { path: 'add', component: AddServiceComponent, pathMatch: 'full', data: { state: 'add_service' }, canActivate: [AdminAuthGuard] },
      { path: 'edit', component: EditServiceComponent, pathMatch: 'full', data: { state: 'edit_service' }, canActivate: [AdminAuthGuard] },
      { path: 'add-combo', component: AddComboComponent, pathMatch: 'full', data: { state: 'add_combo' }, canActivate: [AdminAuthGuard] },
      { path: 'price-config-service', component: PriceConfigServiceComponent, pathMatch: 'full', data: { state: 'priceconfig_service' }, canActivate: [AdminAuthGuard] },
      { path: 'price-config-combo', component: PriceConfigComboComponent, pathMatch: 'full', data: { state: 'priceconfig_combo' }, canActivate: [AdminAuthGuard] },
      { path: 'view-detail', component: MOServiceDetailComponent, pathMatch: 'full', data: { state: 'view_detail' }, canActivate: [AdminAuthGuard] },
      { path: 'price-config-service-list', component: PriceConfigListServiceComponent, pathMatch: 'full', data: { state: 'priceconfig_service_list' }, canActivate: [AdminAuthGuard] },
      
    ]),
  ],
  declarations: [
    MOServicesComponent,
    AddServiceComponent,
    EditServiceComponent,
    AddComboComponent,
    PriceConfigServiceComponent,
    PriceConfigComboComponent,
    PriceConfigGridComponent,
    MOServiceDetailComponent,
    PriceConfigListServiceComponent,
    ResultPriceConfigGridComponent,
    MOPriceConfigDetailComponent,
  ],
  exports: [
    MOServiceGridComponent
  ],
  providers: [MOServicesService],
})
export class MOServicesModule { }
