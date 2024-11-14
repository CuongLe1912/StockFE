export enum DialogType {
    Alert,
    Dialog,
    Prompt,
    Confirm,
    Loading,
    Wrapper,
    Timeout,
    AdminEdit,
    AdminView,
    Automatic,
    AlertTimer,
    WrapperAbove,
    ChangePassword,
}
export function DialogTypeAware(constructor: Function) {
    constructor.prototype.DialogType = DialogType;
}