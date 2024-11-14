import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { UtilityModule } from "../../utility.module";
import { MLRedirectService } from "./redirect.service";
import { RedirectComponent } from "./redirect.component";
import { AdminAuthGuard } from "../../../_core/guards/admin.auth.guard";
import { ImportRedirectComponent } from './import/import.redirect.component';
import { AddModalMLRedirectComponent } from "./add-modal/add-modal.component";
import { HistoryModalRedirectComponent } from "./history-modal/history-modal.component";
import { ConfirmImportRedirectComponent } from "./import/confirm-import/confirm.import.redirect.component";

@NgModule({
    imports: [
        CommonModule,
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: RedirectComponent, pathMatch: 'full', data: { state: 'mlredirect' }, canActivate: [AdminAuthGuard] },
        ]),
    ],
    declarations: [
        RedirectComponent,
        ImportRedirectComponent,
        AddModalMLRedirectComponent,
        HistoryModalRedirectComponent,
        ConfirmImportRedirectComponent
    ],
    providers: [MLRedirectService]
})
export class MLRedirectModule { }
