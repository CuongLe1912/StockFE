import { BaseEntity } from "../base.entity";
import { BooleanType, DateTimeType, NumberType } from "../../enums/data.type";
import { LookupData } from "../../data/lookup.data";
import { TableDecorator } from "../../../decorators/table.decorator";
import { DropDownDecorator } from "../../../decorators/dropdown.decorator";
import { NumberDecorator } from "../../../../_core/decorators/number.decorator";
import { BooleanDecorator } from "../../../../_core/decorators/boolean.decorator";
import { DateTimeDecorator } from "../../../../_core/decorators/datetime.decorator";
import { ConstantHelper } from "../../../../_core/helpers/constant.helper";
import { FileDecorator } from "../../../../_core/decorators/file.decorator";
import { PriceProductComboEntity } from "./price.product.combo.entity";
import { PriceConfigDiscountType, PriceConfigStatusType } from "./enums/price.config.type";

@TableDecorator()
export class PriceConfigEntity extends BaseEntity {

    @NumberDecorator({ allowSearch: true})
    ProductId: number

    @NumberDecorator({ type: NumberType.Text, label: "Giá gốc", required: true, allowSearch: true, allowZero: true, min: 0, max: 99999999999999999999 })
    PriceRoot: number;
    
    @NumberDecorator({ type: NumberType.Text, label: "Giá sau KM", required: true, allowSearch: true, allowZero: true, min: 0, max: 99999999999999999999, maxDepend: 'PriceRoot' })
    PriceDiscount: number;

    @NumberDecorator({ type: NumberType.Text, label: "Khuyến mại", required: true, allowSearch: true, allowZero: true, min: 0, max: 99999999999999999999 })
    Discount: number;

    @BooleanDecorator({ type: BooleanType.RadioButton, label: "Loại khuyến mại", required: true, lookup: { items: ConstantHelper.MO_PRICE_CONFIG_DISCOUNT_TYPES } })
    DiscountType: PriceConfigDiscountType;

    @DropDownDecorator({ label: "Trạng thái", required: true, lookup: LookupData.ReferenceEnum(PriceConfigStatusType) })
    Status: PriceConfigStatusType

    @DateTimeDecorator({ label: 'Bắt đầu áp dụng', required: true, type: DateTimeType.Date })
    StartDate: Date;

    @DateTimeDecorator({ label: 'Kết thúc áp dụng', type: DateTimeType.DateTime })
    EndDate: Date;

    @FileDecorator({ label: 'Chính sách', required: true, url: 'upload/MGUpload', accept: 'application/pdf', description: 'Định dạng: pdf' })
    UrlPolicy: string

    PriceProductCombo: PriceProductComboEntity[]
}