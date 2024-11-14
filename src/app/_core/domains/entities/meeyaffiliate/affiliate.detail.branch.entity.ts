import { LookupData } from '../../data/lookup.data';
import { BaseEntity } from '../../../../_core/domains/entities/base.entity';
import { TableDecorator } from '../../../../_core/decorators/table.decorator';
import { StringDecorator } from '../../../../_core/decorators/string.decorator';
import { DropDownDecorator } from '../../../../_core/decorators/dropdown.decorator';
import { DateTimeDecorator } from "../../../../_core/decorators/datetime.decorator";
import {StringType, DateTimeType, NumberType} from '../../../../_core/domains/enums/data.type';

@TableDecorator()
export class MafAffiliateDetailBranchEntity extends BaseEntity {
    @StringDecorator({ label: "Khách hàng", type: StringType.Text, placeholder: "Nhập Số điện thoại, Email, MeeyId, Mã Ref", max: 100 })
    Customer: string;

    @DropDownDecorator({ label: 'Nhánh', lookup: LookupData.ReferenceUrl('/mafaffiliate/LookupBranch') })
    BranchId: string;

    @DropDownDecorator({ label: 'Trung tâm', lookup: LookupData.ReferenceUrl('/mafaffiliate/LookupCenterRank/[id]') })
    RankId: string;

    @DropDownDecorator({ label: 'Trung tâm', lookup: LookupData.ReferenceUrl('/mafaffiliate/LookupCenterRank', null, null, 'BranchId') })
    RankDependId: string;

    @DropDownDecorator({ label: 'Tầng', lookup: LookupData.ReferenceUrl('/mafaffiliate/LookupLevel/[id]') })
    Level: number;

    @StringDecorator({ label: 'Họ tên', allowSearch: true, type: StringType.Text, max: 150 })
    Name: string;

    @StringDecorator({ label: 'Số điện thoại', type: StringType.PhoneText, min: 10, max: 10 })
    Phone: string;

    @DateTimeDecorator({ label: 'Tháng', type: DateTimeType.DateMonth, maxCurent: true })
    Month: string;
}