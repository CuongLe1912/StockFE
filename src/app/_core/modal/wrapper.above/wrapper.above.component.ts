declare var $: any
import { Subscription } from 'rxjs';
import { EnumHelper } from '../../helpers/enum.helper';
import { DragData } from '../../domains/data/drag.data';
import { DialogData } from '../../domains/data/dialog.data';
import { DialogType } from '../../domains/enums/dialog.type';
import { ButtonType } from '../../domains/enums/button.type';
import { UtilityExHelper } from '../../helpers/utility.helper';
import { AdminEventService } from '../../services/admin.event.service';
import { AdminDialogService } from '../../services/admin.dialog.service';
import { Component, OnInit, OnDestroy, ViewChild, ViewContainerRef, ComponentFactoryResolver, ComponentRef } from '@angular/core';

@Component({
    selector: 'modal-wrapper-above',
    templateUrl: 'wrapper.above.component.html',
    styleUrls: ['../../../../assets/css/modal.scss'],
})
export class ModalWrapperAboveComponent implements OnInit, OnDestroy {
    id: string;
    instance: any;
    sizeClass: string;
    dialog: DialogData;
    processing: boolean;
    ButtonType = ButtonType;
    visible: boolean = false;
    processingReject: boolean;
    processingResult: boolean;
    componentRef: ComponentRef<any>;
    eventDialog: Subscription = null;
    @ViewChild('container', { read: ViewContainerRef }) container: ViewContainerRef;

    constructor(
        public eventService: AdminEventService,
        public dialogService: AdminDialogService,
        public componentFactoryResolver: ComponentFactoryResolver) { }

    ngOnInit() {
        if (this.eventDialog == null) {
            this.eventDialog = this.dialogService.EventDialog.subscribe((item: DialogData) => {
                if (item.type == DialogType.WrapperAbove) {
                    this.dialog = item;
                    this.visible = true;
                    this.sizeClass = EnumHelper.exportModalSize(item.size);
                    setTimeout(() => {
                        let component = this.componentFactoryResolver.resolveComponentFactory(item.object);
                        this.componentRef = this.container.createComponent(component);
                        this.instance = <any>this.componentRef.instance;
                        let params = item.objectExtra || {};
                        if (params) {
                            params['popup'] = true;
                            this.instance.params = params;
                        }
                    }, 100);

                    this.id = UtilityExHelper.randomText(8);
                    UtilityExHelper.activeDragable(this.id);
                }
            });
            this.dialogService.EventHideDialog.subscribe((item: DialogData) => {
                if (item.type == DialogType.WrapperAbove) {
                    if (this.container)
                        this.container.remove();
                    this.visible = false;
                    this.instance = null;
                    this.dialog = null;
                }
            });
            this.dialogService.EventHideAllDialog.subscribe(() => {
                if (this.container)
                    this.container.remove();
                this.visible = false;
                this.instance = null;
                this.dialog = null;
            });
        }
    }

    ngOnDestroy() {
        if (this.eventDialog != null) {
            this.eventDialog.unsubscribe();
            this.eventDialog = null;
            if (this.container) {
                this.container.remove();
                this.componentRef.destroy();
            }
            this.visible = false;
            this.instance = null;
            this.dialog = null;
        }
    }

    public closeModal() {
        this.eventService.HideCombobox.emit();
        if (this.dialog) {
            this.visible = false;
            if ((<any>this.componentRef.instance).close)
                (<any>this.componentRef.instance).close();
            if (this.dialog.cancelFunction)
                this.dialog.cancelFunction();
            this.visible = false;
            if (this.container) {
                this.container.remove();
                this.componentRef.destroy();
            }
            this.instance = null;
            this.dialog = null;
        }
    }

    public async resultModal() {
        if (this.dialog) {
            this.processingResult = true;
            let success = await (<any>this.componentRef.instance).result();
            if (success) {
                if (this.dialog.resultFunctionAsync)
                    await this.dialog.resultFunctionAsync();
                this.visible = false;
                if (this.container) {
                    this.container.remove();
                    this.componentRef.destroy();
                }
                this.instance = null;
                this.dialog = null;
            }
            this.processingResult = false;
        }
    }

    public async rejectModal() {
        if (this.dialog) {
            this.processingReject = true;
            let success = await (<any>this.componentRef.instance).reject();
            if (success) {
                if (this.dialog.rejectFunctionAsync)
                    await this.dialog.rejectFunctionAsync();
                this.visible = false;
                if (this.container) {
                    this.container.remove();
                    this.componentRef.destroy();
                }
                this.instance = null;
                this.dialog = null;
            }
            this.processingReject = false;
        }
    }

    public async confirmModal() {
        if (this.dialog) {
            this.processing = true;
            let success = await (<any>this.componentRef.instance).confirm();
            if (success) {
                if (this.dialog?.okFunctionAsync)
                    await this.dialog.okFunctionAsync(success);
                this.visible = false;
                if (this.container) {
                    this.container.remove();
                    this.componentRef.destroy();
                }
                this.instance = null;
                this.dialog = null;
            }
            let confirmText = (<any>this.componentRef.instance)?.confirmText;
            if (confirmText)
                this.dialog.confirmText = confirmText;
            this.processing = false;
        }
    }

    public async minimizeModal() {
        this.eventService.HideCombobox.emit();
        if (this.dialog) {
            this.visible = false;
            if ((<any>this.componentRef.instance).minimize)
                (<any>this.componentRef.instance).minimize();
            if (this.dialog.minimizeFunction)
                this.dialog.minimizeFunction();
            this.visible = false;
            if (this.container) {
                this.container.remove();
                this.componentRef.destroy();
            }
            this.instance = null;
            this.dialog = null;
        }
    }

    drop(e: any) {
    }
    dragOver(e: any) {
    }
    dragEnd(e: DragData) {
        if (!e.dragCancelled) {
            let x = e.x + 'px',
                y = e.y + 'px',
                position = x + ', ' + y;
            $('#' + this.id).css('transform', 'translate(' + position + ')');
        }
    }
}
