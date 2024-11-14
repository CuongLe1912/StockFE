export enum MCCouponUseType {
    NotLimit = 1,
    Limit,
}
export enum MCCouponActiveType {
    NotApply = 1,
    FirstCreateAccount,
    BuyServiceX,
    UseServiceXLimit,
    ServiceXToExpire,
    AccountBalanceRemain,
    AccountSpendingLimit,
    FixedDate,
}

export enum MCCouponType {
    DiscountCurrency = 1, //Giảm giá theo tiền tệ (VND)
    DiscountPercent,  //Giảm giá theo %
    AddMoneyAccount, //Cộng tiền vào TKKM 2
}


export enum MCCouponStatusType {
    Created = 1, //Chưa bắt đầu
    Running, //Đang chạy
    Expired, //Hết hạn
    OutOfMove, //Hết lượt
    LockUp, //Khóa
    Pause, //Tạm dừng
}
export enum MCCouponCustomerGroupType {
    NormalCustomer = 1, //Khách hàng thường
    BusinessCustomer,  //Khách hàng doanh nghiệp
    ACBCustomer, //Khách hàng qua ACB
}
export enum MCCouponCustomerType {
    All = 1, //Tất cả khách hàng
    Group,  //Chọn nhóm khách hàng
    List, //Chọn danh sách
    Upload, //tải lên khách hàng
}
export enum MCCouponUpdateStatusType {
    Lock = 'lock',
    Pause = 'pause',
    Unlock = 'unlock',
    Unpause = 'unpause',
}
export enum MCCouponApplicableType{
    WebsAndApps =1,
    Webs,
    Apps,
}
export enum MCCouponExpireDateType {
    DayNumber = 1,
    DayCalendar,
}