import { BaseEntity } from "./base.entity";
import { CityEntity } from "./city.entity";
import { StringType } from "../enums/data.type";
import { CountryEntity } from "./country.entity";
import { LookupData } from "../data/lookup.data";
import { DistrictEntity } from "./district.entity";
import { TableDecorator } from "../../decorators/table.decorator";
import { StringDecorator } from "../../decorators/string.decorator";
import { DropDownDecorator } from "../../decorators/dropdown.decorator";

@TableDecorator()
export class WardEntity extends BaseEntity {

    @DropDownDecorator({  allowSearch: true, required: true, lookup: LookupData.Reference(CountryEntity) })
    CountryId: number;

    @DropDownDecorator({ allowSearch: true, required: true, lookup: LookupData.Reference(CityEntity, null, null, 'CountryId') })
    CityId: number;

    @DropDownDecorator({ allowSearch: true, required: true, lookup: LookupData.Reference(DistrictEntity, null, null, 'CityId') })
    DistrictId: number;
    
    @StringDecorator({ allowSearch: true, required: true, type: StringType.Text, max: 150 })
    Name: string;

    @StringDecorator({ type: StringType.Text })
    SystemName: string;

    @StringDecorator({ type: StringType.Code })
    RefId: string;
}