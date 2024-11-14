import { BaseEntity } from '../base.entity';
import { WardEntity } from '../ward.entity';
import { CityEntity } from '../city.entity';
import { DistrictEntity } from '../district.entity';
import { LookupData } from '../../data/lookup.data';
import { GenderType } from '../../enums/gender.type';
import { MLPartnerEntity } from './ml.partner.entity';
import { DepartmentType } from '../../enums/department.type';
import { ConstantHelper } from '../../../../_core/helpers/constant.helper';
import { FileDecorator } from '../../../../_core/decorators/file.decorator';
import { BooleanType, DateTimeType, StringType } from '../../enums/data.type';
import { TableDecorator } from '../../../../_core/decorators/table.decorator';
import { ImageDecorator } from '../../../../_core/decorators/image.decorator';
import { NumberDecorator } from '../../../../_core/decorators/number.decorator';
import { StringDecorator } from '../../../../_core/decorators/string.decorator';
import { BooleanDecorator } from '../../../../_core/decorators/boolean.decorator';
import { DropDownDecorator } from '../../../../_core/decorators/dropdown.decorator';
import { DateTimeDecorator, DateTimeFormat } from '../../../../_core/decorators/datetime.decorator';
import { MLUserReasonLockType, MLUserResetPasswordType, MLUserStatusType, MLUserType } from './enums/ml.user.type';

@TableDecorator()
export class MLUserEntity extends BaseEntity {
    @StringDecorator({ type: StringType.Text, max: 50 })
    MeeyId: string;

    @StringDecorator({ required: true, type: StringType.Text, max: 100 })
    Name: string;

    @StringDecorator({ label: 'CMND', type: StringType.Text, max: 20 })
    IdentityCard;

    @DropDownDecorator({ label: 'Nơi tạo', multiple: true, lookup: LookupData.ReferenceUrl('/MLUser/Source') })
    Source;

    @StringDecorator({ type: StringType.Account, max: 150 })
    UserName: string;

    @StringDecorator({ required: true, type: StringType.Email, max: 100 })
    Email: string;

    @StringDecorator({ required: true, type: StringType.PhoneText, min: 10, max: 10 })
    Phone: string;

    @DateTimeDecorator({ type: DateTimeType.Date, format: DateTimeFormat.DMY, view: 'years', max: new Date() })
    Birthday: Date;

    @ImageDecorator({ url: 'upload/MLUserUploadAvatar' })
    Avatar: string;

    @StringDecorator({ label: 'Nguồn giới thiệu', type: StringType.Text, max: 100 })
    Referer: string;

    @NumberDecorator({ label: 'Số dư ví' })
    Balance: number;

    @NumberDecorator({ label: 'Số dư ví KM1' })
    DiscountBalance1: number;

    @NumberDecorator({ label: 'Số dư ví KM2' })
    DiscountBalance2: number;

    @BooleanDecorator()
    EmailVerified: string;

    @DropDownDecorator({ label: 'Trạng thái xác thực số điện thoại', lookup: { items: ConstantHelper.MA_PHONE_VERIFY_TYPE } })
    PhoneVerified: string;

    @DropDownDecorator({ lookup: LookupData.ReferenceEnum(MLUserStatusType) })
    Status: MLUserStatusType;
    StatusText: string;

    @DropDownDecorator({ allowClear: false, lookup: { items: ConstantHelper.ML_USER_TYPES } })
    Type: MLUserType;

    @StringDecorator({ label: 'Nơi cấp', type: StringType.Text, max: 200 })
    PlaceTax: string;

    @StringDecorator({ label: 'Mã số thuế', type: StringType.Number, max: 15 })
    Tax: string;

    @FileDecorator({
        label: 'Chứng chỉ môi giới',
        url: 'upload/MAUploadBrokerCertificate',
        size: 30,
        accept: '.jpg,.jpeg,.png,.bmp,.gif,.heic,.heif,.tiff,.svg,.psd,.webp,.avif,.pdf',
        regexTypes: /.(jpg|jpeg|png|bmp|gif|hei|heif|tiff|svg|psd|webp|avif|pdf)/,
    })
    BrokerCertificate: string;

    @StringDecorator({ label: '', type: StringType.Text })
    NameBrokerCertificate: string;

    @DateTimeDecorator({ label: 'Ngày cấp', type: DateTimeType.Date, format: DateTimeFormat.DMY, max: new Date() })
    DateTax: Date;

    @StringDecorator({ label: 'Số đăng ký kinh doanh', type: StringType.Number, max: 30 })
    NumberBussiness: string;

    @DateTimeDecorator({ type: DateTimeType.DateTime, format: DateTimeFormat.DMYHM })
    CreatedDate: Date;

    @DateTimeDecorator({ type: DateTimeType.DateTime, format: DateTimeFormat.DMYHM })
    UpdatedDate: Date;

    @StringDecorator({ label: 'Người tạo', type: StringType.Text, max: 250 })
    Creator: string;

    @DropDownDecorator({ lookup: LookupData.Reference(CityEntity, ['Name'], 'Id') })
    CityId: number;

    @DropDownDecorator({ lookup: LookupData.Reference(DistrictEntity, ['Name'], 'Id', 'CityId') })
    DistrictId: number;

    @DropDownDecorator({ lookup: LookupData.Reference(WardEntity, ['Name'], 'Id', 'DistrictId') })
    WardId: number;

    @StringDecorator({ type: StringType.MultiText, max: 100 })
    Address: string;

    @StringDecorator({ label: 'Sale', type: StringType.Email, max: 250 })
    SaleEmail: string;

    @StringDecorator({ label: 'Support', type: StringType.Email, max: 250 })
    SupportEmail: string;

    @DropDownDecorator({ label: 'Sale', required: true, lookup: LookupData.ReferenceUrl('/user/LookupSaleForMeeyId', ['FullName', 'Email']) })
    SaleId: number;

    @DropDownDecorator({ label: 'Sale', multiple: true, lookup: LookupData.ReferenceUrl('/user/LookupSaleForMeeyId', ['FullName', 'Email']) })
    SaleIds: number[];

    @DropDownDecorator({ label: 'CSKH', required: true, lookup: LookupData.ReferenceUrl('/user/LookupSupportForMeeyId', ['FullName', 'Email']) })
    SupportId: number;

    @DropDownDecorator({ label: 'CSKH', multiple: true, lookup: LookupData.ReferenceUrl('/user/LookupSupportForMeeyId', ['FullName', 'Email']) })
    SupportIds: number[];

    @DateTimeDecorator({ label: 'Ngày gán', type: DateTimeType.DateTime })
    AssignDate: Date;

    @BooleanDecorator({ type: BooleanType.RadioButton, lookup: LookupData.ReferenceEnum(GenderType) })
    Gender: GenderType;

    @BooleanDecorator()
    MPConnected: boolean;

    @StringDecorator({ type: StringType.PhoneText, min: 10, max: 10 })
    MPPhone: string;

    @BooleanDecorator()
    IsEmployee: boolean;

    @StringDecorator({ label: 'Công ty', type: StringType.Text, max: 200 })
    Company: string;

    @StringDecorator({ label: 'Công ty', type: StringType.Text, max: 200 })
    CompanyMeeyId: string;

    @StringDecorator({ label: 'Công ty', type: StringType.Text, max: 500 })
    CompanyText: string;

    @StringDecorator({ type: StringType.Link, max: 500 })
    Website: string;

    @StringDecorator({ label: 'Giới thiệu', type: StringType.MultiText, max: 1000 })
    Description: string;

    @DateTimeDecorator({ label: 'Ngày tạo', type: DateTimeType.Date, format: DateTimeFormat.DMY })
    DateTime: Date;

    @DropDownDecorator({ label: 'Liên kết MeeyPay', lookup: { items: ConstantHelper.ML_USER_WALLET_LINKED } })
    MPWalletLinked: number;

    @StringDecorator({ type: StringType.Text, max: 100 })
    GoogleId: string;

    @StringDecorator({ type: StringType.Text, max: 100 })
    FacebookId: string;

    @StringDecorator({ type: StringType.Text, max: 100 })
    AppleId: string;

    @StringDecorator({ label: 'Sale', type: StringType.Text, max: 150 })
    SaleV2: string;

    @StringDecorator({ label: 'CSKH', type: StringType.Text, max: 150 })
    SupportV2: string;

    @DateTimeDecorator({ label: 'Đăng nhập gần nhất', type: DateTimeType.Date })
    LastLogin: Date;

    @DropDownDecorator({ label: "Nguồn giới thiệu", lookup: LookupData.Reference(MLPartnerEntity) })
    AffiliateId: number;

    @StringDecorator({ label: "Tìm kiếm tài khoản", required: true, placeholder: "Nhập số điện thoại, MeeyID của bạn", type: StringType.Search, max: 100 })
    SearchUser: string;

    @DropDownDecorator({ label: 'Sản phẩm quan tâm', required: true, lookup: LookupData.ReferenceUrl('/mcrmcustomer/LookupProduct', ['Name'], 'Id') })
    InterestedProductId: number;

    @DropDownDecorator({ label: 'Người tạo', required: true, lookup: LookupData.ReferenceUrl('/user/Lookup', ['FullName', 'Email']) })
    CreatorId: number;

    @DropDownDecorator({ label: 'Phòng ban', lookup: LookupData.ReferenceUrl('/department/lookupItems/' + <number>DepartmentType.Sale) })
    DepartmentIds: number[];

    LeadId?: number;
}

export class MLUserResetPasswordEntity {
    @NumberDecorator()
    Id: number;

    @StringDecorator({ type: StringType.Text, max: 150 })
    Name: string;

    @BooleanDecorator({ required: true, type: BooleanType.RadioButton, lookup: LookupData.ReferenceEnum(MLUserResetPasswordType) })
    Type: MLUserResetPasswordType;

    @StringDecorator({ type: StringType.Email, max: 150 })
    Email: string;

    @StringDecorator({ type: StringType.PhoneText, min: 10, max: 10 })
    Phone: string;
}

export class MLUserLockEntity {
    @NumberDecorator()
    Id: number;

    @StringDecorator({ type: StringType.Text, max: 150 })
    Name: string;

    @StringDecorator({ type: StringType.Email, max: 150 })
    Email: string;

    @StringDecorator({ type: StringType.PhoneText, min: 10, max: 10 })
    Phone: string;

    @DropDownDecorator({ label: 'Lý do', lookup: { items: ConstantHelper.ML_USER_REASON_LOCK_TYPES } })
    Type?: MLUserReasonLockType;

    @StringDecorator({ label: 'Lý do', required: true, type: StringType.MultiText, max: 500 })
    Reason?: string;
}

export class MLUserDeleteEntity {
    @NumberDecorator()
    Id: number;

    @StringDecorator({ type: StringType.Text, max: 150 })
    Name: string;

    @StringDecorator({ type: StringType.Email, max: 150 })
    Email: string;

    @StringDecorator({ type: StringType.PhoneText, min: 10, max: 10 })
    Phone: string;

    @StringDecorator({ label: 'Lý do', required: true, type: StringType.MultiText, max: 500 })
    Reason?: string;
}

@TableDecorator()
export class MLUserHistoryEntity {
    @NumberDecorator()
    MeeyId: string;

    @DateTimeDecorator({ type: DateTimeType.DateTime, format: DateTimeFormat.DMYHM })
    DateTime: Date;

    @DropDownDecorator({ lookup: LookupData.ReferenceEnum(MLUserStatusType) })
    StatusBefore: MLUserStatusType;

    @DropDownDecorator({ lookup: LookupData.ReferenceEnum(MLUserStatusType) })
    StatusAfter: MLUserStatusType;

    @StringDecorator({ type: StringType.Account, max: 150 })
    Actor: string;

    @StringDecorator({ type: StringType.Text, max: 150 })
    Action: string;

    @StringDecorator({ type: StringType.Text, max: 150 })
    Client: string;

    @StringDecorator({ type: StringType.MultiText, max: 5000 })
    Note: string;
}

export class MLUserStatisticalDto {
    Today: MLUserStatisticalItem;
    Custom: MLUserStatisticalItem;
    Weekend: MLUserStatisticalItem;
}

export class MLUserStatisticalItem {
    New: number;
    NotSale: number;
    HaveArticle: number;
}

export class MLUserVerifyPhoneEntity {
    @NumberDecorator()
    Id: number;

    @StringDecorator({ type: StringType.Text, max: 5 })
    DialingCode: string;

    @StringDecorator({ type: StringType.Text, max: 150 })
    Name: string;

    @StringDecorator({ type: StringType.Email, max: 150 })
    Email: string;

    @StringDecorator({ type: StringType.PhoneText, min: 10, max: 10 })
    Phone: string;
}

@TableDecorator()
export class MLUserStatisticEntity extends BaseEntity {
    @DropDownDecorator({ label: 'Phòng ban', lookup: LookupData.ReferenceUrl('/mlUser/lookupDepartmentItems/' + <number>DepartmentType.Sale) })
    DepartmentId: number;

    @DropDownDecorator({ label: 'Sale', multiple: true, lookup: LookupData.ReferenceUrl('/mlUser/LookupSaleItems', ['FullName', 'Email'], null, 'DepartmentId') })
    SaleIds: number[];

    @DateTimeDecorator({ label: 'Ngày tạo', type: DateTimeType.Date, format: DateTimeFormat.DMY })
    DateTime: Date;
}