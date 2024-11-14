export enum OrderType {
    None = 0,
    Asc = 1,
    Desc
}
export function OrderTypeAware(constructor: Function) {
    constructor.prototype.OrderType = OrderType;
}
