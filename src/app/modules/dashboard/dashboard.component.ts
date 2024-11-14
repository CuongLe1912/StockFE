import * as _ from 'lodash';
import { AppInjector } from '../../app.module';
import { DashboardService } from './dashboard.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ResultApi } from '../../_core/domains/data/result.api';
import { AdminAuthService } from '../../_core/services/admin.auth.service';
import { ActionType, ControllerType } from '../../_core/domains/enums/action.type';

@Component({
    templateUrl: 'dashboard.component.html',
    styleUrls: ['dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
    item: any;
    customers: any;
    authen: AdminAuthService;
    interval: any;

    clickUser: boolean;
    clickOrder: boolean;
    clickCrmUser: boolean;
    clickArticle: boolean;
    clickSchedule: boolean;
    clickMapHistory: boolean;
    clickArticleCrawl: boolean;

    constructor(public service: DashboardService) {
        this.authen = AppInjector.get(AdminAuthService);
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        this.interval = setInterval(() => {
            this.service.statistical().then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = result.Object;
                }
            });
        }, 15000);
    }

    async ngOnInit(): Promise<void> {
        this.clickUser = await this.authen.permissionAllow(ControllerType.MLUser, ActionType.View);
        this.clickOrder = await this.authen.permissionAllow(ControllerType.MOOrder, ActionType.View);
        this.clickArticle = await this.authen.permissionAllow(ControllerType.MLArticle, ActionType.View);
        this.clickSchedule = await this.authen.permissionAllow(ControllerType.MLSchedule, ActionType.View);
        this.clickCrmUser = await this.authen.permissionAllow(ControllerType.MCRMCustomer, ActionType.View);
        this.clickMapHistory = await this.authen.permissionAllow(ControllerType.MMLookupHistory, ActionType.View);
        this.clickArticleCrawl = await this.authen.permissionAllow(ControllerType.MLArticleCrawl, ActionType.View);
    }

    ngOnDestroy(): void {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }
}
