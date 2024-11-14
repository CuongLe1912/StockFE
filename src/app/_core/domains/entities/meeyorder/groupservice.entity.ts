import { BaseEntity } from "../base.entity";
import { StringType } from "../../enums/data.type";
import { LookupData } from "../../data/lookup.data";
import { TableDecorator } from "../../../decorators/table.decorator";
import { StringDecorator } from "../../../decorators/string.decorator";
import { DropDownDecorator } from "../../../decorators/dropdown.decorator";
import { MOProviderEntity } from "./provider.entity";

@TableDecorator()
export class MOGroupServiceEntity extends BaseEntity {
    @StringDecorator({ required: true, type: StringType.Text, max: 150 })
    Name: string;

    @StringDecorator({ required: true, type: StringType.Text, max: 150 })
    Code: string;

    @DropDownDecorator({ required: false, lookup: LookupData.Reference(MOGroupServiceEntity) })
    ParentId: number;

    @DropDownDecorator({ required: false, lookup: LookupData.Reference(MOProviderEntity) })
    ProviderId: number;

    Provider: MOProviderEntity;
}