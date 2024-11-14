import { BaseEntity } from "./base.entity";
import { NumberType, StringType } from "../enums/data.type";
import { TableDecorator } from "../../decorators/table.decorator";
import { NumberDecorator } from "../../decorators/number.decorator";
import { StringDecorator } from "../../decorators/string.decorator";

@TableDecorator({ title: 'Đầu số tổng đài' })
export class PrefixNumberEntity extends BaseEntity {

    @NumberDecorator({ label: 'Tiền tố Vfone', type: NumberType.Text })
    Prefix: number;

    @StringDecorator({ label: 'Đầu số', type: StringType.PhoneText,  max: 15 })
    Phone: string;

    @StringDecorator({ label: 'Miêu tả', type: StringType.MultiText,  max: 500 })
    Description: string;
}