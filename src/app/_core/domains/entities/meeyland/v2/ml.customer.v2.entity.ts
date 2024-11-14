import { TableDecorator } from "../../../../../_core/decorators/table.decorator";
import { NumberDecorator } from "../../../../../_core/decorators/number.decorator";
import { StringDecorator } from "../../../../../_core/decorators/string.decorator";

@TableDecorator()
export class MLCustomerV2Entity {

    @StringDecorator({ required: true, max: 10, placeholder: 'Mã khách hàng' })
    Code: string;

    @StringDecorator({ required: true, max: 10, placeholder: 'Mã khách hàng' })
    Code2: string;

    @NumberDecorator({ placeholder: 'Mã KH ghộp' })
    RootId: number;

    @StringDecorator({ required: true })
    LeadStatus: number;
}