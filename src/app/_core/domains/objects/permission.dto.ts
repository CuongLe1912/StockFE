import { ActionData } from "../data/action.data";
import { OptionItem } from "../data/option.item";
import { PermissionType } from "../enums/permission.type";

export class PermissionDto {
    Id?: number;
    Name?: string;
    Group?: string;
    Title?: string;
    Action?: string;
    Allow?: boolean;
    Active?: boolean;
    ReadOnly?: boolean;
    Controller?: string;
    Organization?: string;
    Type?: PermissionType;
    OrganizationId?: number;
    Types?: PermissionType[];
    SelectedType?: OptionItem;
    OptionItemTypes?: OptionItem[];
}