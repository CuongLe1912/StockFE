import { BaseEntity } from "../base.entity";
import { TextTransformType, NumberType, StringType } from "../../enums/data.type";
import { LookupData } from "../../data/lookup.data";
import { TableDecorator } from "../../../decorators/table.decorator";
import { StringDecorator } from "../../../decorators/string.decorator";
import { DropDownDecorator } from "../../../decorators/dropdown.decorator";
import { MOGroupServiceEntity } from "./groupservice.entity";
import { UseTimeType } from "./enums/usetime.type";
import { MOProviderEntity } from "./provider.entity";
import { UnitDurationType } from "./enums/unit.duration.type";
import { NumberDecorator } from "../../../../_core/decorators/number.decorator";
import { PriceConfigEntity } from "./price.config.entity";
import { CalculationUnitType } from "./enums/calculation.unit.type";
import { ConstantHelper } from "../../../../_core/helpers/constant.helper";
import { RegexType } from "../../enums/regex.type";

@TableDecorator()
export class MOServicesEntity extends BaseEntity {
    @DropDownDecorator({ allowSearch: true, label: "Nhà cung cấp", required: true, lookup: LookupData.Reference(MOProviderEntity) })
    ProviderId: number;

    @StringDecorator({ allowSearch: true, label: "Tên định danh", required: true, type: StringType.Text, max: 150 })
    Name: string;

    @StringDecorator({ label: "Tên hiển thị", required: true, type: StringType.Text, max: 150 })
    NameShow: string;

    @StringDecorator({ allowSearch: true, label: "Mã dịch vụ", required: true, type: StringType.Text, max: 150, customValidators: [{ pattern: RegexType.CodeService, message: 'Chỉ được viết liền gồm chữ và số' }], textTransform: TextTransformType.UpperCase })
    Code: string;

    @DropDownDecorator({ allowSearch: true, label: "Nhóm dịch vụ", required: true, lookup: LookupData.Reference(MOGroupServiceEntity, ['Name'], 'Id', 'ProviderId'), autoHide: true })
    ParentGroupId: number;

    @DropDownDecorator({ allowSearch: true, label: "", required: true, lookup: LookupData.ReferenceUrl('/mogroupservice/lookupParent', ['Name'], 'Id', 'ParentGroupId'), autoHide: true })
    GroupId: number;

    @DropDownDecorator({ allowSearch: true, label: "", multiple: true, required: true, lookup: LookupData.ReferenceUrl('/mogroupservice/lookupParent', ['Name'], 'Id', 'ParentGroupId'), autoHide: true })
    GroupIds: number;

    @StringDecorator({ type: StringType.MultiText, max: 200 })
    Description: string;

    @DropDownDecorator({ label: "Đơn vị tính", required: true, lookup: LookupData.ReferenceEnum(CalculationUnitType) })
    Unit: CalculationUnitType;

    @DropDownDecorator({ label: "Thời gian sử dụng", required: true, lookup: LookupData.ReferenceEnum(UseTimeType) })
    Duration: UseTimeType;

    @NumberDecorator({ label: "Thời gian", required: true, type: NumberType.Text, min: 1, max: 9999999999 })
    CustomUseTime: number

    @DropDownDecorator({ label: "Khoảng thời gian", required: true, lookup: { items: ConstantHelper.MO_UNIT_DURATION_TYPES } })
    UnitDuration: UnitDurationType

    TypeObject: number;
    Group: MOGroupServiceEntity;
    PriceConfig: PriceConfigEntity;
}