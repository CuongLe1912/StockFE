import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { UtilityModule } from "../utility.module";
import { NewsComponent } from "./news/news.component";
import { CategoryComponent } from "./category/category.component";
import { AdminAuthGuard } from "../../_core/guards/admin.auth.guard";
import { EditNewsComponent } from "./news/edit.news/edit.news.component";
import { EditCategoryComponent } from "./category/edit/edit.category.component";
import { CategoryAnnouncedComponent } from "./category.announced/category.announced.component";
import { EditCategoryAnnouncedComponent } from "./category.announced/edit.category.announced/edit.category.announced.component";
import { RecruitmentComponent } from "./recruitment/recruitment.component";
import { ViewRecruitmentComponent } from "./recruitment/view.recruitment/view.recruitment.component";
import { EditRecruitmentComponent } from "./recruitment/edit.recruitment/edit.recruitment.component";
import { ProfileComponent } from "./profile/profile.component";
import { EditProfileComponent } from "./profile/edit.profile/edit.profile.component";

@NgModule({
    declarations: [
        NewsComponent,
        EditNewsComponent,
        CategoryComponent,
        EditCategoryComponent,
        CategoryAnnouncedComponent,
        EditCategoryAnnouncedComponent,
        ViewRecruitmentComponent,
        EditRecruitmentComponent,
        RecruitmentComponent,
        ProfileComponent,
        EditProfileComponent
    ],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: NewsComponent, pathMatch: 'full', data: { state: 'mbank_news' }, canActivate: [AdminAuthGuard] },
            { path: 'news', component: NewsComponent, pathMatch: 'full', data: { state: 'mbank_news' }, canActivate: [AdminAuthGuard] },
            { path: 'news/add', component: EditNewsComponent, pathMatch: 'full', data: { state: 'mbank_news_add' }, canActivate: [AdminAuthGuard] },
            { path: 'news/edit', component: EditNewsComponent, pathMatch: 'full', data: { state: 'mbank_news_edit' }, canActivate: [AdminAuthGuard] },
            { path: 'news/view', component: EditNewsComponent, pathMatch: 'full', data: { state: 'mbank_news_view' }, canActivate: [AdminAuthGuard] },
            { path: 'category', component: CategoryComponent, pathMatch: 'full', data: { state: 'mbank_category' }, canActivate: [AdminAuthGuard] },
            { path: 'categoryannounced', component: CategoryAnnouncedComponent, pathMatch: 'full', data: { state: 'mbank_category_announced' }, canActivate: [AdminAuthGuard] },
            { path: 'recruitment', component: RecruitmentComponent, pathMatch: 'full', data: { state: 'mbank_recruitment' }, canActivate: [AdminAuthGuard] },
            { path: 'recruitment/view', component: ViewRecruitmentComponent, pathMatch: 'full', data: { state: 'mbank_recruitment_view' }, canActivate: [AdminAuthGuard] },
            { path: 'recruitment/edit', component: EditRecruitmentComponent, pathMatch: 'full', data: { state: 'mbank_recruitment_edit' }, canActivate: [AdminAuthGuard] },
            { path: 'recruitment/add', component: EditRecruitmentComponent, pathMatch: 'full', data: { state: 'mbank_recruitment_add' }, canActivate: [AdminAuthGuard] },
            { path: 'profile', component: ProfileComponent, pathMatch: 'full', data: { state: 'mbank_profile' }, canActivate: [AdminAuthGuard] }
        ])
    ]
})
export class MeeyBankModule { }