export enum MethodType {
    Get = 1,
    Put,
    Post,
    Delete,
    Patch,
}
export function MethodTypeAware(constructor: Function) {
    constructor.prototype.MethodType = MethodType;
}
