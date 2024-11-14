import { BaseEntity } from "../base.entity";
import { StringType } from "../../enums/data.type";
import { TableDecorator } from "../../../../_core/decorators/table.decorator";
import { StringDecorator } from "../../../../_core/decorators/string.decorator";

@TableDecorator()
export class MRQuestionEntity extends BaseEntity {

    @StringDecorator({ label: 'Câu hỏi', max: 150 })
    Name: string;

    @StringDecorator({ type: StringType.Email, max: 100 })
    Email: string;

    @StringDecorator({ label: 'Tin nhắn', max: 100 })
    Message: string;
    _Id: string;
}