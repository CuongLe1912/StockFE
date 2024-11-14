export enum RequestTransferType {
    CHARGE = 0,
    REFUND
}

export enum TransferStatusType {
    AVAILABLE = '0', //chưa sử dụng
    USING = '1', //đang sử dụng
    USED = '2', //đã sử dụng
    EXPIRED = '3', //hết hạn
    APPLYING = '4', //đang ap dụng,
    FREEZE = '5' //đóng băng
}