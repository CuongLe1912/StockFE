import { BaseEntity } from "../base.entity";
import { TableDecorator } from "../../../../_core/decorators/table.decorator";
import { StringDecorator } from "../../../../_core/decorators/string.decorator";

@TableDecorator()
export class MRMenuEntity extends BaseEntity {

    @StringDecorator({ label: 'Tên menu', max: 150 })
    Name: string;

    _Id: string;
}
