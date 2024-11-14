import { StringType } from "../enums/data.type";
import { LookupUniqueData } from "../data/lookup.data";
import { ProductEntity } from "../entities/product.entity";
import { TableDecorator } from "../../decorators/table.decorator";
import { NumberDecorator } from "../../decorators/number.decorator";
import { StringDecorator } from "../../decorators/string.decorator";
import { BooleanDecorator } from "../../decorators/boolean.decorator";

TableDecorator()
export class ProductDto {
    @NumberDecorator()
    Id: number;

    @NumberDecorator()
    Amount?: number;

    @BooleanDecorator()
    Allow?: boolean;

    @StringDecorator({ label: 'Tên khác', type: StringType.Text, max: 500 })
    OtherName: string;

    @StringDecorator({ label: 'Tên sản phẩm', required: true, type: StringType.Text, max: 150, unique: LookupUniqueData.Reference(ProductEntity, 'Name') })
    Name: string;

    @StringDecorator({ label: 'Ghi chú', type: StringType.MultiText, max: 1000 })
    Description: string;

    UserIds: number[];
}