import { BaseEntity } from "./base.entity";
import { StringType } from "../enums/data.type";
import { ConstantHelper } from "../../helpers/constant.helper";
import { TableDecorator } from "../../decorators/table.decorator";
import { LookupData, LookupUniqueData } from "../data/lookup.data";
import { StringDecorator } from "../../decorators/string.decorator";
import { DropDownDecorator } from "../../decorators/dropdown.decorator";

@TableDecorator()
export class TicketCategoryEntity extends BaseEntity {
    @StringDecorator({ label: 'Tên chuyên mục', required: true, type: StringType.Text, max: 100, unique: LookupUniqueData.Reference(TicketCategoryEntity, 'Name') })
    Name: string;
    
    @DropDownDecorator({ label: 'Icon', required: true, lookup: LookupData.ReferenceStrings(ConstantHelper.LA_ICONS) })
    SvgIcon: string;

    @StringDecorator({ label: 'Ghi chú', type: StringType.MultiText, max: 2000 })
    Description: string;
}