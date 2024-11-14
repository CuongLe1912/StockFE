declare var $: any
declare var require: any
import * as _ from 'lodash';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AdminApiService } from '../../../_core/services/admin.api.service';
import { AdminAuthService } from '../../../_core/services/admin.auth.service';
import { AdminDataService } from '../../../_core/services/admin.data.service';
import { LinkPermissionDto } from '../../../_core/domains/objects/link.permission.dto';

@Component({
    selector: 'layout-aside',
    templateUrl: 'aside.component.html',
    styleUrls: ['./aside.component.scss'],
})
export class LayoutAsideComponent implements OnInit {
    loading: boolean;
    currentUrl: string;

    constructor(
        public router: Router,
        public data: AdminDataService,
        public authen: AdminAuthService,
        public service: AdminApiService) {
        this.router.events.subscribe((val) => {
            if (val instanceof NavigationEnd) {
                this.currentUrl = val.url;
                this.activeLink();
            }
        });
    }

    ngOnInit() {

    }

    closeAside() {
        if (this.data.activeMenuAside) {
            this.data.activeMenuAside = false;
        }
    }

    toggleAside() {
        $('body').toggleClass('kt-aside--minimize');
    }

    toggleActiveLink(item: LinkPermissionDto) {
        item.Active = !item.Active;
    }

    private activeLink() {
        if (this.authen.links && this.authen.links.length > 0) {
            this.authen.links.forEach((group: any) => {
                if (group && group.items && group.items.length > 0) {
                    group.items.forEach((item: LinkPermissionDto) => {
                        item.Active = false;
                        if (item.Childrens && item.Childrens.length > 0) {
                            item.Childrens.forEach((child: LinkPermissionDto) => {
                                child.Active = false;
                                if (child.Link == this.currentUrl) {
                                    item.Active = true;
                                    child.Active = true;
                                }
                            });
                        }
                    });
                }
            });
        }
    }

    navigate(childItem: LinkPermissionDto) {
        this.closeAside();
        this.router.navigateByUrl(childItem.Link);
    }
}
