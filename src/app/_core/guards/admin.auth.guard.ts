import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AppConfig } from '../helpers/app.config';
import { ActionType } from '../domains/enums/action.type';
import { AdminAuthService } from '../services/admin.auth.service';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AdminAuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authService: AdminAuthService) {
        AppConfig.setEnvironment();
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        let account = this.authService.account,
            stateUrl = state.url.replace('/admin', '');
        stateUrl = stateUrl.replace('/meeygroup/', 'mg');
        stateUrl = stateUrl.replace('/meeycrm/', 'mcrm');
        stateUrl = stateUrl.replace('/meeygroupv2/', 'mg');
        stateUrl = stateUrl.replace('/redt/news', 'mrnews');
        stateUrl = stateUrl.replace('/redt/menu', 'mrmenu');
        stateUrl = stateUrl.replace('/meey3d/tour', 'm3dtour');
        stateUrl = stateUrl.replace('v2/customer', 'customer');
        stateUrl = stateUrl.replace('/redt/office', 'mroffice');
        stateUrl = stateUrl.replace('/redt/leader', 'mrleader');
        stateUrl = stateUrl.replace('/msseo/files', 'msseofile');
        stateUrl = stateUrl.replace('/msseo/metaseo', 'msmetaseo');
        stateUrl = stateUrl.replace('/redt/category', 'mrcategory');
        stateUrl = stateUrl.replace('/redt/question', 'mrquestion');
        stateUrl = stateUrl.replace('/redt/corevalue', 'mrcorevalue');
        stateUrl = stateUrl.replace('/msseo/filetags', 'msseotagfile');
        stateUrl = stateUrl.replace('/meeyshare/news', 'meeysharenews');
        stateUrl = stateUrl.replace('/meey3d/dashboard', 'm3ddashboard');
        stateUrl = stateUrl.replace('/meeyreview/user', 'meeyreviewuser');
        stateUrl = stateUrl.replace('/mpoproject/customer', 'mpocustomer');
        stateUrl = stateUrl.replace('/msseo/boxtextlink', 'msboxtextlink');
        stateUrl = stateUrl.replace('/mlarticle/report', 'mlarticlereport');
        stateUrl = stateUrl.replace('/mmarticle/report', 'mmarticlereport');
        stateUrl = stateUrl.replace('/meeyshare/report', 'meeysharereport');
        stateUrl = stateUrl.replace('/metaseotemplate', 'msmetaseotemplate');
        stateUrl = stateUrl.replace('/mpoproject/video', 'mpoprojectvideos');
        stateUrl = stateUrl.replace('/mpoproject/statistic', 'mpostatistic');
        stateUrl = stateUrl.replace('/meey3d/contactinfo', 'm3dcontactinfo');
        stateUrl = stateUrl.replace('/meeyshare/comment', 'meeysharecomment');
        stateUrl = stateUrl.replace('/mafsynthetic', 'mafaffiliatesynthetic');
        stateUrl = stateUrl.replace('/meeycrm/calllogcustomer', 'mcrmcalllog');
        stateUrl = stateUrl.replace('/msseo/textlinkauto', 'msseotextlinkauto');
        stateUrl = stateUrl.replace('/meeyreview/project', 'meeyreviewproject');
        stateUrl = stateUrl.replace('/mpoproject/projecttype', 'mpoprojecttype');
        stateUrl = stateUrl.replace('/mpoproject/contributes', 'mpocontributes');
        stateUrl = stateUrl.replace('/motransactionreward', 'transactionreward');
        stateUrl = stateUrl.replace('/mpoproject/slide', 'mpoprojectslidevideos');
        stateUrl = stateUrl.replace('/mpoproject/hashtags', 'mpoprojecthashtags');
        stateUrl = stateUrl.replace('/meeyshare/statistic', 'meeysharestatistic');
        stateUrl = stateUrl.replace('/msseo/textlinkmanual', 'msseotextlinkmanual');
        stateUrl = stateUrl.replace('/mafaffiliate/request', 'mafaffiliaterequest');
        stateUrl = stateUrl.replace('/mpoproject/verifydocument', 'mpoprojectdocument');
        stateUrl = stateUrl.replace('/mpoproject/projectcategory', 'mpoprojectcategory');
        stateUrl = stateUrl.replace('/mpoproject/projectinvestor', 'mpoprojectinvestor');
        stateUrl = stateUrl.replace('/mpoproject/investor-unit', 'mpoprojectinvestorunit');
        stateUrl = stateUrl.replace('/mpoproject/review-contribute', 'mporeviewcontribute');
        stateUrl = stateUrl.replace('/mpoproject/violationtype', 'mpoprojectviolationtype');
        stateUrl = stateUrl.replace('/mpoproject/investor-type-unit', 'mpoprojectinvestorunittype');
        stateUrl = stateUrl.replace('/meeybank/categoryannounced', 'mbankcategoryannounced');
        stateUrl = stateUrl.replace('/meeybank/category', 'mbankcategory');
        stateUrl = stateUrl.replace('/meeybank/news', 'mbanknews');
        stateUrl = stateUrl.replace('/meeybank/recruitment', 'mbankrecruitment');
        stateUrl = stateUrl.replace('/meeybank/profile', 'mbankprofile');

        
        if (stateUrl.indexOf('?') >= 0) {
            stateUrl = stateUrl.split('?')[0];
        }
        if (account) {
            if (account.Locked) {
                if (stateUrl.indexOf('/admin/lock') == -1) {
                    this.router.navigate(['/admin/lock'], { queryParams: { returnUrl: state.url } });
                }
                return false;
            }
            let urls = stateUrl.split('/').filter(c => c != null && c.length > 0),
                controller = urls[0],
                action = urls[1];
            return new Promise((resolve, reject) => {
                let actionType = ActionType.View;
                if (action) {
                    if (action == 'edit') actionType = ActionType.Edit;
                    if (controller == 'mptransaction') {
                        switch (action) {
                            case 'deposit': actionType = ActionType.MPDeposit; break;
                            case 'payment': actionType = ActionType.MPPayment; break;
                            case 'transfer': actionType = ActionType.MPTransfer; break;
                            case 'withdrawal': actionType = ActionType.MPWithdrawl; break;
                        }
                    } else if (controller == 'meeymap') {
                        switch (action) {
                            case 'lookuphistory': actionType = ActionType.View; break;
                        }
                    } else if (controller == 'mluser') {
                        switch (action) {
                            case 'statistical': actionType = ActionType.Statistical; break;
                        }
                    }
                }
                if (controller && controller.indexOf('mcrmcalllog') >= 0) {
                    controller = 'mcrmcalllog';
                    actionType = ActionType.View;
                }
                if (controller && controller.indexOf('msboxtextlink') >= 0) {
                    controller = 'msboxtextlink';
                    actionType = ActionType.Configuration;
                }

                this.authService.permissionAllow(controller, actionType).then((allow: boolean) => {
                    if (allow) {
                        resolve(true);
                    }
                    else {
                        resolve(false);
                        this.router.navigate(['/admin/error/403']);
                    }
                });
            });
        } else {
            let url = state.url.indexOf('/admin/lock') >= 0 ? '/' : state.url;
            this.router.navigate(['/admin/signin'], { queryParams: { returnUrl: url } });
            return false;
        }
    }
}