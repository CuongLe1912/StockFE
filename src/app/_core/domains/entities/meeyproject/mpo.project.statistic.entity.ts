import { DateTimeDecorator } from "../../../../_core/decorators/datetime.decorator";
import { TableDecorator } from "../../../../_core/decorators/table.decorator";
import { DateTimeType } from "../../enums/data.type";
import { BaseEntity } from "../base.entity";

@TableDecorator()
export class MPOStatisticEntity extends BaseEntity {
    @DateTimeDecorator({ label: 'Thời gian lấy báo cáo', required: true, type: DateTimeType.DateRange })
    Date: Date[];
}