import { BaseEntity } from "./base.entity";
import { StringType } from "../enums/data.type";
import { TableDecorator } from "../../decorators/table.decorator";
import { StringDecorator } from "../../decorators/string.decorator";

@TableDecorator()
export class CountryEntity extends BaseEntity {
    @StringDecorator({ allowSearch: true, required: true, type: StringType.Text, max: 150 })
    Name: string;

    @StringDecorator({ allowSearch: true, type: StringType.Text })
    SystemName: string;

    @StringDecorator({ required: true, type: StringType.Code })
    DialingCode: string;

    @StringDecorator({ allowSearch: true, type: StringType.Code })
    RefId: string;
}