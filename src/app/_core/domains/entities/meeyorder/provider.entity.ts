import { BaseEntity } from "../base.entity";
import { StringType } from "../../enums/data.type";
import { LookupData } from "../../data/lookup.data";
import { TableDecorator } from "../../../decorators/table.decorator";
import { StringDecorator } from "../../../decorators/string.decorator";
import { DropDownDecorator } from "../../../decorators/dropdown.decorator";
import { NumberDecorator } from "../../../../_core/decorators/number.decorator";

@TableDecorator()
export class MOProviderEntity {
    @NumberDecorator({ allowSearch: true})
    Id: number;

    @StringDecorator({ allowSearch: true, required: true, type: StringType.Text, max: 150 })
    Name: string;

    @StringDecorator({ allowSearch: true, type: StringType.Text })
    Code: string;
}