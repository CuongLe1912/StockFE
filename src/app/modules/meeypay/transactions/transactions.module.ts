import { NgModule } from "@angular/core";
import { ShareModule } from "../../share.module";
import { RouterModule } from "@angular/router";
import { NgApexchartsModule } from "ng-apexcharts";
import { MPTransactionEventService, MPTransactionService } from "./transactions.service";
import { UtilityModule } from "../../../modules/utility.module";
import { AdminAuthGuard } from "../../../_core/guards/admin.auth.guard";
import { MPTransactionViewComponent } from "./view/transaction.view.component";
import { MPWalletHistoryComponent } from "./view.history/wallet.history.component";
import { MPTransactionHistoryComponent } from "./view.history/transaction.history.component";
import { MPTransactionsComponent } from "./transactions.component";
import { MPBalanceComponent } from "./promotion/components/balance.component";
import { MPAddTransactionComponent } from "./promotion/add.transaction/add.transaction.component";
import { MPTransactionStatisticalComponent } from "./transaction.statistical/transaction.statistical.component";
import { MPTransactionDetailComponent } from "./transaction.view/transaction.view.component";
import { MPTransactionApproveComponent } from "./components/transaction.approve/transaction.approve.component";
import { MLTransactionWalletComponent } from "./components/transaction.wallet.component";
import { MLTransactionRefComponent } from "./components/transaction.ref.component";
import { MLTransactionHistoryComponent } from "./components/transaction.history.component";
import { MPTransactionWithdrawalCensorshipComponent } from "./components/transaction.withdrawal/transaction.withdrawal.component";
import { MPMenuButtonComponent } from "./components/menu.button/menu.button.component";
import { MPTransactionAddNoteComponent } from "./components/transaction.add.note/transaction.add.note.component";

@NgModule({
    declarations: [
        MPWalletHistoryComponent,
        MPTransactionViewComponent,
        MPTransactionHistoryComponent,
        MPTransactionsComponent,
        MPBalanceComponent,
        MPAddTransactionComponent,
        MPTransactionStatisticalComponent,
        MPTransactionDetailComponent,
        MPTransactionApproveComponent,
        MLTransactionWalletComponent,
        MLTransactionRefComponent,
        MLTransactionHistoryComponent,
        MPTransactionWithdrawalCensorshipComponent,
        MPMenuButtonComponent,
        MPTransactionAddNoteComponent,
    ],
    imports: [
        ShareModule,
        UtilityModule,
        NgApexchartsModule,
        RouterModule.forChild([
            { path: '', component: MPTransactionsComponent, pathMatch: 'full', data: { state: 'mp_transactions' }, canActivate: [AdminAuthGuard] },
            { path: 'view', component: MPTransactionDetailComponent, pathMatch: 'full', data: { state: 'mp_view_detail' }, canActivate: [AdminAuthGuard] },            
            { path: 'add', component: MPAddTransactionComponent, pathMatch: 'full', data: { state: 'mp_transactions_add' }, canActivate: [AdminAuthGuard] },
        ])
    ],
    providers: [MPTransactionService, MPTransactionEventService]
})
export class MPTransactionModule { }