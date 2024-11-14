import { CityEntity } from '../city.entity';
import { WardEntity } from '../ward.entity';
import { LookupData } from '../../data/lookup.data';
import { DistrictEntity } from '../district.entity';
import { AppConfig } from '../../../../_core/helpers/app.config';
import { BaseEntity } from '../../../../_core/domains/entities/base.entity';
import { TableDecorator } from '../../../../_core/decorators/table.decorator';
import { ImageDecorator } from '../../../../_core/decorators/image.decorator';
import { NumberDecorator } from '../../../../_core/decorators/number.decorator';
import { StringDecorator } from '../../../../_core/decorators/string.decorator';
import { DateTimeDecorator } from '../../../../_core/decorators/datetime.decorator';
import { DropDownDecorator } from '../../../../_core/decorators/dropdown.decorator';
import { StringType, DateTimeType } from '../../../../_core/domains/enums/data.type';
import { RegexType } from '../../enums/regex.type';


@TableDecorator()
export class MCRMInvestorEntity extends BaseEntity {
    //Thông tin chung
    @StringDecorator({ label: "Chủ đầu tư", placeholder: "Nhập chủ đầu tư", required: true, type: StringType.Text, max: 100 })
    InvestorName: string;

    @StringDecorator({ label: "Mã số thuế", placeholder: "Nhập mã số thuế", type: StringType.Text, max: 20 })
    TaxCode: string;

    @StringDecorator({ label: "Mã số doanh nghiệp", placeholder: "Nhập mã số doanh nghiệp", type: StringType.Text, max: 100 })
    BusinessCode: string;

    @StringDecorator({ label: 'Địa chỉ', placeholder: "Nhập địa chỉ chi tiết", type: StringType.Text, max: 200 })
    Address: string;

    // @DropDownDecorator({ lookup: LookupData.Reference(CityEntity, ['Name'], 'Id') })
    // CityId: number;

    // @DropDownDecorator({ lookup: LookupData.Reference(DistrictEntity, ['Name'], 'Id', 'CityId') })
    // DistrictId: number;

    // @DropDownDecorator({ lookup: LookupData.Reference(WardEntity, ['Name'], 'Id', 'DistrictId') })
    // WardId: number;

    @DropDownDecorator({ label: 'Tỉnh/thành phố', lookup: LookupData.ReferenceUrlWithCache('/MCRMInvestorConfig/LookupCity') })
    CityId: string;

    @DropDownDecorator({ label: 'Quận/huyện', lookup: LookupData.ReferenceUrl('/MCRMInvestorConfig/LookupDistrict', null, null, 'CityId') })
    DistrictId: string;

    @DropDownDecorator({ label: 'Phường/xã', lookup: LookupData.ReferenceUrl('/MCRMInvestorConfig/LookupWard', null, null, 'DistrictId') })
    WardId: string;

    @StringDecorator({ label: "Tên người đại diện", placeholder: "Nhập tên người đại diện", required: true, type: StringType.Text, max: 100 })
    RepresentativeName: string;

    @StringDecorator({ label: "Số điện thoại", placeholder: "Nhập số điện thoại người đại diện", required: true, type: StringType.PhoneText, min: 10, max: 10 })
    Phone: string;

    @StringDecorator({ label: "Email", required: true, placeholder: "Nhập email người đại diện", type: StringType.Email, max: 100, customValidators: [{
        pattern: RegexType.Email,
        message: 'Email không hợp lệ'
    }] })
    Email: string;

    @StringDecorator({ label: "Mã hợp đồng", placeholder: "Nhập mã hợp đồng", type: StringType.Text, max: 100 })
    ContractCode: string;

    @StringDecorator({ label: "DB Uri", required: true, placeholder: "Nhập DBUri", type: StringType.Text, max: 2000 })
    DBUri: string;

    //Thông tin sử dụng sản phẩm
    @StringDecorator({ label: "Tên miền sản phẩm", required: true, placeholder: "Nhập domain", type: StringType.Text })
    Domain: string;

    @DateTimeDecorator({ label: "Ngày bắt đầu", type: DateTimeType.Date })
    StartDate: Date;

    @DateTimeDecorator({ label: "Ngày hết hạn", type: DateTimeType.Date, minDepend: 'StartDate' })
    EndDate: Date;

    @NumberDecorator({ label: "Hạn bảo hành (Tháng)", placeholder: "Nhập hạn bảo hành (Tháng)" })
    WarrantyPeriod: number;

    //Thông tin chăm sóc
    @DropDownDecorator({ label: 'Sale', placeholder: 'Chọn sale', required: true, lookup: LookupData.ReferenceUrl('/user/LookupSaleForMeeyId', ['FullName', 'Email']) })
    SaleId: number;

    @DropDownDecorator({ label: 'CSKH', placeholder: 'Chọn CSKH', required: true, lookup: LookupData.ReferenceUrl('/user/LookupSupportForMeeyId', ['FullName', 'Email']) })
    SupportId: number;

    @DropDownDecorator({
        label: 'Trạng thái', lookup: {
            items: [
                { value: 1, label: 'Hoạt động' },
                { value: 2, label: 'Khoá' },
                { value: 3, label: 'Hết hạn' },
            ]
        }
    })
    Status: number;

    IsActive?: boolean;
    SaleName: string;
    SupportName: string;
    Images: MCRMInvestorImageEntity;
}

@TableDecorator()
export class MCRMInvestorImageEntity extends BaseEntity {
    //Image
    @ImageDecorator({
        size: 15,
        dragable: true,
        label: 'Website',
        accept: 'image/jpg,image/jpeg,image/png',
        regexTypes: /.(png|jpg|jpeg)/,
        customUpload: {
            url: AppConfig.MeeyMediaConfig.Api + '/v1/admin/media',
            headers: [{ key: 'X-Client-Source', value: 'meeycrm-v3' }],
            authorization: { key: AppConfig.MeeyMediaConfig.UserName, value: AppConfig.MeeyMediaConfig.Password },
            data: [{ key: 'images', value: 'data' }, { key: 'createdBy[data][_id]', value: 'createdById' }, { key: 'createdBy[data][fullname]', value: 'createdByName' }, { key: 'createdBy[source]', value: 'admin' }]
        }
    })
    LogoWeb: any;

    @ImageDecorator({
        size: 15,
        dragable: true,
        label: 'App',
        accept: 'image/jpg,image/jpeg,image/png',
        regexTypes: /.(png|jpg|jpeg)/,
        customUpload: {
            url: AppConfig.MeeyMediaConfig.Api + '/v1/admin/media',
            headers: [{ key: 'X-Client-Source', value: 'meeycrm-v3' }],
            authorization: { key: AppConfig.MeeyMediaConfig.UserName, value: AppConfig.MeeyMediaConfig.Password },
            data: [{ key: 'images', value: 'data' }, { key: 'createdBy[data][_id]', value: 'createdById' }, { key: 'createdBy[data][fullname]', value: 'createdByName' }, { key: 'createdBy[source]', value: 'admin' }]
        }
    })
    LogoApp: any;

    @ImageDecorator({
        size: 15,
        dragable: true,
        label: 'Mobile Web',
        accept: 'image/jpg,image/jpeg,image/png',
        regexTypes: /.(png|jpg|jpeg)/,
        customUpload: {
            url: AppConfig.MeeyMediaConfig.Api + '/v1/admin/media',
            headers: [{ key: 'X-Client-Source', value: 'meeycrm-v3' }],
            authorization: { key: AppConfig.MeeyMediaConfig.UserName, value: AppConfig.MeeyMediaConfig.Password },
            data: [{ key: 'images', value: 'data' }, { key: 'createdBy[data][_id]', value: 'createdById' }, { key: 'createdBy[data][fullname]', value: 'createdByName' }, { key: 'createdBy[source]', value: 'admin' }]
        }
    })
    LogoMobileWeb: any;

    @ImageDecorator({
        size: 15,
        dragable: true,
        label: 'Website',
        accept: 'image/jpg,image/jpeg,image/png',
        regexTypes: /.(png|jpg|jpeg)/,
        customUpload: {
            url: AppConfig.MeeyMediaConfig.Api + '/v1/admin/media',
            headers: [{ key: 'X-Client-Source', value: 'meeycrm-v3' }],
            authorization: { key: AppConfig.MeeyMediaConfig.UserName, value: AppConfig.MeeyMediaConfig.Password },
            data: [{ key: 'images', value: 'data' }, { key: 'createdBy[data][_id]', value: 'createdById' }, { key: 'createdBy[data][fullname]', value: 'createdByName' }, { key: 'createdBy[source]', value: 'admin' }]
        }
    })
    BackgroundWeb: any;

    @ImageDecorator({
        size: 15,
        dragable: true,
        label: 'App',
        accept: 'image/jpg,image/jpeg,image/png',
        regexTypes: /.(png|jpg|jpeg)/,
        customUpload: {
            url: AppConfig.MeeyMediaConfig.Api + '/v1/admin/media',
            headers: [{ key: 'X-Client-Source', value: 'meeycrm-v3' }],
            authorization: { key: AppConfig.MeeyMediaConfig.UserName, value: AppConfig.MeeyMediaConfig.Password },
            data: [{ key: 'images', value: 'data' }, { key: 'createdBy[data][_id]', value: 'createdById' }, { key: 'createdBy[data][fullname]', value: 'createdByName' }, { key: 'createdBy[source]', value: 'admin' }]
        }
    })
    BackgroundApp: any;

    @ImageDecorator({
        size: 15,
        dragable: true,
        label: 'Mobile Web',
        accept: 'image/jpg,image/jpeg,image/png',
        regexTypes: /.(png|jpg|jpeg)/,
        customUpload: {
            url: AppConfig.MeeyMediaConfig.Api + '/v1/admin/media',
            headers: [{ key: 'X-Client-Source', value: 'meeycrm-v3' }],
            authorization: { key: AppConfig.MeeyMediaConfig.UserName, value: AppConfig.MeeyMediaConfig.Password },
            data: [{ key: 'images', value: 'data' }, { key: 'createdBy[data][_id]', value: 'createdById' }, { key: 'createdBy[data][fullname]', value: 'createdByName' }, { key: 'createdBy[source]', value: 'admin' }]
        }
    })
    BackgroundMobileWeb: any;
}
