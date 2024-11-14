import { BaseEntity } from "../base.entity";
import { StringType } from "../../enums/data.type";
import { TableDecorator } from "../../../../_core/decorators/table.decorator";
import { BooleanDecorator } from "../../../../_core/decorators/boolean.decorator";
import { StringDecorator } from "../../../../_core/decorators/string.decorator";

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

    @BooleanDecorator({ label: 'Tình trạng', })
    Seen?: boolean;
}