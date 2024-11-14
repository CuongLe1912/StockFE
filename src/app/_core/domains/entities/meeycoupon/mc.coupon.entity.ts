import { BaseEntity } from "../base.entity";
import { RegexType } from "../../enums/regex.type";
import { LookupData } from "../../data/lookup.data";
import { ConstantHelper } from "../../../helpers/constant.helper";
import { FileDecorator } from "../../../decorators/file.decorator";
import { TableDecorator } from "../../../decorators/table.decorator";
import { NumberDecorator } from "../../../decorators/number.decorator";
import { StringDecorator } from "../../../decorators/string.decorator";
import { MOGroupServiceEntity } from "../meeyorder/groupservice.entity";
import { BooleanDecorator } from "../../../decorators/boolean.decorator";
import { DropDownDecorator } from "../../../decorators/dropdown.decorator";
import { DateTimeDecorator } from "../../../decorators/datetime.decorator";
import { BooleanType, DateTimeType, NumberType, StringType } from "../../enums/data.type";
import { MCCouponActiveType, MCCouponApplicableType, MCCouponCustomerType, MCCouponExpireDateType, MCCouponStatusType, MCCouponType, MCCouponUpdateStatusType, MCCouponUseType } from "./enums/coupon.type";


@TableDecorator({ title: 'Phiếu giảm giá' })
export class MCCouponEntity extends BaseEntity {

    @StringDecorator({ label: 'Mã coupon', required: true, type: StringType.Text, max: 10, customValidators: [{ pattern: RegexType.TextNoSpecial, message: 'Không được nhập ký tự đặc biệt' }] })
    Code: string;

    @StringDecorator({ label: 'Tên coupon', required: true, type: StringType.Text, max: 30, customValidators: [{ pattern: RegexType.TextNoSpecial, message: 'Không được nhập ký tự đặc biệt' }] })
    Name: string;

    @StringDecorator({ label: 'Mô tả', type: StringType.MultiText, max: 50 })
    Description: string;

    @NumberDecorator({ label: 'Tổng số lượng coupon', type: NumberType.Text, max: 999999999 })
    Limit: number;

    @BooleanDecorator({ type: BooleanType.RadioButton, lookup: LookupData.ReferenceItems(ConstantHelper.MC_COUPON_USE_TYPES) })
    NumberCouponType: MCCouponUseType;

    @NumberDecorator({ label: 'Số lượng coupon được dùng', type: NumberType.Numberic, max: 999999999 })
    LimitUser: number;

    @NumberDecorator({ label: 'Tổng số lượng coupon khả dụng', type: NumberType.Text, max: 999999999 })
    LimitAvaiable: number;

    @NumberDecorator({ label: 'Mức giảm', required: true, type: NumberType.Text, max: 999999999 })
    Amount: number;

    @NumberDecorator({ label: 'Mức giảm', required: true, type: NumberType.Text, max: 99 })
    AmountPercent: number;

    @NumberDecorator({ label: 'Mức giảm tối đa', type: NumberType.Text, max: 999999999 })
    AmountLimit: number;

    @DropDownDecorator({ label: 'Trạng thái', lookup: LookupData.ReferenceUrl('/mccoupon/lookupstatus') })
    Status: MCCouponStatusType;

    @BooleanDecorator({ label: 'Số lượng coupon mỗi khách hàng được dùng', type: BooleanType.RadioButton, lookup: LookupData.ReferenceItems(ConstantHelper.MC_COUPON_USE_TYPES) })
    UseType: MCCouponUseType;

    @DropDownDecorator({ label: 'Loại coupon', required: true, lookup: LookupData.ReferenceUrl('/mccoupon/lookuptype') })
    Type: MCCouponType;

    @DropDownDecorator({ label: 'Loại điều kiện kích hoạt', required: true, lookup: LookupData.ReferenceUrl('/mccoupon/lookupactivetype') })
    ActiveType: MCCouponActiveType;
    // @DropDownDecorator({ label: 'Loại điều kiện kích hoạt', required: true, lookup: LookupData.ReferenceItems(ConstantHelper.MC_COUPON_ACTIVE_TYPES) })
    // TypeActive: MCCouponActiveType;

    @BooleanDecorator({ label: 'Nơi áp dụng', type: BooleanType.RadioButton, lookup: LookupData.ReferenceUrl('/mccoupon/lookupapplicabletype') })
    ApplicableType: MCCouponApplicableType;

    @BooleanDecorator({ label: 'Loại khách hàng', type: BooleanType.RadioButton, lookup: LookupData.ReferenceUrl('/mccoupon/lookupcustomertype') })
    CustomerType: MCCouponCustomerType;

    @DropDownDecorator({ label: 'Nhóm khách hàng', lookup: LookupData.ReferenceUrl('/mccoupon/lookupcustomergrouptype') })
    CustomerGroupType: number;
    @NumberDecorator({ label: 'Hết hạn dùng', type: NumberType.Text, min:1, max: 999999999 })
    Day: number;

    @DateTimeDecorator({ label: 'Ngày bắt đầu', required: true, type: DateTimeType.DateTime, minCurent: true, maxDepend: 'DateEnd' })
    DateStart: Date;

    @DateTimeDecorator({ label: 'Ngày kết thúc', required: true, type: DateTimeType.DateTime, minCurent: true, minDepend: 'DateStart' })
    DateEnd: Date;

    @DateTimeDecorator({ label: 'Ngày hết hạn sử dụng', required: true, type: DateTimeType.DateTime, minCurent: true, minDepend: 'DateEnd' })
    DateEndUse: Date;

    @NumberDecorator({ label: 'Tài khoản chính còn', type: NumberType.Text, max: 999999999 })
    RemainingMainAccount: number;

    @NumberDecorator({ label: 'Hạn sử dụng', type: NumberType.Text, min:1, max: 999999999 })
    ExpireDate: number;

    @NumberDecorator({ label: 'Tổng chi tiêu', type: NumberType.Text, max: 999999999 })
    TotalSpending: number;

    @NumberDecorator({ label: 'Định mức sử dụng', type: NumberType.Text, max: 999999999 })
    UseLimitDay: number;
    @BooleanDecorator({ type: BooleanType.RadioButton, lookup: LookupData.ReferenceItems(ConstantHelper.MC_COUPON_EXPIRE_DATE_TYPES) })
    ExpireDateType: MCCouponExpireDateType;

    @StringDecorator({ label: 'Thông báo áp dụng coupon thành công', required: true, type: StringType.Text, max: 100 })
    MessageSuccess: string;

    @StringDecorator({ label: 'Thông báo áp dụng coupon không thành công', required: true, type: StringType.Text, max: 100 })
    MessageError: string;

    @StringDecorator({ label: 'Tên coupon hiển thị khi áp dụng', required: true, type: StringType.Text, max: 100 })
    NameShow: string;

    @StringDecorator({ label: 'Mô tả ngắn gọn', required: true, type: StringType.MultiText, max: 500 })
    ShowDescription: string;

    @StringDecorator({ label: 'Mô tả ngắn gọn', type: StringType.MultiText, max: 500 })
    CouponDescription: string;
    @FileDecorator({ label: 'Import', required: true, url: 'MCCoupon/Upload', accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel', description: 'Định dạng: xlsx, xls' })
    FileImport: string;

    @DateTimeDecorator({ label: 'Thời gian hiệu lực', type: DateTimeType.DateRange })
    FilterDate: Date;

    Group: MOGroupServiceEntity;
    TypeCoupon: MCOptionDataEntity;
    StatusCoupon: MCOptionDataEntity;

    listUseServices: string[];
    listActivatedServices: string[];
    listCustomerServices: string[];
    couponConditionUseCustomer: MCCouponConditionUserCustomerEntity;
}

@TableDecorator({})
export class MCOptionDataEntity extends BaseEntity {
    @NumberDecorator({ label: '' })
    id: number;

    @StringDecorator({ label: '', type: StringType.Text })
    code: string;

    @StringDecorator({ label: '', type: StringType.Text })
    name: string;
}


@TableDecorator({})
export class MCCouponUpdateStatusEntity extends BaseEntity {

    @DropDownDecorator({ label: 'Trạng thái', lookup: LookupData.ReferenceItems(ConstantHelper.MC_COUPON_UPDATE_STATUS_TYPES) })
    Status: MCCouponUpdateStatusType;
}
@TableDecorator({})
export class MCCouponConditionUserCustomerEntity extends BaseEntity {
    @NumberDecorator({ label: '' })
    id: number;

    @NumberDecorator({ label: '' })
    couponId: number;

    @StringDecorator({ label: '', type: StringType.Text })
    userID: string;
}
