import { BaseEntity } from "../base.entity";
import { WardEntity } from "../ward.entity";
import { CityEntity } from "../city.entity";
import { StringType } from "../../enums/data.type";
import { DistrictEntity } from "../district.entity";
import { LookupData, LookupUniqueData } from "../../data/lookup.data";
import { MCRMCompanyStatusType } from "./enums/mcrm.company.status.type";
import { TableDecorator } from "../../../../_core/decorators/table.decorator";
import { StringDecorator } from "../../../../_core/decorators/string.decorator";
import { DropDownDecorator } from "../../../../_core/decorators/dropdown.decorator";

@TableDecorator({ title: 'Doanh nghiệp' })
export class MCRMCompanyEntity extends BaseEntity {
    @StringDecorator({ required: true, label: 'Tên doanh nghiệp', max: 250, unique: LookupUniqueData.Reference(MCRMCompanyEntity, 'Name') })
    Name: string;

    @StringDecorator({ required: true, type: StringType.PhoneText, min: 10, max: 10 })
    Phone: string;

    @StringDecorator({ type: StringType.Email, max: 250 })
    Email: string;

    @StringDecorator({ type: StringType.Link, max: 250 })
    Website: string;

    @StringDecorator({ required: true, type: StringType.Code, max: 20, unique: LookupUniqueData.Reference(MCRMCompanyEntity, 'TaxCode') })
    TaxCode: string;

    @StringDecorator({ label: 'Người đại diện', type: StringType.Account, max: 250 })
    Leader: string;
    
    @StringDecorator({ type: StringType.PhoneText, min: 10, max: 10 })
    LeaderPhone: string;

    @StringDecorator({ type: StringType.Email, max: 250 })
    LeaderEmail: string;
    
    @StringDecorator({ label: 'Địa chỉ xuất hóa đơn', type: StringType.MultiText, max: 1000 })
    Address: string;

    @DropDownDecorator({ lookup: LookupData.Reference(CityEntity, ['Name'], 'Id') })
    CityId: number;

    @DropDownDecorator({ lookup: LookupData.Reference(DistrictEntity, ['Name'], 'Id', 'CityId') })
    DistrictId: number;

    @DropDownDecorator({ lookup: LookupData.Reference(WardEntity, ['Name'], 'Id', 'DistrictId') })
    WardId: number;

    @DropDownDecorator({ lookup: LookupData.ReferenceEnum(MCRMCompanyStatusType) })
    Status: MCRMCompanyStatusType;
}