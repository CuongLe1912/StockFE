export enum MOOrderStatusType {
    PENDING = 0,
    PAID,
    USING,
    COMPLETED,
    CANCEL,
    WAIT_CONFIRM
}

export enum MOOrderStatusPaymentType {
    NEW = 0,
    SUCCESS,
    INPROCESSING,
    FAIL,
    WAITTOCONFIRM,
    CANCELED,
}

export enum MOOderActionStatusType {
    CREATE = 'create',  // Tạo đơn hàng
    PAYMENT_DIRECT = 'payment_direct',  // Thanh toán
    PAYMENT_RETRY = 'payment_retry',  // Thanh toán lại
    CANCEL = 'cancel', // Hủy đơn hàng
    APPROVE_ORDER = 'approve', // Duyệt đơn hàng
    REJECT = 'reject' // Từ chối
}

export enum MOOderAuthorStatusType {
    ADMIN = 'admin',  // sale, cskh
    USER = 'user',  // user
    SYSTEM = 'system',  // hệ thống
}

export enum MOOderProcessingStatusType {
    AVAILABLE = '0',  // Chưa sử dụng
    USING = '1',  // Đang sử dụng
    USED = '2',  // Đã sử dụng
    EXPIRED = '3', //Đã hết hạn
    APPLYING = '4',  // Đang sử dụng
}