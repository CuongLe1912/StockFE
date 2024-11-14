import { LookupData } from '../../data/lookup.data';
import { ConstantHelper } from '../../../../_core/helpers/constant.helper';
import { BaseEntity } from '../../../../_core/domains/entities/base.entity';
import { TableDecorator } from '../../../../_core/decorators/table.decorator';
import { StringDecorator } from '../../../../_core/decorators/string.decorator';
import { NumberDecorator } from '../../../../_core/decorators/number.decorator';
import { DropDownDecorator } from '../../../../_core/decorators/dropdown.decorator';
import { DateTimeDecorator } from "../../../../_core/decorators/datetime.decorator";
import { StringType, DateTimeType, NumberType } from '../../../../_core/domains/enums/data.type';
import { MAFContractCommissionStatus, MAFContractType, MAFFilterChannelType, MAFFilterContractStatus, TransactionCommissionType } from './enums/contract.type';

@TableDecorator()
export class MafAffiliateEntity extends BaseEntity {
    @NumberDecorator()
    Index: number;

    @StringDecorator({ label: "Khách hàng", type: StringType.Text, placeholder: "Nhập Số điện thoại, Email, MeeyId, Mã Ref", max: 50 })
    Customer: string;

    @DropDownDecorator({ label: 'Nhánh', lookup: LookupData.ReferenceUrl('/mafaffiliate/LookupBranch') })
    BranchId: string;

    @DropDownDecorator({ label: 'Cấp bậc', lookup: LookupData.ReferenceUrl('/mafaffiliate/LookupRanks') })
    RankId: string;

    @DropDownDecorator({ label: 'Tầng', lookup: LookupData.ReferenceUrl('/mafaffiliate/LookupLevel/[id]') })
    Level: number;

    @StringDecorator({ label: 'Họ tên', allowSearch: true, type: StringType.Text, max: 50 })
    Name: string;

    @StringDecorator({ label: 'Số điện thoại', type: StringType.PhoneText, min: 10, max: 50 })
    Phone: string;

    @DateTimeDecorator({ label: 'Tháng', type: DateTimeType.DateMonth, maxCurent: true })
    Month: string;

    @DateTimeDecorator({ label: 'Ngày tham gia', required: true, type: DateTimeType.DateTime })
    JoinDate: Date;

    @DropDownDecorator({ label: "Loại khách hàng", required: true, lookup: { items: ConstantHelper.MAF_CONTRACT_TYPES } })
    Type: MAFContractType;

    @DropDownDecorator({ label: "Trạng thái", required: true, lookup: { items: ConstantHelper.MAF_CONTRACT_CONMMISSION_STATUS_TYPES } })
    CommissionStatus: MAFContractCommissionStatus;

    @DropDownDecorator({ label: "Trạng thái hợp đồng", required: true, lookup: { items: ConstantHelper.MAF_FILTER_CONTRACT_STATUS_TYPES } })
    FilterContractStatus: MAFFilterContractStatus;

    @DropDownDecorator({ label: "Kênh", required: true, lookup: { items: ConstantHelper.MAF_FILTER_CXHANNEL_TYPES } })
    FilterChannelType: MAFFilterChannelType;

    @DropDownDecorator({ label: 'Nguồn', lookup: LookupData.ReferenceUrl('/mafaffiliate/LookupSource') })
    FilterSource: string;

    @DropDownDecorator({ label: 'Sản phẩm', lookup: LookupData.ReferenceUrl('/mafaffiliate/LookupProduct') })
    FilterProduct: string;

    @StringDecorator({ label: "Từ nhánh của KH", type: StringType.Text, placeholder: "Nhập Số điện thoại, Email, MeeyId, Mã Ref", max: 50 })
    FilterRootId: string;

    @NumberDecorator({ label: "Doanh số lũy kế", type: NumberType.Text })
    CumulativeAmount: number;

    @DropDownDecorator({ label: 'Phân loại', lookup: { items: ConstantHelper.MAF_TRANSACTION_COMMISSION_TYPES } })
    FilterCommissionType: TransactionCommissionType;

    AllowApproveRankCumulative: boolean;
    RankCumulative: string;
    RankCumulativeNext: string;
    MeeyId: string;
}

@TableDecorator()
export class MafAddNodeEntity extends BaseEntity {
    @StringDecorator({ label: 'Họ tên', allowSearch: true, type: StringType.Text, max: 50 })
    Name: string;

    @StringDecorator({ label: 'Số điện thoại', type: StringType.PhoneText, min: 10, max: 50 })
    Phone: string;

    @StringDecorator({ label: 'Email', type: StringType.Email, min: 10, max: 50 })
    Email: string;

    @StringDecorator({ label: 'MeeyId', type: StringType.Code, min: 10, max: 50 })
    MeeyId: string;

    @StringDecorator({ label: 'Tìm kiếm', required: true, type: StringType.Code, min: 10, max: 250 })
    Search: string;
}