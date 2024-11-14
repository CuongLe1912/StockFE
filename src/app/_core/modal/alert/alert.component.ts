declare var $: any
import { Subscription } from 'rxjs';
import { DialogData } from '../../domains/data/dialog.data';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { DialogType } from '../../domains/enums/dialog.type';
import { UtilityExHelper } from '../../helpers/utility.helper';
import { AdminDialogService } from '../../services/admin.dialog.service';

@Component({
    selector: 'modal-alert',
    templateUrl: 'alert.component.html',
    styleUrls: [
        './alert.component.scss',
        '../../../../assets/css/modal.scss'
    ],
})
export class ModalAlertComponent implements OnInit, OnDestroy {
    id: string;
    percent: number;
    counter: number;
    maxTimeout: number;
    dialog: DialogData;
    DialogType = DialogType;
    visible: boolean = false;
    eventDialog: Subscription = null;

    constructor(public dialogService: AdminDialogService) { }

    ngOnInit() {
        if (this.eventDialog == null) {
            this.eventDialog = this.dialogService.EventDialog.subscribe((item: DialogData) => {
                if (item.type == DialogType.Alert || item.type == DialogType.AlertTimer) {
                    this.dialog = item;
                    this.visible = true;
                    if (item.object) {
                        this.maxTimeout = item.object as number;
                        this.counter = this.maxTimeout;
                        this.percent = 0;
                        let interval = setInterval(() => {
                            this.counter -= 1;
                            this.percent = parseInt(((this.maxTimeout - this.counter) * (100 / this.maxTimeout)).toString());
                            if (this.counter <= 0) clearInterval(interval);
                        }, 990);
                    }
                    this.id = UtilityExHelper.randomText(8);
                    UtilityExHelper.activeDragable(this.id);
                }
            });
            this.dialogService.EventHideDialog.subscribe((item: DialogData) => {
                if (item.type == DialogType.Alert || item.type == DialogType.AlertTimer) {
                    this.dialog = item;
                    this.visible = false;
                }
            });
        }
    }

    ngOnDestroy() {
        if (this.eventDialog != null) {
            this.eventDialog.unsubscribe();
            this.eventDialog = null;
        }
    }

    public closeModal() {
        if (this.dialog) {
            this.visible = false;
            if (this.dialog.cancelFunction)
                this.dialog.cancelFunction();
        }
    }

    public confirmModal() {
        if (this.dialog) {
            this.visible = false;
            if (this.dialog.okFunction)
                this.dialog.okFunction();
        }
    }
}
