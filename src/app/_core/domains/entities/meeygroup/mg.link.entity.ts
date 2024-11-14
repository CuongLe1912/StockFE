import { BaseEntity } from "../base.entity";
import { LookupData } from "../../data/lookup.data";
import { ConstantHelper } from "../../../../_core/helpers/constant.helper";
import { TableDecorator } from "../../../../_core/decorators/table.decorator";
import { StringDecorator } from "../../../../_core/decorators/string.decorator";
import { DropDownDecorator } from "../../../../_core/decorators/dropdown.decorator";

@TableDecorator({ title: 'Menu' })
export class MGLinkEntity extends BaseEntity {
    @StringDecorator({ label: 'Tên - Tiếng Việt', required: true, max: 150 })
    NameVn: string;

    @StringDecorator({ label: 'Tên - Tiếng Anh', max: 150 })
    NameEn: string;

    @DropDownDecorator({ label: 'Đường dẫn', lookup: { items: ConstantHelper.MG_LINKS } })
    Link: string;

    @DropDownDecorator({ lookup: LookupData.Reference(MGLinkEntity, ['NameVn', 'NameEn']) })
    ParentId: number;
}