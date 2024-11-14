import { BaseEntity } from "./base.entity";
import { LookupData } from "../data/lookup.data";
import { DateTimeType, StringType } from "../enums/data.type";
import { TableDecorator } from "../../decorators/table.decorator";
import { StringDecorator } from "../../decorators/string.decorator";
import { DropDownDecorator } from "../../decorators/dropdown.decorator";
import { DateTimeDecorator, DateTimeFormat } from "../../decorators/datetime.decorator";

@TableDecorator({ title: 'Thư mục' })
export class FolderEntity extends BaseEntity {
    @StringDecorator({ required: true, type: StringType.Text, max: 100 })
    Name: string;

    @DropDownDecorator({ lookup: LookupData.Reference(FolderEntity) })
    ParentId?: number;

    @DateTimeDecorator({ type: DateTimeType.DateTime, format: DateTimeFormat.DMYHM })
    DateTime?: Date;

    Active?: boolean;
}