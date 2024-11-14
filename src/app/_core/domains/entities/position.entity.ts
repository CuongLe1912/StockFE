import { BaseEntity } from "./base.entity";
import { StringType } from "../enums/data.type";
import { LookupUniqueData } from "../data/lookup.data";
import { TableDecorator } from "../../decorators/table.decorator";
import { StringDecorator } from "../../decorators/string.decorator";

@TableDecorator({ title: 'Chức vụ' })
export class PositionEntity extends BaseEntity {
    @StringDecorator({ label: 'Tên nhóm', required: true, allowSearch: true, type: StringType.Text, max: 100, unique: LookupUniqueData.Reference(PositionEntity, 'Name') })
    Name: string;
    
    @StringDecorator({ label: 'Tên viết tắt', allowSearch: true, type: StringType.Text, max: 100, unique: LookupUniqueData.Reference(PositionEntity, 'Code') })
    Code: string;

    @StringDecorator({ type: StringType.MultiText, max: 500 })
    Description: string;
}