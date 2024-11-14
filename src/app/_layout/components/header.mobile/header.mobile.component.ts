declare var $: any
import { Component } from '@angular/core';
import { AdminDataService } from '../../../_core/services/admin.data.service';

@Component({
    selector: 'layout-header-mobile',
    templateUrl: 'header.mobile.component.html'
})
export class LayoutHeaderMobileComponent {
    constructor(public data: AdminDataService) {

    }

    toggleMenuAside() {
        setTimeout(() => {
            this.data.activeMenuAside = !this.data.activeMenuAside;
        }, 100);
    }

    toggleMenuHeader() {
        setTimeout(() => {
            this.data.activeMenuHeader = !this.data.activeMenuHeader;
        }, 100);
    }

    toggleMenuUser() {
        document.getElementsByTagName('body')[0].classList.toggle("kt-header__topbar--mobile-on");
    }
}
