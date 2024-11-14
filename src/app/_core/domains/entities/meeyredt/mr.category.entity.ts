import { TableDecorator } from "../../../../_core/decorators/table.decorator";
import { StringDecorator } from "../../../../_core/decorators/string.decorator";

@TableDecorator({ title: 'Chuyên mục' })
export class MRCategoryEntity {
    @StringDecorator({ label: 'Tên - Tiếng Việt', required: true, max: 150 })
    NameVn: string;

    @StringDecorator({ label: 'Tên - Tiếng Anh', max: 150 })
    NameEn: string;

    // @NumberDecorator({ label: 'Thứ tự', type: NumberType.Numberic })
    // Order: number;

    _Id: string;
}