import { NgModule } from "@angular/core";
import { ShareModule } from "../share.module";
import { RouterModule } from "@angular/router";
import { UtilityModule } from "../utility.module";
import { NgApexchartsModule } from "ng-apexcharts";
import { MeeyCrmExportModule } from "./meeycrm.export.module";
import { CompanyComponent } from "./company/company.component";
import { AdminAuthGuard } from "../../_core/guards/admin.auth.guard";
import { MCRMCustomerComponent } from "./customer/customer/customer.component";
import { EmailTemplateComponent } from "./email.template/email.template.component";
import { MCRMCustomerLeadComponent } from "./customer.lead/customer.lead.component";
import { EditCompanyComponent } from "./company/edit.company/edit.company.component";
import { MCRMCustomerGroupComponent } from "./customer.group/customer.group.component";
import { MCRMEmployeeListComponent } from "./customer.company/employee.list.component";
import { UpdateStatusComponent } from "./customer/update.status/update.status.component";
import { MCRMAddCustomerComponent } from "./customer/add.customer/add.customer.component";
import { MCRMGridCustomerComponent } from "./customer/components/grid.customer.component";
import { MCRMIframeContractComponent } from "./iframe.contract/iframe.contract.component";
import { MCRMCompanyViewComponent } from "./customer.company/view/view.company.component";
import { GroupCustomerComponent } from "./customer/group.customer/group.customer.component";
import { MCRMCustomerCompanyComponent } from "./customer.company/customer.company.component";
import { MCRMViewCustomerComponent } from "./customer/view.customer/view.customer.component";
import { MCRMEditCustomerComponent } from "./customer/edit.customer/edit.customer.component";
import { AssignCustomerComponent } from "./customer/assign.customer/assign.customer.component";
import { MCRMViewNoteEmailComponent } from "./customer/view.note.email/view.note.email.component";
import { ReceiveCustomerComponent } from "./customer/receive.customer/receive.customer.component";
import { MCRMCompanyApproveComponent } from "./customer.company/approve/approve.company.component";
import { MCRMGridCustomerBankComponent } from "./customer/components/grid.customer.bank.component";
import { MCRMRequestGroupComponent } from "./customer.request/request.group/request.group.component";
import { MCRMCustomerListChildComponent } from "./customer/components/customer.list.child.component";
import { MCRMHistoryCustomerComponent } from "./customer/history.customer/history.customer.component";
import { PopupSigninGmailComponent } from "./customer/popup.signin.gmail/popup.signin.gmail.component";
import { MCRMHistoryIframeComponent } from "./iframe.contract/components/grid.history.iframe.contract";
import { MCRMCallManagementStaffComponent } from "./call.management/staff/call.management.staff.component";
import { UpdateStatusLeadComponent } from "./customer.lead/update.status.lead/update.status.lead.component";
import { MCRMAddCustomerLeadComponent } from "./customer.lead/add.customer.lead/add.customer.lead.component";
import { MCRMCustomerBankHistoryComponent } from "./customer/components/grid.customer.bank.history.component";
import { StatisticalCustomerComponent } from "./customer/statistical.customer/statistical.customer.component";
import { MCRMViewCustomerLeadComponent } from "./customer.lead/view.customer.lead/view.customer.lead.component";
import { EditEmailTemplateComponent } from "./email.template/edit.email.template/edit.email.template.component";
import { EditCustomerContactComponent } from "./customer/edit.customer.contact/edit.customer.contact.component";
import { UpdateStatusSuccessComponent } from "./customer/update.status.success/update.status.success.component";
import { MCRMEditCustomerLeadComponent } from "./customer.lead/edit.customer.lead/edit.customer.lead.component";
import { MCRMCompanyUpdateStatusComponent } from "./customer.company/updatestatus/updatestatus.company.component";
import { MCRMCallManagementCustomerComponent } from "./call.management/customer/call.management.customer.component";
import { MCRMCustomerBankEditComponent } from "./customer/components/customer.bank.edit/customer.bank.edit.component";
import { MCRMImportCustomerLeadComponent } from "./customer.lead/import.customer.lead/import.customer.lead.component";
import { MCRMViewCallManagementcomponent } from "./call.management/view.call.management/view.call.management.component";
import { MCRMAddIframeContractComponent } from "./iframe.contract/components/add.iframe.contract/add.iframe.contract.component";
import { MCRMListConfirmImportLeadComponent } from "./customer.lead/confirm.import.customer.lead/list.confirm.import.component";
import { StatisticalCustomerLeadComponent } from "./customer.lead/statistical.customer.lead/statistical.customer.lead.component";
import { ViewMCRMRequestGroupComponent } from "./customer.request/request.group/components/view.request.group/view.request.group.component";
import { MCRMConfirmImportCustomerLeadComponent } from "./customer.lead/confirm.import.customer.lead/confirm.import.customer.lead.component";
import { MCRMCustomerBankAddTurnAuditingComponent } from "./customer/components/customer.bank.add.turn.auditing/customer.bank.add.turn.auditing.component";
import { MCRMCustomerListImportComponent } from "./customer/components/customer.list.import.component";
import { MCRMListAssignComponent } from "./customer/components/customer.list.assign.component";
import { TreeviewModule } from 'ngx-treeview';
import { MCRMAssignSaleConfigComponent } from "./customer/assign.sale.config/assign.sale.config.component";
import { Select2Module } from "ng-select2-component";
import { SyncCrmComponent } from './customer/sync.crm.customer/sync.crm.component'

@NgModule({
    declarations: [
        CompanyComponent,
        EditCompanyComponent,
        UpdateStatusComponent,
        MCRMCustomerComponent,
        GroupCustomerComponent,
        EmailTemplateComponent,
        MCRMListAssignComponent,
        AssignCustomerComponent,
        MCRMCompanyViewComponent,
        ReceiveCustomerComponent,
        MCRMEmployeeListComponent,
        PopupSigninGmailComponent,
        MCRMEditCustomerComponent,
        MCRMRequestGroupComponent,
        UpdateStatusLeadComponent,
        MCRMGridCustomerComponent,
        MCRMCustomerLeadComponent,
        MCRMCustomerGroupComponent,
        EditEmailTemplateComponent,
        MCRMViewNoteEmailComponent,
        MCRMHistoryIframeComponent,
        MCRMCompanyApproveComponent,
        MCRMIframeContractComponent,
        MCRMCustomerCompanyComponent,
        EditCustomerContactComponent,
        UpdateStatusSuccessComponent,
        StatisticalCustomerComponent,
        SyncCrmComponent,
        MCRMHistoryCustomerComponent,
        MCRMAddCustomerLeadComponent,
        MCRMCustomerBankEditComponent,
        MCRMGridCustomerBankComponent,
        ViewMCRMRequestGroupComponent,
        MCRMEditCustomerLeadComponent,
        MCRMViewCustomerLeadComponent,
        MCRMAddIframeContractComponent,
        MCRMCustomerListChildComponent,
        MCRMCustomerListImportComponent,
        MCRMViewCallManagementcomponent,
        MCRMImportCustomerLeadComponent,
        MCRMCallManagementStaffComponent,
        StatisticalCustomerLeadComponent,
        MCRMCustomerBankHistoryComponent,
        MCRMCompanyUpdateStatusComponent,
        MCRMListConfirmImportLeadComponent,
        MCRMCallManagementCustomerComponent,
        MCRMConfirmImportCustomerLeadComponent,
        MCRMCustomerBankAddTurnAuditingComponent,
        MCRMAssignSaleConfigComponent
    ],
    imports: [
        ShareModule,
        UtilityModule,
        NgApexchartsModule,
        MeeyCrmExportModule,
        RouterModule.forChild([
            { path: '', redirectTo: 'customer', pathMatch: 'full' },
            { path: 'company', component: CompanyComponent, pathMatch: 'full', data: { state: 'mcrm_company' }, canActivate: [AdminAuthGuard] },
            { path: 'customer', component: MCRMCustomerComponent, pathMatch: 'full', data: { state: 'mcrm_customer' }, canActivate: [AdminAuthGuard] },
            { path: 'assignsaleconfig', component: MCRMAssignSaleConfigComponent, pathMatch: 'full', data: { state: 'mcrm_customer' }, canActivate: [AdminAuthGuard] },
            { path: 'customer/add', component: MCRMAddCustomerComponent, pathMatch: 'full', data: { state: 'mcrm_customer_add' }, canActivate: [AdminAuthGuard] },
            { path: 'customer/edit', component: MCRMEditCustomerComponent, pathMatch: 'full', data: { state: 'mcrm_customer_edit' }, canActivate: [AdminAuthGuard] },
            { path: 'customer/view', component: MCRMViewCustomerComponent, pathMatch: 'full', data: { state: 'mcrm_customer_view' }, canActivate: [AdminAuthGuard] },
            { path: 'emailtemplate', component: EmailTemplateComponent, pathMatch: 'full', data: { state: 'mcrm_emailtemplate' }, canActivate: [AdminAuthGuard] },
            { path: 'customergroup', component: MCRMCustomerGroupComponent, pathMatch: 'full', data: { state: 'mcrm_customer_group' }, canActivate: [AdminAuthGuard] },
            { path: 'customerrequest', component: MCRMRequestGroupComponent, pathMatch: 'full', data: { state: 'mcrm_customer_request' }, canActivate: [AdminAuthGuard] },
            { path: 'calllogstaff', component: MCRMCallManagementStaffComponent, pathMatch: 'full', data: { state: 'mcrm_calllog_staff' }, canActivate: [AdminAuthGuard] },
            { path: 'calllogcustomer', component: MCRMCallManagementCustomerComponent, pathMatch: 'full', data: { state: 'mcrm_calllog_customer' }, canActivate: [AdminAuthGuard] },
            { path: 'iframecontract', component: MCRMIframeContractComponent, pathMatch: 'full', data: { state: 'mcrm_iframe_contract' }, canActivate: [AdminAuthGuard] },
            { path: 'customerlead', component: MCRMCustomerLeadComponent, pathMatch: 'full', data: { state: 'mcrm_customer_lead' }, canActivate: [AdminAuthGuard] },
            { path: 'customerlead/add', component: MCRMAddCustomerLeadComponent, pathMatch: 'full', data: { state: 'mcrm_customer_lead_add' }, canActivate: [AdminAuthGuard] },
            { path: 'customerlead/edit', component: MCRMEditCustomerLeadComponent, pathMatch: 'full', data: { state: 'mcrm_customer_lead_edit' }, canActivate: [AdminAuthGuard] },
            { path: 'customerlead/view', component: MCRMViewCustomerLeadComponent, pathMatch: 'full', data: { state: 'mcrm_customer_lead_view' }, canActivate: [AdminAuthGuard] },
        ]),
        TreeviewModule.forRoot(),
        Select2Module
    ]
})
export class MeeyCrmModule { }