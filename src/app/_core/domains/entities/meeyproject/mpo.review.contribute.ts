import { BaseEntity } from "../base.entity";
import { DateTimeType, StringType } from "../../enums/data.type";
import { TableDecorator } from "../../../decorators/table.decorator";
import { StringDecorator } from "../../../decorators/string.decorator";
import { DateTimeDecorator } from "../../../decorators/datetime.decorator";
import { DropDownDecorator } from "../../../decorators/dropdown.decorator";

@TableDecorator({ title: 'Đóng góp dự án' })
export class MPOReviewContributeEntity extends BaseEntity {
    @StringDecorator({ label: 'Tên dự án', type: StringType.Text })
    ProjectName: string;

    @StringDecorator({ label: 'Số điện thoại', type: StringType.Phone })
    Phone: string;

    @StringDecorator({ label: 'Meey Id', type: StringType.Text })
    MeeyId: string;

    @StringDecorator({ label: 'Mô tả', type: StringType.MultiText })
    Content: string;

    @DropDownDecorator({
        label: 'Tình trạng',
        lookup: {
            items: [
                { value: true, label: 'Đã xem' },
                { value: false, label: 'Chưa xem' }
            ]
        }
    })
    Seen?: boolean;

    @DateTimeDecorator({ label: 'Thời gian', type: DateTimeType.DateRange, maxCurent: true })
    FilterDateRange: Date;
}