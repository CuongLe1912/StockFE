import { BankEntity } from '../bank.entity';
import { BaseEntity } from '../base.entity';
import { LookupData, LookupUniqueData } from '../../data/lookup.data';
import { MPRevenueStatusType } from './enums/mp.revenue.status.type';
import { ConstantHelper } from '../../../../_core/helpers/constant.helper';
import { UtilityExHelper } from '../../../../_core/helpers/utility.helper';
import { TableDecorator } from '../../../../_core/decorators/table.decorator';
import { StringDecorator } from '../../../../_core/decorators/string.decorator';
import { NumberDecorator } from '../../../../_core/decorators/number.decorator';
import { DropDownDecorator } from '../../../../_core/decorators/dropdown.decorator';
import { DateTimeType, DropdownLoadType, NumberType, StringType } from '../../enums/data.type';
import { DateTimeDecorator, DateTimeFormat } from '../../../../_core/decorators/datetime.decorator';

@TableDecorator({ title: 'Mã tiền thu' })
export class MPRevenueEntity extends BaseEntity {
    @StringDecorator({ label: 'Nội dung chuyển tiền', type: StringType.MultiText, max: 300 })
    Note: string;

    @NumberDecorator({ label: "Số tiền thu", required: true, type: NumberType.Text, min: 100, max: 9999999999999999999 })
    Amount: number;

    @DropDownDecorator({ label: 'Nguồn tiền', placeholder: 'Nguồn tiền', required: true, lookup: LookupData.ReferenceUrl('/bank/lookupBanks', ['Name']) })
    BankId: number;

    @DropDownDecorator({ label: 'Trạng thái', lookup: LookupData.ReferenceItems(ConstantHelper.MP_REVENUE_STATUS_TYPES) })
    Status: MPRevenueStatusType;

    @DateTimeDecorator({ label: 'Ngày nhận', required: true, type: DateTimeType.Date, max: new Date(), format: DateTimeFormat.DMY })
    ReceiveDate: Date;

    @StringDecorator({
        label: 'Mã tiền thu', required: true, type: StringType.AutoGenerate, max: 50, unique: LookupUniqueData.Reference(MPRevenueEntity, 'Code'), generateFunction: () => {
            return UtilityExHelper.randomNumber(10)
        }
    })
    Code: string;

    @DropDownDecorator({ label: 'Mã tiền thu', lookup: { url: '/MPRevenue/LookupRevenue', loadType: DropdownLoadType.Ajax, propertyDisplay: ['Code'], propertyValue: "Code" } })
    FilterCode: string;

    @StringDecorator({ label: 'Người chuyển', placeholder: 'Nhập họ tên, số điện thoại, email', type: StringType.Text, max: 150 })
    UserTransfer: string;

    @DropDownDecorator({ label: 'Sale chăm sóc', lookup: LookupData.ReferenceUrl('/user/LookupSaleForMeeyCrm', ['FullName', 'Email']) })
    SaleId: number;

    @DropDownDecorator({ label: 'Mã giao dịch', lookup: { url: '/mptransactions/LookupTransaction', loadType: DropdownLoadType.Ajax, propertyDisplay: ['Code'], propertyValue: "Code" } })
    TransactionCode: string;
}