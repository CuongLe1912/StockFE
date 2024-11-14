import { BaseEntity } from "../base.entity";
import { BooleanType, StringType } from "../../enums/data.type";
import { LookupData, LookupUniqueData } from "../../data/lookup.data";
import { TableDecorator } from "../../../../_core/decorators/table.decorator";
import { StringDecorator } from "../../../../_core/decorators/string.decorator";
import { BooleanDecorator } from "../../../../_core/decorators/boolean.decorator";

@TableDecorator({ title: 'Loại dự án' })
export class MPOProjectTypeEntity extends BaseEntity {
    @StringDecorator({ label: 'Tên loại dự án', required: true, type: StringType.AutoComplete, max: 150, unique: LookupUniqueData.ReferenceUrl('/mpoprojecttype/exists/vi'), lookup: LookupData.ReferenceUrl('/MPOProject/LookupProjectType?language=vi') })
    Name: string;

    @StringDecorator({ label: 'Tên tiếng Anh', required: true, type: StringType.AutoComplete, max: 150, unique: LookupUniqueData.ReferenceUrl('/mpoprojecttype/exists/en'), lookup: LookupData.ReferenceUrl('/MPOProject/LookupProjectType?language=en') })
    NameEn: string;

    @BooleanDecorator({
        label: 'Trạng thái lựa chọn',
        type: BooleanType.RadioButton,
        lookup: {
            items: [
                { value: true, label: 'Cho phép Chọn', selected: true },
                { value: false, label: 'Không cho Chọn' }
            ]
        }
    })
    Active?: boolean;
}