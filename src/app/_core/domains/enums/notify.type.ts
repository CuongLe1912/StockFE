export enum NotifyType {
    Message = 1,
    Logout,
    LockUser = 10,
    UpdateRole,
    ChangePassword,
    Answer = 20,
    HangupCall,
    IncomingCall,
    OutcomingCall,
    HangupCallDetail,
}
export function NotifyTypeAware(constructor: Function) {
    constructor.prototype.NotifyType = NotifyType;
}
