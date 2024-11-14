import { NgModule } from '@angular/core';
import { UtilityModule } from './utility.module';
import { ViewUserComponent } from './sercurity/user/view.user/view.user.component';
import { MOUserOrderGridComponent } from './meeyuser/components/user.order.component';
import { MLUserArticleComponent } from './meeyuser/components/user.article.component';
import { MLUserHistoryComponent } from './meeyuser/components/user.history.component';
import { ChoiceUserComponent } from './sercurity/user/choice.user/choice.user.component';
import { MLUserTransactionComponent } from './meeyuser/components/user.transaction.component';
import { MLPopupViewUserComponent } from './meeyuser/popup.view.user/popup.view.user.component';
import { ViewChoiceUserComponent } from './sercurity/user/choice.user/view.choice.user.component';
import { MMLookupQuickViewComponent } from './meeymap/lookup.quickview/lookup.quickview.component';
import { MLUserLookupHistoryComponent } from './meeyuser/components/user.lookup.history.component';
import { MLListArticleServiceComponent } from './meeyarticle/components/list.article.service.component';
import { MLScheduleViewArticleComponent } from './meeyland/schedule/schedule.view.article/schedule.view.article.component';
import { MLScheduleViewArticleMapComponent } from './meeyland/schedule/schedule.view.article.map/schedule.view.article.map.component';
import { MLEmployeeListComponent } from './meeyland/business.account/company/components/employee.list.component';
import { MLCompanyViewComponent } from './meeyland/business.account/company/view/view.company.component';
import { MOServiceGridComponent } from './meeyorder/services/components/service.grid.component';
import { MLCompanyApproveComponent } from './meeyland/business.account/company/approve/approve.company.component';

@NgModule({
    imports: [
        UtilityModule
    ],
    declarations: [
        ViewUserComponent,
        ChoiceUserComponent,
        MLUserHistoryComponent,
        MLUserArticleComponent,
        ViewChoiceUserComponent,
        MLPopupViewUserComponent,
        MOUserOrderGridComponent,
        MLUserTransactionComponent,
        MMLookupQuickViewComponent,
        MLUserLookupHistoryComponent,
        MLListArticleServiceComponent,
        MLScheduleViewArticleComponent,
        MLScheduleViewArticleMapComponent,
        MLEmployeeListComponent,
        MLCompanyViewComponent,
        MLCompanyApproveComponent,
        MOServiceGridComponent,
    ],
    exports: [
        ViewUserComponent,
        ChoiceUserComponent,
        MLUserHistoryComponent,
        MLUserArticleComponent,
        ViewChoiceUserComponent,
        MLPopupViewUserComponent,
        MOUserOrderGridComponent,
        MLUserTransactionComponent,
        MMLookupQuickViewComponent,
        MLUserLookupHistoryComponent,
        MLListArticleServiceComponent,
        MLScheduleViewArticleComponent,
        MLScheduleViewArticleMapComponent,
        MLEmployeeListComponent,
        MLCompanyViewComponent,
        MLCompanyApproveComponent,
        MOServiceGridComponent,
    ]
})
export class ShareModule { }
