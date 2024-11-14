import { BaseEntity } from "../base.entity";
import { StringType } from "../../enums/data.type";
import { LookupData } from "../../data/lookup.data";
import { EditorIcon } from "../../data/editor.param.data";
import { TableDecorator } from "../../../decorators/table.decorator";
import { StringDecorator } from "../../../decorators/string.decorator";
import { DropDownDecorator } from "../../../decorators/dropdown.decorator";
import { EmailTemplateWrapperEntity } from "../email.template.wrapper.entity";

@TableDecorator({ title: 'Mẫu Email' })
export class MCRMEmailTemplateEntity extends BaseEntity {
    @StringDecorator({ required: true, allowSearch: true, type: StringType.Text, max: 150 })
    Name: string;

    @StringDecorator({ required: true, allowSearch: true, type: StringType.Text, max: 550 })
    Title: string;

    @DropDownDecorator({ label: 'Mẫu Header/Footer', allowSearch: true, lookup: LookupData.Reference(EmailTemplateWrapperEntity, ['Name']), autoSelect: true })
    EmailTemplateWrapperId: number;

    @StringDecorator({
        required: true, type: StringType.Html,
        variables: [
            { name: 'FullName', title: 'Họ và tên', icon: EditorIcon.Account },
            { name: 'DateTime', title: 'Ngày tháng', icon: EditorIcon.DateTime },
        ]
    })
    Content: string;
}