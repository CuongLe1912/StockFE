import { LookupData } from '../../data/lookup.data';
import { BaseEntity } from '../../../../_core/domains/entities/base.entity';
import { TableDecorator } from '../../../../_core/decorators/table.decorator';
import { ImageDecorator } from '../../../../_core/decorators/image.decorator';
import { StringDecorator } from '../../../../_core/decorators/string.decorator';
import { NumberDecorator } from '../../../../_core/decorators/number.decorator';
import {StringType, NumberType} from '../../../../_core/domains/enums/data.type';
import { DropDownDecorator } from '../../../../_core/decorators/dropdown.decorator';

@TableDecorator()
export class MafAffiliateTreeAddEntity extends BaseEntity {
    @StringDecorator({ label: 'Tên nhánh', required: true, allowSearch: true, type: StringType.Text, max: 100 })
    BranchName: string;

    @DropDownDecorator({ label: 'Nhánh', required: true, lookup: LookupData.ReferenceUrl('/mafaffiliate/LookupBranch'), autoSelect: true, allowClear: false })
    BranchId: number;
    
    @StringDecorator({ label: 'Tên TTKD', required: true, allowSearch: true, type: StringType.Text, max: 100 })
    RankName: string;

    @StringDecorator({ placeholder: 'Nhập MeeyId, SĐT, Email' , required: true, type: StringType.Text, max: 50 })
    Search: string;

    @StringDecorator({ required: true, type: StringType.Text, max: 100 })
    MeeyId: string;

    @StringDecorator({ required: true, label: 'Lý do yêu cầu', type: StringType.MultiText, max: 200 })
    Reason: string;

    @NumberDecorator({ type: NumberType.Text })
    NodeId: number;

    @NumberDecorator({ type: NumberType.Text })
    ParentId: number;

    @StringDecorator({ type: StringType.Text, max: 150 })
    RefCode: string;

    @StringDecorator({ type: StringType.Text, max: 150 })
    Name: string;

    @StringDecorator({ type: StringType.Text, max: 150 })
    Phone: string;

    @StringDecorator({ type: StringType.Text, max: 150 })
    Email: string;

    @StringDecorator({ type: StringType.Text, max: 150 })
    Note: string;

    @StringDecorator({ type: StringType.Text, max: 150 })
    RefCurrentMeeyId: string;

    @StringDecorator({ type: StringType.Text, max: 150 })
    RefCurrentName: string;

    @StringDecorator({ type: StringType.Text, max: 150 })
    RefCurrentPhone: string;

    @StringDecorator({ type: StringType.Text, max: 150 })
    RefCurrentRankName: string;

    @StringDecorator({ type: StringType.Text, max: 150 })
    RefChangeMeeyId: string;

    @StringDecorator({ type: StringType.Text, max: 150 })
    RefChangeName: string;

    @StringDecorator({ type: StringType.Text, max: 150 })
    RefChangePhone: string;

    @StringDecorator({ type: StringType.Text, max: 150 })
    RefChangeRankName: string;

    @ImageDecorator({ label: 'File đính kèm', url: 'upload/uploadavatar', required: true })
    File: string;
}