import { BaseEntity } from '../base.entity';
import { LookupData } from '../../data/lookup.data';
import { DateTimeType, NumberType, StringType } from '../../enums/data.type';
import { ConstantHelper } from '../../../helpers/constant.helper';
import { TableDecorator } from '../../../decorators/table.decorator';
import { StringDecorator } from '../../../decorators/string.decorator';
// import { NumberDecorator } from '../../../decorators/number.decorator';
import { MMRequestStatusType, MMRequestActionType, MMRequestType } from './enums/mm.request.status.type';
import { DropDownDecorator } from '../../../decorators/dropdown.decorator';
import { DateTimeDecorator } from '../../../decorators/datetime.decorator';

@TableDecorator()
export class MMRequestEntity extends BaseEntity {
    @StringDecorator({ label: "Mã yêu cầu", required: true, type: StringType.Text, max: 50 })
    Code: string;

    @StringDecorator({ type: StringType.Text, max: 50 })
    MeeyId: string;

    @StringDecorator({ type: StringType.Text, max: 50 })
    MeeyUserId: string;

    @StringDecorator({ type: StringType.Text, max: 100 })
    CompanyName: string;

    @DropDownDecorator({ label: 'Hành động', lookup: { items: ConstantHelper.MM_REQUEST_ACTION_TYPES } })
    Action: MMRequestActionType;

    @DropDownDecorator({ label: 'Loại TK lúc đăng ký', lookup: { items: ConstantHelper.MM_REQUEST_TYPES } })
    Type: MMRequestType;

    @DropDownDecorator({ label: 'Trạng thái', lookup: LookupData.ReferenceItems(ConstantHelper.MM_REQUEST_STATUS_TYPES) })
    State: MMRequestStatusType;

    @StringDecorator({ required: true, label: 'Ghi chú', type: StringType.MultiText, max: 500 })
    Note: string;

    @DateTimeDecorator({ label: "Ngày yêu cầu", type: DateTimeType.DateTime })
	RequestDate: Date;

    @DateTimeDecorator({ label: "Ngày yêu cầu", type: DateTimeType.DateTime })
	CreatedDate: Date;
}