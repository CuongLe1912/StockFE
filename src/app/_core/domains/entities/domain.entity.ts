import { BaseEntity } from "./base.entity";
import { StringType } from "../enums/data.type";
import { TableDecorator } from "../../decorators/table.decorator";
import { StringDecorator } from "../../decorators/string.decorator";

@TableDecorator({ title: 'Domain API' })
export class DomainEntity extends BaseEntity {
    @StringDecorator({ label: 'Tên', required: true, type: StringType.Text, max: 250 })
    Label: string;

    @StringDecorator({ label: 'Domain', required: true, type: StringType.Link, max: 250 })
    Value: string;

    @StringDecorator({ label: 'Nhóm', required: true, type: StringType.Text, max: 250 })
    Group: string;

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