import { BaseEntity } from "../base.entity";
import { RegexType } from "../../enums/regex.type";
import { LookupData } from "../../data/lookup.data";
import { MBBannerType } from "./enums/mb.banner.type";
import { MBStatusType } from "./enums/mb.status.type";
import { MBSourceType } from "./enums/mb.source.type";
import { MBProductType } from "./enums/mb.product.type";
import { DropdownLoadType } from "../../enums/data.type";
import { MBPlatformType } from "./enums/mb.platform.type";
import { AppConfig } from "../../../../_core/helpers/app.config";
import { UtilityExHelper } from "../../../../_core/helpers/utility.helper";
import { ConstantHelper } from "../../../../_core/helpers/constant.helper";
import { DateTimeType, NumberType, StringType } from "../../enums/data.type";
import { TableDecorator } from "../../../../_core/decorators/table.decorator";
import { ImageDecorator } from "../../../../_core/decorators/image.decorator";
import { NumberDecorator } from "../../../../_core/decorators/number.decorator";
import { StringDecorator } from "../../../../_core/decorators/string.decorator";
import { DropDownDecorator } from "../../../../_core/decorators/dropdown.decorator";
import { DateTimeDecorator } from "../../../../_core/decorators/datetime.decorator";

@TableDecorator({ title: 'Banner' })
export class MBBannerEntity extends BaseEntity {
    @StringDecorator({
        label: 'Mã Banner', required: true, type: StringType.Text, max: 10, unique: { url: '/MBBanner/ExistsBanner', property: 'Code' }, customValidators: [{ pattern: RegexType.TextSimple, message: 'Không được nhập ký tự đặc biệt' }], generateFunction: () => {
            return UtilityExHelper.randomNumber(8)
        }
    })
    Code: string;

    @StringDecorator({ label: 'Tên Banner', required: true, max: 20, unique: { url: '/MBBanner/ExistsBanner', property: 'Name' }, customValidators: [{ pattern: RegexType.TextNoSpecialVietnamese, message: 'Không được nhập ký tự đặc biệt' }] })
    Name: string;

    @StringDecorator({ label: 'Mô tả', required: true, max: 100 })
    Description: string;

    @DropDownDecorator({ label: 'Khách hàng', required: true, lookup: { url: '/MCRMCustomer/LookupRootCustomer', loadType: DropdownLoadType.Ajax, propertyDisplay: ['Phone', 'Email', 'Name'] } })
    CustomerId: string;

    @DateTimeDecorator({ label: 'Thời gian treo', required: true, type: DateTimeType.DateRange, minCurent: true })
    DateRange: Date[];

    @DateTimeDecorator({ label: 'Từ', required: true, type: DateTimeType.DateTime, minCurent: true, maxDepend: 'EndDate' })
    StartDate: Date;

    @DateTimeDecorator({ label: 'Đến', type: DateTimeType.DateTime, minCurent: true, minDepend: 'StartDate' })
    EndDate: Date;

    @NumberDecorator({ label: 'Thời gian hiển thị (giây)', min: 3, max: 99999, required: true, type: NumberType.Text })
    DisplayTime: number;

    @DropDownDecorator({ label: 'Trạng thái', lookup: LookupData.ReferenceItems(ConstantHelper.MB_BANNER_STATUS_TYPES) })
    Status: MBStatusType;

    @DropDownDecorator({ label: 'Loại Banner', required: true, lookup: LookupData.ReferenceItems(ConstantHelper.MB_BANNER_BANNER_TYPES) })
    BannerType: MBBannerType;

    @DropDownDecorator({ label: 'Nguồn', required: true, lookup: LookupData.ReferenceItems(ConstantHelper.MB_BANNER_SOURCE_TYPES) })
    SourceType: MBSourceType;

    @DropDownDecorator({ label: 'Sản phẩm', required: true, multiple: true, lookup: LookupData.ReferenceItems(ConstantHelper.MB_BANNER_PRODUCT_TYPES) })
    Products: MBProductType;

    @DropDownDecorator({ label: 'Sản phẩm', required: true, lookup: LookupData.ReferenceItems(ConstantHelper.MB_BANNER_PRODUCT_TYPES) })
    FilterProduct: MBProductType;

    @DateTimeDecorator({ label: 'Thời gian treo', type: DateTimeType.DateRange })
    FilterDateRange: Date;

    @DropDownDecorator({ label: 'Người tạo', lookup: LookupData.ReferenceUrl('mbbanner/lookupcreatedby', ['CreatedBy'], 'CreatedBy') })
    FilterCreatedBy: Date;

    @DropDownDecorator({ label: 'Mã Banner', lookup: LookupData.ReferenceUrl('mbbanner/lookupcode', ['Code'], 'Code') })
    FilterCode: string;

    @DropDownDecorator({ label: 'Tên Banner', lookup: LookupData.ReferenceUrl('mbbanner/lookupname', ['Name'], 'Name') })
    FilterName: string;

    @NumberDecorator({ type: NumberType.Text })
    ZoneCount: number;

    Zones: MBBannerZoneEntity[];
}

@TableDecorator({})
export class MBBannerZoneEntity extends BaseEntity {
    @StringDecorator({ type: StringType.Text })
    Name: string;

    @StringDecorator({ label: 'Link Điều Hướng', type: StringType.Link, required: true, max: 250 })
    Link: string;

    @ImageDecorator({
        required: true,
        multiple: false,
        label: 'Ảnh Home',
        accept: 'image/jpg,image/png',
        description: 'Định dạng: jpg, png',
        customUpload: {
            needMove: true,
            url: AppConfig.MeeyMediaConfig.Api + '/v1/admin/media',
            headers: [{ key: 'X-Client-Source', value: AppConfig.MeeyLandConfig.Source }],
            authorization: { key: AppConfig.MeeyMediaConfig.UserName, value: AppConfig.MeeyMediaConfig.Password },
            data: [{ key: 'images', value: 'data' }, { key: 'createdBy[data][_id]', value: 'createdById' }, { key: 'createdBy[data][fullname]', value: 'createdByName' }, { key: 'createdBy[source]', value: 'admin' }]
        }
    })
    Image: string;

    @NumberDecorator({ type: NumberType.Numberic })
    BannerId?: number;

    @StringDecorator({ type: StringType.Text })
    ZoneClass?: string;

    @StringDecorator({ type: StringType.Text })
    Description: string;

    @DropDownDecorator({})
    Platform: MBPlatformType;

    Uri: string;
    Size?: number;
    Order?: number;
    Width?: number;
    Height?: number;
}

@TableDecorator({})
export class MBBannerUpdateStatusEntity extends BaseEntity {

    @DropDownDecorator({ label: 'Trạng thái', lookup: LookupData.ReferenceItems(ConstantHelper.MB_BANNER_STATUS_TYPES) })
    Status: MBStatusType;

    // @DateTimeDecorator({ label: 'Thời gian treo', required: true, type: DateTimeType.DateRange, minCurent: true })
    // DateRange?: Date[];

    @DateTimeDecorator({ label: 'Từ', required: true, type: DateTimeType.DateTime, minCurent: true, maxDepend: 'EndDate' })
    StartDate: Date;

    @DateTimeDecorator({ label: 'Đến', type: DateTimeType.DateTime, minCurent: true, minDepend: 'StartDate' })
    EndDate: Date;

    @NumberDecorator({ label: 'Thời gian hiển thị (giây)', max: 99999, required: true, type: NumberType.Text })
    DisplayTime?: number;
}