declare var $: any
import { Subscription } from 'rxjs';
import { DialogData } from '../../domains/data/dialog.data';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { DialogType } from '../../domains/enums/dialog.type';
import { UtilityExHelper } from '../../helpers/utility.helper';
import { AdminDialogService } from '../../services/admin.dialog.service';

@Component({
    selector: 'modal-prompt',
    templateUrl: 'prompt.component.html',
    styleUrls: ['../../../../assets/css/modal.scss'],
})
export class ModalPromptComponent implements OnInit, OnDestroy {
    id: string;
    dialog: DialogData;
    processing: boolean;
    visible: boolean = false;
    eventDialog: Subscription = null;

    constructor(public dialogService: AdminDialogService) { }

    ngOnInit() {
        if (this.eventDialog == null) {
            this.eventDialog = this.dialogService.EventDialog.subscribe((item: DialogData) => {
                if (item.type == DialogType.Prompt) {
                    this.dialog = item;
                    this.visible = true;
                    this.id = UtilityExHelper.randomText(8);
                    UtilityExHelper.activeDragable(this.id);
                }
            });
        }
        this.dialogService.EventHideDialog.subscribe((item: DialogData) => {
            if (item.type == DialogType.Prompt) {
                this.visible = false;
            }
        });
    }

    ngOnDestroy() {
        if (this.eventDialog != null) {
            this.eventDialog.unsubscribe();
            this.eventDialog = null;
            this.visible = false;
        }
    }

    public closeModal() {
        if (this.dialog) {
            this.visible = false;
            if (this.dialog.cancelFunction)
                this.dialog.cancelFunction();
        }
    }

    public async promptModal() {
        if (this.dialog) {
            this.processing = true;
            if (this.dialog.okFunction)
                this.dialog.okFunction(this.dialog.object);
            else if (this.dialog.okFunctionAsync)
                await this.dialog.okFunctionAsync(this.dialog.object);
            this.processing = false;
            this.visible = false;
            this.dialog = null;
        }
    }
}
