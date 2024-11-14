export enum SmsTemplateType {
    Register = 1,
    ResetPassword,
    MLRegister = 50,
    MLResetPassword,
    MLLock,
    MLUnlock,
    RegisterBussinessAccount = 100,
}
export function SmsTemplateTypeAware(constructor: Function) {
    constructor.prototype.SmsTemplateType = SmsTemplateType;
}