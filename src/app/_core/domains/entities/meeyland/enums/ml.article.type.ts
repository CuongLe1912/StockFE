export enum MLArticleType {
    Self = 1,
    Crawl
}

export enum MLArticleNeedType {
    Buy = 1,
    Sell
}

export enum MLArticleViewType {
    NotYet = 0,
    Viewed,
    Edited
}

export enum MLArtilceSyncType {
    No = 0,
    Yes,
}

export enum MLArticlePostType {
    Repeat = 1,
    Custom
}

export enum MLArticleAccessType {
    Deleted = -10,
    Rejected = -6,
    AdminUnPublish = -5,
    UnPublish = -3,
    WaitPayment = -2,
    Draft = -1,
    WaitPublish = 0,
    Publish
}

export enum MLArticleReasonType {
    Other = 1,
    BadImage,
    Duplicate,
    OtherSite,
    BadContent,
    InvalidContent,
    InvalidCategory,
    ImageContainLogo,
    ImageContainPhone,
}

export enum MLArticleReasonReportType {
    BadAddress = 1,
    BadContent,
    BadValuation,
    UnConnected,
    Transacted,
    Duplicate,
    Other,
}

export enum MLArticleStatusType {
    WaitApprove = 2,
    WaitPayment,
    Publish,
    Down,
    Expire,
    Draft,
    Rejected,
    Deleted,
    WaitPublish
}

export enum MLArticleReportStatusType {
    NotYet = 0,
    Processed
}

export enum MLArticlePackageType {
    Vip1 = 'vip1',
    Vip2 = 'vip2',
    Vip3 = 'vip3',
    Normal = 'normal'
}

export enum MLArtilceMediateType {
    No = 1,
    Yes,
}

export enum MLArticleReferenceType {
    Need = 1,
    Area,
    Floor,
    Units,
    Facade,
    Source,
    Access,
    VipType,
    Feature,
    Balcony,
    Bedroom,
    Deposit,
    NeedBuy,
    NeedSell,
    Bathroom,
    UnitArea,
    Utilities,
    Equipment,
    Furniture,
    WideRoads,
    UserTypes,
    WaterUnit,
    UnitPrice,
    EnergyUnit,
    Directions,
    Advantages,
    UnitLength,
    LegalPaper,
    TotalPrice,
    Reputation,
    TypeOfHouses,
    BusinessDates,
    BusinessTimes,
    PerCommission,
    PaymentPeriod,
    UnitRentPrice,
    StatusArticle,
    ApprovalContent,
    TypeOfRealEstate,
    LevelTransaction,
    BalconyDirection,
    MinimumRentalPeriod,
    TenantArticle,
}

export enum MLArticleRejectOptionType {
    UnPublish = 1,
    KeepPublish,
}

export enum MLArticleApproveContentType {
    Reject = -1,
    Waiting = 0,
    Approve,
}