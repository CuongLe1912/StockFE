import { BaseEntity } from "../base.entity";
import { BooleanType, StringType } from "../../enums/data.type";
import { TableDecorator } from "../../../../_core/decorators/table.decorator";
import { StringDecorator } from "../../../../_core/decorators/string.decorator";
import { BooleanDecorator } from "../../../../_core/decorators/boolean.decorator";
import { DropDownDecorator } from "../../../../_core/decorators/dropdown.decorator";
import { LookupData } from "../../data/lookup.data";
import { MPOViolationType } from "./enums/mpo.violation.type";

@TableDecorator()
export class MPOProjectViolationTypeEntity extends BaseEntity {
    @DropDownDecorator({ label: 'Hình thức', required: true, lookup: LookupData.ReferenceReverseEnum(MPOViolationType) })
    Type: string;

    @StringDecorator({ label: 'Loại vi phạm', required: true, type: StringType.AutoComplete, max: 150, lookup: LookupData.ReferenceUrl('/MPOProjectViolationType/Lookup') })
    Name: string;

    @StringDecorator({ label: 'Loại vi phạm (T.Anh)', required: true, placeholder: 'Loại vi phạm (Tiếng Anh)', type: StringType.AutoComplete, max: 150, lookup: LookupData.ReferenceUrl('/MPOProjectViolationType/Lookup?showNameEn=true') })
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

    @BooleanDecorator({ label: 'Bắt buộc nhập thông tin', type: BooleanType.Checkbox })
    RequireInformation?: boolean;
}