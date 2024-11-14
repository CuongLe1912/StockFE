export enum MLScheduleType {
    Online = 1,
    Offline,
}

export enum MLScheduleDateType {
    All = 1,
    Custom
}

export enum MLScheduleStatusType {
    Request = 1,
    Accept,
    Complete,
    Reject,
    Cancel,
}

export enum MLScheduleRejectType {
    Busy = 1,
    Sold,
    OtherReason
}

export enum MLScheduleActionType {
    AddNew = 1,
    Edit,
    EditStatus,
    Cancel,
}

export enum MLScheduleCancelType {
    Busy = 1,
    NotNeed,
    OtherBooking,
    OtherReason
}