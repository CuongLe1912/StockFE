import { NgModule } from '@angular/core';
import { MPInvoiceComponent } from './invoice.component';
import { ShareModule } from '../../share.module';
import { UtilityModule } from '../../utility.module';
import { RouterModule } from '@angular/router';
import { AdminAuthGuard } from '../../../_core/guards/admin.auth.guard';
import { MPAddInvoiceComponent } from './components/add.invoice/add.invoice.component';
import { MPInvoiceService } from './invoice.service';
import { MPViewInvoiceComponent } from './components/view.invoice/view.invoice.component';
import { MPEditInvoiceComponent } from './components/edit.invoice/edit.invoice.component';
import { MPMenuButtonComponent } from './components/menu.button/menu.button.component';
import { MPExportInvoiceComponent } from './components/export.invoice/export.invoice.component';
import { MPGroupInvoiceComponent } from './components/group.invoice/group.invoice.component';

@NgModule({
  declarations: [
    MPInvoiceComponent,
    MPAddInvoiceComponent,
    MPViewInvoiceComponent,
    MPEditInvoiceComponent,
    MPMenuButtonComponent,
    MPExportInvoiceComponent,
    MPGroupInvoiceComponent,
  ],
  imports: [
    ShareModule,
    UtilityModule,
    RouterModule.forChild([
      { path: '', component: MPInvoiceComponent, pathMatch: 'full', data: { state: 'invoice' }, canActivate: [AdminAuthGuard] },
      { path: 'add', component: MPAddInvoiceComponent, pathMatch: 'full', data: { state: 'add_invoice' }, canActivate: [AdminAuthGuard] },
      { path: 'view', component: MPViewInvoiceComponent, pathMatch: 'full', data: { state: 'view_invoice' }, canActivate: [AdminAuthGuard] },
      { path: 'edit', component: MPEditInvoiceComponent, pathMatch: 'full', data: { state: 'edit_invoice' }, canActivate: [AdminAuthGuard] },
      { path: 'group', component: MPGroupInvoiceComponent, pathMatch: 'full', data: { state: 'group_invoice' }, canActivate: [AdminAuthGuard] },
    ])
  ],
  providers: [MPInvoiceService]
})
export class MPInvoiceModule { }
