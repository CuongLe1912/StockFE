import { BaseEntity } from "./base.entity";
import { StringType } from "../enums/data.type";
import { LookupData } from "../data/lookup.data";
import { CountryEntity } from "./country.entity";
import { TableDecorator } from "../../decorators/table.decorator";
import { StringDecorator } from "../../decorators/string.decorator";
import { DropDownDecorator } from "../../decorators/dropdown.decorator";

@TableDecorator()
export class CityEntity extends BaseEntity {

    @DropDownDecorator({ allowSearch: true, required: true, lookup: LookupData.Reference(CountryEntity) })
    CountryId: number;
    
    @StringDecorator({ allowSearch: true, required: true, type: StringType.Text, max: 150 })
    Name: string;

    @StringDecorator({ allowSearch: true, type: StringType.Text, max: 150 })
    Title: string;

    @StringDecorator({ type: StringType.Text, max: 150 })
    EnglishName: string;

    @StringDecorator({ type: StringType.Code })
    MeeyId: string;
}