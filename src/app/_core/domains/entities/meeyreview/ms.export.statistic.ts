import { BaseEntity } from "../base.entity";
import { LookupData } from "../../data/lookup.data";
import { DateTimeType } from "../../enums/data.type";
import { TableDecorator } from "../../../../_core/decorators/table.decorator";
import { DropDownDecorator } from "../../../../_core/decorators/dropdown.decorator";
import { DateTimeDecorator } from "../../../../_core/decorators/datetime.decorator";

@TableDecorator({ title: 'Xuất dữ liệu thô' })
export class MeeyReviewProjectExportStatisticEntity extends BaseEntity {

    @DateTimeDecorator({ label: 'Thời gian từ - đến', required: true, type: DateTimeType.DateRange, allowClear: false})
    ExportDate: Date[];
}
export class MeeyReviewExportStatisticEntity extends BaseEntity {

    @DateTimeDecorator({ label: 'Thời gian từ - đến', required: true, type: DateTimeType.DateRange, allowClear: false })
    ExportDate: Date[];

    @DropDownDecorator({
        label: 'Dữ liệu cần xuất', required: true, allowClear: false, lookup: LookupData.ReferenceItems([
            { label: 'Dữ liệu về review', value: 1 },
            { label: 'Dữ liệu về tương tác', value: 2 },
            { label: 'Dữ liệu về phản hồi', value: 3 },
        ])
    })
    Type: number;
}