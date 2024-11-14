export enum MCRMCustomerType {
    UnKnow = -1,
    Brokers,
    Owner,
    Investor,
    Company,
    Exchanges,
    Bank,
    Advertiser,
    BrokerIndividual = 100
}

export enum MCRMCustomerStatusType {
    NotSale = 1,
    NotApproach = 2,
    Consider = 3,
    Reject = 5,
    Success = 6,
    Deleted = 7,
}

export enum MCRMCustomerActivityType {
    Individuals = 1,
    Business
}
export enum MCRMSaleAssignConfigHistoryTypes {
    Create = 1,
    Update
}
export enum MCRMCustomerPotentialType {
    Potential1 = 1,
    Potential2,
    Potential3,
    Potential4,
}

export enum MCRMCustomerExpireType {
    Expire = 1,
}

export enum MCRMCustomerNoteCallType {
    In = 1,
    Out
}

export enum MCRMCustomerRequestStatusType {
    Init = 1,
    Accept,
    Reject,
    Split
}

export enum MCRMCustomerNoteCallStatusType {
    Unknow = 0,
    NotAnswer = 1,  // KH không nghe máy
    Busy,           // KH đang bận không tiện nói chuyện, gọi lại sau
    Interested,     // KH quan tâm dịch vụ
    NotNeed,        // KH thiện chí nhưng chưa có nhu cầu
    Difficult,      // KH khó tiếp cận
    Supported       // KH đã có nhân viên khác hỗ trợ
}

export enum MCRMCustomerNoteEmailStatusType {
    Draft = 1,
    Sent,
    Opened
}

export enum MCRMCustomerActionType {
    Create = 1,
    Update,
    UpdateStatus,
    Group,
    AssignSale,
    AssignSupport,
    SaleReceive,
    SupportReceive,
    AddContact,
    EditContact,
    DeleteContact,
    DeleteGroupCustomer,
    TransferSale,
    UpdateStore,
    AutoAssign,
    CreateMeeyId,
    AssignAffiliate,
    AffiliateToSale,
    ManagerAssignSale,
}

export enum CustomerStoreType {
    IndividualsStore = 0,
    CenterStore,
    CompanyStore,
    Affiliate,
    Bank,
}
export enum CustomerTransferType {
    TransferSale = 1,
    TransferAffiliate,
}