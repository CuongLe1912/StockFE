import { BaseEntity } from "../base.entity";
import { TableDecorator } from "../../../../_core/decorators/table.decorator";
import { StringDecorator } from "../../../../_core/decorators/string.decorator";
import { StringType } from "../../enums/data.type";

@TableDecorator({ title: 'Nhóm khách hàng' })
export class MCRMCustomerGroupEntity extends BaseEntity {
    @StringDecorator({ required: true, label: 'Tên nhóm', max: 250 })
    Name: string;

    @StringDecorator({ required: true, label: 'Miêu tả', type: StringType.MultiText,  max: 500 })
    Description: string;
}