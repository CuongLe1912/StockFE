import { UserEntity } from "./user.entity";
import { BaseEntity } from "./base.entity";
import { LookupData } from "../data/lookup.data";
import { DateTimeType, StringType } from "../enums/data.type";
import { TableDecorator } from "../../decorators/table.decorator";
import { StringDecorator } from "../../decorators/string.decorator";
import { DropDownDecorator } from "../../decorators/dropdown.decorator";
import { DateTimeDecorator } from "../../decorators/datetime.decorator";

@TableDecorator({ title: "Nhật ký hệ thống" })
export class LogActivityEntity extends BaseEntity {
    @DateTimeDecorator({  type: DateTimeType.DateTime })
    DateTime: Date;

    @StringDecorator({ allowSearch: true, type: StringType.Text, max: 200 })
    Url: string;

    @DropDownDecorator({ allowSearch: true, required: true, lookup: { url: '/utility/controllers' } })
    Controller: string;

    @StringDecorator({ allowSearch: true, type: StringType.Text, max: 200 })
    Action: string;

    @StringDecorator({ allowSearch: true, type: StringType.Text, max: 200 })
    Method: string;

    @StringDecorator({ allowSearch: true, type: StringType.Text, max: 200 })
    ObjectId: string;

    @StringDecorator({ type: StringType.MultiText, max: 2000 })
    Notes: string;

    @StringDecorator({ type: StringType.Json, max: 4000 })
    Body: string;

    @DropDownDecorator({ allowSearch: true, lookup: LookupData.Reference(UserEntity, ['FullName', 'Email']) })
    UserId: number;
}