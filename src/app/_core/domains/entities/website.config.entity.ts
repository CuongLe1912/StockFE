import { BaseEntity } from "./base.entity";
import { StringType } from "../enums/data.type";
import { TableDecorator } from "../../decorators/table.decorator";
import { StringDecorator } from "../../decorators/string.decorator";

@TableDecorator({ title: 'Cấu hình website' })
export class WebsiteConfigEntity extends BaseEntity {
    @StringDecorator({ label: 'Tên miền', required: true, type: StringType.Text, max: 1000 })
    Domain: string;

    @StringDecorator({ label: 'Số điện thoại khách hàng', required: true, max: 10, type: StringType.PhoneText })
    CustomerPhone: string;

    @StringDecorator({ label: 'Tên liên hệ', required: true, max: 250, type: StringType.Account })
    ContactName: string;

    @StringDecorator({ label: 'Số điện thoại liên hệ', required: true, max: 10, type: StringType.PhoneText })
    ContactPhone: string;

    @StringDecorator({ label: 'Email liên hệ', max: 250, type: StringType.Email })
    ContactEmail: string;

    @StringDecorator({ label: 'Dữ liệu cấu hình', required: true, max: 100000, type: StringType.MultiText, rows: 19 })
    JsonConfig: string;
}