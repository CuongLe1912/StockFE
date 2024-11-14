import { BaseEntity } from "../base.entity";
import { LookupData } from "../../data/lookup.data";
import { MSDemandType } from "./enums/ms.demand.type";
import { MSFurnitureType } from "./enums/ms.furniture.type";
import { MSPrioritizedType } from "./enums/ms.prioritized.type";
import { AppConfig } from "../../../../_core/helpers/app.config";
import { MSSeoReferenceType, MSTagType } from "./enums/ms.tag.type";
import { ConstantHelper } from "../../../../_core/helpers/constant.helper";
import { FileDecorator } from "../../../../_core/decorators/file.decorator";
import { TableDecorator } from "../../../../_core/decorators/table.decorator";
import { NumberDecorator } from "../../../../_core/decorators/number.decorator";
import { StringDecorator } from "../../../../_core/decorators/string.decorator";
import { BooleanDecorator } from "../../../../_core/decorators/boolean.decorator";
import { DropDownDecorator } from "../../../../_core/decorators/dropdown.decorator";
import { DateTimeDecorator } from "../../../../_core/decorators/datetime.decorator";
import { BooleanType, DateTimeType, NumberType, StringType } from "../../enums/data.type";

@TableDecorator({ title: 'Tags SEO' })
export class MSSeoEntity extends BaseEntity {
    @DropDownDecorator({ label: 'Loại Tag', required: true, autoSelect: true, lookup: LookupData.ReferenceItems(ConstantHelper.MS_TAG_TYPES) })
    Type: MSTagType;

    @StringDecorator({ label: 'Tag', placeholder: 'Tag', required: true, max: 100, type: StringType.Tag, delimiters: ';', })
    Name: string;

    @StringDecorator({ label: 'Tag', required: true, max: 100, type: StringType.Text, })
    TagName: string;

    @BooleanDecorator({ label: 'Ưu tiên' })
    Prioritized: boolean = false;

    @DropDownDecorator({ label: 'Nhu cầu', required: true, lookup: LookupData.ReferenceUrlWithCache('/MSSeoConfig/LookupReference/' + MSSeoReferenceType.NeedSell), })
    Demand: string;

    @DropDownDecorator({ label: 'Loại nhà đất', multiple: true, lookup: LookupData.ReferenceUrl('/MSSeoConfig/LookupReference/' + MSSeoReferenceType.TypeOfHouses, null, null, 'Demand'), })
    TypeOfHouse: string[];

    @DropDownDecorator({ label: 'Giá', multiple: true, lookup: LookupData.ReferenceUrl('/MSSeoConfig/LookupReference/' + MSSeoReferenceType.TotalPrice, null, null, 'Demand') })
    Price: string[];

    @DropDownDecorator({ label: 'Diện tích', multiple: true, lookup: LookupData.ReferenceUrl('/MSSeoConfig/LookupReference/' + MSSeoReferenceType.Area) })
    Area: string[];

    @DropDownDecorator({ label: 'Tỉnh/thành phố', multiple: true, lookup: LookupData.ReferenceUrlWithCache('/MSSeoConfig/LookupCity') })
    City: string[];

    @DropDownDecorator({ label: 'Quận/huyện', multiple: true, lookup: LookupData.ReferenceUrl('/MSSeoConfig/LookupDistrict', null, null, 'City', 'Group') })
    District: string[];

    @DropDownDecorator({ label: 'Phường/xã', multiple: true, lookup: LookupData.ReferenceUrl('/MSSeoConfig/LookupWard', null, null, 'District', 'Group') })
    Ward: string[];

    @DropDownDecorator({ label: 'Đường, phố', multiple: true, lookup: LookupData.ReferenceUrl('/MSSeoConfig/LookupStreet', null, null, 'District', 'Group') })
    Street: string[];

    @DropDownDecorator({ label: 'Giấy tờ pháp lý', multiple: true, lookup: LookupData.ReferenceUrlWithCache('/MSSeoConfig/LookupReference/' + MSSeoReferenceType.LegalPaper) })
    LegalPaper: string[];

    @DropDownDecorator({ label: 'Đường rộng', multiple: true, lookup: LookupData.ReferenceUrlWithCache('/MSSeoConfig/LookupReference/' + MSSeoReferenceType.WideRoads) })
    WideRoad: string[];

    @DropDownDecorator({ label: 'Hướng nhà/đất', multiple: true, lookup: LookupData.ReferenceUrl('/MSSeoConfig/LookupReference/' + MSSeoReferenceType.Directions, null, null, null, 'Group', null, 3600) })
    Direction: string[];

    @DropDownDecorator({ label: 'Mặt tiền', multiple: true, lookup: LookupData.ReferenceUrlWithCache('/MSSeoConfig/LookupReference/' + MSSeoReferenceType.Facade) })
    Facade: string[];

    @DropDownDecorator({ label: 'Ưu điểm BĐS', multiple: true, lookup: LookupData.ReferenceUrl('/MSSeoConfig/LookupReference/' + MSSeoReferenceType.Advantages, null, null, null, 'Group', null, 3600) })
    Advantage: string[];

    @DropDownDecorator({ label: 'Số tầng', multiple: true, lookup: LookupData.ReferenceUrlWithCache('/MSSeoConfig/LookupReference/' + MSSeoReferenceType.Floor) })
    Floor: string[];

    @DropDownDecorator({ label: 'Số phòng ngủ', multiple: true, lookup: LookupData.ReferenceUrlWithCache('/MSSeoConfig/LookupReference/' + MSSeoReferenceType.Bedroom) })
    Bedroom: string[];

    @DropDownDecorator({ label: 'Loại hình BĐS', multiple: true, lookup: LookupData.ReferenceUrl('/MSSeoConfig/LookupReference/' + MSSeoReferenceType.TypeOfRealEstate, null, null, 'Demand') })
    TypeOfRealEstate: string[];

    @DropDownDecorator({ label: 'Nội thất, thiết bị', lookup: LookupData.ReferenceItems(ConstantHelper.MS_TAG_FURNITURE_TYPES) })
    Furniture: MSFurnitureType;

    @DropDownDecorator({ label: 'Tiện ích', multiple: true, lookup: LookupData.ReferenceUrl('/MSSeoConfig/LookupReference/' + MSSeoReferenceType.Utilities, null, null, 'Demand') })
    Utility: string[];

    @StringDecorator({ label: 'Title Tag', max: 120, })
    Title: string;

    @StringDecorator({ label: 'Meta Title', max: 300, })
    MetaTitle: string;

    @StringDecorator({ label: 'Meta Keywords', max: 300, })
    MetaKeyword: string;

    @StringDecorator({ label: 'Meta Description', max: 300, })
    MetaDescription: string;

    @StringDecorator({ label: 'Url Tag', max: 120, customValidators: [{ pattern: /^([a-zA-Z0-9-]+)$/, message: 'Không được nhập ký tự đặc biệt' }] })
    Url: string;

    @StringDecorator({ label: 'Body Content', type: StringType.Html, max: 500000 })
    Content: string;

    @BooleanDecorator({ label: 'Template', type: BooleanType.RadioButton, lookup: LookupData.ReferenceUrl('/MSSeo/LookupTemplate', ['Name'], 'Content', ) })
    Template: string;

    @NumberDecorator({ label: 'Tổng tin', type: NumberType.Text })
    Total: number;

    @DropDownDecorator({ label: 'Loại Tag', multiple: true, lookup: LookupData.ReferenceItems(ConstantHelper.MS_TAG_TYPES) })
    FilerType: MSTagType[];

    @DropDownDecorator({ label: 'Ưu tiên', lookup: LookupData.ReferenceItems(ConstantHelper.MS_TAG_PRIORITY_TYPES) })
    FilterPrioritized: MSPrioritizedType;

    @DropDownDecorator({ label: 'Nhu cầu', lookup: LookupData.ReferenceItems(ConstantHelper.MS_TAG_DEMAND_TYPES) })
    FilterDemand: MSDemandType;

    @DateTimeDecorator({ label: 'Ngày cập nhật', type: DateTimeType.DateRange })
    FilterUpdateDate: Date;

    @FileDecorator({ label: 'Import Manual', required: true, url: 'MSSeo/MSUpload?type=2', accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', description: 'Định dạng: xlsx' })
    FileMaunal: string;

    @FileDecorator({
        required: true,
        label: 'Import Auto',
        description: 'Định dạng: xlsx',
        customUpload: {
            data: [{ key: 'file', value: 'data' }],
            url: AppConfig.MeeySeoConfig.Api + '/v4/admin/tag-import/validate',
            authorization: { key: AppConfig.MeeySeoConfig.UserName, value: AppConfig.MeeySeoConfig.Password },
        },
        accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    })
    FileAuto: string;

    @NumberDecorator({ label: 'Từ', required: true, type: NumberType.Numberic, min: 1, maxDepend: 'ExportTo' })
    ExportFrom: number;

    @NumberDecorator({ label: 'Đến', required: true, type: NumberType.Numberic, min: 2, minDepend: 'ExportFrom' })
    ExportTo: number;

    TagId: string;
    TagType: string;
    AdminUserId: number;
    Location: MSLocationEntity[];
}

@TableDecorator()
export class MSLocationEntity {
    @StringDecorator()
    city?: string;

    @StringDecorator()
    district?: string;

    @StringDecorator()
    ward?: string;

    @StringDecorator()
    street?: string;

    @StringDecorator()
    cityName?: string;

    @StringDecorator()
    districtName?: string;

    @StringDecorator()
    wardName?: string;

    @StringDecorator()
    streetName?: string;
}

@TableDecorator()
export class MSConfirmImportEntity {
    @NumberDecorator()
    index?: number;

    @StringDecorator()
    name?: string;

    @StringDecorator()
    url?: string;

    @BooleanDecorator()
    hasError?: boolean;

    @StringDecorator()
    description?: string;

    @StringDecorator()
    propertyString?: string;

    @StringDecorator()
    content?: string;
}