import { BaseEntity } from "../base.entity";
import { NumberType, StringType } from "../../enums/data.type";
import { LookupData } from "../../data/lookup.data";
import { TableDecorator } from "../../../decorators/table.decorator";
import { StringDecorator } from "../../../decorators/string.decorator";
import { DropDownDecorator } from "../../../decorators/dropdown.decorator";
import { UseTimeType } from "./enums/usetime.type";
import { UnitDurationType } from "./enums/unit.duration.type";
import { NumberDecorator } from "../../../../_core/decorators/number.decorator";
import { CalculationUnitType } from "./enums/calculation.unit.type";
import { ConstantHelper } from "../../../../_core/helpers/constant.helper";

@TableDecorator()
export class ProductEntity extends BaseEntity {

    @NumberDecorator({ allowSearch: true})
    ProductId: number

    @StringDecorator({ label: "Tên dịch vụ", required: true, type: StringType.Text, max: 150 })
    Name: string;

    @StringDecorator({ label: "Mã dịch vụ", required: true, type: StringType.Text, max: 150 })
    Code: string;

    @DropDownDecorator({ label: "Đơn vị tính", required: true, lookup: LookupData.ReferenceEnum(CalculationUnitType) })
    Unit: CalculationUnitType;

    @NumberDecorator({ label: "Số lượng", required: true, type: NumberType.Text, min: 1 })
    Amount: number

    @DropDownDecorator({ label: "Thời gian sử dụng", required: true, lookup: LookupData.ReferenceEnum(UseTimeType) })
    Duration: UseTimeType;

    @NumberDecorator({ label: "Thời gian", required: true, type: NumberType.Text, min: 1 })
    CustomUseTime: number

    @DropDownDecorator({ label: "Khoảng thời gian", required: true, lookup: { items: ConstantHelper.MO_UNIT_DURATION_TYPES } })
    UnitDuration: UnitDurationType
}