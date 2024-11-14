import { BaseEntity } from "./base.entity";
import { UserEntity } from "./user.entity";
import { StringType } from "../enums/data.type";
import { LookupData } from "../data/lookup.data";
import { TableDecorator } from "../../decorators/table.decorator";
import { StringDecorator } from "../../decorators/string.decorator";
import { DropDownDecorator } from "../../decorators/dropdown.decorator";

@TableDecorator({ title: 'Bộ lọc' })
export class RequestFilterEntity extends BaseEntity {

    @StringDecorator({ label: 'Tên bộ lọc', required: true, type: StringType.Text, max: 150 })
    Name: string;

    @StringDecorator({ label: 'Chi tiết bộ lọc', required: true, type: StringType.Json, max: 50000 })
    FilterData: string;

    @StringDecorator({ label: 'Đối tượng', required: true, type: StringType.Text, max: 150 })
    Controller: string;

    @DropDownDecorator({ allowSearch: true, lookup: LookupData.Reference(UserEntity, ['FullName', 'Email']) })
    UserId: number;
}