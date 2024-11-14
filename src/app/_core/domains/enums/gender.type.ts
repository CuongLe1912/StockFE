export enum GenderType {
    Male = 1,
    Female,   
    Unknow, 
}
export function GenderTypeAware(constructor: Function) {
    constructor.prototype.GenderType = GenderType;
}
