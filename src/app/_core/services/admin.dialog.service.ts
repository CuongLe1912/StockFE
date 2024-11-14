import * as _ from 'lodash';
import { ResultApi } from '../domains/data/result.api';
import { Injectable, EventEmitter } from '@angular/core';
import { DialogData } from '../domains/data/dialog.data';
import { DialogType } from '../domains/enums/dialog.type';
import { ModalSizeType } from '../domains/enums/modal.size.type';

@Injectable()
export class AdminDialogService {
    private wapperDialog: DialogData;
    private wapperAboveDialog: DialogData;
    public EventDialog: EventEmitter<any> = new EventEmitter<any>();
    public EventHideDialog: EventEmitter<any> = new EventEmitter<any>();
    public EventHideAllDialog: EventEmitter<any> = new EventEmitter<any>();

    public HideAllDialog() {
        this.EventHideAllDialog.emit();
    }
    public Dialog(dialog: DialogData) {
        this.EventDialog.emit(dialog);
    }
    public ErrorResult(result: ResultApi, title: string = 'Error') {
        this.Alert(title, result.Description);
    }
    public HideDialog(diaglog: DialogData) {
        this.EventHideDialog.emit(diaglog);
    }
    public Error(content: string, title: string = 'Lỗi') {
        this.Alert(title, content);
    }
    public Message(content: string, restrict: boolean = false): DialogData {
        let dialog: DialogData = {
            content: content,
            okFunction: null,
            title: 'Thông báo',
            restrict: restrict,
            cancelFunction: null,
            type: DialogType.Alert,
        };
        this.EventDialog.emit(dialog);
        return dialog;
    }
    public Alert(title: string, content: string, restrict: boolean = false): DialogData {
        let dialog: DialogData = {
            title: title,
            content: content,
            okFunction: null,
            restrict: restrict,
            cancelFunction: null,
            type: DialogType.Alert,
        };
        this.EventDialog.emit(dialog);
        return dialog;
    }
    public AlertResult(title: string, result: ResultApi, restrict: boolean = false): DialogData {
        let message = result && result.Description && result.Description.toString();
        let dialog: DialogData = {
            title: title,
            content: message,
            okFunction: null,
            restrict: restrict,
            cancelFunction: null,
            type: DialogType.Alert,
        };
        this.EventDialog.emit(dialog);
        return dialog;
    }
    public AlertTimeOut(title: string, content: string, timeout: number = 10, restrict: boolean = false): DialogData {
        let dialog: DialogData = {
            title: title,
            object: timeout,
            content: content,
            okFunction: null,
            restrict: restrict,
            cancelFunction: null,
            type: DialogType.AlertTimer,
        };
        this.EventDialog.emit(dialog);
        return dialog;
    }
    public Loading(title: string, content: string): DialogData {
        let dialog: DialogData = {
            title: title,
            restrict: true,
            content: content,
            okFunction: null,
            cancelFunction: null,
            type: DialogType.Loading,
        };
        this.EventDialog.emit(dialog);
        return dialog;
    }
    public Warning(content: string, title: string = 'Cảnh báo') {
        this.Alert(title, content);
    }
    public Success(content: string, title: string = 'Thành công') {
        this.Alert(title, content);
    }
    public Timeout(userIdle: any, okFunction: () => void = null, title = 'Khóa màn hình') {
        let dialog: DialogData = {
            title: title,
            restrict: true,
            object: userIdle,
            content: 'content',
            cancelFunction: null,
            type: DialogType.Timeout,
            okFunction: () => {
                if (okFunction) okFunction();
            },
        };
        this.EventDialog.emit(dialog);
    }

    public WapperAsync(obj: DialogData,
        okFunction?: (item?: any) => Promise<any>,
        rejectFunction?: (item?: any) => Promise<any>,
        resultFunction?: (item?: any) => Promise<any>,
        cancelFunction: (item?: any) => void = null, minimizeFunction: (item?: any) => void = null) {
        if (this.wapperDialog) this.HideDialog(this.wapperDialog);
        if (obj.cancelText == null || obj.cancelText == undefined)
            obj.cancelText = 'Đóng';

        //Màn hình bé hơn 1400 tăng 1 size popup
        if (window.innerWidth < 1400 && obj.size < ModalSizeType.FullScreen) {
            obj.size += 1;
        }
        this.wapperDialog = {
            size: obj.size,
            title: obj.title,
            object: obj.object,
            className: obj.className,
            type: DialogType.Wrapper,
            cancelText: obj.cancelText,
            rejectText: obj.rejectText,
            resultText: obj.resultText,
            objectExtra: obj.objectExtra,
            confirmText: obj.confirmText,
            description: obj.description,
            confirmClose: obj.confirmClose,
            okFunctionAsync: async (item?: any) => {
                if (okFunction) await okFunction(item);
            },
            minimizeFunction: minimizeFunction ? () => {
                if (minimizeFunction) minimizeFunction();
            } : null,
            cancelFunction: (item?: any) => {
                if (cancelFunction) cancelFunction(item);
            },
            rejectFunctionAsync: async (item?: any) => {
                if (rejectFunction) await rejectFunction(item);
            },
            resultFunctionAsync: async (item?: any) => {
                if (resultFunction) await resultFunction(item);
            },
        }
        this.EventDialog.emit(this.wapperDialog);
    }
    public WapperAboveAsync(obj: DialogData,
        okFunction?: (item?: any) => Promise<any>,
        rejectFunction?: (item?: any) => Promise<any>,
        resultFunction?: (item?: any) => Promise<any>,
        cancelFunction: (item?: any) => void = null, minimizeFunction: (item?: any) => void = null) {
        if (this.wapperAboveDialog) this.HideDialog(this.wapperAboveDialog);
        if (obj.cancelText == null || obj.cancelText == undefined)
            obj.cancelText = 'Đóng';

        //Màn hình bé hơn 1400 tăng 1 size popup
        if (window.innerWidth < 1400 && obj.size < ModalSizeType.FullScreen) {
            obj.size += 1;
        }
        this.wapperAboveDialog = {
            size: obj.size,
            title: obj.title,
            object: obj.object,
            cancelText: obj.cancelText,
            rejectText: obj.rejectText,
            resultText: obj.resultText,
            objectExtra: obj.objectExtra,
            confirmText: obj.confirmText,
            description: obj.description,
            type: DialogType.WrapperAbove,
            confirmClose: obj.confirmClose,
            okFunctionAsync: async (item?: any) => {
                if (okFunction) await okFunction(item);
            },
            minimizeFunction: minimizeFunction ? () => {
                if (minimizeFunction) minimizeFunction();
            } : null,
            cancelFunction: (item?: any) => {
                if (cancelFunction) cancelFunction(item);
            },
            rejectFunctionAsync: async (item?: any) => {
                if (rejectFunction) await rejectFunction(item);
            },
            resultFunctionAsync: async (item?: any) => {
                if (resultFunction) await resultFunction(item);
            },
        }
        this.EventDialog.emit(this.wapperAboveDialog);
    }
    public ConfirmRedirect(title: string, content: string, okFunction: () => void) {
        let dialog: DialogData = {
            title: title,
            content: content,
            confirmText: 'Đồng ý',
            cancelFunction: null,
            type: DialogType.Confirm,
            okFunction: () => {
                if (okFunction) okFunction();
            }
        }
        this.EventDialog.emit(dialog);
        return dialog;
    }
    public Confirm(content: string, okFunction: () => void, cancelFunction: () => void = null, title = 'Xác nhận') {
        let dialog: DialogData = {
            title: title,
            content: content,
            cancelText: 'Bỏ qua',
            confirmText: 'Đồng ý',
            type: DialogType.Confirm,
            cancelFunction: () => {
                if (cancelFunction) cancelFunction();
            },
            okFunction: () => {
                if (okFunction) okFunction();
            }
        }
        this.EventDialog.emit(dialog);
    }
    public ConfirmAsync(content: string, okFunction: () => Promise<any>, cancelFunction: () => void = null, title = 'Xác nhận', confirmText = 'Đồng ý', resultText = null, resultFunction: () => void = null) {
        let dialog: DialogData = {
            title: title,
            content: content,
            cancelText: 'Bỏ qua',
            resultText: resultText,
            confirmText: confirmText,
            cancelFunction: () => {
                if (cancelFunction) cancelFunction();
            },
            type: DialogType.Confirm,
            okFunctionAsync: async () => {
                if (okFunction) await okFunction();
            },
            resultFunction: async () => {
                if (resultFunction) await resultFunction();
            }
        }

        this.EventDialog.emit(dialog);
    }
    public PromptAsync(text: string, object: any, okFunction: (name: string) => Promise<any>, cancelFunction: () => void = null, title = 'Xác nhận', confirmText = 'Đồng ý') {
        let dialog: DialogData = {
            title: title,
            content: text,
            object: object,
            cancelText: 'Bỏ qua',
            confirmText: confirmText,
            cancelFunction: () => {
                if (cancelFunction) cancelFunction();
            },
            type: DialogType.Prompt,
            okFunctionAsync: async (name: string) => {
                if (okFunction) await okFunction(name);
            }
        }
        this.EventDialog.emit(dialog);
    }
}