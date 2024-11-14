import { BaseEntity } from "../base.entity";
import { TableDecorator } from "../../../../_core/decorators/table.decorator";
import { StringDecorator } from "../../../../_core/decorators/string.decorator";
import { StringType } from "../../enums/data.type";

@TableDecorator({ title: 'Lời nhắn' })
export class MGMessageEntity extends BaseEntity {
    @StringDecorator({ label: 'Họ tên', required: true, max: 150 })
    Name: string;

    @StringDecorator({ label: 'Email', type: StringType.Email, required: true, max: 150 })
    Email: string;

    @StringDecorator({ label: 'Message', type: StringType.MultiText, required: true, max: 1000 })
    Message: string;
}