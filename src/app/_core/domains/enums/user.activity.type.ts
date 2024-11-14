export enum UserActivityType {
    Register = 1,
    Login,
    Logout,
}
export function UserActivityTypeAware(constructor: Function) {
    constructor.prototype.UserActivityType = UserActivityType;
}