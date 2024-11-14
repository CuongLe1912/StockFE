import { BaseEntity } from "./base.entity";
import { CityEntity } from "./city.entity";
import { StringType } from "../enums/data.type";
import { CountryEntity } from "./country.entity";
import { LookupData } from "../data/lookup.data";
import { TableDecorator } from "../../decorators/table.decorator";
import { StringDecorator } from "../../decorators/string.decorator";
import { DropDownDecorator } from "../../decorators/dropdown.decorator";

@TableDecorator()
export class DistrictEntity extends BaseEntity {

    @DropDownDecorator({ allowSearch: true, required: true, lookup: LookupData.Reference(CountryEntity) })
    CountryId: number;

    @DropDownDecorator({ allowSearch: true, required: true, lookup: LookupData.Reference(CityEntity, null, null, 'CountryId') })
    CityId: number;

    @StringDecorator({ allowSearch: true, required: true, type: StringType.Text, max: 150 })
    Name: string;

    @StringDecorator({ type: StringType.Text, max: 150 })
    Title: string;

    @StringDecorator({ type: StringType.Text, max: 150 })
    EnglishName: string;

    @StringDecorator({ type: StringType.Code })
    MeeyId: string;
}