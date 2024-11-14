import { BaseEntity } from '../base.entity';
import { LookupData } from '../../data/lookup.data';
import { DateTimeType, DropdownLoadType, StringType, NumberType, BooleanType } from '../../enums/data.type';
import { ConstantHelper } from '../../../../_core/helpers/constant.helper';
import { TableDecorator } from '../../../../_core/decorators/table.decorator';
import { StringDecorator } from '../../../../_core/decorators/string.decorator';
import { NumberDecorator } from '../../../../_core/decorators/number.decorator';
import { BooleanDecorator } from '../../../../_core/decorators/boolean.decorator';
import { DropDownDecorator } from '../../../../_core/decorators/dropdown.decorator';
import { DateTimeDecorator } from '../../../../_core/decorators/datetime.decorator';
import { MPPaymentMethodType, MPTransactionStatusType, MPWalletHistoryType } from './enums/mp.transaction.status.type';
import { RegexType } from "../../enums/regex.type";
import { FileDecorator } from '../../../../_core/decorators/file.decorator';

@TableDecorator()
export class MPTransactionsEntity extends BaseEntity {
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

    @DropDownDecorator({ label: 'Trạng thái', lookup: { items: ConstantHelper.MP_TRANSACTION_STATUS_TYPES } })
    Status: MPTransactionStatusType;

    @DropDownDecorator({ label: 'Phương thức thanh toán', lookup: LookupData.ReferenceUrl('/MPTransactions/Configuare/cbPaymentMethods', ['title'], 'id') })
    PaymentMethod: MPPaymentMethodType;

    @DropDownDecorator({ label: 'Loại GD', lookup: LookupData.ReferenceUrl('/MPTransactions/Configuare/cbTransactionTypes', ['Title'], 'Id') })
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

@TableDecorator()
export class MPTransactionBalanceEntity extends BaseEntity {
    @StringDecorator({ label: 'Loại ví' })
    walletype: string;

    @StringDecorator({ label: 'Mã ví' })
    walletId: number;

    @StringDecorator({ label: 'Chọn ví' })
    walleChoose: string;

    @NumberDecorator({ label: "Số tiền nạp", type: NumberType.Text, required: true, allowZero: true, min: 1, max: 9999999999999999999, subfix: 'VND' })
    Amount: number;

    @NumberDecorator({ label: "Số tiền cần nạp", type: NumberType.Text, required: true, allowZero: true, min: 1, max: 9999999999999999999, subfix: 'VND' })
    NeedAmount: number;

    @DropDownDecorator({ label: "Nội dung hiển thị cho KH", required: true, lookup: { items: ConstantHelper.MP_TRANSACTION_CONTENT_DISPLAY_TYPES } })
    Description: string;

    @StringDecorator({ label: "Lý do chi tiết", type: StringType.MultiText, required: true, max: 200, customValidators: [{ pattern: RegexType.TextNoSpecial, message: 'Không được nhập ký tự đặc biệt' }] })
    StaffNote: string;

    @StringDecorator({ required: true, placeholder: "Nhập Số điện thoại, Email của MeeyPay", type: StringType.Search, max: 100 })
    SearchCustom: string;

    @DropDownDecorator({ label: "Nguồn tiền", required: true, lookup: { items: ConstantHelper.MP_TRANSACTION_FUNDS_TYPES } })
    Funds: string;

    @DropDownDecorator({ label: "Nội dung", required: true, lookup: { items: ConstantHelper.MP_TRANSACTION_TRANSACTION_CONTENT_TYPES } })
    ContentOption: string;

    @NumberDecorator({ label: "Số tiền Khuyến mãi", type: NumberType.Text, required: true, allowZero: true, min: 1, max: 9999999999999999999, subfix: 'VND' })
    AmountKM2: number;

    @NumberDecorator({ type: NumberType.Text })
    NoAmountKM2: number = 0;

    @BooleanDecorator({
        label: 'Khuyến mãi', type: BooleanType.RadioButton, lookup: {
            items: [
                { value: true, label: 'Khuyến mãi' },
                { value: false, label: 'Không khuyến mãi', selected: true },
            ]
        }
    })
    HavePromotion: boolean;

    @DropDownDecorator({ required: true, label: 'Mã tiền thu', lookup: { url: '/MPRevenue/LookupRevenue', loadType: DropdownLoadType.All, propertyDisplay: ['Code'], propertyValue: "Code", dependId: 'Funds' } })
    SearchPaymentCode: string;

    @BooleanDecorator({
        label: 'Nạp tiền', type: BooleanType.RadioButton, lookup: {
            items: [
                { value: 1, label: 'TK Chính', selected: true },
                { value: 3, label: 'TKKM2' },
                { value: 10, label: 'TK MeeyAds' },
            ]
        }
    })
    WalletypeId: number;

    @BooleanDecorator({
        label: 'Nạp tiền', type: BooleanType.RadioButton, lookup: {
            items: [
                { value: true, label: 'Xuất hóa đơn' },
                { value: false, label: 'Không xuất hóa đơn', selected: true },
            ]
        }
    })
    HaveInvoice: boolean;

    @BooleanDecorator({ description: 'Dịch vụ Ads', type: BooleanType.Checkbox })
    ServiceAds: boolean;

    @BooleanDecorator({ description: 'Meey Pay', type: BooleanType.Checkbox })
    MeeyPay: boolean;

    @NumberDecorator({ label: "Số tiền Ads", type: NumberType.Text, required: true, allowZero: true, min: 1, max: 9999999999999999999, subfix: 'VND' })
    AmountAds: number;

    @NumberDecorator({ label: "Phí dịch vụ", type: NumberType.Text, allowZero: true, min: 1, max: 9999999999999999999, subfix: 'VND' })
    AmountFee: number;

    @BooleanDecorator({
        label: 'VAT', type: BooleanType.RadioButton, lookup: {
            items: [
                { value: true, label: 'Có VAT', selected: true },
                { value: false, label: 'Không có VAT' },
            ]
        }
    })
    HaveVAT: boolean;

    @NumberDecorator({ label: "Số tiền VAT", type: NumberType.Text, allowZero: true, min: 1, max: 9999999999999999999, subfix: 'VND' })
    AmountVAT: number;

    @StringDecorator({ label: "Tên khách hàng", required: true, type: StringType.AutoComplete, lookup: LookupData.ReferenceUrl('MPInvoice/LookupCustomerName') })
    CustomerName: string;

    @StringDecorator({ label: "Mã số thuế", type: StringType.AutoComplete, lookup: LookupData.ReferenceUrl('MPInvoice/LookupTaxCode') })
    TaxCode: string;

    @StringDecorator({ label: "Email", required: true, type: StringType.AutoComplete, lookup: LookupData.ReferenceUrl('MPInvoice/LookupCustomerEmail') })
    CustomerEmail: string;

    @StringDecorator({ label: 'Nội dung xuất hóa đơn', required: true, type: StringType.MultiText, max: 200 })
    ContentVAT: string;

    @BooleanDecorator({ placeholder: 'Lưu thông tin xuất hóa đơn' })
    SaveVAT: boolean;
}

@TableDecorator()
export class MPTransactionWithdrawalEntity extends BaseEntity {
    @NumberDecorator({ label: "Số tiền thực tế chuyển vào TK", type: NumberType.Text, required: true, allowZero: true, min: 1, max: 999999999999999, subfix: 'VND' })
    ActualPaidAmount: number;

    //
    @StringDecorator({ required: true, type: StringType.Text, max: 50 })
    MeeyId: string;

    // @StringDecorator({ label: 'Mã đơn hàng', type: StringType.Text })
    // OrderCode: string;

    // @StringDecorator({ label: 'Mã KH (MeeyId)', type: StringType.Text })
    // CustomerCode: string;

    // @DateTimeDecorator({ label: 'Ngày tạo GD', type: DateTimeType.DateTime })
    // CreateTime: Date;

    // @StringDecorator({ label: 'Mã tham chiếu', type: StringType.Text })
    // RefTransaction: string;

    @DropDownDecorator({ label: 'Trạng thái', lookup: { items: ConstantHelper.MP_TRANSACTION_STATUS_TYPES } })
    Status: MPTransactionStatusType;

    // @DropDownDecorator({ label: 'Phương thức thanh toán', lookup: LookupData.ReferenceUrl('/MPTransactions/Configuare/cbPaymentMethods', ['title'], 'id') })
    // PaymentMethod: MPPaymentMethodType;

    // @DropDownDecorator({ label: 'Loại GD', lookup: LookupData.ReferenceUrl('/MPTransactions/Configuare/cbTransactionTypes', ['Title'], 'Id') })
    // TransactionType: number;

    // @DropDownDecorator({ label: 'Sale', required: true, multiple: true, lookup: LookupData.ReferenceUrl('/user/LookupSaleForMeeyPay', ['FullName', 'Email'], 'Email') })
    // Sale: string;

    // @DropDownDecorator({ label: 'CSKH', required: true, multiple: true, lookup: LookupData.ReferenceUrl('/user/LookupSupportForMeeyPay', ['FullName', 'Email'], 'Email') })
    // Support: string;

    // @DropDownDecorator({ label: 'Người tạo', lookup: LookupData.ReferenceUrl('/user/Lookup', ['FullName', 'Email'], 'Email') })
    // CreatedUser: string;

    // @DropDownDecorator({ label: 'Người duyệt', required: true, lookup: LookupData.ReferenceUrl('/user/Lookup', ['FullName', 'Email'], 'Email') })
    // ApprovedBy: string;

    @StringDecorator({ label: "Ghi chú", type: StringType.MultiText, required: true, max: 500, customValidators: [{ pattern: RegexType.TextNoSpecial, message: 'Không được nhập ký tự đặc biệt' }] })
    StaffNote: string;

    // @DropDownDecorator({ label: 'Lý do từ chối', required: true, lookup: { items: ConstantHelper.MP_TRANSACTION_WITHDRAWAL_TYPE } })
    @DropDownDecorator({ label: 'Lý do từ chối', lookup: LookupData.ReferenceUrl('/MPTransactions/Configuare/cbWithdrawReasons', ['title'], 'key') })
    MeeyResponseCode: string;

    // @DropDownDecorator({ label: "Nguồn tiền", required: true, lookup: { items: ConstantHelper.MP_TRANSACTION_FUNDS_TYPES } })
    // Funds: string;

    @DropDownDecorator({ required: true, label: 'Mã tiền thu', lookup: { url: '/MPRevenue/LookupRevenue', loadType: DropdownLoadType.All, propertyDisplay: ['Code'], propertyValue: "Code", dependId: 'Funds' } })
    SearchPaymentCode: string;

    @StringDecorator({ label: 'Mã tham chiếu', type: StringType.Text, required: true, max: 50 })
    RevenueCode: string;

    @FileDecorator({ label: 'Tệp đính kèm', url: 'upload/MCrmUpload', description: '(Bạn có thể đính kèm biên lai hoặc ảnh xác nhận giao dịch)' })
    UrlFile: string

    Transaction: any;
    UserInfo: any;
    // TransactionHistories: any[];
    // WalletChangeHistories: any[];
}