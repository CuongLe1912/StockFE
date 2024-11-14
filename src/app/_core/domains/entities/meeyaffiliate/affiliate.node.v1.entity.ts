import { LookupData } from '../../data/lookup.data';
import { BaseEntity } from '../../../../_core/domains/entities/base.entity';
import { ImageDecorator } from '../../../../_core/decorators/image.decorator';
import { TableDecorator } from '../../../../_core/decorators/table.decorator';
import { StringDecorator } from '../../../../_core/decorators/string.decorator';
import { DropDownDecorator } from '../../../../_core/decorators/dropdown.decorator';
import { DateTimeDecorator } from "../../../../_core/decorators/datetime.decorator";
import {StringType, DateTimeType} from '../../../../_core/domains/enums/data.type';

@TableDecorator()
export class MafAffiliateNodeV1Entity extends BaseEntity {
    @StringDecorator({ label: "Mã", type: StringType.Text, })
    Code: string;

    @StringDecorator({ label: 'Họ tên', type: StringType.Text })
    Name: string;

    @StringDecorator({ label: 'Email', type: StringType.Email })
    Email: string;

    @StringDecorator({ label: 'Số điện thoại', type: StringType.PhoneText })
    Phone: string;
    
    @ImageDecorator({ url: 'upload/uploadavatar' })
    Avatar: string;

    @StringDecorator({ label: '', type: StringType.Text })
    MeeyId: string;

    @StringDecorator({ label: '', type: StringType.Text })
    ParentId: string;

    @DateTimeDecorator({ label: 'Ngày tham gia', required: true, type: DateTimeType.DateTime })
	JoinDate: Date;

    @DropDownDecorator({ label: 'Nhánh', lookup: LookupData.ReferenceUrl('/mafaffiliate/LookupBranch') })
    BranchId: string;
}