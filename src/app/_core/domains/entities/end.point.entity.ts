import { BaseEntity } from "./base.entity";
import { DomainEntity } from "./domain.entity";
import { StringType } from "../enums/data.type";
import { LookupData } from "../data/lookup.data";
import { MethodType } from "../enums/method.type";
import { TableDecorator } from "../../decorators/table.decorator";
import { StringDecorator } from "../../decorators/string.decorator";
import { DropDownDecorator } from "../../decorators/dropdown.decorator";

@TableDecorator({ title: 'Ánh xạ API' })
export class EndPointEntity extends BaseEntity {
    @StringDecorator({ required: true, allowSearch: true, type: StringType.Text, max: 550 })
    Url: string;

    @DropDownDecorator({ required: true, allowSearch: true, lookup: LookupData.Reference(DomainEntity, ['Label'], 'Value') })
    Domain: string;

    @StringDecorator({ required: true, allowSearch: true, max: 50 })
    SystemName: string;

    @StringDecorator({ required: true, allowSearch: true, type: StringType.Text, max: 550 })
    Title: string;

    @DropDownDecorator({ required: true, lookup: LookupData.ReferenceEnum(MethodType) })
    Method: string;

    @StringDecorator({ type: StringType.Text, max: 250 })
    Token: string;

    @StringDecorator({ label: 'X-Api Key', type: StringType.Text, max: 100 })
    XApiKey: string;

    @StringDecorator({ label: 'X-Client Id', type: StringType.Text, max: 100 })
    XClientId: string;

    @StringDecorator({ label: 'App Key', type: StringType.Text, max: 50 })
    AppKey: string;

    @StringDecorator({ label: 'Secret Key', type: StringType.Text, max: 100 })
    SecretKey: string;
}