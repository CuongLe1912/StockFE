import { StringType } from "../enums/data.type";
import { TeamEntity } from "../entities/team.entity";
import { TableDecorator } from "../../decorators/table.decorator";
import { LookupUniqueData, LookupData } from "../data/lookup.data";
import { NumberDecorator } from "../../decorators/number.decorator";
import { StringDecorator } from "../../decorators/string.decorator";
import { OrganizationEntity } from "../entities/organization.entity";
import { BooleanDecorator } from "../../decorators/boolean.decorator";
import { DropDownDecorator } from "../../decorators/dropdown.decorator";

TableDecorator()
export class TeamDto {
    @NumberDecorator()
    Id: number;

    @NumberDecorator()
    Amount?: number;

    @BooleanDecorator()
    Allow?: boolean;

    @StringDecorator({ label: 'Tên viết tắt', required: true, allowSearch: true, type: StringType.Text, max: 100, unique: LookupUniqueData.Reference(TeamEntity, 'Code') })
    Code: string;

    @StringDecorator({ label: 'Tên nhóm', required: true, allowSearch: true, type: StringType.Text, max: 100, unique: LookupUniqueData.Reference(TeamEntity, 'Name') })
    Name: string;

    @StringDecorator({ label: 'Ghi chú', type: StringType.MultiText, max: 1000 })
    Description: string;

    @DropDownDecorator({ autoSelect: true, allowSearch: true, required: true, lookup: LookupData.Reference(OrganizationEntity) })
    OrganizationId: number;

    UserIds: number[];
    Organization?: string;
}