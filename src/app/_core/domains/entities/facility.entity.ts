import { BaseEntity } from "./base.entity";
import { StringType } from "../enums/data.type";
import { TableDecorator } from "../../decorators/table.decorator";
import { StringDecorator } from "../../decorators/string.decorator";
import { NumberDecorator } from "../../decorators/number.decorator";

@TableDecorator({ title: 'Địa chỉ tiện ích' })
export class FacilityEntity extends BaseEntity {
    @StringDecorator({ required: true, type: StringType.Text, max: 1000 })
    Name: string;

    @StringDecorator({ max: 250 })
    Category: string;

    @NumberDecorator({ required: true, step: 0.00000001, decimals: 8 })
    Lat: number;

    @NumberDecorator({ required: true, step: 0.00000001, decimals: 8 })
    Lng: number;

    @StringDecorator({ type: StringType.Text, max: 1000 })
    ImageUrl: string;

    @StringDecorator({ type: StringType.Text, max: 1000 })
    Address: string;
}