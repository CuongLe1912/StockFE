import { BaseEntity } from '../base.entity';
import { LookupData } from '../../data/lookup.data';
import { NumberType, StringType } from '../../enums/data.type';
import { TableDecorator } from '../../../decorators/table.decorator';
import { StringDecorator } from '../../../decorators/string.decorator';
import { NumberDecorator } from '../../../decorators/number.decorator';
import { DropDownDecorator } from '../../../decorators/dropdown.decorator';

@TableDecorator()
export class MCRMCustomerBankEntity extends BaseEntity {
    @StringDecorator({ label: 'Tên công ty', placeholder: 'Nhập tên công ty', type: StringType.Text, max: 200, required: true })
    Name: string;

    @StringDecorator({ label: 'Email', type: StringType.Email, max: 100, required: true })
    Email: string;

    @StringDecorator({ label: 'Số điện thoại', required: true, type: StringType.PhoneText, min: 10, max: 10 })
    Phone: string;

    @StringDecorator({ label: 'Tên viết tắt', type: StringType.Text, max: 50 })
    ShortName: string;

    @StringDecorator({ label: 'Số ĐKDN', type: StringType.Text, max: 100 })
    RegisterNumber: string;

    @StringDecorator({ label: 'Địa chỉ', type: StringType.Text, max: 500 })
    Address: string;

    @StringDecorator({ label: 'Tên domain', required: true, type: StringType.Text, max: 200 })
    Domain: string;

    @NumberDecorator({ label: 'Giới hạn nhân viên ', placeholder: 'Không giới hạn', type: NumberType.Text, max: 9999999999 })
    AmountMembers: number;

    @StringDecorator({ label: 'Mã số thuế', type: StringType.Text, max: 13 })
    TaxCode: string;

    @DropDownDecorator({ label: 'Sale', required: true, lookup: LookupData.ReferenceUrl('/user/LookupSaleForMeeyId', ['FullName', 'Email']) })
    SaleId: number;

    @DropDownDecorator({ label: 'CSKH', lookup: LookupData.ReferenceUrl('/user/LookupSupportForMeeyId', ['FullName', 'Email']) })
    SupportId: number;
}
