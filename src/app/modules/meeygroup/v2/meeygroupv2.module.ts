import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { UtilityModule } from "../../utility.module";
import { ProfileComponent } from "./profile/profile.component";
import { AdminAuthGuard } from "../../../_core/guards/admin.auth.guard";
import { RecruitmentComponent } from "./recruitment/recruitment.component";
import { EditProfileComponent } from "./profile/edit.profile/edit.profile.component";
import { EditRecruitmentComponent } from "./recruitment/edit.recruitment/edit.recruitment.component";
import { ViewRecruitmentComponent } from "./recruitment/view.recruitment/view.recruitment.component";

@NgModule({
    declarations: [
        ProfileComponent,
        EditProfileComponent,
        RecruitmentComponent,
        EditRecruitmentComponent,
        ViewRecruitmentComponent
    ],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: 'profile', component: ProfileComponent, pathMatch: 'full', data: { state: 'mg_profile' }, canActivate: [AdminAuthGuard] },
            { path: 'recruitment', component: RecruitmentComponent, pathMatch: 'full', data: { state: 'mg_recruitment' }, canActivate: [AdminAuthGuard] },
            { path: 'recruitment/add', component: EditRecruitmentComponent, pathMatch: 'full', data: { state: 'mg_recruitment_add' }, canActivate: [AdminAuthGuard] },
            { path: 'recruitment/edit', component: EditRecruitmentComponent, pathMatch: 'full', data: { state: 'mg_recruitment_edit' }, canActivate: [AdminAuthGuard] },
            { path: 'recruitment/view', component: ViewRecruitmentComponent, pathMatch: 'full', data: { state: 'mg_recruitment_view' }, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class MeeyGroupV2Module { }