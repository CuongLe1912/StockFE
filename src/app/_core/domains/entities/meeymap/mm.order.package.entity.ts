import { BaseEntity } from "../base.entity";
import { DateTimeType, StringType } from "../../enums/data.type";
import { TableDecorator } from "../../../../_core/decorators/table.decorator";
import { StringDecorator } from "../../../../_core/decorators/string.decorator";
import { DateTimeDecorator } from "../../../../_core/decorators/datetime.decorator";

@TableDecorator()
export class MMOrderPackageEntity extends BaseEntity {

    @StringDecorator({ type: StringType.Text, max: 50 })
    Action: string;

    @DateTimeDecorator({ label: 'Thời gian', type: DateTimeType.DateTime })
    CreatedAt: Date;

    @DateTimeDecorator({ label: 'Thời điểm bắt đầu hiệu lực', type: DateTimeType.DateTime })
    StartTime: Date;

    @DateTimeDecorator({ label: 'Thời điểm hết hiệu lực', type: DateTimeType.DateTime })
    EndTime: Date;

    @StringDecorator({ type: StringType.Code, max: 50 })
    OrderCode: string;

    @StringDecorator({ type: StringType.Text, max: 250 })
    OrderService: string;
}