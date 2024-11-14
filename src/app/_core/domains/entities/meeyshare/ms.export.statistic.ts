import { BaseEntity } from "../base.entity";
import { LookupData } from "../../data/lookup.data";
import { DateTimeType } from "../../enums/data.type";
import { TableDecorator } from "../../../../_core/decorators/table.decorator";
import { DropDownDecorator } from "../../../../_core/decorators/dropdown.decorator";
import { DateTimeDecorator } from "../../../../_core/decorators/datetime.decorator";

@TableDecorator({ title: 'Xuất dữ liệu thô' })
export class MeeyShareExportStatisticEntity extends BaseEntity {

    @DateTimeDecorator({ label: 'Thời gian từ - đến', required: true, type: DateTimeType.DateRange, allowClear: false, maxRange: 7 })
    ExportDate: Date[];

    @DropDownDecorator({
        label: 'Dữ liệu cần xuất', required: true, allowClear: false, multiple: true, lookup: LookupData.ReferenceItems([
            { label: 'Bài đăng', value: 1 },
            { label: 'Lượt xem', value: 2 },
            { label: 'Bình luận', value: 3 },
            { label: 'Lượt vote', value: 4 },
        ])
    })
    Type: number[];
}