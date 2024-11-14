export enum UserStatusType {
    Active = 0,
    Locked,
}
export function UserStatusTypeAware(constructor: Function) {
    constructor.prototype.UserStatusType = UserStatusType;
}