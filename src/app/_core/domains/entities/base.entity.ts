import { TableDecorator } from "../../decorators/table.decorator";
import { NumberDecorator } from "../../decorators/number.decorator";
import { StringDecorator } from "../../decorators/string.decorator";
import { BooleanDecorator } from "../../decorators/boolean.decorator";
import { DateTimeDecorator } from "../../decorators/datetime.decorator";

@TableDecorator()
export class BaseEntity {
    @NumberDecorator({ allowSearch: true})
    Id?: number;

    @BooleanDecorator()
    IsActive?: boolean;

    @BooleanDecorator()
    IsDelete?: boolean;
    
    @StringDecorator()
    CreatedBy?: string;

    @StringDecorator()
    UpdatedBy?: string;

    @DateTimeDecorator({ label: 'Ngày tạo'})
    CreatedDate?: Date;

    @DateTimeDecorator()
    UpdatedDate?: Date;

    Checked?: boolean;
    Editable?: boolean;
    Checkable?: boolean;
    ReadOnlyCheckable?: boolean;    
}