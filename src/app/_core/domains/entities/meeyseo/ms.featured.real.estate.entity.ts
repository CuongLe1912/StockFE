import { BaseEntity } from "../base.entity";
import { OptionItem } from "../../data/option.item";
import { LookupData } from "../../data/lookup.data";
import { MSSeoReferenceType } from "./enums/ms.tag.type";
import { StructureType } from "./enums/ms.structure.type";
import { MSFurnitureType } from "./enums/ms.furniture.type";
import { AppConfig } from "../../../../_core/helpers/app.config";
import { ConstantHelper } from "../../../../_core/helpers/constant.helper";
import { FileDecorator } from "../../../../_core/decorators/file.decorator";
import { TableDecorator } from "../../../../_core/decorators/table.decorator";
import { StringDecorator } from "../../../../_core/decorators/string.decorator";
import { NumberDecorator } from "../../../../_core/decorators/number.decorator";
import { BooleanDecorator } from "../../../../_core/decorators/boolean.decorator";
import { DropDownDecorator } from "../../../../_core/decorators/dropdown.decorator";
import { DateTimeDecorator } from "../../../../_core/decorators/datetime.decorator";
import { BooleanType, DateTimeType, DropdownLoadType, NumberType, StringType } from "../../enums/data.type";

@TableDecorator({ title: 'Featured Real Estate' })
export class MSStructureEntity extends BaseEntity {
    @BooleanDecorator({ label: 'Cấu trúc', required: true, lookup: LookupData.ReferenceItems(ConstantHelper.MS_STRUCTURE_TYPES), type: BooleanType.Checkbox })
    Structure: StructureType[] = [];

    @BooleanDecorator({ label: 'Chi tiết tin' })
    ApplyDetail: boolean = false;

    @NumberDecorator({ label: 'STT', required: true, min: 1, max: 99, type: NumberType.Numberic })
    Priority: number;

    StructureId: string;
    HavingProperty: boolean;
}

@TableDecorator()
export class MSPropertiesEntity extends BaseEntity {
    @DropDownDecorator({ label: 'Nhu cầu', required: true, lookup: LookupData.ReferenceUrlWithCache('/MSSeoConfig/LookupReference/' + MSSeoReferenceType.NeedSell), })
    Need: string;

    @DropDownDecorator({ label: 'Loại nhà đất', required: true, multiple: true, lookup: LookupData.ReferenceUrl('/MSSeoConfig/LookupReference/' + MSSeoReferenceType.TypeOfHouses, null, null, 'Need'), })
    TypeOfHouse: string[];

    @DropDownDecorator({ label: 'Loại hình BĐS', required: true, multiple: true, lookup: LookupData.ReferenceUrl('/MSSeoConfig/LookupReference/' + MSSeoReferenceType.TypeOfRealEstate, null, null, 'Need') })
    TypeOfRealEstate: string[];

    @DropDownDecorator({
        label: 'Dự án', required: true, multiple: true, max: 3, lookup: {
            url: '/MSSeoConfig/LookupProjectByDistrict', loadType: DropdownLoadType.Ajax,
            dependId: [
                { Property: 'City', Url: '/MSSeoConfig/LookupProjectByCity' },
                { Property: 'District', Url: '/MSSeoConfig/LookupProjectByDistrict' }
            ]
        }
    })
    Project: string[];

    @DropDownDecorator({ label: 'Đường/phố', required: true, multiple: true, lookup: LookupData.ReferenceUrl('/MSSeoConfig/LookupStreet', null, null, 'District', 'Group') })
    Street: string[];

    @DropDownDecorator({ label: 'Phường/xã', required: true, multiple: true, lookup: LookupData.ReferenceUrl('/MSSeoConfig/LookupWard', null, null, 'District', 'Group') })
    Ward: string[];

    @DropDownDecorator({ label: 'Quận/huyện', required: true, multiple: true, lookup: LookupData.ReferenceUrl('/MSSeoConfig/LookupDistrict', null, null, 'City', 'Group') })
    District: string[];

    @DropDownDecorator({ label: 'Tỉnh/thành phố', required: true, multiple: true, lookup: LookupData.ReferenceUrlWithCache('/MSSeoConfig/LookupCity') })
    City: string[];

    @DropDownDecorator({ label: 'Giá', required: true, multiple: true, lookup: LookupData.ReferenceUrl('/MSSeoConfig/LookupReference/' + MSSeoReferenceType.TotalPrice, null, null, 'Need') })
    Price: string[];

    @DropDownDecorator({ label: 'Diện tích', required: true, multiple: true, lookup: LookupData.ReferenceUrl('/MSSeoConfig/LookupReference/' + MSSeoReferenceType.Area) })
    Area: string[];

    @DropDownDecorator({ label: 'Số tầng', required: true, multiple: true, lookup: LookupData.ReferenceUrlWithCache('/MSSeoConfig/LookupReference/' + MSSeoReferenceType.Floor) })
    Floor: string[];

    @DropDownDecorator({ label: 'Số phòng ngủ', required: true, multiple: true, lookup: LookupData.ReferenceUrlWithCache('/MSSeoConfig/LookupReference/' + MSSeoReferenceType.Bedroom) })
    Bedroom: string[];

    @DropDownDecorator({ label: 'Hướng nhà/đất', required: true, multiple: true, lookup: LookupData.ReferenceUrl('/MSSeoConfig/LookupReference/' + MSSeoReferenceType.Directions, null, null, null, 'Group', null, 3600) })
    Direction: string[];

    @DropDownDecorator({ label: 'Mặt tiền', required: true, multiple: true, lookup: LookupData.ReferenceUrlWithCache('/MSSeoConfig/LookupReference/' + MSSeoReferenceType.Facade) })
    Facade: string[];

    @DropDownDecorator({ label: 'Ưu điểm BĐS', required: true, multiple: true, lookup: LookupData.ReferenceUrl('/MSSeoConfig/LookupReference/' + MSSeoReferenceType.Advantages, null, null, null, 'Group', null, 3600) })
    Feature: string[];

    @DropDownDecorator({ label: 'Đường rộng', required: true, multiple: true, lookup: LookupData.ReferenceUrlWithCache('/MSSeoConfig/LookupReference/' + MSSeoReferenceType.WideRoads) })
    WideRoad: string[];

    @DropDownDecorator({ label: 'Giấy tờ pháp lý', required: true, multiple: true, lookup: LookupData.ReferenceUrlWithCache('/MSSeoConfig/LookupReference/' + MSSeoReferenceType.LegalPaper) })
    LegalPaper: string[];

    @DropDownDecorator({ label: 'Nội thất, thiết bị', required: true, lookup: LookupData.ReferenceItems(ConstantHelper.MS_TAG_FURNITURE_TYPES) })
    HavingFE: MSFurnitureType;

    @DropDownDecorator({ label: 'Tiện ích', required: true, multiple: true, lookup: LookupData.ReferenceUrl('/MSSeoConfig/LookupReference/' + MSSeoReferenceType.Utilities, null, null, 'Need') })
    Utility: string[];

    @NumberDecorator({ label: 'Giới hạn hiển thị', required: true, min: 1, max: 99999, type: NumberType.Numberic })
    Limit: number;

    @BooleanDecorator({ label: 'Trạng thái', type: BooleanType.Toggle })
    Status: boolean = true;

    @DropDownDecorator({ label: 'Trạng thái', lookup: LookupData.ReferenceStrings(['ON', 'OFF']) })
    FilterStatus: boolean = true;

    @DateTimeDecorator({ label: 'Ngày cập nhật', type: DateTimeType.DateRange })
    FilterUpdateDate: Date;

    @FileDecorator({
        required: true,
        label: 'Import Manual',
        description: 'Định dạng: xlsx',
        customUpload: {
            data: [{ key: 'file', value: 'data' }],
            url: AppConfig.MeeySeoConfig.Api + '/v4/admin/srp-import/validate',
            authorization: { key: AppConfig.MeeySeoConfig.UserName, value: AppConfig.MeeySeoConfig.Password },
        },
        accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    })
    FileAuto: string;

    Code: string;
    PropertyId: string;
    ProjectOptionItems: OptionItem[];
}

@TableDecorator()
export class MSTextLinkEntity extends BaseEntity {
    @StringDecorator({ label: 'Anchor text', required: true, max: 100, type: StringType.Text, })
    Text: string;

    @StringDecorator({ label: 'Url', required: true, max: 2000, type: StringType.Text })
    Url: string;

    @NumberDecorator({ label: 'Thứ tự ưu tiên', required: true, min: 1, max: 99999, type: NumberType.Numberic })
    Priority: number;

    @BooleanDecorator({ label: 'Trạng thái', type: BooleanType.Toggle })
    Status: boolean = true;

    LinkId: string;
}

@TableDecorator()
export class MSSyntaxEntity extends BaseEntity {
    @NumberDecorator({ label: 'Giới hạn hiển thị', required: true, min: 1, max: 20, type: NumberType.Numberic })
    Limit: number;

    @BooleanDecorator({ label: 'Trạng thái', type: BooleanType.Toggle })
    Status: boolean = true;

    @BooleanDecorator({ label: 'Chọn vị trí cần thêm', type: BooleanType.RadioButton })
    Position: string;

    SyntaxId: string;
}

@TableDecorator({ title: '' })
export class MSConfigTextLinkEntity extends BaseEntity {
    @NumberDecorator({ label: 'Số text link tối đa hiển thị trên trang: ', required: true, min: 0, max: 70, type: NumberType.Numberic })
    Value: number;
}
@TableDecorator({ title: 'Validate Import Text Link' })
export class MSHighlightValidateImportEntity extends BaseEntity {
    @FileDecorator({
        required: true,
        label: 'Import',
        description: 'Định dạng: xlsx',
        customUpload: {
            data: [
                { key: 'file', value: 'data' },
                { key: 'adminUserId', value: 'createdById' },
            ],
            url: AppConfig.MeeySeoConfig.Api + '/v4/admin/srp-import/validate',
            authorization: { key: AppConfig.MeeySeoConfig.UserName, value: AppConfig.MeeySeoConfig.Password },
        },
        accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    })
    FileManual: string;
}
