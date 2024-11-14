import { BaseEntity } from "./base.entity";
import { StringType } from "../enums/data.type";
import { LookupData } from "../data/lookup.data";
import { SmsTemplateType } from "../enums/sms.template.type";
import { TableDecorator } from "../../decorators/table.decorator";
import { StringDecorator } from "../../decorators/string.decorator";
import { DropDownDecorator } from "../../decorators/dropdown.decorator";

@TableDecorator({ title: 'Mẫu SMS' })
export class SmsTemplateEntity extends BaseEntity {
    @DropDownDecorator({ required: true, allowSearch: true, lookup: LookupData.ReferenceEnum(SmsTemplateType) })
    Type: SmsTemplateType;

    @StringDecorator({ required: true, type: StringType.MultiText })
    Content: string;
}