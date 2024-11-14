import { BaseEntity } from "./base.entity";
import { StringType } from "../enums/data.type";
import { TableDecorator } from "../../decorators/table.decorator";
import { StringDecorator } from "../../decorators/string.decorator";

@TableDecorator({ title: 'Mẫu Meta Seo' })
export class MSMetaSeoTemplateEntity extends BaseEntity {
    @StringDecorator({ required: true, allowSearch: true, type: StringType.Text, max: 250 })
    Name: string;

    @StringDecorator({ type: StringType.Html, required: true, max: 500000 })
    Content: string;
}