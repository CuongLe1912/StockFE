import { BaseEntity } from "./base.entity";
import { StringType } from "../enums/data.type";
import { LookupUniqueData } from "../data/lookup.data";
import { TableDecorator } from "../../decorators/table.decorator";
import { StringDecorator } from "../../decorators/string.decorator";

@TableDecorator()
export class ProductEntity extends BaseEntity {
    @StringDecorator({ label: 'Tên sản phẩm', required: true, type: StringType.Text, max: 150, unique: LookupUniqueData.Reference(ProductEntity, 'Name') })
    Name: string;
    
    @StringDecorator({ label: 'Tên khác', type: StringType.Text, max: 500 })
    OtherName: string;

    @StringDecorator({ label: 'Ghi chú', type: StringType.MultiText, max: 1000 })
    Description: string;
}