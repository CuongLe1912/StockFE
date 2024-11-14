import { RoleDto } from "./role.dto";
import { TeamDto } from "./team.dto";
import { ProductDto } from "./product.dto";
import { PermissionDto } from "./permission.dto";

export class OrganizationDto {
    Id: number;
    Name: string;
    Active?: boolean;
    Teams?: TeamDto[];
    Roles?: RoleDto[];
    AllTeams?: TeamDto[];
    AllRoles?: RoleDto[];
    FilterRoles?: RoleDto[];
    FilterTeams?: TeamDto[];
    Products?: ProductDto[];
    AllProducts?: ProductDto[];
    PermissionActive?: boolean;
    FilterProducts?: ProductDto[];
    Permissions?: PermissionDto[];
    AllPermissions?: PermissionDto[];
}