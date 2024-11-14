export enum ResultType {
    Success = 1,
    Exception,
    Fail,
}
export function ResultTypeAware(constructor: Function) {
    constructor.prototype.ResultType = ResultType;
}
