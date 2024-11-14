export enum MLEmployeeStatusType {
    Pending = 0,
    Cancel,
    Active,
    Locked,
    Deleted,
    Rejected,
}

export enum MLEmployeeHistoryActionType {
    Add = 1,
    Confirm,
    Reject,
    Cancel,
    Lock,
    UnLock,
    Remove,
    UnKnow
}
export enum MLEmployeeImportStatusType {
    Success = 1,
    Error
}