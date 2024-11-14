import { BaseEntity } from "../base.entity";
import { StringType } from "../../enums/data.type";
import { TableDecorator } from "../../../../_core/decorators/table.decorator";
import { StringDecorator } from "../../../../_core/decorators/string.decorator";

@TableDecorator({ title: 'Chủ đầu tư' })
export class MPOContributesEntity extends BaseEntity {
    @StringDecorator({ label: 'Tên dự án', required: true, type: StringType.Text, max: 150 })
    Name: string;

    @StringDecorator({ label: 'Số điện thoại', required: true, type: StringType.Phone, max: 10 })
    Phone: string;

    @StringDecorator({ label: 'Nội dung', required: true, type: StringType.MultiText, max: 500 })
    Content: string;
}