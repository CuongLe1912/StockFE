import { AppComponent } from './app.component';
import { Injector, NgModule } from '@angular/core';
import { LayoutModule } from './_layout/layout.module';
import { AppRoutingModule } from './app-routing.module';
import { UtilityModule } from './modules/utility.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { UserIdleModule, UserIdleService } from 'angular-user-idle';
import { ErrorInterceptor } from './_core/interceptor/error.interceptor';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// services
import { DataService } from './services/data.service';
import { VersionService } from './services/version.service';
import { MSSeoService } from './modules/meeyseo/seo.service';
import { MLUserService } from './modules/meeyuser/user.service';
import { WardService } from './modules/common/ward/ward.service';
import { TeamService } from './modules/common/team/team.service';
import { CityService } from './modules/common/city/city.service';
import { MeeyCrmService } from './modules/meeycrm/meeycrm.service';
import { MeeymapService } from './modules/meeymap/meeymap.service';
import { UserService } from './modules/sercurity/user/user.service';
import { RoleService } from './modules/sercurity/role/role.service';
import { AdminApiService } from './_core/services/admin.api.service';
import { MBBannerService } from './modules/meeybanner/banner.service';
import { AdminAuthService } from './_core/services/admin.auth.service';
import { AdminDataService } from './_core/services/admin.data.service';
import { AdminChatService } from './_core/services/admin.chat.service';
import { MeeyCouponService } from './modules/meeycoupon/coupon.service';
import { AdminEventService } from './_core/services/admin.event.service';
import { MLArticleService } from './modules/meeyarticle/article.service';
import { DashboardService } from './modules/dashboard/dashboard.service';
import { MPOProjectService } from './modules/meeyproject/project.service';
import { ProductService } from './modules/common/product/product.service';
import { AdminDialogService } from './_core/services/admin.dialog.service';
import { MOOrdersService } from './modules/meeyorder/orders/orders.service';
import { MOTransactionRewardService } from './modules/meeyorder/transaction.reward/transactionreward.service';
import { MPInvoiceService } from './modules/meeypay/invoice/invoice.service';
import { DistrictService } from './modules/common/district/district.service';
import { PositionService } from './modules/common/position/position.service';
import { MeeylandV2Service } from './modules/meeyland/v2/meeyland.v2.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MLScheduleService } from './modules/meeyland/schedule/schedule.service';
import { MAFPolicyService } from './modules/meeyaffiliate/policy/policy.service';
import { MOServicesService } from './modules/meeyorder/services/services.service';
import { DepartmentService } from './modules/common/department/department.service';
import { MLCouponHmcService } from './modules/meeyland/coupon.hmc/coupon.hmc.service';
import { MAFAffiliateService } from './modules/meeyaffiliate/affiliate/affiliate.service';
import {RecruitmentService} from "./modules/meeygroup/v2/recruitment/recruitment.service";
import { ConfigurationService } from './modules/common/configuration/configuration.service';
import { CreateEntityService } from './_core/modules/create.entitys/create.entitys.service';
import { MOServiceHistoryService } from './modules/meeyorder/service.history/service.history.service';
import { MLBusinessAccountService } from './modules/meeyland/business.account/business.account.service';
import { MPTransactionEventService, MPTransactionService } from './modules/meeypay/transactions/transactions.service';
import { MAFRankCumulativeService } from './modules/meeyaffiliate/rank.cumulative/rank.cumulative.service';
import { VimeModule } from '@vime/angular';
import { InvestorTypeService } from './modules/meeyproject/project.investor.type/mpo.investor.type.service';
import { MLRedirectService } from './modules/meeyland/redirect/redirect.service';
import { BadwordApiService } from './modules/badwordapi/badwordapi.service';
import { M3DService } from './modules/meey3d/meey3d.service';
import { MBankRecruitmentService } from './modules/meeybank/recruitment/recruitment.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    VimeModule,
    LayoutModule,
    UtilityModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    UserIdleModule.forRoot({ idle: 6000, timeout: 60, ping: 1000 }),
    NgxSkeletonLoaderModule.forRoot({ animation: 'pulse', loadingText: 'This item is actually loading...' }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
    WardService,
    CityService,
    DataService,
    UserService,
    RoleService,
    TeamService,
    MSSeoService,
    MLUserService,
    ProductService,
    MeeyCrmService,
    MeeymapService,
    VersionService,
    PositionService,
    DistrictService,
    UserIdleService,
    AdminApiService,
    MOOrdersService,
    MOTransactionRewardService,
    DashboardService,
    MLArticleService,
    AdminChatService,
    AdminAuthService,
    AdminDataService,
    MeeylandV2Service,
    AdminEventService,
    DepartmentService,
    MLScheduleService,
    MeeyCouponService,
    MOServicesService,
    AdminDialogService,
    MLCouponHmcService,
    MLRedirectService,
    CreateEntityService,
    MPTransactionService,
    ConfigurationService,
    MOServiceHistoryService,
    MLBusinessAccountService,
    MPTransactionEventService,
    MAFPolicyService,
    MAFRankCumulativeService,
    MAFAffiliateService,
    RecruitmentService,
    MPOProjectService,
    MBBannerService,
    MPInvoiceService,
    InvestorTypeService,
    BadwordApiService,
    M3DService,
    MBankRecruitmentService
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
  constructor(private injector: Injector) {
    AppInjector = this.injector;
  }
}
export let AppInjector: Injector;
