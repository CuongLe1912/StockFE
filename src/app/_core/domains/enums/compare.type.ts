export enum CompareType {
    B_Equals = 1,
    B_NotEquals = 2,

    N_Equals = 10,
    N_NotEquals = 11,
    N_GreaterThan = 12,
    N_GreaterThanOrEqual = 13,
    N_LessThan = 14,
    N_LessThanOrEqual = 15,
    N_Between = 16,
    N_NotBetween = 17,

    S_Equals = 20,
    S_NotEquals = 21,
    S_Contains = 22,
    S_NotContains = 23,
    S_StartWith = 24,
    S_NotStartWith = 25,
    S_EndWith = 26,
    S_NotEndWith = 27,

    D_Equals = 30,
    D_NotEquals = 31,
    D_GreaterThan = 32,
    D_LessThan = 34,
    D_GreaterThanOrEqual = 33,
    D_LessThanOrEqual = 35,
    D_Between = 36,
    D_NotBetween = 37
}

export function CompareTypeAware(constructor: Function) {
    constructor.prototype.CompareType = CompareType;
}