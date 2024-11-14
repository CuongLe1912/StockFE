export enum MLUserType {
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

export enum MLUserStatusType {
    Deleted = 4,
    Locked = 3,
    DeActive = 0,
    Active = 1,
}

export enum MLUserVerifyPhone {
    DeActive = 0,
    Active = 1,
}

export enum MLUserResetPasswordType {
    Sms = 1,
    Email
}
export enum MLUserReasonLockType {
    BadContent = 1,
    Duplicate,
    Sex,
    Politic,
    MultipleUser,
    UserRequest
}
export enum MLUserWalletLinked {
    No = 0,
    Yes,
}
export enum MLUSerInterestedProductType {
    MeeyLand = 1,
    MeeyMap,
    MeeyCrm,
    MeeyProject,
    MeeyId,
    MeeyAdmin,
    NeeyAds,
    Meey3D,
    MeeyShare,
    MeeyPage,
    MeeyKhach,
    MeeyChain,
    MeeyParking,
    MeeyCrmInvestor,
    MeeyHomes,
}