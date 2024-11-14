import { BaseEntity } from '../base.entity';
import { LookupData } from '../../data/lookup.data';
import { MMLookupHistoryEntity } from './mm.lookup.history.entity';
import { TableDecorator } from '../../../../_core/decorators/table.decorator';
import { DropDownDecorator } from '../../../../_core/decorators/dropdown.decorator';

@TableDecorator()
export class MMLookupHistoryAssignEntity extends BaseEntity {

    @DropDownDecorator({ required: true, lookup: LookupData.ReferenceUrl('/user/LookupForMeeyMap', ['FullName', 'Email']) })
    ToUserId: number;

    @DropDownDecorator({ required: true, lookup: LookupData.ReferenceUrl('/user/LookupForMeeyMap', ['FullName', 'Email']) })
    FromUserId: number;

    @DropDownDecorator({ required: true, lookup: LookupData.Reference(MMLookupHistoryEntity, ['Address']) })
    MMLookupHistoryId: number;
}

@TableDecorator()
export class MMLookupHistoryAssignListEntity extends BaseEntity {
    Ids: number[];

    @DropDownDecorator({ required: true, lookup: LookupData.ReferenceUrl('/user/LookupForMeeyMap', ['FullName', 'Email']) })
    UserId: number;
}