import { BaseEntity } from "../base.entity";
import { BooleanType, StringType } from "../../enums/data.type";
import { TableDecorator } from "../../../decorators/table.decorator";
import { StringDecorator } from "../../../decorators/string.decorator";
import { BooleanDecorator } from "../../../decorators/boolean.decorator";
import { LookupData } from "../../data/lookup.data";

@TableDecorator()
export class MPOProjectDocumentEntity extends BaseEntity {
    @StringDecorator({ label: 'Tên giấy tờ', required: true, type: StringType.AutoComplete, max: 150, lookup: LookupData.ReferenceUrl('/MPOProjectDocument/Lookup') })
    Name: string;

    @StringDecorator({ label: 'Tên Tiếng Anh', required: true, type: StringType.AutoComplete, max: 150, lookup: LookupData.ReferenceUrl('/MPOProjectDocument/Lookup?showNameEn=true') })
    NameEn: string;

    @BooleanDecorator({
        type: BooleanType.RadioButton,
        label: 'Trạng thái lựa chọn',
        required: true,
        lookup: {
            items: [
                { value: true, label: 'Cho phép lựa chọn' },
                { value: false, label: 'Không cho phép lựa chọn' }
            ]
        }
    })
    Active?: boolean;
}