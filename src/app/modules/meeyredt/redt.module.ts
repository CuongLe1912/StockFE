import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { UtilityModule } from "../utility.module";
import { NewsComponent } from "./news/news.component";
import { MenuComponent } from "./menu/menu.component";
import { BannerComponent } from "./banner/banner.component";
import { LeaderComponent } from "./leader/leader.component";
import { OfficeComponent } from "./office/office.component";
import { CategoryComponent } from "./category/category.component";
import { AdminAuthGuard } from "../../_core/guards/admin.auth.guard";
import { CoreValueComponent } from "./corevalue/corevalue.component";
import { EditMenuComponent } from "./menu/edit.menu/edit.menu.component";
import { EditBannerComponent } from "./banner/edit.banner/edit.banner.component";
import { EditLeaderComponent } from "./leader/edit.leader/edit.leader.component";
import { EditOfficeComponent } from "./office/edit.office/edit.office.component";
import { EditCoreValueComponent } from "./corevalue/edit.corevalue/edit.corevalue.component";
import { EditNewsComponent } from "../../modules/meeyredt/news/edit.news/edit.news.component";
import { EditCategoryComponent } from "../../modules/meeyredt/category/edit.category/edit.category.component";
import { QuestionComponent } from "./question/question.component";

@NgModule({
    declarations: [
        NewsComponent,
        MenuComponent,
        LeaderComponent,
        BannerComponent,
        OfficeComponent,
        EditMenuComponent,
        EditNewsComponent,
        CategoryComponent,
        CoreValueComponent,
        EditLeaderComponent,
        EditBannerComponent,
        EditOfficeComponent,
        EditCategoryComponent,
        EditCoreValueComponent,
        QuestionComponent
    ],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: 'news', component: NewsComponent, pathMatch: 'full', data: { state: 'mr_news' }, canActivate: [AdminAuthGuard] },
            { path: 'menu', component: MenuComponent, pathMatch: 'full', data: { state: 'mg_menus' }, canActivate: [AdminAuthGuard] },
            { path: 'office', component: OfficeComponent, pathMatch: 'full', data: { state: 'mr_office'}, canActivate: [AdminAuthGuard] },
            { path: 'leader', component: LeaderComponent, pathMatch: 'full', data: { state: 'mr_leader' }, canActivate: [AdminAuthGuard] },
            { path: 'banner', component: BannerComponent, pathMatch: 'full', data: { state: 'mg_banners' }, canActivate: [AdminAuthGuard] },
            { path: 'news/add', component: EditNewsComponent, pathMatch: 'full', data: { state: 'mr_news_add' }, canActivate: [AdminAuthGuard] },
            { path: 'category', component: CategoryComponent, pathMatch: 'full', data: { state: 'mr_category' }, canActivate: [AdminAuthGuard] },
            { path: 'news/edit', component: EditNewsComponent, pathMatch: 'full', data: { state: 'mr_news_edit' }, canActivate: [AdminAuthGuard] },
            { path: 'news/view', component: EditNewsComponent, pathMatch: 'full', data: { state: 'mr_news_view' }, canActivate: [AdminAuthGuard] },
            { path: 'corevalue', component: CoreValueComponent, pathMatch: 'full', data: { state: 'mr_corevalue' }, canActivate: [AdminAuthGuard] },
            { path: 'banner/add', component: EditBannerComponent, pathMatch: 'full', data: { state: 'mg_banners_add' }, canActivate: [AdminAuthGuard] },
            { path: 'banner/edit', component: EditBannerComponent, pathMatch: 'full', data: { state: 'mg_banners_edit' }, canActivate: [AdminAuthGuard] },
            { path: 'banner/view', component: EditBannerComponent, pathMatch: 'full', data: { state: 'mg_banners_view' }, canActivate: [AdminAuthGuard] },
            { path: 'question', component: QuestionComponent, pathMatch: 'full', data: { state: 'mg_questions' }, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class RedtModule { }