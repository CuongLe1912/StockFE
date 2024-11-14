import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminAuthGuard } from './_core/guards/admin.auth.guard';

// Layout
import { LayoutComponent } from './_layout/layout.component';
import { LayoutSignInComponent } from './_layout/signin/template.signin.component';

@NgModule({
  imports: [
    RouterModule.forRoot([
      {
        path: 'admin',
        component: LayoutComponent,
        children: [
          { path: 'redt', loadChildren: () => import('./modules/meeyredt/redt.module').then(m => m.RedtModule) },
          { path: 'msseo', loadChildren: () => import('./modules/meeyseo/seo.module').then(m => m.MSSeoModule) },
          { path: 'bank', loadChildren: () => import('./modules/common/bank/bank.module').then(m => m.BankModule) },
          { path: 'team', loadChildren: () => import('./modules/common/team/team.module').then(m => m.TeamModule) },
          { path: 'city', loadChildren: () => import('./modules/common/city/city.module').then(m => m.CityModule) },
          { path: 'ward', loadChildren: () => import('./modules/common/ward/ward.module').then(m => m.WardModule) },
          { path: 'mluser', loadChildren: () => import('./modules/meeyuser/user.module').then(m => m.MLUserModule) },
          { path: 'meey3d', loadChildren: () => import('./modules/meey3d/meey3d.module').then(m => m.Meey3DModule) },
          { path: 'error', loadChildren: () => import('./_core/modules/error/error.module').then(m => m.ErrorModule) },
          { path: 'user', loadChildren: () => import('./modules/sercurity/user/user.module').then(m => m.UserModule) },
          { path: 'role', loadChildren: () => import('./modules/sercurity/role/role.module').then(m => m.RoleModule) },
          { path: 'meeycrm', loadChildren: () => import('./modules/meeycrm/meeycrm.module').then(m => m.MeeyCrmModule) },
          { path: 'street', loadChildren: () => import('./modules/common/street/street.module').then(m => m.StreetModule) },
          { path: 'notify', loadChildren: () => import('./modules/common/notify/notify.module').then(m => m.NotifyModule) },
          { path: 'domain', loadChildren: () => import('./modules/common/domain/domain.module').then(m => m.DomainModule) },
          { path: 'mbbanner', loadChildren: () => import('./modules/meeybanner/banner.module').then(m => m.MBBannerModule) },
          { path: 'mccoupon', loadChildren: () => import('./modules/meeycoupon/coupon.module').then(m => m.MeeyCouponModule) },
          { path: 'product', loadChildren: () => import('./modules/common/product/product.module').then(m => m.ProductModule) },
          { path: 'country', loadChildren: () => import('./modules/common/country/country.module').then(m => m.CountryModule) },
          { path: 'meeybank', loadChildren: () => import('./modules/meeybank/meeybank.module').then(m => m.MeeyBankModule) },
          { path: 'meeygroup', loadChildren: () => import('./modules/meeygroup/meeygroup.module').then(m => m.MeeyGroupModule) },
          { path: 'mmlookuphistory', loadChildren: () => import('./modules/meeymap/meeymap.module').then(m => m.MeeymapModule) },
          { path: 'mlarticle', loadChildren: () => import('./modules/meeyarticle/article.module').then(m => m.MLArticleModule) },
          { path: 'mmarticle', loadChildren: () => import('./modules/meeyarticle/article.module').then(m => m.MLArticleModule) },
          { path: 'meeyshare', loadChildren: () => import('./modules/meeyshare/meeyshare.module').then(m => m.MeeyShareModule) },
          { path: 'moorders', loadChildren: () => import('./modules/meeyorder/orders/orders.module').then(m => m.MOOrdersModule) },
          { path: 'motransactionreward', loadChildren: () => import('./modules/meeyorder/transaction.reward/transactionreward.module').then(m => m.MOTransactionRewardModule) },
          { path: 'mpoproject', loadChildren: () => import('./modules/meeyproject/project.module').then(m => m.MPOProjectModule) },
          { path: 'position', loadChildren: () => import('./modules/common/position/position.module').then(m => m.PositionModule) },
          { path: 'district', loadChildren: () => import('./modules/common/district/district.module').then(m => m.DistrictModule) },
          { path: 'facility', loadChildren: () => import('./modules/common/facility/facility.module').then(m => m.FacilityModule) },
          { path: 'mpinvoice', loadChildren: () => import('./modules/meeypay/invoice/invoice.module').then(m => m.MPInvoiceModule) },
          { path: 'meeyreview', loadChildren: () => import('./modules/meeyreview/meeyreview.module').then(m => m.MeeyReviewModule) },
          { path: 'mlpartner', loadChildren: () => import('./modules/meeyland/partner/partner.module').then(m => m.MLPartnerModule) },
          { path: 'endpoint', loadChildren: () => import('./modules/common/end.point/end.point.module').then(m => m.EndPointModule) },
          { path: 'mlarticlecrawl', loadChildren: () => import('./modules/meeyarticle/article.module').then(m => m.MLArticleModule) },
          { path: 'meeylandv2', loadChildren: () => import('./modules/meeyland/v2/meeyland.v2.module').then(m => m.MeeylandV2Module) },
          { path: 'mmrequest', loadChildren: () => import('./modules/meeymap/request/request.component').then(m => m.MMRequestModule) },
          { path: 'mafpolicy', loadChildren: () => import('./modules/meeyaffiliate/policy/policy.module').then(m => m.MAFPolicyModule) },
          { path: 'mlschedule', loadChildren: () => import('./modules/meeyland/schedule/schedule.module').then(m => m.MLScheduleModule) },
          { path: 'meeygroupv2', loadChildren: () => import('./modules/meeygroup/v2/meeygroupv2.module').then(m => m.MeeyGroupV2Module) },
          { path: 'mlredirect', loadChildren: () => import('./modules/meeyland/redirect/redirect.module').then(m => m.MLRedirectModule) },
          { path: 'moservices', loadChildren: () => import('./modules/meeyorder/services/services.module').then(m => m.MOServicesModule) },
          { path: 'mbbannerv2', loadChildren: () => import('./modules/meeybanner/version2/bannerv2.module').then(m => m.MBBannerV2Module) },
          { path: 'department', loadChildren: () => import('./modules/common/department/department.module').then(m => m.DepartmentModule) },
          { path: 'permission', loadChildren: () => import('./modules/sercurity/permission/permission.module').then(m => m.PermissionModule) },
          { path: 'mlcouponhmc', loadChildren: () => import('./modules/meeyland/coupon.hmc/coupon.hmc.module').then(m => m.MLCouponHMCModule) },
          { path: 'mafcontract', loadChildren: () => import('./modules/meeyaffiliate/contract/contract.module').then(m => m.MAFContractModule) },
          { path: 'smstemplate', loadChildren: () => import('./modules/common/sms.template/sms.template.module').then(m => m.SmsTemplateModule) },
          { path: 'smtpaccount', loadChildren: () => import('./modules/common/smtp.account/smtp.account.module').then(m => m.SmtpAccountModule) },
          { path: 'logactivity', loadChildren: () => import('./modules/common/log.activity/log.activity.module').then(m => m.LogActivityModule) },
          { path: 'mprevenue', loadChildren: () => import('./modules/meeypay/transactions/revenue/revenue.component').then(m => m.RevenueModule) },
          { path: 'mafaffiliate', loadChildren: () => import('./modules/meeyaffiliate/affiliate/affiliate.module').then(m => m.MAFAffiliateModule) },
          { path: 'mcrminvestor', loadChildren: () => import('./modules/meeycrm/investor/meeycrm.investor.module').then(m => m.MCRMInvestorModule) },
          { path: 'prefixnumber', loadChildren: () => import('./modules/common/prefix.number/prefix.number.module').then(m => m.PrefixNumberModule) },
          { path: 'logexception', loadChildren: () => import('./modules/common/log.exception/log.exception.module').then(m => m.LogExceptionModule) },
          { path: 'organization', loadChildren: () => import('./modules/sercurity/organization/organization.module').then(m => m.OrganizationModule) },
          { path: 'mlcompany', loadChildren: () => import('./modules/meeyland/business.account/company/company.module').then(m => m.MLCompanyModule) },
          { path: 'configuration', loadChildren: () => import('./modules/common/configuration/configuration.module').then(m => m.ConfigurationModule) },
          { path: 'mptransactions', loadChildren: () => import('./modules/meeypay/transactions/transactions.module').then(m => m.MPTransactionModule) },
          { path: 'useractivity', loadChildren: () => import('./modules/sercurity/user.activity/user.activity.module').then(m => m.UserActivityModule) },
          { path: 'create-entity', loadChildren: () => import('./_core/modules/create.entitys/create.entitys.module').then(m => m.CreateEntitysModule) },
          { path: 'emailtemplate', loadChildren: () => import('./modules/common/email.template/email.template.module').then(m => m.EmailTemplateModule) },
          { path: 'websiteconfig', loadChildren: () => import('./modules/common/website.config/website.config.module').then(m => m.WebsiteConfigModule) },
          { path: 'priceproperty', loadChildren: () => import('./modules/common/price.property/price.property.module').then(m => m.PricePropertyModule) },
          { path: 'mlemployee', loadChildren: () => import('./modules/meeyland/business.account/employee/employee.module').then(m => m.MLEmployeeModule) },
          { path: 'mafsynthetic', loadChildren: () => import('./modules/meeyaffiliate/synthetic/synthetic.module').then(m => m.MAFAffiliateSyntheticModule) },
          { path: 'ticketcategory', loadChildren: () => import('./modules/common/ticket.category/ticket.category.module').then(m => m.TicketCategoryModule) },
          { path: 'linkpermission', loadChildren: () => import('./modules/sercurity/link.permission/link.permission.module').then(m => m.LinkPermissionModule) },
          { path: 'moservicehistory', loadChildren: () => import('./modules/meeyorder/service.history/service.history.module').then(m => m.MOServiceHistoryModule) },
          { path: 'mafrankcumulative', loadChildren: () => import('./modules/meeyaffiliate/rank.cumulative/rank.cumulative.module').then(m => m.MAFRankCumulativeModule) },
          { path: 'metaseotemplate', loadChildren: () => import('./modules/common/ms.meta.seo.template/ms.meta.seo.template.module').then(m => m.MSMetaSeoTemplateModule) },
          { path: 'emailtemplatewrapper', loadChildren: () => import('./modules/common/email.template.wrapper/email.template.wrapper.module').then(m => m.EmailTemplateWrapperModule) },
          { path: 'badwordapi', loadChildren: () => import('./modules/badwordapi/badwordapi.module').then(m => m.BadwordapiModule) },
          { path: '', loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule), canActivate: [AdminAuthGuard] },
        ]
      },
      {
        path: 'admin/lock',
        component: LayoutSignInComponent,
        children: [
          { path: '', loadChildren: () => import('./modules/sercurity/lock/lock.module').then(m => m.LockModule) },
        ]
      },
      {
        path: 'admin/signin',
        component: LayoutSignInComponent,
        children: [
          { path: '', loadChildren: () => import('./modules/sercurity/signin/signin.module').then(m => m.SignInModule) },
        ]
      },
      {
        path: 'admin/verify',
        component: LayoutSignInComponent,
        children: [
          { path: '', loadChildren: () => import('./modules/sercurity/verify/verify.module').then(m => m.VerifyModule) },
        ]
      },
      {
        path: 'admin/resetpassword',
        component: LayoutSignInComponent,
        children: [
          { path: '', loadChildren: () => import('./modules/sercurity/reset.password/reset.password.module').then(m => m.ResetPasswordModule) },
        ]
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/admin',
      },
      {
        path: '**',
        redirectTo: '/admin/error/404',
      },
    ], { initialNavigation: 'enabled' }),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
