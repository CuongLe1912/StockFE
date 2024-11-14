import { BaseEntity } from '../base.entity';
import { WardEntity } from '../ward.entity';
import { CityEntity } from '../city.entity';
import { LookupData } from '../../data/lookup.data';
import { DistrictEntity } from '../district.entity';
import { GenderType } from '../../enums/gender.type';
import { ConstantHelper } from '../../../helpers/constant.helper';
import { FileDecorator } from '../../../decorators/file.decorator';
import { TableDecorator } from '../../../decorators/table.decorator';
import { ImageDecorator } from '../../../decorators/image.decorator';
import { StringDecorator } from '../../../decorators/string.decorator';
import { NumberDecorator } from '../../../decorators/number.decorator';
import { BooleanDecorator } from '../../../decorators/boolean.decorator';
import { DropDownDecorator } from '../../../decorators/dropdown.decorator';
import { StringType, DateTimeType, BooleanType } from '../../enums/data.type';
import { MCRMCustomerLeadStatusType } from './enums/mcrm.customer.status.type';
import { DateTimeDecorator, DateTimeFormat } from '../../../decorators/datetime.decorator';
import { MCRMCustomerActivityType, MCRMCustomerPotentialType, MCRMCustomerType } from './enums/mcrm.customer.type';

@TableDecorator()
export class MCRMCustomerLeadEntity extends BaseEntity {
    @NumberDecorator()
    Index: number;

    @ImageDecorator({ url: 'upload/MLUserUploadAvatar', size: 5 })
    Avatar: string;

    @StringDecorator({ label: 'Họ tên', type: StringType.Text, max: 100 })
    Name: string;

    @StringDecorator({ label: 'CMND', type: StringType.Number, max: 13 })
    IdCard: string;

    @StringDecorator({ label: 'Email',type: StringType.Email, max: 100 })
    Email: string;

    @StringDecorator({label: 'Số điện thoại', required:true, type: StringType.PhoneText, min: 10, max: 10 })
    Phone: string;

    @StringDecorator({ type: StringType.Account, max: 150 })
    UserName: string;

    @DropDownDecorator({ label: 'Tỉnh/thành phố', lookup: LookupData.Reference(CityEntity, ['Name'], 'Id') })
    CityId: number;

    @DropDownDecorator({ label: 'Quận/huyện', lookup: LookupData.Reference(DistrictEntity, ['Name'], 'Id', 'CityId') })
    DistrictId: number;

    @DropDownDecorator({ label: 'Phường/xã', lookup: LookupData.Reference(WardEntity, ['Name'], 'Id', 'DistrictId') })
    WardId: number;

    @DropDownDecorator({ required: true, label: 'Đối tượng', lookup: { items: ConstantHelper.ML_CUSTOMER_TYPES }})
    CustomerType: MCRMCustomerType;

    @DropDownDecorator({ required: true, label: 'Đối tượng', lookup: { items: ConstantHelper.ML_CUSTOMER_TYPES } })
    FilterCustomerType: MCRMCustomerType;

    @DropDownDecorator({ label: 'Sale', required: true, lookup: LookupData.ReferenceUrl('/user/LookupSaleForMeeyId', ['FullName', 'Email']) })
    SaleId: number;

    @DropDownDecorator({ label: 'Sale', lookup: LookupData.ReferenceUrl('/user/LookupSaleForMeeyId', ['FullName', 'Email']) })
    FilterSaleId: number;

    @DropDownDecorator({ label: 'CSKH', required: true, lookup: LookupData.ReferenceUrl('/user/LookupSupportForMeeyId', ['FullName', 'Email']) })
    SupportId: number;

    @DropDownDecorator({ label: 'CSKH', lookup: LookupData.ReferenceUrl('/user/LookupSupportForMeeyId', ['FullName', 'Email']) })
    FilterSupportId: number;

    @DropDownDecorator({ label: 'Trạng thái tiếp cận', lookup: { items: ConstantHelper.ML_CUSTOMER_LEAD_STATUS_TYPES } })
    CustomerStatusType: MCRMCustomerLeadStatusType;

    @DropDownDecorator({ label: 'Mức độ tiềm năng', lookup: { items: ConstantHelper.ML_CUSTOMER_POTETIAL_TYPES }, allowClear: false })
    CustomerPotentialType: MCRMCustomerPotentialType;

    @DropDownDecorator({ label: 'Loại hình hoạt động', lookup: { items: ConstantHelper.ML_CUSTOMER_ACTIVITY_TYPES }, allowClear: false })
    CustomerActivityType: MCRMCustomerActivityType;

    @StringDecorator({ label: 'Địa chỉ chi tiết', type: StringType.MultiText, max: 500, rows: 2 })
    Address: string;

    @StringDecorator({ label: 'Giới thiệu', type: StringType.MultiText, max: 1000, rows: 2 })
    Description: string;

    @DateTimeDecorator({ type: DateTimeType.Date, format: DateTimeFormat.DMY, view: 'years', max: new Date() })
    Birthday: Date;

    @StringDecorator({ label: 'Tên', type: StringType.Text, max: 100 })
    InvoiceName: string;
    @BooleanDecorator({ type: BooleanType.RadioButton, required: true, lookup: LookupData.ReferenceEnum(GenderType) })
    Gender: GenderType;

    @StringDecorator({ label: 'Tỉnh/thành phố' })
    City: string;

    @StringDecorator({ label: 'Quận/huyện' })
    District: string;

    @StringDecorator({ label: 'Phường/xã' })
    Ward: string;

    @StringDecorator({ required: true, type: StringType.Text, max: 100 })
    ShortName: string;

    @DateTimeDecorator({ label: 'Ngày tạo' })
    CreatedDate?: Date;

    @DateTimeDecorator({ label: 'Ngày chăm sóc gần đây', type: DateTimeType.DateTime })
    LastTimeSupport: Date;
    @DateTimeDecorator({ label: 'Ngày chăm sóc gần đây', type: DateTimeType.DateTime })
    FilterLastTimeSupport: Date;
    @FileDecorator({ label: 'Import Lead ID', required: true, url: 'MCRMCustomerLead/MSUpload', accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel', description: 'Định dạng: xlsx, xls' })
    FileImport: string;

}
@TableDecorator({ title: 'File Import' })
export class ImportFileCustomerLeadEntity extends BaseEntity {
    @NumberDecorator()
    Size: number;

    @DateTimeDecorator({ type: DateTimeType.Date, label: 'Ngày cập nhật' })
    DateTime: Date;
}
@TableDecorator()
export class ListConfirmImportCustomerLeadEntity {
    @NumberDecorator()
    Index?: number;
    @StringDecorator()
    Name?: string;
    @StringDecorator()
    Email?: string;
    @StringDecorator()
    Phone?: string;
    @StringDecorator()
    IdCard?: string;
    @StringDecorator()
    Birthday?: string;
    @StringDecorator()
    Gender?: string;
    @StringDecorator()
    Description?: string;
    @StringDecorator()
    Status?: string;
    @DropDownDecorator({ required: true, label: 'Đối tượng', lookup: { items: ConstantHelper.ML_CUSTOMER_TYPES } })
    FilterCustomerType: MCRMCustomerType;
}
