import { BaseEntity } from "../base.entity";
import { DateTimeType } from "../../enums/data.type";
import { TableDecorator } from "../../../../_core/decorators/table.decorator";
import { DateTimeDecorator } from "../../../../_core/decorators/datetime.decorator";

@TableDecorator({ title: 'Báo cáo số liệu' })
export class MeeyShareStatisticEntity extends BaseEntity {

    @DateTimeDecorator({ label: 'Thời gian lấy báo cáo', required: true, type: DateTimeType.DateRange, allowClear: false })
    ReportDate: Date[];
}