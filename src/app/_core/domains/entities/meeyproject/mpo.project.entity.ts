import { BaseEntity } from "../base.entity";
import { UserEntity } from "../user.entity";
import { LookupData } from "../../data/lookup.data";
import { MethodType } from "../../enums/method.type";
import { MPOJuridicalType } from "./enums/mpo.juridical.type";
import { AppConfig } from "../../../../_core/helpers/app.config";
import { ConstantHelper } from "../../../../_core/helpers/constant.helper";
import { FileDecorator } from "../../../../_core/decorators/file.decorator";
import { TableDecorator } from "../../../../_core/decorators/table.decorator";
import { ImageDecorator } from "../../../../_core/decorators/image.decorator";
import { NumberDecorator } from "../../../../_core/decorators/number.decorator";
import { StringDecorator } from "../../../../_core/decorators/string.decorator";
import { BooleanDecorator } from "../../../../_core/decorators/boolean.decorator";
import { DropDownDecorator } from "../../../../_core/decorators/dropdown.decorator";
import { DateTimeDecorator } from "../../../../_core/decorators/datetime.decorator";
import { BooleanType, DateTimeType, DropdownLoadType, NumberType, StringType } from "../../enums/data.type";

@TableDecorator({ title: 'Dự án' })
export class MPOProjectEntity extends BaseEntity {
    @StringDecorator({ label: 'Tên dự án', max: 1000 })
    Name: string;

    @StringDecorator({ label: 'Tên thương mại', required: true, max: 1000 })
    TradeName: string;

    @DropDownDecorator({ label: 'Tỉnh/Thành phố', required: true, lookup: LookupData.ReferenceUrl('/MPOProject/LookupCity') })
    CityId: string;

    @DropDownDecorator({ label: 'Quận/Huyện', required: true, lookup: LookupData.ReferenceUrl('/MPOProject/LookupDistrict', null, null, 'CityId') })
    DistrictId: string;

    @DropDownDecorator({ label: 'Phường/Xã', lookup: LookupData.ReferenceUrl('/MPOProject/LookupWard', null, null, 'DistrictId') })
    WardId: string;

    @DropDownDecorator({ label: 'Đường/Phố', lookup: LookupData.ReferenceUrl('/MPOProject/LookupStreet', null, null, 'DistrictId') })
    StreetId: string;

    @StringDecorator({ label: 'Số nhà', max: 1000 })
    Address: string;

    @NumberDecorator({ label: 'Vĩ độ', step: 0.00000001, decimals: 8, type: NumberType.Text, min: -90, max: 90, allowNegative: true })
    Lat: number;

    @NumberDecorator({ label: 'Kinh độ', step: 0.00000001, decimals: 8, type: NumberType.Text, min: -180, max: 180, allowNegative: true })
    Lng: number;

    @DropDownDecorator({ label: 'Loại dự án', lookup: LookupData.ReferenceUrl('/MPOProject/LookupProjectType') })
    ProjectTypeId: string;

    @DropDownDecorator({ label: 'Loại dự án', multiple: true, lookup: LookupData.ReferenceUrl('/MPOProject/LookupProjectType') })
    ProjectTypeIds: string[];

    @DropDownDecorator({ label: 'Trạng thái dự án', lookup: LookupData.ReferenceUrl('/MPOProject/LookupProjectStatus') })
    ProjectStatusId: string;

    @BooleanDecorator({ label: 'Công khai', type: BooleanType.Toggle })
    IsPublished: boolean = false;

    @DropDownDecorator({ label: 'Trạng thái hiển thị', lookup: LookupData.ReferenceUrl('/MPOProject/LookupPublishStatus') })
    PublishStatusId: string;

    @DropDownDecorator({ label: 'Chủ đầu tư', lookup: { url: '/MPOProject/LookupInvestor', loadType: DropdownLoadType.Ajax } })
    InvestorId: string;

    @DropDownDecorator({ label: 'Chủ đầu tư', multiple: true, lookup: { url: '/MPOProject/LookupInvestor', loadType: DropdownLoadType.Ajax } })
    InvestorIds: string;

    @DateTimeDecorator({ label: 'Ngày tạo', type: DateTimeType.DateTime })
    FilterCreatedAt: Date;

    @DropDownDecorator({ label: "Người tạo", lookup: LookupData.Reference(UserEntity, ['FullName']) })
    FilterCreatedBy: string;

    @DateTimeDecorator({ label: 'Ngày chỉnh sửa', type: DateTimeType.DateTime })
    FilterUpdateAt: Date;

    @DropDownDecorator({ label: "Người chỉnh sửa", lookup: LookupData.Reference(UserEntity, ['FullName']) })
    FilterUpdateBy: string;

    // @StringDecorator({ label: 'Mức giá theo m2 thấp nhất (VND)', max: 1000 })
    @NumberDecorator({ label: 'Mức giá theo m2 thấp nhất (VND)', decimals: 2, step: 0.01, max: 999999999999999, type: NumberType.Text, maxDepend: 'PriceM2Max' })
    PriceM2Min: string;

    // @StringDecorator({ label: 'Mức giá theo m2 cao nhất (VND)', max: 1000 })
    @NumberDecorator({ label: 'Mức giá theo m2 cao nhất (VND)', decimals: 2, step: 0.01, max: 999999999999999, type: NumberType.Text, minDepend: 'PriceM2Min' })
    PriceM2Max: string;

    // @StringDecorator({ label: 'Mức giá theo sản phẩm thấp nhất (VND)', max: 1000 })
    @NumberDecorator({ label: 'Mức giá theo sản phẩm thấp nhất (VND)', decimals: 2, step: 0.01, max: 999999999999999, type: NumberType.Text, maxDepend: 'PriceMax' })
    PriceMin: string;

    // @StringDecorator({ label: 'Mức giá theo sản phẩm cao nhất (VND)', max: 1000 })
    @NumberDecorator({ label: 'Mức giá theo sản phẩm cao nhất (VND)', decimals: 2, step: 0.01, max: 999999999999999, type: NumberType.Text, minDepend: 'PriceMin' })
    PriceMax: string;

    @DropDownDecorator({ label: 'Dự án', lookup: { url: '/MPOProject/LookupProject', loadType: DropdownLoadType.Ajax } })
    ProjectId: string;

    @StringDecorator({ label: 'Id dự án', max: 1000 })
    ProjectMeeyId: string;

    @StringDecorator({ label: 'Tổng diện tích', max: 1000 })
    TotalArea: string;

    @StringDecorator({ label: 'Mật độ xây dựng', max: 1000 })
    BuildingDensity: string;

    @StringDecorator({ label: 'Hình thức sở hữu', max: 1000 })
    Ownership: string;

    @StringDecorator({ label: 'Số tầng', max: 1000 })
    TotalFloor: string;

    @StringDecorator({ label: 'Số căn', type: StringType.MultiText, max: 5000 })
    TotalApartment: string;

    @StringDecorator({ label: 'Số tòa', type: StringType.MultiText, max: 5000 })
    TotalBuilding: string;

    @StringDecorator({ label: 'Tiến độ bàn giao', max: 1000 })
    Progress: string;

    @StringDecorator({ label: 'Thời gian khởi công', max: 1000 })
    StartTime: string;

    @StringDecorator({ label: 'Thời gian hoàn thành', max: 1000 })
    CompletionTime: string;

    @DropDownDecorator({ label: 'Dự án', lookup: { url: '/MPOProject/LookupMeeyProject', loadType: DropdownLoadType.Ajax, propertyValue: 'Id', propertyDisplay: ['TradeName'],} })
    ListProjectId: string;

    @ImageDecorator({
        size: 10,
        dragable: true,
        label: 'Logo dự án',
        accept: 'image/jpg,image/jpeg,image/png,.heic',
        regexTypes: /.(png|jpg|jpeg|heic)/,
        customUpload: {
            url: AppConfig.MeeyMediaConfig.Api + '/v1/admin/media',
            headers: [{ key: 'X-Client-Source', value: AppConfig.MeeyProjectConfig.Source }],
            authorization: { key: AppConfig.MeeyMediaConfig.UserName, value: AppConfig.MeeyMediaConfig.Password },
            data: [{ key: 'images', value: 'data' }, { key: 'createdBy[data][_id]', value: 'createdById' }, { key: 'createdBy[data][fullname]', value: 'createdByName' }, { key: 'createdBy[source]', value: 'admin' }]
        }
    })
    Logo: any;

    @ImageDecorator({
        size: 10,
        label: 'Ảnh bìa dự án',
        accept: 'image/jpg,image/jpeg,image/png,.heic',
        regexTypes: /.(png|jpg|jpeg|heic)/,
        customUpload: {
            url: AppConfig.MeeyMediaConfig.Api + '/v1/admin/media',
            headers: [{ key: 'X-Client-Source', value: AppConfig.MeeyProjectConfig.Source }],
            authorization: { key: AppConfig.MeeyMediaConfig.UserName, value: AppConfig.MeeyMediaConfig.Password },
            data: [{ key: 'images', value: 'data' }, { key: 'createdBy[data][_id]', value: 'createdById' }, { key: 'createdBy[data][fullname]', value: 'createdByName' }, { key: 'createdBy[source]', value: 'admin' }]
        }
    })
    Banner: any;

    @StringDecorator({
        label: 'Mô tả dự án', placeholder: 'Nhập hoặc dán thông tin.', max: 10000, type: StringType.Html,
        htmlToolbar: 'uploadFile | uploadImage | undo redo | fontsizeselect | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent',
        htmlMenubar: false,
    })
    Description: string;

    @ImageDecorator({
        size: 2,
        max: 1000,
        totalSize: 20,
        multiple: true,
        duplicate: false,
        label: 'Hình ảnh',
        accept: 'image/jpg,image/jpeg,image/png,.heic',
        regexTypes: /.(png|jpg|jpeg|heic)/,
        customUpload: {
            url: AppConfig.MeeyMediaConfig.Api + '/v1/admin/media',
            headers: [{ key: 'X-Client-Source', value: AppConfig.MeeyProjectConfig.Source }],
            authorization: { key: AppConfig.MeeyMediaConfig.UserName, value: AppConfig.MeeyMediaConfig.Password },
            data: [{ key: 'images', value: 'data' }, { key: 'createdBy[data][_id]', value: 'createdById' }, { key: 'createdBy[data][fullname]', value: 'createdByName' }, { key: 'createdBy[source]', value: 'admin' }]
        }
    })
    Images: any[];

    @FileDecorator({
        size: 10,
        required: true,
        label: 'Tên file',
        description: 'Định dạng: xls, xlxs',
        accept: 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,',
        customUpload: {
            method: MethodType.Post,
            url: AppConfig.MeeyProjectConfig.Api + '/v1/admin/import/projects',
            headers: [{ key: 'X-Client-Source', value: AppConfig.MeeyProjectConfig.Source }],
            authorization: { key: AppConfig.MeeyProjectConfig.UserName, value: AppConfig.MeeyProjectConfig.Password },
            data: [{ key: 'files', value: 'data' }, { key: 'createdBy[data][_id]', value: 'createdById' }, { key: 'createdBy[data][fullname]', value: 'createdByName' }, { key: 'createdBy[source]', value: 'admin' }]
        }
    })
    File: any;

    DescriptionText: string;

    LocationTab: MPOProjectLocationEntity;
    UtilitiesTab: MPOProjectUtilitiesEntity;
    Juridical: MPOProjectJuridicalEntity;
    SalePolicy: MPOProjectSalePolicyEntity;
    InvestorRelated: MPOProjectInvestorRelatedEntity;
    ConstructionProgress: MPOProjectConstructionProgressEntity;
    PaymentProgress: MPOProjectPaymentProgressEntity;

    Investor: any;

    City: string;
    District: string;
    Ward: string;
}

@TableDecorator({ title: 'Giới thiệu dự án' })
export class MPOProjectItemEntity extends BaseEntity {
    @StringDecorator({ label: 'Id dự án', max: 1000 })
    ProjectMeeyId: string;

    @StringDecorator({ label: 'Mô tả', placeholder: 'Nhập hoặc dán thông tin.', max: 10000, type: StringType.MultiText })
    Description: string;

    @StringDecorator({
        label: 'Mô tả', placeholder: 'Nhập hoặc dán thông tin.', max: 10000, type: StringType.Html,
        htmlToolbar: 'uploadFile | uploadImage | undo redo | fontsizeselect | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent',
        htmlMenubar: false,
    })
    Content: string;

    @StringDecorator({
        label: 'Tiến độ thanh toán', placeholder: 'Nhập hoặc dán thông tin.', max: 10000, type: StringType.Html,
        htmlToolbar: 'uploadFile | uploadImage | undo redo | fontsizeselect | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent',
        htmlMenubar: false,
    })
    PaymentProgress: string;

    @StringDecorator({ label: 'Tiện ích', placeholder: 'Tiện ích', max: 1000, type: StringType.Tag, maxTags: 100, delimiters: ';', titleTags: 'Tiện ích' })
    Utilities: string;

    @ImageDecorator({
        size: 2,
        max: 1000,
        totalSize: 100,
        multiple: true,
        duplicate: false,
        label: 'Hình ảnh',
        accept: 'image/jpg,image/jpeg,image/png,.heic',
        regexTypes: /.(png|jpg|jpeg|heic)/,
        customUpload: {
            url: AppConfig.MeeyMediaConfig.Api + '/v1/admin/media',
            headers: [{ key: 'X-Client-Source', value: AppConfig.MeeyProjectConfig.Source }],
            authorization: { key: AppConfig.MeeyMediaConfig.UserName, value: AppConfig.MeeyMediaConfig.Password },
            data: [{ key: 'images', value: 'data' }, { key: 'createdBy[data][_id]', value: 'createdById' }, { key: 'createdBy[data][fullname]', value: 'createdByName' }, { key: 'createdBy[source]', value: 'admin' }]
        }
    })
    Images: any[];

    @FileDecorator({
        max: 20,
        size: 10,
        totalSize: 200,
        multiple: true,
        duplicate: false,
        label: 'Tài liệu',
        customUpload: {
            url: AppConfig.MeeyMediaConfig.Api + '/v1/admin/media',
            headers: [{ key: 'X-Client-Source', value: AppConfig.MeeyProjectConfig.Source }],
            authorization: { key: AppConfig.MeeyMediaConfig.UserName, value: AppConfig.MeeyMediaConfig.Password },
            data: [{ key: 'files', value: 'data' }, { key: 'createdBy[data][_id]', value: 'createdById' }, { key: 'createdBy[data][fullname]', value: 'createdByName' }, { key: 'createdBy[source]', value: 'admin' }]
        },
        regexTypes: /.(pdf|doc|docx|xls|xlsx|dwg|kmz)/,
        accept: 'application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/pdf,application/pdf,application/dwg,application/vnd.google-earth.kmz,.kmz',
        description: 'Định dạng: pdf, doc, docx, xls, xlsx, dwg, kmz...',
    })
    Files: any[];

    @NumberDecorator({ label: 'Tổng diện tích khu đất (m2)', decimals: 2, type: NumberType.Text, max: 999999999999999 })
    TotalAcreage: number;

    @NumberDecorator({ label: 'Tổng số căn hộ', type: NumberType.Text, max: 999 })
    TotalApartment: number;

    @NumberDecorator({ label: 'Số tòa', type: NumberType.Text, max: 999 })
    TotalBuilding: number;

    @NumberDecorator({ label: 'Diện tích xây dựng (m2)', decimals: 2, type: NumberType.Text, max: 999999999999999 })
    ConstructAcreage: number;

    @NumberDecorator({ label: 'Chi tiết căn hộ', type: NumberType.Text, max: 999999999999999 })
    ApartmentNumberDetails: string;

    @NumberDecorator({ label: 'Số tầng nổi', decimals: 1, step: 0.5, type: NumberType.Text, max: 999 })
    TotalfloorFloating: number;

    @NumberDecorator({ label: 'Mật độ xây dựng', decimals: 2, type: NumberType.Text, max: 999 })
    BuildingDensity: number;

    @NumberDecorator({ label: 'Số tầng hầm', type: NumberType.Text, max: 9999999999 })
    TotalBasements: number;

    @NumberDecorator({ label: 'Tổng vốn đầu tư', type: NumberType.Text, max: 999999999999999 })
    TotalInvestment: number;

    @NumberDecorator({ label: 'Tổng diện tích đất xây dựng nhà ở thương mại (ha)', decimals: 2, type: NumberType.Text, max: 999999999999999 })
    TotalAcreageCommerce: number;

    @NumberDecorator({ label: 'Đất Chung cư, hỗn hợp chung cư (ha)', decimals: 2, type: NumberType.Text, max: 999999999999999 })
    MixedApartment: number;

    @NumberDecorator({ label: 'Đất thấp tầng (ha)', decimals: 2, type: NumberType.Text, max: 999999999999999 })
    LowRiseBuilding: number;

    @NumberDecorator({ label: 'Tổng diện tích sàn (m2)', decimals: 2, type: NumberType.Text, max: 999999999999999 })
    TotalAcreageZoning: number;

    @NumberDecorator({ label: 'Tổng số căn nhà ở (căn)', type: NumberType.Text, max: 999 })
    TotalApartmentZoning: number;

    @NumberDecorator({ label: 'Tổng diện tích sàn dịch vụ, thương mại (m2)', decimals: 2, type: NumberType.Text, max: 999999999999999 })
    TotalAcreageCommerceApartment: number;

    @NumberDecorator({ label: 'Tổng diện tích sàn nhà ở (m2)', decimals: 2, type: NumberType.Text, max: 999999999999999 })
    TotalAcreageApartment: number;

    @NumberDecorator({ label: 'Tổng số căn nhà ở (căn)', type: NumberType.Text, max: 999 })
    TotalApartmentApartment: number;

    @NumberDecorator({ label: 'Tổng diện tích sàn (m2)', decimals: 2, type: NumberType.Text, max: 999999999999999 })
    totalAcreageRiseBuilding: number;

    @NumberDecorator({ label: 'Tổng số căn (căn)', type: NumberType.Text, max: 999 })
    TotalApartmentRiseBuilding: number;

    @StringDecorator({ label: '360 View', max: 100, type: StringType.Link })
    View360: string;

    @StringDecorator({ label: 'VR', max: 100, type: StringType.Link })
    VR: string;

    @StringDecorator({ placeholder: "Tìm kiếm theo tên ảnh...", type: StringType.Text, max: 50 })
    SearchImage: string;

    @StringDecorator({ placeholder: "Tìm kiếm theo tên video...", type: StringType.Text, max: 50 })
    SearchVideo: string;

    @StringDecorator({ label: "Tên tài liệu", required: true, type: StringType.Text, max: 100, customValidators: [{ pattern: new RegExp(/^[^*|:<>\\/?"']*$/), message: 'Không được nhập ký tự đặc biệt' }] })
    TitleFile: string;

    @DropDownDecorator({
        label: 'Trạng thái',
        required: true, lookup: LookupData.ReferenceItems([
            { label: 'Không Livestream', value: false },
            { label: 'Đang Livestream', value: true }
        ])
    })
    IsLive: boolean;

    Type: string;
}

@TableDecorator({ title: 'Chủ đầu tư liên quan' })
export class MPOProjectInvestorRelatedEntity extends BaseEntity {

    @DropDownDecorator({ label: 'Chủ đầu tư', placeholder: 'Chọn chủ đầu tư', required: true, lookup: { url: '/MPOProject/LookupInvestor', loadType: DropdownLoadType.Ajax } })
    InvestorId: string;

    @StringDecorator({ label: 'Tên chủ đầu tư', required: true })
    Name: string;

    @StringDecorator({ label: 'Giới thiệu', placeholder: 'Giới thiệu về chủ đầu tư', required: true, type: StringType.MultiText, max: 10000 })
    Description: string;

    @ImageDecorator({
        size: 10,
        label: 'Logo',
        customUpload: {
            url: AppConfig.MeeyMediaConfig.Api + '/v1/admin/media',
            headers: [{ key: 'X-Client-Source', value: AppConfig.MeeyProjectConfig.Source }],
            authorization: { key: AppConfig.MeeyMediaConfig.UserName, value: AppConfig.MeeyMediaConfig.Password },
            data: [{ key: 'images', value: 'data' }, { key: 'createdBy[data][_id]', value: 'createdById' }, { key: 'createdBy[data][fullname]', value: 'createdByName' }, { key: 'createdBy[source]', value: 'admin' }]
        }
    })
    Logo: any;

    AffiliateUnit: MPOProjectInvestorAffiliateUnitlEntity[];
}

@TableDecorator()
export class MPOProjectInvestorAffiliateUnitlEntity extends BaseEntity {
    @DropDownDecorator({ label: 'Loại đơn vị', required: true, lookup: { url: '/mpoprojectInvestor/LookupUnit', loadType: DropdownLoadType.Ajax, propertyValue: '_id', propertyDisplay: ['name'] } })
    Unit: string;

    @DropDownDecorator({
        label: 'Tên đơn vị liên quan', required: true, lookup: {
            url: '/mpoprojectInvestor/LookupRelatedUnit', loadType: DropdownLoadType.All, propertyValue: '_id', propertyDisplay: ['name', 'shortName'],
            dependId: [
                {
                    Property: 'Unit',
                    PropertyOption: 'type',
                    Url: '/mpoprojectInvestor/LookupRelatedUnit',
                }
            ]
        }
    })
    Name: string;

    @StringDecorator({ type: StringType.Text })
    RelatedType: string;

    @StringDecorator({ label: 'Giới thiệu', type: StringType.MultiText, max: 2000 })
    Description: string;

    @ImageDecorator({
        size: 10,
        label: 'Logo',
        customUpload: {
            url: AppConfig.MeeyMediaConfig.Api + '/v1/admin/media',
            headers: [{ key: 'X-Client-Source', value: AppConfig.MeeyProjectConfig.Source }],
            authorization: { key: AppConfig.MeeyMediaConfig.UserName, value: AppConfig.MeeyMediaConfig.Password },
            data: [{ key: 'images', value: 'data' }, { key: 'createdBy[data][_id]', value: 'createdById' }, { key: 'createdBy[data][fullname]', value: 'createdByName' }, { key: 'createdBy[source]', value: 'admin' }]
        }
    })
    Logo: any;
}

@TableDecorator()
export class MPOProjectInvestorUnitEntity extends BaseEntity {

    @DropDownDecorator({ label: 'Loại đơn vị', required: true, lookup: { url: '/mpoprojectInvestor/LookupUnitNotBank', loadType: DropdownLoadType.Ajax, propertyValue: '_id', propertyDisplay: ['name'] } })
    Unit: string;

    @StringDecorator({ label: 'Loại đơn vị', placeholder: 'Nhập loại đơn vị. Vd: Đơn vị thi công', required: true, max: 200 })
    UnitName: string;

    @StringDecorator({ label: 'Đơn vị liên quan', placeholder: 'Nhập tên đơn vị. Vd: Công ty Cotecon', required: true, max: 200 })
    Name: string;

    @StringDecorator({ label: 'Mô tả', placeholder: 'Nhập mô tả', type: StringType.MultiText, max: 500 })
    Description: string;

    @ImageDecorator({
        size: 10,
        label: 'Logo',
        customUpload: {
            url: AppConfig.MeeyMediaConfig.Api + '/v1/admin/media',
            headers: [{ key: 'X-Client-Source', value: AppConfig.MeeyProjectConfig.Source }],
            authorization: { key: AppConfig.MeeyMediaConfig.UserName, value: AppConfig.MeeyMediaConfig.Password },
            data: [{ key: 'images', value: 'data' }, { key: 'createdBy[data][_id]', value: 'createdById' }, { key: 'createdBy[data][fullname]', value: 'createdByName' }, { key: 'createdBy[source]', value: 'admin' }]
        }
    })
    Logo: any;

    @StringDecorator({ label: 'Từ khóa', placeholder: 'Nhập tên đơn vị để tìm kiếm', max: 200 })
    NameSearch: string;

    @StringDecorator({ label: 'Loại đơn vị' })
    RelatedUnitType: string;
    
    @DateTimeDecorator({ allowSearch: true, label: 'Ngày tạo', type: DateTimeType.DateTime })
    CreatedAt?: Date;
    
    @DropDownDecorator({ allowSearch: true, label: 'Chọn người tạo', lookup: LookupData.Reference(UserEntity, ['Id', 'FullName']) })
    CreatedBySearch: string;

    @BooleanDecorator({ label: 'Kích hoạt', type: BooleanType.Toggle })
    Active: boolean;

    @DropDownDecorator({ allowSearch: true, label: "Kích hoạt", placeholder: 'Chọn trạng thái kích hoạt', lookup: { items: ConstantHelper.UNIT_TYPE_ACTIVE } })
    ActiveSearch?: boolean;

    @StringDecorator({ label: 'Loại đơn vị' })
    RelatedUnitTypeName: string;
}

@TableDecorator()
export class MPOProjectLocationEntity {
    // @StringDecorator({
    //     label: 'Mô tả', placeholder: 'Nhập hoặc dán thông tin.', max: 10000, type: StringType.Html,
    //     htmlToolbar: 'uploadFile | uploadImage | undo redo | fontsizeselect | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent',
    //     htmlMenubar: false,
    // })
    // LocationDescription: string;

    @StringDecorator({
        label: 'Mô tả', placeholder: 'Nhập hoặc dán thông tin.', max: 10000, type: StringType.Html,
        htmlToolbar: 'uploadFile | uploadImage | undo redo | fontsizeselect | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent',
        htmlMenubar: false,
    })
    TrafficLineDescription: string;

    @ImageDecorator({
        size: 2,
        max: 1000,
        totalSize: 100,
        multiple: true,
        duplicate: false,
        label: 'Hình ảnh',
        accept: 'image/jpg,image/jpeg,image/png,.heic',
        regexTypes: /.(png|jpg|jpeg|heic)/,
        customUpload: {
            url: AppConfig.MeeyMediaConfig.Api + '/v1/admin/media',
            headers: [{ key: 'X-Client-Source', value: AppConfig.MeeyProjectConfig.Source }],
            authorization: { key: AppConfig.MeeyMediaConfig.UserName, value: AppConfig.MeeyMediaConfig.Password },
            data: [{ key: 'images', value: 'data' }, { key: 'createdBy[data][_id]', value: 'createdById' }, { key: 'createdBy[data][fullname]', value: 'createdByName' }, { key: 'createdBy[source]', value: 'admin' }]
        }
    })
    Images: any[];
}

@TableDecorator()
export class MPOProjectUtilitiesEntity {
    @StringDecorator({ label: 'Tiện ích', placeholder: 'Tiện ích', max: 1000, type: StringType.Tag, maxTags: 100, delimiters: ';', titleTags: 'Tiện ích' })
    BasicUtilities: string;

    @StringDecorator({
        label: 'Mô tả', placeholder: 'Nhập hoặc dán thông tin.', max: 10000, type: StringType.Html,
        htmlToolbar: 'uploadFile | uploadImage | undo redo | fontsizeselect | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent',
        htmlMenubar: false,
    })
    BasicDescription: string;

    @ImageDecorator({
        size: 2,
        max: 1000,
        totalSize: 100,
        multiple: true,
        duplicate: false,
        label: 'Hình ảnh',
        accept: 'image/jpg,image/jpeg,image/png,.heic',
        regexTypes: /.(png|jpg|jpeg|heic)/,
        customUpload: {
            url: AppConfig.MeeyMediaConfig.Api + '/v1/admin/media',
            headers: [{ key: 'X-Client-Source', value: AppConfig.MeeyProjectConfig.Source }],
            authorization: { key: AppConfig.MeeyMediaConfig.UserName, value: AppConfig.MeeyMediaConfig.Password },
            data: [{ key: 'images', value: 'data' }, { key: 'createdBy[data][_id]', value: 'createdById' }, { key: 'createdBy[data][fullname]', value: 'createdByName' }, { key: 'createdBy[source]', value: 'admin' }]
        }
    })
    BasicImages: any[];

    @StringDecorator({ label: 'Tiện ích', placeholder: 'Tiện ích', max: 1000, type: StringType.Tag, maxTags: 100, delimiters: ';', titleTags: 'Tiện ích' })
    OutstandingUtilities: string;

    @StringDecorator({
        label: 'Mô tả', placeholder: 'Nhập hoặc dán thông tin.', max: 10000, type: StringType.Html,
        htmlToolbar: 'uploadFile | uploadImage | undo redo | fontsizeselect | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent',
        htmlMenubar: false,
    })
    OutstandingDescription: string;

    @ImageDecorator({
        size: 2,
        max: 1000,
        totalSize: 100,
        multiple: true,
        duplicate: false,
        label: 'Hình ảnh',
        accept: 'image/jpg,image/jpeg,image/png,.heic',
        regexTypes: /.(png|jpg|jpeg|heic)/,
        customUpload: {
            url: AppConfig.MeeyMediaConfig.Api + '/v1/admin/media',
            headers: [{ key: 'X-Client-Source', value: AppConfig.MeeyProjectConfig.Source }],
            authorization: { key: AppConfig.MeeyMediaConfig.UserName, value: AppConfig.MeeyMediaConfig.Password },
            data: [{ key: 'images', value: 'data' }, { key: 'createdBy[data][_id]', value: 'createdById' }, { key: 'createdBy[data][fullname]', value: 'createdByName' }, { key: 'createdBy[source]', value: 'admin' }]
        }
    })
    OutstandingImages: any[];
}

@TableDecorator()
export class MPOProjectJuridicalEntity {
    @StringDecorator({
        label: 'Mô tả', placeholder: 'Nhập hoặc dán thông tin.', max: 1000000, type: StringType.Html,
        htmlToolbar: 'uploadFile | uploadImage | undo redo | fontsizeselect | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent',
        htmlMenubar: false, required: true,
    })
    Description: string;

    @FileDecorator({
        max: 50,
        size: 10,
        totalSize: 500,
        multiple: true,
        duplicate: false,
        label: 'Chọn hoặc kéo thả file',
        customUpload: {
            url: AppConfig.MeeyMediaConfig.Api + '/v1/admin/media',
            headers: [{ key: 'X-Client-Source', value: AppConfig.MeeyProjectConfig.Source }],
            authorization: { key: AppConfig.MeeyMediaConfig.UserName, value: AppConfig.MeeyMediaConfig.Password },
            data: [{ key: 'files', value: 'data' }, { key: 'createdBy[data][_id]', value: 'createdById' }, { key: 'createdBy[data][fullname]', value: 'createdByName' }, { key: 'createdBy[source]', value: 'admin' }]
        },
        regexTypes: /.(pdf|doc|docx|xls|xlsx|dwg|kmz)/,
        accept: 'application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/pdf,application/pdf,application/dwg,application/vnd.google-earth.kmz,.kmz',
        description: 'Định dạng: pdf, doc, docx, xls, xlsx, dwg, kmz...',
    })
    Files: any[];

    @ImageDecorator({
        size: 10,
        max: 50,
        totalSize: 500,
        multiple: true,
        duplicate: false,
        label: 'Chọn hoặc kéo thả ảnh',
        accept: 'image/jpg,image/jpeg,image/png,.heic',
        regexTypes: /.(png|jpg|jpeg|heic)/,
        customUpload: {
            url: AppConfig.MeeyMediaConfig.Api + '/v1/admin/media',
            headers: [{ key: 'X-Client-Source', value: AppConfig.MeeyProjectConfig.Source }],
            authorization: { key: AppConfig.MeeyMediaConfig.UserName, value: AppConfig.MeeyMediaConfig.Password },
            data: [{ key: 'images', value: 'data' }, { key: 'createdBy[data][_id]', value: 'createdById' }, { key: 'createdBy[data][fullname]', value: 'createdByName' }, { key: 'createdBy[source]', value: 'admin' }]
        }
    })
    ImageFiles: any[];

    Details: MPOProjectJuridicalDetailEntity[];
}

@TableDecorator()
export class MPOProjectJuridicalDetailEntity {
    @StringDecorator({ label: 'Tài liệu', type: StringType.Text, })
    Name: string;

    @StringDecorator({ type: StringType.Text, })
    Code: string;

    @StringDecorator({ type: StringType.Text, })
    Url: any;

    UrlS3Key: any;

    @DropDownDecorator({ label: 'Loại tài liệu pháp lý', required: true, lookup: LookupData.ReferenceReverseEnum(MPOJuridicalType) })
    Type: string;

    @StringDecorator({ label: 'Mô tả', max: 2000, type: StringType.MultiText, })
    Description: string;

    TypeFile: string;
}

@TableDecorator()
export class MPOProjectSalePolicyEntity {
    @StringDecorator({
        label: 'Mô tả', placeholder: 'Nhập hoặc dán thông tin.', max: 10000, type: StringType.Html,
        htmlToolbar: 'uploadFile | uploadImage | undo redo | fontsizeselect | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent',
        htmlMenubar: false,
    })
    Description: string;

    @ImageDecorator({
        size: 2,
        max: 1000,
        totalSize: 100,
        multiple: true,
        duplicate: false,
        label: 'Hình ảnh',
        accept: 'image/jpg,image/jpeg,image/png,.heic',
        regexTypes: /.(png|jpg|jpeg|heic)/,
        customUpload: {
            url: AppConfig.MeeyMediaConfig.Api + '/v1/admin/media',
            headers: [{ key: 'X-Client-Source', value: AppConfig.MeeyProjectConfig.Source }],
            authorization: { key: AppConfig.MeeyMediaConfig.UserName, value: AppConfig.MeeyMediaConfig.Password },
            data: [{ key: 'images', value: 'data' }, { key: 'createdBy[data][_id]', value: 'createdById' }, { key: 'createdBy[data][fullname]', value: 'createdByName' }, { key: 'createdBy[source]', value: 'admin' }]
        }
    })
    Images: any[];

    @FileDecorator({
        max: 1000,
        size: 20,
        totalSize: 200,
        multiple: true,
        duplicate: false,
        label: 'Tài liệu',
        customUpload: {
            url: AppConfig.MeeyMediaConfig.Api + '/v1/admin/media',
            headers: [{ key: 'X-Client-Source', value: AppConfig.MeeyProjectConfig.Source }],
            authorization: { key: AppConfig.MeeyMediaConfig.UserName, value: AppConfig.MeeyMediaConfig.Password },
            data: [{ key: 'files', value: 'data' }, { key: 'createdBy[data][_id]', value: 'createdById' }, { key: 'createdBy[data][fullname]', value: 'createdByName' }, { key: 'createdBy[source]', value: 'admin' }]
        },
        regexTypes: /.(pdf|doc|docx|xls|xlsx|dwg|kmz)/,
        accept: 'application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/pdf,application/pdf,application/dwg,application/vnd.google-earth.kmz,.kmz',
        description: 'Định dạng: pdf, doc, docx, xls, xlsx, dwg, kmz...',
    })
    Files: any[];
}

@TableDecorator()
export class MPOProjectConstructionProgressEntity {
    @StringDecorator({
        label: 'Mô tả', placeholder: 'Nhập hoặc dán thông tin.', max: 10000, type: StringType.Html,
        htmlToolbar: 'uploadFile | uploadImage | undo redo | fontsizeselect | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent',
        htmlMenubar: false,
    })
    Description: string;

    @ImageDecorator({
        size: 2,
        max: 1000,
        totalSize: 100,
        multiple: true,
        duplicate: false,
        label: 'Hình ảnh',
        accept: 'image/jpg,image/jpeg,image/png,.heic',
        regexTypes: /.(png|jpg|jpeg|heic)/,
        customUpload: {
            url: AppConfig.MeeyMediaConfig.Api + '/v1/admin/media',
            headers: [{ key: 'X-Client-Source', value: AppConfig.MeeyProjectConfig.Source }],
            authorization: { key: AppConfig.MeeyMediaConfig.UserName, value: AppConfig.MeeyMediaConfig.Password },
            data: [{ key: 'images', value: 'data' }, { key: 'createdBy[data][_id]', value: 'createdById' }, { key: 'createdBy[data][fullname]', value: 'createdByName' }, { key: 'createdBy[source]', value: 'admin' }]
        }
    })
    Images: any[];
}

@TableDecorator()
export class MPOProjectPaymentProgressEntity {
    @StringDecorator({
        label: 'Tiến độ thanh toán', placeholder: 'Nhập hoặc dán thông tin.', max: 10000, type: StringType.Html,
        htmlToolbar: 'uploadFile | uploadImage | undo redo | fontsizeselect | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent',
        htmlMenubar: false,
    })
    PaymentProgress: string;

    @ImageDecorator({
        size: 2,
        max: 1000,
        totalSize: 100,
        multiple: true,
        duplicate: false,
        label: 'Hình ảnh',
        accept: 'image/jpg,image/jpeg,image/png,.heic',
        regexTypes: /.(png|jpg|jpeg|heic)/,
        customUpload: {
            url: AppConfig.MeeyMediaConfig.Api + '/v1/admin/media',
            headers: [{ key: 'X-Client-Source', value: AppConfig.MeeyProjectConfig.Source }],
            authorization: { key: AppConfig.MeeyMediaConfig.UserName, value: AppConfig.MeeyMediaConfig.Password },
            data: [{ key: 'images', value: 'data' }, { key: 'createdBy[data][_id]', value: 'createdById' }, { key: 'createdBy[data][fullname]', value: 'createdByName' }, { key: 'createdBy[source]', value: 'admin' }]
        }
    })
    Images: any[];
}

export class MPCheckArticleModel {
    IsExists : boolean
    HasArticle: boolean
    Name : string
}
