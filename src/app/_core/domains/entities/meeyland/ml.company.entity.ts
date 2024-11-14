import { UserEntity } from "../user.entity";
import { BaseEntity } from "../base.entity";
import { LookupData } from "../../data/lookup.data";
import { DateTimeType, StringType } from "../../enums/data.type";
import { MLCompanyStatusType } from "./enums/ml.company.status.type";
import { ConstantHelper } from "../../../../_core/helpers/constant.helper";
import { TableDecorator } from "../../../../_core/decorators/table.decorator";
import { StringDecorator } from "../../../../_core/decorators/string.decorator";
import { DropDownDecorator } from "../../../../_core/decorators/dropdown.decorator";
import { DateTimeDecorator } from "../../../../_core/decorators/datetime.decorator";
import { MCRMCustomerStatusType } from "../meeycrm/enums/mcrm.customer.type";
import { RegexType } from "../../enums/regex.type";
import { MLEmployeeImportStatusType } from "./enums/ml.employee.status.type";

@TableDecorator()
export class MLCompanyEntity extends BaseEntity {

    @DropDownDecorator({ required: true, lookup: LookupData.Reference(UserEntity, ['FullName', 'Email']) })
    UserId: number;

    @StringDecorator({ required: true, type: StringType.Text, max: 50 })
    MeeyId: string;

    @StringDecorator({ required: true, type: StringType.Text, max: 50 })
    UserMeeyId: string;

    @StringDecorator({ required: true, allowSearch: true, type: StringType.Text, max: 100 })
    Name: string;

    @StringDecorator({ type: StringType.Account, max: 250 })
    User: string;

    @StringDecorator({ required: true, type: StringType.Email, max: 50 })
    Email: string;

    @StringDecorator({ required: true, allowSearch: true, type: StringType.PhoneText, min: 10, max: 10 })
    Phone: string;

    @StringDecorator({ required: true, type: StringType.Text, max: 250 })
    Address: string;

    @DropDownDecorator({
        required: true,
        allowSearch: true,
        lookup: { items: ConstantHelper.ML_COMPANY_STATUS_TYPES }
    })
    Status: MLCompanyStatusType;

    @DateTimeDecorator({ label: 'Ngày thực hiện gần nhất', type: DateTimeType.DateRange })
    DateTime: Date;

    @DateTimeDecorator({ label: 'Ngày tạo', type: DateTimeType.DateTime })
    StartDate: Date;

    @DateTimeDecorator({ required: true })
    ApproveDate: Date;

    @DateTimeDecorator({ required: true })
    RejectDate: Date;

    @StringDecorator({ required: true, type: StringType.Text, max: 250 })
    ShortName: string;

    @StringDecorator({ label: 'Ghi chú/Lý do', type: StringType.Text, max: 500, required: true })
    Notes: string;

    @StringDecorator({ type: StringType.Text, max: 250 })
    RegisterNumber: string;

    @StringDecorator({ type: StringType.Email })
    CreatorEmail: string;

    @StringDecorator({ type: StringType.PhoneText, min: 10, max: 10 })
    CreatorPhone: string;

    @StringDecorator({ type: StringType.Account, max: 100 })
    CreatorName: string;

    @StringDecorator({ type: StringType.Text })
    RecommendName: string;

    @StringDecorator({ type: StringType.Phone })
    RecommendPhone: string;

    @StringDecorator({ type: StringType.Email })
    RecommendEmail: string;

    @StringDecorator({ type: StringType.Text })
    RecommendAddress: string;

    @StringDecorator({ type: StringType.Text })
    RecommendShortName: string;

    @StringDecorator({ type: StringType.Text })
    RecommendRegisterNumber: string;

    @StringDecorator({ label: 'Ghi chú/Lý do', type: StringType.MultiText, max: 500, required: true })
    Reason: string;

    @DropDownDecorator({
        label: 'Phân loại DN',
        required: true, lookup: LookupData.ReferenceItems([
            { label: 'DN Thường', value: false },
            { label: 'Dùng cổng riêng', value: true }
        ])
    })
    TypeCompany: boolean;

    @DropDownDecorator({ label: 'Sale chăm sóc', lookup: LookupData.ReferenceUrl('/user/LookupSaleForMeeyCrm', ['FullName', 'Email']) })
    SaleId: number;

    @DropDownDecorator({ label: 'CSKH', lookup: LookupData.ReferenceUrl('/user/LookupSupportForMeeyCrm', ['FullName', 'Email']) })
    SupportId: number;
}

@TableDecorator()
export class MLCompanyAuditingEntity extends BaseEntity {
    @DateTimeDecorator({ label: 'Thời gian tra cứu', type: DateTimeType.DateRange })
    DateTime: Date;

    @StringDecorator({ type: StringType.Text, max: 50 })
    MeeyId: string;

    @StringDecorator({ type: StringType.Text, max: 100 })
    Name: string;

    @StringDecorator({ type: StringType.Text, max: 250 })
    Address: string;
}
@TableDecorator()
export class MLCompanyUpdateStatusEntity extends BaseEntity {

    @DropDownDecorator({ required: true, lookup: LookupData.Reference(UserEntity, ['FullName', 'Email']) })
    UserId: number;

    @StringDecorator({ required: true, type: StringType.Text, max: 50 })
    MeeyId: string;

    @StringDecorator({ required: true, type: StringType.Text, max: 50 })
    UserMeeyId: string;

    @StringDecorator({ required: true, allowSearch: true, type: StringType.Text, max: 100 })
    Name: string;

    @StringDecorator({ type: StringType.Account, max: 250 })
    User: string;

    @StringDecorator({ required: true, type: StringType.Email, max: 50 })
    Email: string;

    @StringDecorator({ required: true, allowSearch: true, type: StringType.PhoneText, min: 10, max: 10 })
    Phone: string;

    @StringDecorator({ required: true, type: StringType.Text, max: 250 })
    Address: string;

    @DropDownDecorator({
        required: true,
        allowSearch: true,
        lookup: { items: ConstantHelper.ML_COMPANY_STATUS_TYPES }
    })
    Status: MLCompanyStatusType;

    @DateTimeDecorator({ label: 'Ngày thực hiện gần nhất', type: DateTimeType.DateRange })
    DateTime: Date;

    @DateTimeDecorator({ label: 'Ngày tạo', type: DateTimeType.DateTime })
    StartDate: Date;

    @DateTimeDecorator({ required: true })
    ApproveDate: Date;

    @DateTimeDecorator({ required: true })
    RejectDate: Date;

    @StringDecorator({ required: true, type: StringType.Text, max: 250 })
    ShortName: string;

    @StringDecorator({ label: 'Ghi chú/Lý do', type: StringType.Text, max: 500, required: true })
    Notes: string;

    @StringDecorator({ type: StringType.Text, max: 250 })
    RegisterNumber: string;

    @StringDecorator({ type: StringType.Email })
    CreatorEmail: string;

    @StringDecorator({ type: StringType.PhoneText, min: 10, max: 10 })
    CreatorPhone: string;

    @StringDecorator({ type: StringType.Account, max: 100 })
    CreatorName: string;

    @StringDecorator({ type: StringType.Text })
    RecommendName: string;

    @StringDecorator({ type: StringType.Phone })
    RecommendPhone: string;

    @StringDecorator({ type: StringType.Email })
    RecommendEmail: string;

    @StringDecorator({ type: StringType.Text })
    RecommendAddress: string;

    @StringDecorator({ type: StringType.Text })
    RecommendShortName: string;

    @StringDecorator({ type: StringType.Text })
    RecommendRegisterNumber: string;

    @StringDecorator({ label: 'Ghi chú/Lý do', type: StringType.MultiText, max: 500, required: true })
    Reason: string;

    @DropDownDecorator({
        label: 'Phân loại DN',
        required: true, lookup: LookupData.ReferenceItems([
            { label: 'DN Thường', value: false },
            { label: 'Dùng cổng riêng', value: true }
        ])
    })
    TypeCompany: boolean;

    @DropDownDecorator({ label: 'Sale chăm sóc', lookup: LookupData.ReferenceUrl('/user/LookupSaleForMeeyCrm', ['FullName', 'Email']) })
    SaleId: number;

    @DropDownDecorator({ label: 'CSKH', lookup: LookupData.ReferenceUrl('/user/LookupSupportForMeeyCrm', ['FullName', 'Email']) })
    SupportId: number;
    @DropDownDecorator({ label: 'Trạng thái tiếp cận', lookup: { items: ConstantHelper.ML_CUSTOMER_STATUS_TYPES } })
    CustomerStatusType: MCRMCustomerStatusType;
}
@TableDecorator()
export class MLCompanyImportSaleEntity extends BaseEntity {
    @StringDecorator({ label: "Số điện thoại", required: true, type: StringType.Text, min: 10, max: 10 })
    Phone: string;

    @StringDecorator({ label: "Họ tên", required: true, type: StringType.Text, max: 100 })
    Name: string;

    @StringDecorator({ label: "Email", required: true, max: 100, customValidators: [{
        pattern: RegexType.Email,
        message: 'Email không hợp lệ'
    }] })
    Email: string;
    @DropDownDecorator({ label: "Trạng thái",required: true, lookup: { items: ConstantHelper.ML_EMPLOYEE_IMPORT_SALE_STATUS_TYPES }})
    StatusValue: MLEmployeeImportStatusType;
    Status: number;
    @StringDecorator({ label: "Ghi chú", type: StringType.Text })
    Content: string; 

}