import { UserEntity } from "./user.entity";
import { BaseEntity } from "./base.entity";
import { LookupData } from "../data/lookup.data";
import { DateTimeType, StringType } from "../enums/data.type";
import { TableDecorator } from "../../decorators/table.decorator";
import { StringDecorator } from "../../decorators/string.decorator";
import { DropDownDecorator } from "../../decorators/dropdown.decorator";
import { DateTimeDecorator } from "../../decorators/datetime.decorator";

@TableDecorator({ title: "Lỗi hệ thống" })
export class LogExceptionEntity extends BaseEntity {
    @DateTimeDecorator({ allowSearch: true, type: DateTimeType.DateTime })
    DateTime: Date;

    @StringDecorator({ type: StringType.MultiText, max: 2000, rows: 15 })
    Exception: string;

    @StringDecorator({ type: StringType.MultiText, max: 2000, rows: 15 })
    InnerException: string;

    @StringDecorator({ type: StringType.MultiText, max: 2000, rows: 15 })
    StackTrace: string;

    @DropDownDecorator({ allowSearch: true, lookup: LookupData.Reference(UserEntity, ['FullName', 'Email']) })
    UserId: number;
}