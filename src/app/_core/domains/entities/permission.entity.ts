import { BaseEntity } from "./base.entity";
import { StringType } from "../enums/data.type";
import { LookupData } from "../data/lookup.data";
import { PermissionType } from "../enums/permission.type";
import { OrganizationEntity } from "./organization.entity";
import { ConstantHelper } from "../../helpers/constant.helper";
import { TableDecorator } from "../../decorators/table.decorator";
import { StringDecorator } from "../../decorators/string.decorator";
import { BooleanDecorator } from "../../decorators/boolean.decorator";
import { DropDownDecorator } from "../../decorators/dropdown.decorator";

@TableDecorator()
export class PermissionEntity extends BaseEntity {
    @StringDecorator({ type: StringType.Text, max: 150 })
    Group: string;

    @StringDecorator({ type: StringType.Text, max: 150 })
    Title: string;

    @StringDecorator({ allowSearch: true, required: true, type: StringType.Text, max: 150 })
    Name: string;

    @DropDownDecorator({ allowSearch: true, required: true, lookup: LookupData.Reference(OrganizationEntity) })
    OrganizationId: number;

    @DropDownDecorator({ allowSearch: true, required: true, lookup: LookupData.ReferenceUrl('/utility/controllers') })
    Controller: string;

    @DropDownDecorator({ allowSearch: true, required: true, lookup: LookupData.ReferenceUrl('/utility/actions', null, null, 'Controller') })
    Action: string;

    @BooleanDecorator({ lookup: LookupData.ReferenceItems(ConstantHelper.PERMISSION_TYPES) })
    Types: PermissionType[];
}