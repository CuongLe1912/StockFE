import { BaseEntity } from "./base.entity";
import { StringType } from "../enums/data.type";
import { LookupUniqueData } from "../data/lookup.data";
import { ImageDecorator } from "../../decorators/image.decorator";
import { TableDecorator } from "../../decorators/table.decorator";
import { StringDecorator } from "../../decorators/string.decorator";

@TableDecorator({ title: 'Ngân hàng' })
export class BankEntity extends BaseEntity {
    @StringDecorator({ label: 'Mã ngân hàng', required: true, type: StringType.Code, max: 20, unique: LookupUniqueData.Reference(BankEntity, 'Code') })
    Code: string;

    @StringDecorator({ label: 'Mã ngân hàng [MeeyPay]', type: StringType.Code, max: 20 })
    BankCode: string;

    @StringDecorator({ label: 'STK ngân hàng [MeeyPay]', type: StringType.Code, max: 50 })
    AccountNumber: string;

    @StringDecorator({ label: 'Tên ngân hàng', required: true, type: StringType.Text, max: 250, unique: LookupUniqueData.Reference(BankEntity, 'Name') })
    Name: string;

    @StringDecorator({ label: 'Miêu tả', type: StringType.MultiText, max: 550 })
    Description: string;

    @ImageDecorator({ label: 'Icon', url: 'upload/uploadavatar' })
    Icon: string;
}