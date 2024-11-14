import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { UtilityModule } from "../utility.module";
import { PageComponent } from "./page/page.component";
import { NewsComponent } from "./news/news.component";
import { LeaderComponent } from "./leader/leader.component";
import { OfficeComponent } from "./office/office.component";
import { BannerComponent } from "./banner/banner.component";
import { ProductComponent } from "./product/product.component";
import { SectionComponent } from "./section/section.component";
import { PartnerComponent } from "./partner/partner.component";
import { MessageComponent } from "./message/message.component";
import { EmployeeComponent } from "./employee/employee.component";
import { CategoryComponent } from "./category/category.component";
import { AnnouncedComponent } from "./announced/announced.component";
import { AdminAuthGuard } from "../../_core/guards/admin.auth.guard";
import { EditNewsComponent } from "./news/edit.news/edit.news.component";
import { EditPageComponent } from "./page/edit.page/edit.page.component";
import { PageSectionComponent } from "./page.section/page.section.component";
import { EditOfficeComponent } from "./office/edit.office/edit.office.component";
import { EditLeaderComponent } from "./leader/edit.leader/edit.leader.component";
import { EditBannerComponent } from "./banner/edit.banner/edit.banner.component";
import { EditMessageComponent } from "./message/edit.message/edit.message.component";
import { EditSectionComponent } from "./section/edit.section/edit.section.component";
import { EditPartnerComponent } from "./partner/edit.partner/edit.partner.component";
import { EditProductComponent } from "./product/edit.product/edit.product.component";
import { CategoryLeaderComponent } from "./category.leader/category.leader.component";
import { EditCategoryComponent } from "./category/edit.category/edit.category.component";
import { EditEmployeeComponent } from "./employee/edit.employee/edit.employee.component";
import { EditAnnouncedComponent } from "./announced/edit.announced/edit.announced.component";
import { CategoryAnnouncedComponent } from "./category.announced/category.announced.component";
import { EditPageSectionComponent } from "./page.section/edit.page.section/edit.page.section.component";
import { EditCategoryLeaderComponent } from "./category.leader/edit.category.leader/edit.category.leader.component";
import { EditCategoryAnnouncedComponent } from "./category.announced/edit.category.announced/edit.category.announced.component";
import { QRLeaderComponent } from "./qr.leader/qr.leader.component";
import { EditQRLeaderComponent } from "./qr.leader/edit.qr.leader/edit.qr.leader.component";

@NgModule({
    declarations: [
        NewsComponent,
        PageComponent,
        BannerComponent,
        OfficeComponent,
        LeaderComponent,
        MessageComponent,
        SectionComponent,
        ProductComponent,
        PartnerComponent,
        EmployeeComponent,
        CategoryComponent,
        EditNewsComponent,
        EditPageComponent,
        QRLeaderComponent,
        AnnouncedComponent,
        EditLeaderComponent,
        EditOfficeComponent,
        EditBannerComponent,
        EditMessageComponent,
        PageSectionComponent,
        EditPartnerComponent,
        EditSectionComponent,
        EditProductComponent,
        EditEmployeeComponent,
        EditQRLeaderComponent,
        EditCategoryComponent,
        EditAnnouncedComponent,
        CategoryLeaderComponent,
        EditPageSectionComponent,
        CategoryAnnouncedComponent,
        EditCategoryLeaderComponent,
        EditCategoryAnnouncedComponent
    ],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: NewsComponent, pathMatch: 'full', data: { state: 'mg_news' }, canActivate: [AdminAuthGuard] },
            { path: 'news', component: NewsComponent, pathMatch: 'full', data: { state: 'mg_news' }, canActivate: [AdminAuthGuard] },
            { path: 'page', component: PageComponent, pathMatch: 'full', data: { state: 'mg_pages' }, canActivate: [AdminAuthGuard] },
            { path: 'office', component: OfficeComponent, pathMatch: 'full', data: { state: 'mg_office' }, canActivate: [AdminAuthGuard] },
            { path: 'leader', component: LeaderComponent, pathMatch: 'full', data: { state: 'mg_leader' }, canActivate: [AdminAuthGuard] },
            { path: 'banner', component: BannerComponent, pathMatch: 'full', data: { state: 'mg_banner' }, canActivate: [AdminAuthGuard] },
            { path: 'product', component: ProductComponent, pathMatch: 'full', data: { state: 'mg_product' }, canActivate: [AdminAuthGuard] },
            { path: 'partner', component: PartnerComponent, pathMatch: 'full', data: { state: 'mg_partner' }, canActivate: [AdminAuthGuard] },
            { path: 'section', component: SectionComponent, pathMatch: 'full', data: { state: 'mg_section' }, canActivate: [AdminAuthGuard] },
            { path: 'message', component: MessageComponent, pathMatch: 'full', data: { state: 'mg_messages' }, canActivate: [AdminAuthGuard] },
            { path: 'employee', component: EmployeeComponent, pathMatch: 'full', data: { state: 'mg_employee' }, canActivate: [AdminAuthGuard] },
            { path: 'category', component: CategoryComponent, pathMatch: 'full', data: { state: 'mg_category' }, canActivate: [AdminAuthGuard] },
            { path: 'news/add', component: EditNewsComponent, pathMatch: 'full', data: { state: 'mg_news_add' }, canActivate: [AdminAuthGuard] },
            { path: 'qrleader', component: QRLeaderComponent, pathMatch: 'full', data: { state: 'mg_qr_leader' }, canActivate: [AdminAuthGuard] },
            { path: 'news/edit', component: EditNewsComponent, pathMatch: 'full', data: { state: 'mg_news_edit' }, canActivate: [AdminAuthGuard] },
            { path: 'news/view', component: EditNewsComponent, pathMatch: 'full', data: { state: 'mg_news_view' }, canActivate: [AdminAuthGuard] },
            { path: 'announced', component: AnnouncedComponent, pathMatch: 'full', data: { state: 'mg_announced' }, canActivate: [AdminAuthGuard] },
            { path: 'banner/add', component: EditBannerComponent, pathMatch: 'full', data: { state: 'mg_banner_add' }, canActivate: [AdminAuthGuard] },
            { path: 'banner/edit', component: EditBannerComponent, pathMatch: 'full', data: { state: 'mg_banner_edit' }, canActivate: [AdminAuthGuard] },
            { path: 'banner/view', component: EditBannerComponent, pathMatch: 'full', data: { state: 'mg_banner_view' }, canActivate: [AdminAuthGuard] },
            { path: 'pagesection', component: PageSectionComponent, pathMatch: 'full', data: { state: 'mg_page_section' }, canActivate: [AdminAuthGuard] },
            { path: 'announced/add', component: EditAnnouncedComponent, pathMatch: 'full', data: { state: 'mg_announced_add' }, canActivate: [AdminAuthGuard] },
            { path: 'announced/edit', component: EditAnnouncedComponent, pathMatch: 'full', data: { state: 'mg_announced_edit' }, canActivate: [AdminAuthGuard] },
            { path: 'announced/view', component: EditAnnouncedComponent, pathMatch: 'full', data: { state: 'mg_announced_view' }, canActivate: [AdminAuthGuard] },
            { path: 'categoryleader', component: CategoryLeaderComponent, pathMatch: 'full', data: { state: 'mg_category_leader' }, canActivate: [AdminAuthGuard] },
            { path: 'announced/approve', component: EditAnnouncedComponent, pathMatch: 'full', data: { state: 'mg_announced_approve' }, canActivate: [AdminAuthGuard] },
            { path: 'categoryannounced', component: CategoryAnnouncedComponent, pathMatch: 'full', data: { state: 'mg_category_announced' }, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class MeeyGroupModule { }