import { BaseEntity } from "../base.entity";
import { StringType } from "../../enums/data.type";
import { LookupData, LookupUniqueData } from "../../data/lookup.data";
import { TableDecorator } from "../../../../_core/decorators/table.decorator";
import { StringDecorator } from "../../../../_core/decorators/string.decorator";
import { DropDownDecorator } from "../../../../_core/decorators/dropdown.decorator";

@TableDecorator({ title: 'Đối tác' })
export class MLPartnerEntity extends BaseEntity {

    @StringDecorator({ required: true, type: StringType.Text, max: 150 })
    Name: string;
}

@TableDecorator({ title: 'Mã đối tác' })
export class MLPartnerCodeEntity extends BaseEntity {

    @DropDownDecorator({ required: true, label: 'Đối tác', lookup: LookupData.Reference(MLPartnerEntity) })
    MLPartnerId: number;

    @StringDecorator({ required: true, unique: LookupUniqueData.Reference(MLPartnerCodeEntity, 'PartnerKey'), label: 'Mã đối tác', type: StringType.Code, max: 50 })
    PartnerKey: string;
}