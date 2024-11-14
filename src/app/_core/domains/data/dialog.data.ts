import { DialogType } from "../enums/dialog.type";
import { ModalSizeType } from "../enums/modal.size.type";
import { ObjectEx } from "../../decorators/object.decorator";

export class DialogData {
    object?: any;
    title?: string;
    content?: string;
    type?: DialogType;
    objectExtra?: any;
    restrict?: boolean;
    className?: string;
    cancelText?: string;
    rejectText?: string;
    resultText?: string;
    description?: string;
    size?: ModalSizeType;
    confirmText?: string;
    confirmClose?: boolean;
    cancelFunction?: () => void;
    minimizeFunction?: () => void;
    okFunction?: (result?: any) => void;
    resultFunction?: (result?: any) => void;
    rejectFunction?: (result?: any) => void;
    okFunctionAsync?: (result?: any) => Promise<any>;
    rejectFunctionAsync?: (result?: any) => Promise<any>;
    resultFunctionAsync?: (result?: any) => Promise<any>;

    constructor() {        
    }
}

export class DialogAutoData {
    title?: string;
    cancelText?: string;
    size?: ModalSizeType;
    confirmText?: string;
    objectValue: DialogObjectValue;
    confirmFunction?: (result?: any) => Promise<any>;
}

export class DialogObjectValue {
    object?: any;
    Reference: new () => {};
    Propperties?: (string | ObjectEx)[];
}