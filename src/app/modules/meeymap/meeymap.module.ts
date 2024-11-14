import { NgModule } from "@angular/core";
import { ShareModule } from "../share.module";
import { RouterModule } from "@angular/router";
import { UtilityModule } from "../utility.module";
import { NgApexchartsModule } from "ng-apexcharts";
import { MMAssignComponent } from "./assign/assign.component";
import { MMAddNoteComponent } from "./add.note/add.note.component";
import { MMQuestionComponent } from "./question/question.component";
import { AdminAuthGuard } from "../../_core/guards/admin.auth.guard";
import { MMAssignListComponent } from "./assign.list/assign.list.component";
import { MMLookupViewComponent } from "./lookup.view/lookup.view.component";
import { MMLookupHistoryComponent } from "./lookup.history/lookup.history.component";
import { MMQuestionEditComponent } from "./question/edit.question/edit.question.component";
import { MLLookupStatisticalComponent } from "./lookup.statistical/lookup.statistical.component";
import { MLLookHistoryAssignComponent } from "./lookup.history.assign/lookup.history.assign.component";

@NgModule({
    declarations: [
        MMAssignComponent,
        MMAddNoteComponent,
        MMQuestionComponent,
        MMAssignListComponent,
        MMLookupViewComponent,
        MMQuestionEditComponent,
        MMLookupHistoryComponent,
        MLLookHistoryAssignComponent,
        MLLookupStatisticalComponent,
    ],
    imports: [
        ShareModule,
        UtilityModule,
        NgApexchartsModule,
        RouterModule.forChild([
            { path: '', component: MMLookupHistoryComponent, pathMatch: 'full', data: { state: 'mm_lookup_history' }, canActivate: [AdminAuthGuard] },
            { path: 'view', component: MMLookupViewComponent, pathMatch: 'full', data: { state: 'mm_lookup_history_view' }, canActivate: [AdminAuthGuard] },
            { path: 'question', component: MMQuestionComponent, pathMatch: 'full', data: { state: 'mm_question' }, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class MeeymapModule { }