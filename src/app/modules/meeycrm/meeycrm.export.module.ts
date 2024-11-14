import { NgModule } from "@angular/core";
import { UtilityModule } from "../utility.module";
import { MCRMAddNoteComponent } from "./customer/add.note/add.note.component";
import { MCRMCallLogComponent } from "./customer/components/customer.calllog.component";
import { MCRMCustomerListComponent } from "./customer/components/customer.list.component";
import { MCRMAddCustomerComponent } from "./customer/add.customer/add.customer.component";
import { MCRMCustomerNoteComponent } from "./customer/components/customer.note.component";
import { MCRMCustomerUserComponent } from "./customer/components/customer.user.component";
import { MCRMAddNoteCallComponent } from "./customer/add.note.call/add.note.call.component";
import { MCRMCustomerOrderComponent } from "./customer/components/customer.order.component";
import { MCRMViewCustomerComponent } from "./customer/view.customer/view.customer.component";
import { MCRMAddNoteEmailComponent } from "./customer/add.note.email/add.note.email.component";
import { MCRMCustomerArticleComponent } from "./customer/components/customer.article.component";
import { MCRMCustomerContactComponent } from "./customer/components/customer.contact.component";
import { MCRMCustomerHistoryComponent } from "./customer/components/customer.history.component";
import { MCRMCustomerNoteCallComponent } from "./customer/components/customer.note.call.component";
import { MCRMCustomerNoteEmailComponent } from "./customer/components/customer.note.email.component";
import { MCRMCustomerTransactionComponent } from "./customer/components/customer.transaction.component";
import { MCRMCustomerLookHistoryComponent } from "./customer/components/customer.lookup.history.component";
import { MCRMShowHistoryComponent } from "./customer/assign.sale.config/show.history/show.history.component";

@NgModule({
    declarations: [
        MCRMAddNoteComponent,
        MCRMCallLogComponent,
        MCRMAddNoteCallComponent,
        MCRMAddCustomerComponent,
        MCRMCustomerNoteComponent,
        MCRMAddNoteEmailComponent,
        MCRMViewCustomerComponent,
        MCRMCustomerUserComponent,
        MCRMCustomerListComponent,
        MCRMCustomerOrderComponent,
        MCRMCustomerHistoryComponent,
        MCRMCustomerContactComponent,
        MCRMCustomerArticleComponent,
        MCRMCustomerNoteCallComponent,
        MCRMCustomerNoteEmailComponent,
        MCRMCustomerLookHistoryComponent,
        MCRMCustomerTransactionComponent,
        MCRMShowHistoryComponent
    ],
    imports: [
        UtilityModule,
    ], 
    exports: [
        MCRMAddNoteComponent,
        MCRMCallLogComponent,
        MCRMAddNoteCallComponent,
        MCRMAddCustomerComponent,
        MCRMCustomerNoteComponent,
        MCRMAddNoteEmailComponent,
        MCRMViewCustomerComponent,
        MCRMCustomerUserComponent,
        MCRMCustomerListComponent,
        MCRMCustomerOrderComponent,
        MCRMCustomerHistoryComponent,
        MCRMCustomerContactComponent,
        MCRMCustomerArticleComponent,
        MCRMCustomerNoteCallComponent,
        MCRMCustomerNoteEmailComponent,
        MCRMCustomerLookHistoryComponent,
        MCRMCustomerTransactionComponent,
    ]
})
export class MeeyCrmExportModule { }