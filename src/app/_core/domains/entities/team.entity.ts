import { BaseEntity } from "./base.entity";
import { StringType } from "../enums/data.type";
import { OrganizationEntity } from "./organization.entity";
import { TableDecorator } from "../../decorators/table.decorator";
import { LookupData, LookupUniqueData } from "../data/lookup.data";
import { StringDecorator } from "../../decorators/string.decorator";
import { DropDownDecorator } from "../../decorators/dropdown.decorator";

@TableDecorator()
export class TeamEntity extends BaseEntity {
    @StringDecorator({ label: 'Tên nhóm', required: true, type: StringType.Text, max: 100, unique: LookupUniqueData.Reference(TeamEntity, 'Name') })
    Name: string;
    
    @StringDecorator({ label: 'Tên viết tắt', type: StringType.Text, max: 100, unique: LookupUniqueData.Reference(TeamEntity, 'Code') })
    Code: string;

    @StringDecorator({ label: 'Ghi chú', type: StringType.MultiText, max: 1000 })
    Description: string;

    @DropDownDecorator({ required: true, lookup: LookupData.Reference(OrganizationEntity) })
    OrganizationId: number;
}