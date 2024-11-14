import { BaseEntity } from "../base.entity";
import { MGPageEntity } from "./mg.page.entity";
import { LookupData } from "../../data/lookup.data";
import { MGSectionEntity } from "./mg.section.entity";
import { NumberType, StringType } from "../../enums/data.type";
import { TableDecorator } from "../../../../_core/decorators/table.decorator";
import { StringDecorator } from "../../../../_core/decorators/string.decorator";
import { NumberDecorator } from "../../../../_core/decorators/number.decorator";
import { DropDownDecorator } from "../../../../_core/decorators/dropdown.decorator";

@TableDecorator({ title: 'Nội dung trang' })
export class MGPageSectionEntity extends BaseEntity {
    @DropDownDecorator({ label: 'Trang', lookup: LookupData.Reference(MGPageEntity) })
    PageId: number;

    @DropDownDecorator({ label: 'Nội dung', lookup: LookupData.Reference(MGSectionEntity) })
    SectionId: number;

    @NumberDecorator({ label: 'Thứ tự', type: NumberType.Numberic })
    Order: number;

    @StringDecorator({ label: 'Chi tiết - Tiếng Việt', type: StringType.Json, max: 10000 })
    JsonValueVn: string;

    @StringDecorator({ label: 'Chi tiết - Tiếng Anh', type: StringType.Json, max: 10000 })
    JsonValueEn: string;
}