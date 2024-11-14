import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { UtilityModule } from "../utility.module";
import { NewsComponent } from "./news/news.component";
import { ReportComponent } from "./report/report.component";
import { CommentComponent } from "./comment/comment.component";
import { AdminAuthGuard } from "../../_core/guards/admin.auth.guard";
import { StatisticComponent } from "./statistic/statistic.component";
import { EditNewsComponent } from "./news/edit.news/edit.news.component";
import { EditReportComponent } from "./report/edit.report/edit.report.component";
import { EditCommentComponent } from "./comment/edit.comment/edit.comment.component";
import { EditReportStatusComponent } from "./report/edit.report.status/edit.report.status.component";
import { TableStatisticFeedComponentComponent } from "./statistic/table.statistic/table.statistic.feed.component";
import { TableStatisticInteractionComponentComponent } from "./statistic/table.statistic/table.statistic.interaction.component";
import { ExportStatisticComponent } from "./statistic/export.statistic/export.statistic.component";

@NgModule({
    declarations: [
        NewsComponent,
        ReportComponent,
        CommentComponent,
        EditNewsComponent,
        StatisticComponent,
        EditReportComponent,
        EditCommentComponent,
        ExportStatisticComponent,
        EditReportStatusComponent,
        TableStatisticFeedComponentComponent,
        TableStatisticInteractionComponentComponent
    ],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: NewsComponent, pathMatch: 'full', data: { state: 'mr_news' }, canActivate: [AdminAuthGuard] },
            { path: 'news', component: NewsComponent, pathMatch: 'full', data: { state: 'mr_news' }, canActivate: [AdminAuthGuard] },
            { path: 'report', component: ReportComponent, pathMatch: 'full', data: { state: 'mr_report' }, canActivate: [AdminAuthGuard] },
            { path: 'comment', component: CommentComponent, pathMatch: 'full', data: { state: 'mr_comment' }, canActivate: [AdminAuthGuard] },
            { path: 'news/edit', component: EditNewsComponent, pathMatch: 'full', data: { state: 'mr_news_edit' }, canActivate: [AdminAuthGuard] },
            { path: 'news/view', component: EditNewsComponent, pathMatch: 'full', data: { state: 'mr_news_view' }, canActivate: [AdminAuthGuard] },
            { path: 'statistic', component: StatisticComponent, pathMatch: 'full', data: { state: 'mr_statistic' }, canActivate: [AdminAuthGuard] },
            { path: 'report/edit', component: EditReportComponent, pathMatch: 'full', data: { state: 'mr_report_edit' }, canActivate: [AdminAuthGuard] },
            { path: 'report/view', component: EditReportComponent, pathMatch: 'full', data: { state: 'mr_report_view' }, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class MeeyShareModule { }