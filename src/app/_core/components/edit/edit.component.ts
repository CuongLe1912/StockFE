import * as _ from 'lodash';
import { AppInjector } from '../../../app.module';
import { NavigationEnd, Router } from '@angular/router';
import { ActionData } from '../../domains/data/action.data';
import { HistoryComponent } from './history/history.component';
import { AdminApiService } from '../../services/admin.api.service';
import { ModalSizeType } from '../../domains/enums/modal.size.type';
import { BreadcrumbData } from '../../domains/data/breadcrumb.data';
import { AdminAuthService } from '../../services/admin.auth.service';
import { AdminDataService } from '../../services/admin.data.service';
import { AdminDialogService } from '../../services/admin.dialog.service';
import { NavigationStateData } from '../../domains/data/navigation.state';

export abstract class EditComponent {
    params: any;
    router: Router;
    active: boolean;
    processing: boolean;
    data: AdminDataService;
    loading: boolean = true;
    service: AdminApiService;
    authen: AdminAuthService;
    processingSecond: boolean;
    state: NavigationStateData;
    actions: ActionData[] = [];
    dialogService: AdminDialogService;
    breadcrumbs: BreadcrumbData[] = [];

    constructor() {
        this.dialogService = AppInjector.get(AdminDialogService);
        this.authen = AppInjector.get(AdminAuthService);
        this.service = AppInjector.get(AdminApiService);
        this.data = AppInjector.get(AdminDataService);
        this.router = AppInjector.get(Router);
        this.state = this.getUrlState();
        this.router.events.subscribe((val) => {
            if (val instanceof NavigationEnd) {
                this.breadcrumbs = [];
                let currentUrl = val.url.replace('/edit', '').replace('/add', '').replace('/view', '');
                if (currentUrl.indexOf('?') >= 0) currentUrl = currentUrl.split('?')[0];
                if (this.authen && this.authen.links && this.authen.links.length > 0) {
                    this.authen.links.forEach((group: any) => {
                        if (group.items && group.items.length > 0) {
                            group.items.forEach((item: any) => {
                                if (this.breadcrumbs.length == 0) {
                                    if (item.Childrens && item.Childrens.length > 0) {
                                        let child = item.Childrens
                                            .filter((c: any) => c.Link != '/')
                                            .find((c: any) => c.Link == currentUrl);
                                        if (child) {
                                            if (item.Group)
                                                this.breadcrumbs.push({ Name: item.Group });
                                            this.breadcrumbs.push({ Name: item.Name });
                                            this.breadcrumbs.push({ Name: child.Name, Link: child.Link });
                                        } else {
                                            item.Childrens.forEach((child: any) => {
                                                if (child.Link != '/') {
                                                    if (child.Link == currentUrl) {
                                                        if (item.Group)
                                                            this.breadcrumbs.push({ Name: item.Group });
                                                        this.breadcrumbs.push({ Name: item.Name });
                                                        this.breadcrumbs.push({ Name: child.Name, Link: child.Link });
                                                    } else if (currentUrl.indexOf(child.Link) >= 0) {
                                                        let existChild = item.Childrens.find(c => c.Link == currentUrl);
                                                        if (!existChild) {
                                                            if (item.Group)
                                                                this.breadcrumbs.push({ Name: item.Group });
                                                            this.breadcrumbs.push({ Name: item.Name });
                                                            this.breadcrumbs.push({ Name: child.Name, Link: child.Link });
                                                        }
                                                    }
                                                }
                                            });
                                        }
                                    } else {
                                        if (item.Link != '/') {
                                            if (item.Link == currentUrl) {
                                                if (item.Group)
                                                    this.breadcrumbs.push({ Name: item.Group });
                                                this.breadcrumbs.push({ Name: item.Name, Link: item.Link });
                                            } else if (currentUrl.indexOf(item.Link) >= 0) {
                                                let existChild = item.Childrens.find(c => c.Link == currentUrl);
                                                if (!existChild) {
                                                    if (item.Group)
                                                        this.breadcrumbs.push({ Name: item.Group });
                                                    this.breadcrumbs.push({ Name: item.Name, Link: item.Link });
                                                }
                                            }
                                        }
                                    }
                                }
                            });
                        }
                    });
                }
            }
        });
    }

    public back() {
        if (this.state)
            this.router.navigate([this.state.prevUrl], { state: { params: JSON.stringify(this.state) } });
        else
            this.router.navigate(['/admin/mluser']);
    }

    public getController() {
        let url = this.router.url
            .replace('/admin/', '')
            .replace('admin/', '');
        let items = url.split('/');
        return items && items[0];
    }

    public getParam(key: string) {
        let value = this.router?.routerState?.snapshot?.root?.queryParams[key];
        if (value == null || value == undefined) {
            let queryParams = this.router.parseUrl(this.router.url).queryParams;
            value = queryParams && queryParams[key];
            if (value == null || value == undefined) {
                value = this.params && this.params[key];
                if (value == null || value == undefined)
                    value = this.state && this.state[key];
                if (value == null || value == undefined && this.state?.object)
                    value = this.state?.object && this.state?.object[key];
            }
        }
        return value;
    }

    public addBreadcrumb(name: string) {
        this.breadcrumbs.push({ Name: name });
    }

    public getUrlState(): NavigationStateData {
        let stateKey = 'params',
            controller = this.getController(),
            navigation = this.router.getCurrentNavigation(),
            sessionKey = 'session_' + stateKey + '_' + controller,
            valueJson = navigation && navigation.extras && navigation.extras.state
                ? navigation.extras.state[stateKey]
                : sessionStorage.getItem(sessionKey);
        if (valueJson) sessionStorage.setItem(sessionKey, valueJson.toString());
        return JSON.parse(valueJson) as NavigationStateData;
    }

    public viewHistory(id: number, controller: string) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            object: HistoryComponent,
            title: 'Nhật ký hoạt động',
            size: ModalSizeType.ExtraLarge,
            objectExtra: { id: id, type: controller },
        });
    }

    public setUrlState(state: NavigationStateData, controller: string = null) {
        if (!controller) controller = this.getController();
        let stateKey = 'params',
            navigation = this.router.getCurrentNavigation(),
            sessionKey = 'session_' + stateKey + '_' + controller;
        if (state) sessionStorage.setItem(sessionKey, JSON.stringify(state));
    }
}