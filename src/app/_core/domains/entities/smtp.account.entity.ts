import { BaseEntity } from "./base.entity";
import { StringType } from "../enums/data.type";
import { LookupData } from "../data/lookup.data";
import { SmtpAccountType } from "../enums/smtp.account.type";
import { TableDecorator } from "../../decorators/table.decorator";
import { StringDecorator } from "../../decorators/string.decorator";
import { NumberDecorator } from "../../decorators/number.decorator";
import { BooleanDecorator } from "../../decorators/boolean.decorator";
import { DropDownDecorator } from "../../decorators/dropdown.decorator";

@TableDecorator({ title: 'Tài khoản Smtp' })
export class SmtpAccountEntity extends BaseEntity {

    @StringDecorator({ required: true, allowSearch: true, type: StringType.Text })
    Host: string;

    @NumberDecorator()
    Port: number;

    @StringDecorator({ required: true, allowSearch: true, type: StringType.Account })
    Username: string;

    @StringDecorator({ required: true, type: StringType.Password })
    Password: string;

    @StringDecorator({ type: StringType.Email })
    EmailFrom: string;

    @DropDownDecorator({ required: true, allowSearch: true, lookup: LookupData.ReferenceEnum(SmtpAccountType) })
    Type: SmtpAccountType;

    @BooleanDecorator()
    EnableSsl: string;
}