export enum SmtpAccountType {
    Register = 1,
    Marketing,
    Coupon,
}
export function SmtpAccountTypeAware(constructor: Function) {
    constructor.prototype.SmtpAccountType = SmtpAccountType;
}