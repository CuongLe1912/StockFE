export enum MAFObjectType {
    UserNormal = 1,
    Publisher,
}

export enum MAFStatusCommissionType {
    Draft = 1,
    Paid,
    Fail,
    Collected,
    Approved,
    Pending,
}

export enum MAFActionType {
    Import = -1,
    Register = 0,
    Introduce,
    MoveTree,
    UpLevel,
    DownLevel,
    MoveBranch,
    UpdateRank,
    AddContract = 10,
    SignContract,
    UpdateContract,
    RejectContract,
    ApproveContract,
    ApproveRankCumulative
}

export enum MAFRankType {
    RANK1 = 1,
    RANK2,
    RANK3,
    RANK4,
    RANK999 = 999,
}

export enum MAFRequestStatusType {
    Init = 1,
    Accept,
    Reject
}

export enum MAFNodeType {
    Center = 1,
    Branch,
    Member,
    Rank
}
