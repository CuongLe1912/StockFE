import { BaseEntity } from "./base.entity";
import { StringType } from "../enums/data.type";
import { TableDecorator } from "../../decorators/table.decorator";
import { StringDecorator } from "../../decorators/string.decorator";

@TableDecorator()
export class OrganizationEntity extends BaseEntity {
    @StringDecorator({ allowSearch: true, required: true, type: StringType.Text, max: 150 })
    Name: string;

    @StringDecorator({ allowSearch: true, type: StringType.Account, max: 100 })
    Leader: string;

    @StringDecorator({ required: true, type: StringType.Link })
    Website: string;

    @StringDecorator({ allowSearch: true, type: StringType.PhoneText, min: 10, max: 10 })
    LeaderPhone: string;

    @StringDecorator({ type: StringType.Email })
    LeaderEmail: string;
}