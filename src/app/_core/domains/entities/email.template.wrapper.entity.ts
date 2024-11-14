import { BaseEntity } from "./base.entity";
import { StringType } from "../enums/data.type";
import { EditorIcon } from "../data/editor.param.data";
import { TableDecorator } from "../../decorators/table.decorator";
import { StringDecorator } from "../../decorators/string.decorator";

@TableDecorator({ title: 'Mẫu Email Header/Footer' })
export class EmailTemplateWrapperEntity extends BaseEntity {
    @StringDecorator({ required: true, allowSearch: true, type: StringType.Text, max: 250 })
    Name: string;

    @StringDecorator({
        required: true, type: StringType.Html,
        variables: [
            { name: 'Code', title: 'Mã OTP', icon: EditorIcon.Code },
            { name: 'Password', title: 'Mật khẩu', icon: EditorIcon.Password },
            { name: 'Email', title: 'Email', icon: EditorIcon.Email },
            { name: 'Link', title: 'Đường dẫn', icon: EditorIcon.Url, childrens: [
                { name: 'Link', title: 'Đường dẫn', icon: EditorIcon.Url },
                { name: 'AcceptLink', title: 'Đồng ý', icon: EditorIcon.Accept },
                { name: 'RejectLink', title: 'Từ chối', icon: EditorIcon.Reject },
            ] },
            { name: 'Address', title: 'Địa chỉ', icon: EditorIcon.Address },
            { name: 'Phone', title: 'Số điện thoại', icon: EditorIcon.Phone },
            { name: 'FullName', title: 'Họ và tên', icon: EditorIcon.Account },
            { name: 'Company', title: 'Tên công ty', icon: EditorIcon.Company },
            { name: 'Reason', title: 'Ghi chú/Lý do', icon: EditorIcon.Reason },
            { name: 'DateTime', title: 'Ngày tháng', icon: EditorIcon.DateTime },
        ]
    })
    Header: string;

    @StringDecorator({
        required: true, type: StringType.Html,
        variables: [
            { name: 'Code', title: 'Mã OTP', icon: EditorIcon.Code },
            { name: 'Password', title: 'Mật khẩu', icon: EditorIcon.Password },
            { name: 'Email', title: 'Email', icon: EditorIcon.Email },
            { name: 'Link', title: 'Đường dẫn', icon: EditorIcon.Url, childrens: [
                { name: 'Link', title: 'Đường dẫn', icon: EditorIcon.Url },
                { name: 'AcceptLink', title: 'Đồng ý', icon: EditorIcon.Accept },
                { name: 'RejectLink', title: 'Từ chối', icon: EditorIcon.Reject },
            ] },
            { name: 'Address', title: 'Địa chỉ', icon: EditorIcon.Address },
            { name: 'Phone', title: 'Số điện thoại', icon: EditorIcon.Phone },
            { name: 'FullName', title: 'Họ và tên', icon: EditorIcon.Account },
            { name: 'Company', title: 'Tên công ty', icon: EditorIcon.Company },
            { name: 'Reason', title: 'Ghi chú/Lý do', icon: EditorIcon.Reason },
            { name: 'DateTime', title: 'Ngày tháng', icon: EditorIcon.DateTime },
        ]
    })
    Footer: string;

    @StringDecorator({
        required: true, type: StringType.Html,
        variables: [
            { name: 'Code', title: 'Mã OTP', icon: EditorIcon.Code },
            { name: 'Password', title: 'Mật khẩu', icon: EditorIcon.Password },
            { name: 'Email', title: 'Email', icon: EditorIcon.Email },
            { name: 'Link', title: 'Đường dẫn', icon: EditorIcon.Url, childrens: [
                { name: 'Link', title: 'Đường dẫn', icon: EditorIcon.Url },
                { name: 'AcceptLink', title: 'Đồng ý', icon: EditorIcon.Accept },
                { name: 'RejectLink', title: 'Từ chối', icon: EditorIcon.Reject },
            ] },
            { name: 'Address', title: 'Địa chỉ', icon: EditorIcon.Address },
            { name: 'Phone', title: 'Số điện thoại', icon: EditorIcon.Phone },
            { name: 'FullName', title: 'Họ và tên', icon: EditorIcon.Account },
            { name: 'Company', title: 'Tên công ty', icon: EditorIcon.Company },
            { name: 'Reason', title: 'Ghi chú/Lý do', icon: EditorIcon.Reason },
            { name: 'DateTime', title: 'Ngày tháng', icon: EditorIcon.DateTime },
        ]
    })
    Content: string;
}