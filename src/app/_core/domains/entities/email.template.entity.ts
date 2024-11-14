import { BaseEntity } from "./base.entity";
import { StringType } from "../enums/data.type";
import { LookupData } from "../data/lookup.data";
import { EditorIcon } from "../data/editor.param.data";
import { SmtpAccountEntity } from "./smtp.account.entity";
import { ConstantHelper } from "../../helpers/constant.helper";
import { EmailTemplateType } from "../enums/email.template.type";
import { TableDecorator } from "../../decorators/table.decorator";
import { StringDecorator } from "../../decorators/string.decorator";
import { DropDownDecorator } from "../../decorators/dropdown.decorator";
import { EmailTemplateWrapperEntity } from "./email.template.wrapper.entity";

@TableDecorator({ title: 'Mẫu Email' })
export class EmailTemplateEntity extends BaseEntity {
    @StringDecorator({ required: true, allowSearch: true, type: StringType.Text, max: 550 })
    Title: string;

    @DropDownDecorator({ required: true, allowSearch: true, lookup: { items: ConstantHelper.EMAILTEMPLATE_TYPES } })
    Type: EmailTemplateType;

    @DropDownDecorator({ label: 'Tài khoản gửi mail', required: true, allowSearch: true, lookup: LookupData.Reference(SmtpAccountEntity, ['UserName', 'Host']) })
    SmtpAccountId: number;

    @DropDownDecorator({ label: 'Mẫu Header/Footer', allowSearch: true, lookup: LookupData.Reference(EmailTemplateWrapperEntity, ['Name']), autoSelect: true })
    EmailTemplateWrapperId: number;

    @StringDecorator({
        required: true, type: StringType.Html,
        variables: [
            { name: 'Code', title: 'Mã OTP', icon: EditorIcon.Code },
            { name: 'Money', title: 'Số tiền', icon: EditorIcon.Money },
            { name: 'Password', title: 'Mật khẩu', icon: EditorIcon.Password },
            { name: 'Email', title: 'Email', icon: EditorIcon.Email },
            { name: 'Link', title: 'Đường dẫn', icon: EditorIcon.Url, childrens: [
                { name: 'Link', title: 'Đường dẫn', icon: EditorIcon.Url },
                { name: 'AcceptLink', title: 'Đồng ý', icon: EditorIcon.Accept },
                { name: 'RejectLink', title: 'Từ chối', icon: EditorIcon.Reject },
            ] },
            { name: 'Address', title: 'Địa chỉ', icon: EditorIcon.Address },
            { name: 'Phone', title: 'Số điện thoại', icon: EditorIcon.Phone, childrens: [
                { name: 'Phone', title: 'Số điện thoại', icon: EditorIcon.Phone },
                { name: 'PhoneMeeyLand', title: 'Số điện thoại Meeyland', icon: EditorIcon.Phone },
            ] },
            { name: 'FullName', title: 'Họ và tên', icon: EditorIcon.Account },
            { name: 'Company', title: 'Tên công ty', icon: EditorIcon.Company },
            { name: 'Reason', title: 'Ghi chú/Lý do', icon: EditorIcon.Reason },
            { name: 'DateTime', title: 'Ngày tháng', icon: EditorIcon.DateTime },
        ]
    })
    Content: string;
}