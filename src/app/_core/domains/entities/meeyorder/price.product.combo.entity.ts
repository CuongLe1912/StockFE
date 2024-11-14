import { BaseEntity } from "../base.entity";
import { BooleanType, DateTimeType, NumberType, StringType } from "../../enums/data.type";
import { LookupData } from "../../data/lookup.data";
import { TableDecorator } from "../../../decorators/table.decorator";
import { NumberDecorator } from "../../../../_core/decorators/number.decorator";
import { StringDecorator } from "../../../../_core/decorators/string.decorator";

@TableDecorator()
export class PriceProductComboEntity extends BaseEntity {

    @NumberDecorator({ allowSearch: true})
    ProductComboId: number
    
    Name: string;
    Code: string;
    Amount: number

    @NumberDecorator({ type: NumberType.Text, label: "Giá gốc", required: true, allowSearch: true, allowZero: true, min: 0, max: 99999999999999999999 })
    PriceRoot: number;
    
    @NumberDecorator({ type: NumberType.Text, label: "Giá sau KM", required: true, allowSearch: true, allowZero: true, min: 0, max: 99999999999999999999, maxDepend: 'PriceRoot' })
    PriceDiscount: number;

    @NumberDecorator({ type: NumberType.Text, label: "Khuyến mại", required: true, allowSearch: true, allowZero: true, min: 0, max: 99999999999999999999})
    Discount: number;

    Unit: number;
}