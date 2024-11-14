declare var $: any
import { Subscription } from 'rxjs';
import { DialogData } from '../../domains/data/dialog.data';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { DialogType } from '../../domains/enums/dialog.type';
import { UtilityExHelper } from '../../helpers/utility.helper';
import { AdminAuthService } from '../../services/admin.auth.service';
import { AdminDialogService } from '../../services/admin.dialog.service';

@Component({
    selector: 'modal-timeout',
    templateUrl: 'timeout.component.html',
    styleUrls: ['../../../../assets/css/modal.scss'],
})
export class ModalTimeoutComponent implements OnInit, OnDestroy {
    id: string;
    userIdle: any;
    counter: number;
    dialog: DialogData;
    visible: boolean = false;
    eventDialog: Subscription = null;

    constructor(
        public authen: AdminAuthService,
        public dialogService: AdminDialogService) { }

    ngOnInit() {
        if (this.eventDialog == null) {
            this.eventDialog = this.dialogService.EventDialog.subscribe((item: DialogData) => {
                if (item.type == DialogType.Timeout) {
                    this.dialog = item;
                    this.userIdle = item.object;

                    this.userIdle.startWatching();
                    let timeout = this.userIdle.getConfigValue();
                    this.userIdle.onTimerStart().subscribe((count: number) => {
                        this.visible = true;
                        this.counter = timeout.timeout - count;
                        if (this.counter <= 0) {
                            this.counter = 0;
                            this.authen.lock();
                            this.userIdle.stopWatching();
                        }
                    });
                    // Start watch when time is up.
                    this.userIdle.onTimeout().subscribe(() => {
                        setTimeout(() => {
                            if (this.dialog.okFunction)
                                this.dialog.okFunction();
                        }, 1000);
                    });

                    this.id = UtilityExHelper.randomText(8);
                    UtilityExHelper.activeDragable(this.id);
                }
            });
        }
        this.dialogService.EventHideDialog.subscribe((item: DialogData) => {
            if (item.type == DialogType.Timeout) {
                this.visible = false;
            }
        });
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
            if (this.userIdle)
                this.userIdle.resetTimer();
            this.visible = false;
        }
    }
}
