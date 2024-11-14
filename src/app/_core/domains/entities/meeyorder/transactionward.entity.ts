import { BaseEntity } from "../base.entity";
import { LookupData } from "../../data/lookup.data";
import { ConstantHelper } from "../../../helpers/constant.helper";
import { TableDecorator } from "../../../decorators/table.decorator";
import { StringDecorator } from "../../../decorators/string.decorator";
import { NumberDecorator } from "../../../decorators/number.decorator";
import { DropDownDecorator } from "../../../decorators/dropdown.decorator";
import { DateTimeDecorator } from "../../../decorators/datetime.decorator";
import { FileDecorator } from "../../../../_core/decorators/file.decorator";
import { DateTimeType, DropdownLoadType, StringType } from "../../enums/data.type";
import { MPTransactionStatusType, MPWalletHistoryType } from "../meeypay/enums/mp.transaction.status.type";

@TableDecorator()
export class TransactionReWardEntity extends BaseEntity {

    @StringDecorator({ required: true, type: StringType.Text, max: 50 })
    MeeyId: string;

    @StringDecorator({ label: 'Mã giao dịch', type: StringType.Text })
    Code: string;

    @StringDecorator({ label: 'Mã đơn hàng', type: StringType.Text })
    OrderCode: string;

    @StringDecorator({ label: 'Mã KH (MeeyId)', type: StringType.Text })
    CustomerCode: string;

    @DateTimeDecorator({ label: 'Ngày tạo GD', type: DateTimeType.DateTime })
    CreateTime: Date;

    @StringDecorator({ label: 'Mã tham chiếu', type: StringType.Text })
    RefTransaction: string;

    @StringDecorator({ label: 'Số điện thoại', type: StringType.PhoneText, min: 10, max: 10 })
    Phone: string;

    @StringDecorator({ type: StringType.Email, max: 150 })
    Email: string;

    @DropDownDecorator({ label: 'Trạng thái', lookup: { items: ConstantHelper.MO_TRANSACTION_REWARD_STATUS_TYPES } })
    Status: MPTransactionStatusType;

    @DropDownDecorator({ label: 'Phương thức giao dịch', lookup: { items: ConstantHelper.MO_TRANSACTION_REWARD_PaymentMethod_TYPES } })
    PaymentMethod: string;

    @DropDownDecorator({ label: 'Loại GD', lookup: { items: ConstantHelper.MO_TRANSACTION_REWARD_STATUS_PAYMENTMETHOD_TYPES } })
    TransactionType: number;

    @DropDownDecorator({ label: 'Sale', required: true, multiple: true, lookup: LookupData.ReferenceUrl('/user/LookupSaleForMeeyPay', ['FullName', 'Email'], 'Email') })
    Sale: string;

    @DropDownDecorator({ label: 'CSKH', required: true, multiple: true, lookup: LookupData.ReferenceUrl('/user/LookupSupportForMeeyPay', ['FullName', 'Email'], 'Email') })
    Support: string;

    @DropDownDecorator({ label: 'Nơi tạo', lookup: LookupData.ReferenceUrl('/MPTransactions/Configuare/source', ['label'], 'clientId') })
    Source: string;

    @DropDownDecorator({ label: 'Người tạo', lookup: LookupData.ReferenceUrl('/user/Lookup', ['FullName', 'Email'], 'Email') })
    CreatedUser: string;

    @DropDownDecorator({ label: 'Người duyệt', required: true, lookup: LookupData.ReferenceUrl('/user/Lookup', ['FullName', 'Email'], 'Email') })
    ApprovedBy: string;

    @StringDecorator({ label: "Ghi chú", type: StringType.MultiText, required: true, max: 200 })
    Note: string;

    @DropDownDecorator({ label: 'Lý do từ chối', required: true, lookup: LookupData.ReferenceUrl('/MPTransactions/Configuare/cbReasons', ['title'], 'key') })
    MeeyResponseCode: string;

    @DropDownDecorator({ label: "Nguồn tiền", required: true, lookup: { items: ConstantHelper.MP_TRANSACTION_FUNDS_TYPES } })
    Funds: string;

    @DropDownDecorator({ required: true, label: 'Mã tiền thu', lookup: { url: '/MPRevenue/LookupRevenue', loadType: DropdownLoadType.Ajax, propertyDisplay: ['Code'], propertyValue: "Code", dependId: 'Funds' } })
    SearchPaymentCode: string;

    @FileDecorator({ label: 'Tệp đính kèm', url: 'upload/MCrmUpload', description: '(Bạn có thể đính kèm biên lai hoặc ảnh xác nhận giao dịch)' })
    UrlFile: string;

    Transaction: any;
    UserInfo: any;
    TransactionHistories: any[];
    WalletChangeHistories: any[];

    @DateTimeDecorator({ label: 'Ngày giao dịch', type: DateTimeType.DateRange })
    DateRangeReward: Date[];

}
@TableDecorator()
export class MLWalletHistoryEntity extends BaseEntity {
    @StringDecorator({ label: 'Thời gian' })
    DateTime: string;

    @DropDownDecorator({ label: 'Ý nghĩa', lookup: { items: ConstantHelper.ML_WALLET_HISTORY_TYPES } })
    HistoryType: MPWalletHistoryType;

    @NumberDecorator({ label: 'Số tiền' })
    Money: string;

    @StringDecorator({ label: 'Loại ví', type: StringType.Text })
    WalletType: string;

    @StringDecorator({ label: 'Mã ví', type: StringType.Code })
    WalletCode: string;

    @NumberDecorator({ label: 'Số dư trước giao dịch' })
    PrevMoney: string;

    @NumberDecorator({ label: 'Số dư sau giao dịch' })
    CurentMoney: string;
}

@TableDecorator()
export class MPTransactionHistoryEntity extends BaseEntity {
    @StringDecorator({ label: 'Thời gian' })
    DateTime: string;

    @StringDecorator({ label: 'Hành động' })
    Action: string;

    @DropDownDecorator({ label: 'Trạng thái trước', lookup: { items: ConstantHelper.MP_TRANSACTION_STATUS_TYPES } })
    PrevStatus: MPTransactionStatusType;

    @DropDownDecorator({ label: 'Trạng thái sau', lookup: { items: ConstantHelper.MP_TRANSACTION_STATUS_TYPES } })
    CurentStatus: MPTransactionStatusType;

    @StringDecorator({ label: 'Ghi chú', type: StringType.MultiText })
    Notes: string;

    @StringDecorator({ label: 'Người thực hiện', type: StringType.Account })
    User: string;
}