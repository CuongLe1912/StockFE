import { BaseEntity } from "./base.entity";
import { OptionItem } from "../data/option.item";
import { NumberType, StringType } from "../enums/data.type";
import { ConstantHelper } from "../../helpers/constant.helper";
import { TableDecorator } from "../../decorators/table.decorator";
import { StringDecorator } from "../../decorators/string.decorator";
import { NumberDecorator } from "../../decorators/number.decorator";
import { DropDownDecorator } from "../../decorators/dropdown.decorator";
import { LookupData } from "../data/lookup.data";

@TableDecorator()
export class LinkPermissionEntity extends BaseEntity {
    @StringDecorator({ required: true, allowSearch: true, type: StringType.Text, max: 150 })
    Name: string;

    @DropDownDecorator({ required: true, allowSearch: true, lookup: { items: ConstantHelper.LINKS } })
    Link: string;

    @DropDownDecorator({ allowClear: true, lookup: LookupData.ReferenceStrings(ConstantHelper.LA_ICONS) })
    CssIcon: string;

    @NumberDecorator({ type: NumberType.Numberic })
    Order: number;

    @DropDownDecorator({ allowClear: true, lookup: LookupData.Reference(LinkPermissionEntity) })
    ParentId: number;

    @DropDownDecorator({ allowClear: true, required: true, allowSearch: true, lookup: { url: '/permission/lookup', propertyGroup: 'Title' } })
    PermissionId: string;

    @StringDecorator({ type: StringType.Text, max: 150 })
    Group: string;

    @NumberDecorator({ type: NumberType.Numberic })
    GroupOrder: number;
}