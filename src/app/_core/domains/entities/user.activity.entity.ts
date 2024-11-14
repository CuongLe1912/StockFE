import { BaseEntity } from "./base.entity";
import { DateTimeType, StringType } from "../enums/data.type";
import { LookupData } from "../data/lookup.data";
import { SmtpAccountType } from "../enums/smtp.account.type";
import { TableDecorator } from "../../decorators/table.decorator";
import { StringDecorator } from "../../decorators/string.decorator";
import { NumberDecorator } from "../../decorators/number.decorator";
import { BooleanDecorator } from "../../decorators/boolean.decorator";
import { DropDownDecorator } from "../../decorators/dropdown.decorator";
import { DateTimeDecorator } from "../../decorators/datetime.decorator";
import { UserActivityType } from "../enums/user.activity.type";

@TableDecorator({ title: 'Nhật ký hoạt động' })
export class UserActivityEntity extends BaseEntity {

    @StringDecorator({ allowSearch: true, type: StringType.Text })
    Ip: string;

    @StringDecorator({ type: StringType.Text })
    Os: string;

    @DateTimeDecorator({ allowSearch: true, type: DateTimeType.DateTime })
    DateTime: string;

    @StringDecorator({ type: StringType.Text })
    Country: string;

    @StringDecorator({ type: StringType.Text })
    Browser: string;

    @BooleanDecorator()
    Incognito: string;

    @DropDownDecorator({ allowSearch: true, lookup: LookupData.ReferenceEnum(UserActivityType) })
    Type: UserActivityType;
}