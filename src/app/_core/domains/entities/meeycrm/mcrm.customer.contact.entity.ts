import { BaseEntity } from "../base.entity";
import { StringType } from "../../enums/data.type";
import { TableDecorator } from "../../../../_core/decorators/table.decorator";
import { StringDecorator } from "../../../../_core/decorators/string.decorator";
import { NumberDecorator } from "../../../../_core/decorators/number.decorator";
import { BooleanDecorator } from "../../../../_core/decorators/boolean.decorator";

@TableDecorator({ title: 'Thông tin liên hệ' })
export class MCRMCustomerContactEntity extends BaseEntity {
    @StringDecorator({ required: true, type: StringType.Text, max: 100 })
    Name: string;

    @StringDecorator({ required: true, type: StringType.PhoneText, min: 10, max: 10 })
    Phone: string;

    @StringDecorator({ type: StringType.Email, max: 250 })
    Email: string;

    @BooleanDecorator()
    AllowView: boolean;

    @BooleanDecorator()
    AllowDelete: boolean;

    @NumberDecorator()
    MCRMCustomerId: number;
}

@TableDecorator({ title: 'Thông tin liên hệ' })
export class MCRMCustomerContactDto {
    @StringDecorator({ type: StringType.PhoneText, min: 10, max: 10 })
    Phone: string;

    @StringDecorator({ type: StringType.Email, max: 250 })
    Email: string;
}