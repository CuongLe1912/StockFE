import { BaseEntity } from '../base.entity';
import { LookupData } from '../../data/lookup.data';
import { DateTimeType, StringType } from '../../enums/data.type';
import { ConstantHelper } from '../../../../_core/helpers/constant.helper';
import { TableDecorator } from '../../../../_core/decorators/table.decorator';
import { StringDecorator } from '../../../../_core/decorators/string.decorator';
import { NumberDecorator } from '../../../../_core/decorators/number.decorator';
import { MMLookupHistoryStatusType } from './enums/mm.lookup.history.status.type';
import { DropDownDecorator } from '../../../../_core/decorators/dropdown.decorator';
import { DateTimeDecorator } from '../../../../_core/decorators/datetime.decorator';

@TableDecorator()
export class MMLookupHistoryEntity extends BaseEntity {

    @DropDownDecorator({ required: true, lookup: LookupData.ReferenceUrl('/user/LookupForMeeyMap', ['FullName', 'Email']) })
    UserId: number;

    @StringDecorator({ type: StringType.Text, max: 50 })
    MeeyId: string;

    @StringDecorator({ type: StringType.Text, max: 50 })
    MeeyUserId: string;

    @StringDecorator({ type: StringType.Text, max: 100 })
    Name: string;

    @StringDecorator({ type: StringType.Account, max: 250 })
    User: string;

    @StringDecorator({ type: StringType.Email, max: 50 })
    Email: string;

    @StringDecorator({ type: StringType.PhoneText, min: 10, max: 10 })
    Phone: string;

    @DropDownDecorator({
        required: true,
        allowSearch: true,
        lookup: { items: ConstantHelper.MM_LOOKUP_HISTORY_STATUS_TYPES }
    })
    Status: MMLookupHistoryStatusType;

    @StringDecorator({ required: true, label: 'Ghi chú/Lý do', type: StringType.MultiText, max: 500 })
    Notes: string;

    @NumberDecorator({ decimals: 10 })
    Lat: number;

    @NumberDecorator({ decimals: 10 })
    Lng: number;

    @StringDecorator({ type: StringType.Text, max: 250 })
    Layers: string;

    @StringDecorator({ type: StringType.Text, max: 250 })
    Address: string;

    @StringDecorator({ type: StringType.Text, max: 250 })
    QueryLayers: string;

    @DateTimeDecorator({ label: 'Thời gian tra cứu', type: DateTimeType.DateTime })
    LookupDate: Date;

    @DateTimeDecorator({ label: 'Ngày gán quyền', type: DateTimeType.DateTime })
    AssignDate: Date;

    @DropDownDecorator({ required: true, label: 'Loại quy hoạch', lookup: LookupData.ReferenceUrl('/mmLookupHistory/lookupZoneTypes') })
    ZoneType: string;

    Feature: any;
}