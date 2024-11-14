import { BaseEntity } from '../../../../_core/domains/entities/base.entity';
import { TableDecorator } from '../../../../_core/decorators/table.decorator';
import { DateTimeType, NumberType, StringType } from '../../../../_core/domains/enums/data.type';
import { DateTimeDecorator } from '../../../../_core/decorators/datetime.decorator';
import { StringDecorator } from '../../../../_core/decorators/string.decorator';
import { DropDownDecorator } from '../../../../_core/decorators/dropdown.decorator';
import { LookupData } from '../../../../_core/domains/data/lookup.data';
import { MOServicesEntity } from '../../../../_core/domains/entities/meeyorder/services.entity';
import { ConstantHelper } from '../../../../_core/helpers/constant.helper';
import { RequestTransferType } from '../enums/request.transfer.type';
import { NumberDecorator } from '../../../../_core/decorators/number.decorator';


@TableDecorator()
export class MOServiceHistoryEntity extends BaseEntity {
	@StringDecorator({ label: "Mã yêu cầu", required: true, type: StringType.Text, max: 20 })
    Code: string;

	@DropDownDecorator({ label: "Dịch vụ", required: true, multiple: true, lookup: LookupData.Reference(MOServicesEntity, ['Name', 'Code']) })
    ServiceId: number;
	
	@DateTimeDecorator({ label: "Ngày thực hiện", type: DateTimeType.DateTime })
	StartDate: Date;

	@DropDownDecorator({ label: "Loại yêu cầu", required: true, multiple: true, lookup: { items: ConstantHelper.MO_REQUEST_TRANSFER_TYPES } })
    Type: RequestTransferType;

	@StringDecorator({ label: "TK chuyển", placeholder: "Nhập số điện thoại, email, MeeyId", required: true, type: StringType.Text, max: 100 })
    FromMeeyId: string;

	@StringDecorator({ label: "TK nhận", placeholder: "Nhập số điện thoại, email, MeeyId", required: true, type: StringType.Text, max: 100 })
    ToMeeyId: string;
}
