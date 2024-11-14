import { BaseEntity } from "../base.entity";
import { NumberType } from "../../enums/data.type";
import { ConstantHelper } from "../../../../_core/helpers/constant.helper";
import { TableDecorator } from "../../../../_core/decorators/table.decorator";
import { StringDecorator } from "../../../../_core/decorators/string.decorator";
import { NumberDecorator } from "../../../../_core/decorators/number.decorator";
import { DropDownDecorator } from "../../../../_core/decorators/dropdown.decorator";

@TableDecorator({ title: 'Trang' })
export class MGPageEntity extends BaseEntity {
    @StringDecorator({ label: 'Tên', required: true, max: 250 })
    Name: string;

    @DropDownDecorator({ label: 'Đường dẫn', lookup: { items: ConstantHelper.MG_LINKS } })
    Link: string;

    @NumberDecorator({ label: 'Thứ tự', type: NumberType.Numberic })
    Order: number;
}