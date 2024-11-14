import { BaseEntity } from "../base.entity";
import { StringType } from "../../enums/data.type";
import { TableDecorator } from "../../../../_core/decorators/table.decorator";
import { StringDecorator } from "../../../../_core/decorators/string.decorator";

@TableDecorator()
export class MPOProjectHashtagsEntity extends BaseEntity {
    @StringDecorator({ label: 'Tên hashtag', required: true, })
    Name: string;

    @StringDecorator({ label: 'Giới thiệu', required: true, type: StringType.MultiText, max: 200 })
    Description: string;
}