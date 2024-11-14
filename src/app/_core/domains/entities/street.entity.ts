import { BaseEntity } from "./base.entity";
import { CityEntity } from "./city.entity";
import { StringType } from "../enums/data.type";
import { LookupData } from "../data/lookup.data";
import { DistrictEntity } from "./district.entity";
import { TableDecorator } from "../../decorators/table.decorator";
import { StringDecorator } from "../../decorators/string.decorator";
import { DropDownDecorator } from "../../decorators/dropdown.decorator";

@TableDecorator()
export class StreetEntity extends BaseEntity {

    @DropDownDecorator({ required: true, lookup: LookupData.Reference(CityEntity, null, null, 'DistrictId') })
    CityId: number;

    @DropDownDecorator({ required: true, lookup: LookupData.Reference(DistrictEntity, null, null, 'CityId') })
    DistrictId: number;
    
    @StringDecorator({ required: true, type: StringType.Text, max: 250 })
    Name: string;

    @StringDecorator({ type: StringType.Text, max: 250 })
    SystemName: string;

    @StringDecorator({ type: StringType.Code, max: 50 })
    RefId: string;
}