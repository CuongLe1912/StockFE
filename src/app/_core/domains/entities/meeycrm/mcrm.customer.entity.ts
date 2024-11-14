import { WardEntity } from "../ward.entity";
import { BaseEntity } from "../base.entity";
import { CityEntity } from "../city.entity";
import { DistrictEntity } from "../district.entity";
import { LookupData } from "../../data/lookup.data";
import { EditorIcon } from "../../data/editor.param.data";
import { MCRMCompanyEntity } from "./mcrm.company.entity";
import { MCRMCallLogType } from "./enums/mcrm.calllog.type";
import { PrefixNumberEntity } from "../prefix.number.entity";
import { DepartmentType } from "../../enums/department.type";
import { MLPartnerEntity } from "../meeyland/ml.partner.entity";
import { MCRMEmailTemplateEntity } from "./mcrm.email.template.entity";
import { MCRMCustomerGroupEntity } from "./mcrm.customer.group.entity";
import { ConstantHelper } from "../../../../_core/helpers/constant.helper";
import { FileDecorator } from "../../../../_core/decorators/file.decorator";
import { TableDecorator } from "../../../../_core/decorators/table.decorator";
import { ImageDecorator } from "../../../../_core/decorators/image.decorator";
import { StringDecorator } from "../../../../_core/decorators/string.decorator";
import { NumberDecorator } from "../../../../_core/decorators/number.decorator";
import { BooleanDecorator } from "../../../../_core/decorators/boolean.decorator";
import { DropDownDecorator } from "../../../../_core/decorators/dropdown.decorator";
import { BooleanType, DateTimeType, DropdownLoadType, NumberType, StringType } from "../../enums/data.type";
import { DateTimeDecorator, DateTimeFormat } from "../../../../_core/decorators/datetime.decorator";
import { MCRMDistributionType } from "./enums/mcrm.distribution.type";
import { MCRMCustomerActivityType, MCRMCustomerExpireType, MCRMCustomerPotentialType, MCRMCustomerStatusType, MCRMCustomerType, MCRMCustomerNoteCallType, MCRMCustomerNoteCallStatusType, CustomerStoreType, CustomerTransferType } from "./enums/mcrm.customer.type";
import { MCRMIframeContractEntity } from "./mcrm.ifame.contract.entity";
import { MCRMCustomerLeadStatusType } from "./enums/mcrm.customer.status.type";
import { MLUSerInterestedProductType } from "../meeyland/enums/ml.user.type";

@TableDecorator({ title: 'Khách hàng' })
export class MCRMCustomerEntity extends BaseEntity {
    @NumberDecorator()
    Index: number;

    @StringDecorator({ type: StringType.Text, max: 50 })
    MeeyId: string;

    @StringDecorator({ type: StringType.Code, max: 50 })
    Code: string;

    @ImageDecorator({ url: 'upload/MLUserUploadAvatar' })
    Avatar: string;

    @StringDecorator({ required: true, type: StringType.Text, max: 100 })
    Name: string;

    @StringDecorator({ type: StringType.Email, max: 100 })
    Email: string;

    @StringDecorator({ type: StringType.PhoneText, min: 10, max: 200 })
    Phone: string;

    @DropDownDecorator({ label: "Nguồn giới thiệu", lookup: LookupData.Reference(MLPartnerEntity) })
    SourceId: number;

    // @DropDownDecorator({ label: "Nơi tạo tài khoản", lookup: LookupData.Reference(MLPartnerEntity) })
    @DropDownDecorator({ label: 'Nơi tạo tài khoản', multiple: true, lookup: LookupData.ReferenceUrl('/MLUser/Source') })
    AccountSource: string;
    @DropDownDecorator({ label: 'Nơi tạo tài khoản', multiple: true, lookup: LookupData.ReferenceUrl('/MLUser/Source', ['Name'], 'Id') })
    FilterAccountSource: string;

    @StringDecorator({ type: StringType.Account, max: 150 })
    UserName: string;

    @DropDownDecorator({ label: 'Tỉnh/thành phố', lookup: LookupData.Reference(CityEntity, ['Name'], 'Id') })
    CityId: number;

    @DropDownDecorator({ label: 'Quận/huyện', lookup: LookupData.Reference(DistrictEntity, ['Name'], 'Id', 'CityId') })
    DistrictId: number;

    @DropDownDecorator({ label: 'Phường/xã', lookup: LookupData.Reference(WardEntity, ['Name'], 'Id', 'DistrictId') })
    WardId: number;

    @DropDownDecorator({ required: true, label: 'Loại khách', lookup: { items: ConstantHelper.ML_CUSTOMER_TYPES }, allowClear: false })
    CustomerType: MCRMCustomerType;

    @DropDownDecorator({ required: true, label: 'Loại khách', lookup: { items: ConstantHelper.ML_CUSTOMER_TYPES } })
    FilterCustomerType: MCRMCustomerType;

    @DropDownDecorator({ required: true, label: 'Kho khách hàng', lookup: {
        items: [
            { value: CustomerStoreType.CenterStore, label: 'Kho trung tâm' },
            { value: CustomerStoreType.CompanyStore, label: 'Kho công ty' },
        ]
    } })
    CustomerStoreType: CustomerStoreType;

    @DropDownDecorator({ label: 'Sale chăm sóc', lookup: LookupData.ReferenceUrl('/user/LookupSaleForMeeyCrm', ['FullName', 'Email']) })
    SaleId: number;

    @DropDownDecorator({ label: 'CSKH', lookup: LookupData.ReferenceUrl('/user/LookupSupportForMeeyCrm', ['FullName', 'Email']) })
    SupportId: number;

    @DropDownDecorator({ label: 'Sale chăm sóc', lookup: LookupData.ReferenceUrl('/user/LookupSaleForMeeyCrm', ['FullName', 'Email']) })
    FilterSaleId: number;

    @DropDownDecorator({ label: 'CSKH', lookup: LookupData.ReferenceUrl('/user/LookupSupportForMeeyCrm', ['FullName', 'Email']) })
    FilterSupportId: number;


    @DropDownDecorator({ label: 'Trạng thái tiếp cận', lookup: { items: ConstantHelper.ML_CUSTOMER_STATUS_TYPES } })
    CustomerStatusType: MCRMCustomerStatusType;

    @DropDownDecorator({ label: 'Khách hàng quá hạn', lookup: { items: ConstantHelper.ML_CUSTOMER_EXPIRE_TYPES } })
    CustomerExpireType: MCRMCustomerExpireType;

    @DropDownDecorator({ label: 'Mức độ tiềm năng', lookup: { items: ConstantHelper.ML_CUSTOMER_POTETIAL_TYPES } })
    CustomerPotentialType: MCRMCustomerPotentialType;

    @DropDownDecorator({ label: 'Loại hình hoạt động', lookup: { items: ConstantHelper.ML_CUSTOMER_ACTIVITY_TYPES }, allowClear: false })
    CustomerActivityType: MCRMCustomerActivityType;

    @DropDownDecorator({ label: 'Nhóm khách hàng', lookup: LookupData.Reference(MCRMCustomerGroupEntity) })
    CustomerGroupId: number;

    @DropDownDecorator({ label: 'Doanh nghiệp', lookup: LookupData.Reference(MCRMCompanyEntity) })
    CompanyId: number;

    @DateTimeDecorator({ label: 'Ngày chăm sóc gần nhất', type: DateTimeType.DateTime })
    LastTimeSupport: Date;

    @DateTimeDecorator({ label: 'Ngày chăm sóc gần nhất', type: DateTimeType.DateTime })
    FilterLastTimeSupport: Date;

    @DateTimeDecorator({ label: 'Ngày chăm sóc đầu tiên', type: DateTimeType.DateTime })
    FirstTimeSupport: Date;

    @NumberDecorator()
    ExpireDay: number;

    @NumberDecorator()
    PrevSaleId: number;

    @BooleanDecorator()
    Expire: boolean;

    @StringDecorator()
    ExpireMessage: string;

    @StringDecorator({ label: 'Địa chỉ chi tiết', type: StringType.MultiText, max: 500, rows: 2 })
    Address: string;

    @StringDecorator({ label: 'Giới thiệu', type: StringType.MultiText, max: 1000, rows: 2 })
    Description: string;

    @DateTimeDecorator({ type: DateTimeType.Date, format: DateTimeFormat.DMY, view: 'years', max: new Date() })
    Birthday: Date;

    @StringDecorator({ label: 'Tên', type: StringType.Text, max: 100 })
    InvoiceName: string;

    @StringDecorator({ label: 'Mã số thuế', type: StringType.Text, max: 50 })
    InvoiceTaxCode: string;

    @StringDecorator({ label: 'Mã số thuế', type: StringType.AutoComplete, lookup: LookupData.ReferenceUrl('/mcrmcustomer/LookupTaxCode', ['Name'], 'Id'), max: 13 })
    FilterTaxCode: string;

    @StringDecorator({ label: 'Địa chỉ hóa đơn', type: StringType.Text, max: 500 })
    InvoiceAddress: string;

    @StringDecorator({ label: 'Địa chỉ chi tiết', type: StringType.MultiText, rows: 2 })
    AddressDetail: string;

    @StringDecorator({ label: 'Tỉnh/thành phố' })
    City: string;

    @StringDecorator({ label: 'Quận/huyện' })
    District: string;

    @StringDecorator({ label: 'Phường/xã' })
    Ward: string;

    @StringDecorator({ required: true, type: StringType.Text, max: 100 })
    ShortName: string;

    @DropDownDecorator({ label: 'Phân phối', lookup: { items: ConstantHelper.ML_CUSTOMER_DISTRIBUTION_TYPES } })
    DistributionType: MCRMDistributionType;

    @DateTimeDecorator({ label: 'Ngày tạo' })
    CreatedDate?: Date;

    @DateTimeDecorator({ label: 'Ngày tạo tài khoản' })
    FilterCreatedDate?: Date;

    @DateTimeDecorator({ label: 'Ngày cập nhật' })
    FilterUpdatedDate?: Date;
    @DropDownDecorator({ label: 'Số dư tài khoản',lookup: {
        items: [
            { value: '0-499999',  label: '< 500.000' },
            { value: '500000-2000000',  label: '500.000 - 2.000.000' },
            { value: '2000000-5000000',  label: '2.000.000 - 5.000.000' },
            { value: '5000000-10000000',  label: '5.000.000 - 10.000.000' },
            { value: '10000001-999999999999', label: '> 10.000.000' },
        ]
    } })
    FilterBalance: string[];

    @NumberDecorator({ label: 'Thời hạn chăm sóc', max: 99999 })
    FilterSupportExpire: number;

    @NumberDecorator({ label: 'Quá hạn chăm sóc', max: 99999 })
    FilterSupportExpire2: number;

    @DropDownDecorator({
        label: 'Trạng thái tiếp cận',
        lookup: {
            items: [
                { value: MCRMCustomerStatusType.NotApproach, label: 'Chưa tiếp cận' },
                { value: MCRMCustomerStatusType.Consider, label: 'Xem xét' },
                { value: MCRMCustomerStatusType.Success, label: 'Thành công' },
            ]
        }
    })
    FilterCustomerStatusType: MCRMCustomerStatusType;

    @DropDownDecorator({ label: 'Nguồn Iframe', lookup: LookupData.Reference(MCRMIframeContractEntity, ['ContractName', 'CompanyName'], 'Id') })
    FilterIframeContractId: number;

    @DropDownDecorator({ label: 'Người giới thiệu', lookup: LookupData.ReferenceUrl('/mcrmcustomer/LookupCustomerRef', ['Name'], 'Id') })
    FilterCustomerRef: string;

    @StringDecorator({ label: 'Sản phẩm quan tâm', type: StringType.Text, max: 100 })
    InterestedProduct: string;

    @DropDownDecorator({ label: 'Sản phẩm quan tâm', required: true, lookup: LookupData.ReferenceUrl('/mcrmcustomer/LookupProduct', ['Name'], 'Id') })
    FilterInterestedProductId: number;

    @DropDownDecorator({label: 'Trạng thái xác thực số điện thoại', lookup: LookupData.ReferenceItems(ConstantHelper.MA_PHONE_VERIFY_TYPE)})
    PhoneVerified: string;
}

@TableDecorator()
export class MCRMCustomerAssignDto {
    Ids: number[];

    @StringDecorator({ label: 'Ghi chú', required: true , type: StringType.MultiText, max: 200 })
    Note: string;

    @DropDownDecorator({ label: 'Phòng ban', required: true, lookup: LookupData.ReferenceUrl('/department/lookupItems/' + <number>DepartmentType.Sale) })
    DepartmentId: number;

    @DropDownDecorator({ label: 'Nhân viên', required: true, lookup: LookupData.ReferenceUrl('/user/AllUsersByDepartmentId', ['FullName', 'Email'], 'Id', 'DepartmentId') })
    UserId: number;

    @NumberDecorator({ label: 'Số lượng khách hàng chăm sóc',required: true, type: NumberType.Text })
    Amount: number;

    @BooleanDecorator({ label: 'Chọn loại điều chuyển', type: BooleanType.RadioButton, lookup: LookupData.ReferenceItems(ConstantHelper.ML_CUSTOMER_TRANSFER_TYPES) })
    TransferType: CustomerTransferType;

    @StringDecorator({ placeholder: 'Nhập Số điện thoại, Email, MeeyId, CRMId ' , required: true, type: StringType.Text, max: 100 })
    Search: string;
    @StringDecorator({ label: 'Phone', type: StringType.Text, max: 20 })
    Phone: string;

    Tab: string;
    Sale: string;
    MeeyIds: string[];
    CustomerRefMeeyId: string;
}

@TableDecorator()
export class MCRMCustomerReceiveDto {
    Id: number;

    @StringDecorator({ label: 'Ghi chú', type: StringType.MultiText, max: 200 })
    Note: string;
}

@TableDecorator()
export class MCRMCustomerStatusDto {
    Ids: number[];

    @StringDecorator({ label: 'Ghi chú', type: StringType.MultiText, max: 200 })
    Note: string;

    @BooleanDecorator({ required: true, label: 'Trạng thái tiếp cận', type: BooleanType.RadioButton, lookup: { items: ConstantHelper.ML_CUSTOMER_STATUS_LITLE_TYPES }, autoSelect: true })
    Status?: MCRMCustomerStatusType;
}

@TableDecorator()
export class MCRMCustomerLeadStatusDto {
    Ids: number[];

    @StringDecorator({ label: 'Ghi chú', type: StringType.MultiText, max: 200 })
    Note: string;

    @BooleanDecorator({ required: true, label: 'Trạng thái', type: BooleanType.RadioButton, lookup: { items: ConstantHelper.ML_CUSTOMER_LEAD_STATUS_TYPES }, autoSelect: true })
    Status?: MCRMCustomerLeadStatusType;

    @BooleanDecorator({ required: true, label: 'Trạng thái', type: BooleanType.RadioButton, lookup: { items: ConstantHelper.ML_CUSTOMER_LEAD_STATUS_LITE_TYPES }, autoSelect: true })
    StatusLite?: MCRMCustomerLeadStatusType;
}

@TableDecorator()
export class MCRMCustomerNoteDto {
    Id: number;

    @DropDownDecorator({ label: 'Khách hàng', lookup: { url: '/MCRMCustomer/LookupCustomerHaveRole', loadType: DropdownLoadType.Ajax } })
    CustomerId: number;

    @DropDownDecorator({ label: 'Khách hàng', allowClear: false, autoSelect: true })
    CustomerLeadId?: number;

    @StringDecorator({ required: true, label: 'Ghi chú', type: StringType.MultiText, max: 500 })
    Note: string;

    @DropDownDecorator({ required: true, label: 'Số điện thoại', multiple: true, autoSelect: true })
    Phones: string[];

    @StringDecorator({ required: true, label: 'Số điện thoại', type: StringType.PhoneText, min: 10, max: 10 })
    PhoneText?: string;
}

@TableDecorator()
export class MCRMCustomerNoteCallDto {
    Id?: number;

    @StringDecorator({ type: StringType.Code, max: 50 })
    Code?: string;

    @StringDecorator({ type: StringType.Text, max: 100 })
    CallId?: string;

    @NumberDecorator()
    CallLogId?: number;

    @DropDownDecorator({ label: 'Khách hàng', allowClear: false, autoSelect: true })
    CustomerId?: number;

    @DropDownDecorator({ label: 'Khách hàng', allowClear: false, autoSelect: true })
    CustomerLeadId?: number;

    @StringDecorator({ label: 'Ghi chú', type: StringType.MultiText, max: 500 })
    Note?: string;

    @DropDownDecorator({ required: true, label: 'Số điện thoại', multiple: false, autoSelect: true, allowClear: false })
    Phone?: string;

    @StringDecorator({ required: true, label: 'Số điện thoại', type: StringType.PhoneText, min: 10, max: 10 })
    PhoneText?: string;

    @DropDownDecorator({ required: true, label: 'Loại', lookup: { items: ConstantHelper.ML_CUSTOMER_CALLLOGS_TYPES } })
    Type?: MCRMCallLogType;

    @DropDownDecorator({ required: true, label: 'Trạng thái', lookup: { items: ConstantHelper.ML_CUSTOMER_NOTE_CALL_STATUS_TYPES } })
    Status?: MCRMCustomerNoteCallStatusType;

    @DropDownDecorator({ label: 'Đầu số', lookup: LookupData.Reference(PrefixNumberEntity, ['Phone'], 'Prefix'), autoSelect: true, allowClear: false })
    PrefixNumber?: number;

    @StringDecorator({ label: 'Thông báo', type: StringType.Text, max: 500 })
    Message?: string;

    @StringDecorator({ label: 'Loại', type: StringType.Text, max: 500 })
    TypeName?: string;

    @StringDecorator({ label: 'Sự kiện', type: StringType.Text, max: 50 })
    Event?: string;
}

@TableDecorator()
export class MCRMCustomerNoteEmailDto {
    @DropDownDecorator({ label: 'Khách hàng', allowClear: false })
    CustomerId: number;

    @DropDownDecorator({ label: 'Khách hàng', allowClear: false, autoSelect: true })
    CustomerLeadId?: number;

    @StringDecorator({ required: true, label: 'Tiêu đề', type: StringType.Text, max: 500 })
    Title: string;

    @StringDecorator({
        required: true, type: StringType.Html, max: 50000,
        variables: [
            { name: 'FullName', title: 'Họ và tên', icon: EditorIcon.Account },
            { name: 'DateTime', title: 'Ngày tháng', icon: EditorIcon.DateTime },
        ]
    })
    Content: string;

    @StringDecorator({ required: true, label: 'Người nhận', type: StringType.TagEmail, max: 250 })
    EmailTo: string;

    @StringDecorator({ required: true, label: 'Người nhận [Cc]', type: StringType.TagEmail, max: 250 })
    EmailCc: string;

    @StringDecorator({ required: true, label: 'Người nhận [Bcc]', type: StringType.TagEmail, max: 250 })
    EmailBcc: string;

    @StringDecorator({ required: true, label: 'Người gửi', type: StringType.Email, max: 250 })
    EmailFrom: string;

    @FileDecorator({ label: 'Tệp', url: 'upload/MCrmUpload', multiple: true, })
    Attachments: string[];

    @DropDownDecorator({ label: 'Mẫu email', lookup: LookupData.Reference(MCRMEmailTemplateEntity) })
    EmailTemplateId: number;
}
@TableDecorator()
export class MCRMCustomerTransferDto {
    Ids: number[];
    RootId: number;     

    @StringDecorator({ required: true, type: StringType.Text, max: 100 })
    Name: string;

    @StringDecorator({ type: StringType.Text, max: 100 })
    Email: string;

    @StringDecorator({ type: StringType.Text, min: 10, max: 200 })
    Phone: string;

    @BooleanDecorator({ label: 'Chọn loại điều chuyển', type: BooleanType.RadioButton, lookup: LookupData.ReferenceItems(ConstantHelper.ML_CUSTOMER_TRANSFER_TYPES) })
    TransferType: CustomerTransferType; 

    @StringDecorator({ required: true, label: 'Lý do', type: StringType.MultiText, max: 200, rows: 2 })
    Reason: string;

    @DropDownDecorator({ label: 'Phòng ban', required: true, lookup: LookupData.ReferenceUrl('/department/lookupItems/' + <number>DepartmentType.Sale), autoSelect: true })
    DepartmentId: number;

    @DropDownDecorator({ label: 'Nhân viên', required: true, lookup: LookupData.ReferenceUrl('/user/AllUsersByDepartmentId', ['FullName', 'Email'], 'Id', 'DepartmentId') })
    UserId: number;

    @NumberDecorator({ label: 'Số lượng khách hàng chăm sóc', type: NumberType.Text })
    Amount: number;
}