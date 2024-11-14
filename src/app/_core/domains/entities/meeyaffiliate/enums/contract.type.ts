export enum MAFContractType {
    Individual = 1,
    Businesses
}

export enum MAFContractStatus {
    Draft = -2,
    Reject = -1,
    Pending = 0,
    Approve = 1,
}

export enum MAFFilterContractStatus {
    NotYet = 0,
    NotYetHasCommission
}

export enum MAFFilterChannelType {
    Link = 1,
    Code,
    QR,
    Admin,
    IFrame
}

export enum MAFSyntheticContractStatus {
    BusinessesNotYet = 0,
    BusinessesHasContract,
    IndividualUnsigned,
    IndividualSigned,
}

export enum MAFContractSignStatus {
    Unsigned = 0,
    Signed,
}

export enum MAFContractCommissionStatus {
    Pending = 0,
    CommissionPending,
    Approve,
    NotInformation,
}

export enum MAFInvoiceStatus {
    NotYet = 0,
    Exists,
}

export enum MAFStatusPaymentType {
    NotYet,
    Paid,
}

export enum TransactionCommissionType {
    Direct = 1,
    Manage,
}