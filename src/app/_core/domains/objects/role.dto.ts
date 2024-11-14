import { StringType } from "../enums/data.type";
import { PermissionDto } from "./permission.dto";
import { RoleEntity } from "../entities/role.entity";
import { TableDecorator } from "../../decorators/table.decorator";
import { LookupData, LookupUniqueData } from "../data/lookup.data";
import { StringDecorator } from "../../decorators/string.decorator";
import { NumberDecorator } from "../../decorators/number.decorator";
import { OrganizationEntity } from "../entities/organization.entity";
import { BooleanDecorator } from "../../decorators/boolean.decorator";
import { DropDownDecorator } from "../../decorators/dropdown.decorator";

TableDecorator()
export class RoleDto {
    @NumberDecorator()
    Id: number;

    @NumberDecorator()
    Amount?: number;

    @BooleanDecorator()
    Allow?: boolean;

    @StringDecorator({ label: 'Mã quyền', required: true, allowSearch: true, type: StringType.Text, max: 10, unique: LookupUniqueData.Reference(RoleEntity, 'Code') })
    Code: string;

    @StringDecorator({ label: 'Tên quyền', required: true, allowSearch: true, type: StringType.Text, max: 200, unique: LookupUniqueData.Reference(RoleEntity, 'Name') })
    Name: string;

    @StringDecorator({ label: 'Ghi chú', type: StringType.MultiText, max: 1000 })
    Description: string;

    @DropDownDecorator({ autoSelect: true, allowSearch: true, required: true, lookup: LookupData.Reference(OrganizationEntity) })
    OrganizationId: number;

    UserIds: number[];
    Organization?: string;
    Permissions: PermissionDto[];
}