export enum MPTransactionType {
    Topup = 101,
    Reward = 103,
    Promotion = 102,
    Transfer = 601, // Chuyển tiền
    Recovery = 701, // Thu hồi
    Donate = 113, // Tặng TKKM 2
    Payment = 201, // Thanh toán dịch vụ,
    Withdrawal = 302, // Rút tiền từ TKKM1
}

export enum TransactionHistoryType {
    CreateTransaction = 1,
    ApproveTransaction = 2,
    UpdateTransactionFail = 3,
    UpdateTransactionSuccess = 4,
    UpdateTransactionWaitConfirm = 6,
    CancelTransaction = 5,
    CreateTopupPromotion = 7,
    OpsNote = 8,
}

export enum MPTransactionStatusType {
    New = 0,
    Success,
    Process,
    Fail,
    Waiting,
    Cancel,
}

export enum MPWalletHistoryType {
    Plus = 0,
    Minus
}

export enum MPPaymentMethodType {
    OnlineATM = 1,
    Card = 2,
    Transfer = 3,
    Office = 4,
    MeeyPayAccount = 5,
    BankTransfer = 6,
    Coupon = 7,
    TransactionReward = 8,
}

export enum MPMerchantType {
    MeeyWallet = 1,
    MeeyAffiliate = 2,
    MeeyLand = 3,
    MeeylandPromotion = 10,
    MeeyMap = 11,
}

export enum MPTransactionAuthorType {
    ADMIN = 'admin',  // sale, cskh
    ADMIN_MEEYLAND = 'adminmeeyland',
    USER = 'user',  // user,
    SYSTEM = 'system' //hệ thống
}

export enum MPTransactionFundsType {
    BANK = 'BANK',
    COUNTER = 'COUNTER',
}
