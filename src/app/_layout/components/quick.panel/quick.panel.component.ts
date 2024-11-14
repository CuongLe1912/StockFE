import { Subscription } from 'rxjs';
import { AdminEventService } from '../../../_core/services/admin.event.service';
import { Component, ComponentFactoryResolver, ComponentRef, OnDestroy, ViewChild, ViewContainerRef } from '@angular/core';

@Component({
    selector: 'layout-quick-panel',
    styleUrls: ['./quick.panel.component.scss'],
    templateUrl: './quick.panel.component.html'
})
export class LayoutQuickPanelComponent implements OnDestroy {
    title: string;
    active: boolean;
    componentInstance: any;
    componentRef: ComponentRef<any>;
    subscribeQuickPanel: Subscription;
    @ViewChild('container', { read: ViewContainerRef }) container: ViewContainerRef;

    constructor(
        public event: AdminEventService,
        public componentFactoryResolver: ComponentFactoryResolver) {
    }

    hidePanel() {
        this.active = false;
    }

    ngOnDestroy() {
        if (this.subscribeQuickPanel) {
            this.subscribeQuickPanel.unsubscribe();
            this.subscribeQuickPanel = null;
        }
    }
}
