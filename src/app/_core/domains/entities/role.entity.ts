import { BaseEntity } from "./base.entity";
import { StringType } from "../enums/data.type";
import { OrganizationEntity } from "./organization.entity";
import { TableDecorator } from "../../decorators/table.decorator";
import { LookupData, LookupUniqueData } from "../data/lookup.data";
import { StringDecorator } from "../../decorators/string.decorator";
import { DropDownDecorator } from "../../decorators/dropdown.decorator";

@TableDecorator()
export class RoleEntity extends BaseEntity {
    @StringDecorator({ required: true, type: StringType.Text, max: 10, unique: LookupUniqueData.Reference(RoleEntity, 'Code') })
    Code: string;

    @StringDecorator({ required: true, type: StringType.Text, max: 200, unique: LookupUniqueData.Reference(RoleEntity, 'Name') })
    Name: string;

    @StringDecorator({ type: StringType.MultiText, max: 1000 })
    Description: string;

    @DropDownDecorator({ required: true, lookup: LookupData.Reference(OrganizationEntity) })
    OrganizationId: number;
}