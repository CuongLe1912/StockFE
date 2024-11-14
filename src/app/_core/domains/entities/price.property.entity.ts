import { BaseEntity } from "./base.entity";
import { LookupData } from "../data/lookup.data";
import { TableDecorator } from "../../decorators/table.decorator";
import { DropDownDecorator } from "../../decorators/dropdown.decorator";

@TableDecorator({ title: 'Định giá nhà' })
export class PricePropertyEntity extends BaseEntity {

    @DropDownDecorator({ label: 'Dự án', required: true, lookup: LookupData.ReferenceUrl('/PriceProperty/LookupProject') })
    ProjectId: string;

    @DropDownDecorator({ label: 'Tầng', required: true, lookup: LookupData.ReferenceUrl('/PriceProperty/LookupFloor', null, null, 'BuildingId') })
    FloorId: string;

    @DropDownDecorator({ label: 'Căn hộ', required: true, lookup: LookupData.ReferenceUrl('/PriceProperty/LookupProperty', null, null, 'FloorId') })
    PropertyId: string;

    @DropDownDecorator({ label: 'Tòa nhà', required: true, lookup: LookupData.ReferenceUrl('/PriceProperty/LookupBuilding', null, null, 'ProjectId') })
    BuildingId: string;
}