import { BaseEntity } from "../../base.entity";
import { RegexType } from "../../../enums/regex.type";
import { LookupData } from "../../../data/lookup.data";
import { OptionItem } from "../../../data/option.item";
import { MBProductType } from "../enums/mb.product.type";
import { MBStatusV2Type } from "../enums/mb.status.type";
import { MBBannerV2Type } from "../enums/mb.banner.type";
import { MBPositionType } from "../enums/mb.position.type";
import { AppConfig } from "../../../../helpers/app.config";
import { MBPlatformV2Type } from "../enums/mb.platform.type";
import { MSSeoReferenceType } from "../../meeyseo/enums/ms.tag.type";
import { ImageDecorator } from "../../../../decorators/image.decorator";
import { TableDecorator } from "../../../../decorators/table.decorator";
import { NumberDecorator } from "../../../../decorators/number.decorator";
import { StringDecorator } from "../../../../decorators/string.decorator";
import { DropDownDecorator } from "../../../../decorators/dropdown.decorator";
import { DateTimeDecorator } from "../../../../decorators/datetime.decorator";
import { DateTimeType, DropdownLoadType, NumberType, StringType } from "../../../enums/data.type";

@TableDecorator({ title: 'Banner' })
export class MBBannerV2Entity extends BaseEntity {
    @DropDownDecorator({ label: 'Loại nhà đất', multiple: true, lookup: LookupData.ReferenceUrl('/MSSeoConfig/LookupReference/' + MSSeoReferenceType.TypeOfHouses), })
    TypeOfHouse: string[];

    @StringDecorator({ label: 'Tên Banner', required: true, max: 200, customValidators: [{ pattern: RegexType.TextNoSpecialVietnamese, message: 'Không được nhập ký tự đặc biệt' }] })
    Name: string;

    @DropDownDecorator({
        label: 'Loại banner', required: true, lookup: LookupData.ReferenceItems([
            { label: 'Quảng cáo', value: MBBannerV2Type.Ads },
            { label: 'Hỗ trợ', value: MBBannerV2Type.Support },
        ])
    })
    Type: MBBannerV2Type;

    @StringDecorator({ label: 'Tên khách hàng', max: 200 })
    Customer: string;

    @DropDownDecorator({
        label: 'Sản phẩm', required: true, lookup: LookupData.ReferenceItems([
            { label: 'Meey Land', value: MBProductType.MeeyLand },
        ])
    })
    Product: MBProductType;

    @DropDownDecorator({ label: 'Dự án', multiple: true, max: 3, lookup: { url: '/MLArticleConfig/LookupProjectByCity', loadType: DropdownLoadType.Ajax } })
    ProjectIds: string[];

    @StringDecorator({ label: 'Link Điều Hướng', type: StringType.Link, max: 250 })
    Link: string;

    @DateTimeDecorator({ label: 'Ngày bắt đầu', required: true, type: DateTimeType.Date, minCurent: true, maxDepend: 'EndDate' })
    StartDate: Date;

    @DateTimeDecorator({ label: 'Ngày kết thúc', required: true, type: DateTimeType.Date, minCurent: true, minDepend: 'StartDate' })
    EndDate: Date;

    @DropDownDecorator({
        required: true, label: 'Trạng thái', allowClear: false, lookup: LookupData.ReferenceItems([
            { label: 'Đang hoạt động', value: MBStatusV2Type.Active, color: 'kt-badge kt-badge--inline kt-badge--primary' },
            { label: 'Không hoạt động', value: MBStatusV2Type.Down, color: 'kt-badge kt-badge--inline kt-badge--warning' },
        ])
    })
    Status: MBStatusV2Type;

    @DropDownDecorator({
        label: 'Vị trí', required: true, lookup: LookupData.ReferenceItems([
            { label: 'Trái', value: MBPositionType.Left },
            { label: 'Phải', value: MBPositionType.Right },
            { label: 'Giữa', value: MBPositionType.Center },
            { label: 'Giữa nội dung cột phải', value: MBPositionType.RightCenter },
        ])
    })
    Position: MBPositionType;

    @DropDownDecorator({
        label: 'Nền tảng hiển thị', required: true, lookup: LookupData.ReferenceItems([
            { label: 'Desktop', value: MBPlatformV2Type.Desktop },
            { label: 'WebMobile', value: MBPlatformV2Type.WebMobile },
            { label: 'App', value: MBPlatformV2Type.App },
        ])
    })
    Platform: MBPlatformV2Type;

    @ImageDecorator({
        size: 0.5,
        required: true,
        totalSize: 0.5,
        multiple: false,
        duplicate: false,
        label: 'Ảnh banner',
        customUpload: {
            url: AppConfig.MeeyMediaConfig.Api + '/v1/admin/media',
            headers: [{ key: 'X-Client-Source', value: AppConfig.MeeyLandConfig.Source }],
            authorization: { key: AppConfig.MeeyMediaConfig.UserName, value: AppConfig.MeeyMediaConfig.Password },
            data: [{ key: 'images', value: 'data' }, { key: 'createdBy[data][_id]', value: 'createdById' }, { key: 'createdBy[data][fullname]', value: 'createdByName' }, { key: 'createdBy[source]', value: 'admin' }]
        },
        accept: '.jpg,.jpeg,.png,.bmp,.gif,.webp',
        regexTypes: /.(jpg|jpeg|png|bmp|gif|webp)/,
        description: 'Định dạng: png, jpg, jpeg...',
    })
    Images: any;

    @DropDownDecorator({ label: 'Tỉnh/thành phố', multiple: true, lookup: LookupData.ReferenceUrlWithCache('/MSSeoConfig/LookupCity') })
    CityIds: string[];

    @DropDownDecorator({ label: 'Quận/huyện', multiple: true, lookup: LookupData.ReferenceUrl('/MSSeoConfig/LookupDistrict', null, null, 'CityIds', 'Group') })
    DistrictIds: string[];

    @DropDownDecorator({ label: 'Phường/xã', multiple: true, lookup: LookupData.ReferenceUrl('/MSSeoConfig/LookupWard', null, null, 'DistrictIds', 'Group') })
    WardIds: string[];

    @DropDownDecorator({ label: 'Đường, phố', multiple: true, lookup: LookupData.ReferenceUrl('/MSSeoConfig/LookupStreet', null, null, 'DistrictIds', 'Group') })
    StreetIds: string[];

    @NumberDecorator({ label: 'Thứ tự hiển thị', required: true, type: NumberType.Text })
    Order: number;

    @DropDownDecorator({
        label: 'Trang hiển thị', multiple: true, lookup: LookupData.ReferenceItems([
            { label: '1. Trang chủ', value: 1 },
            { label: '2. Mua bán', value: 2 },
            { label: '3. Cho thuê', value: 3 },
            { label: '4. Sang nhượng', value: 4 },
            { label: '5. Cần mua', value: 5 },
            { label: '6. Cần thuê', value: 6 },
            { label: '7. Chi tiết tin đăng', value: 7 },
            { label: '8. Đăng tin', value: 8 },
        ])
    })
    Page: number[];

    @DateTimeDecorator({ label: 'Ngày bắt đầu/kết thúc', type: DateTimeType.DateRange })
    DateTime: Date[];

    Projects: any[];
    Locations: any[];
    ProjectOptionItem: OptionItem[];
}