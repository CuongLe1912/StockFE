export enum ButtonType {
    Primary = 1,
    Secondary,
    Success,
    Warning,
    Danger,
    Brand,
    Info,
}
export function ButtonTypeAware(constructor: Function) {
    constructor.prototype.ButtonType = ButtonType;
}
