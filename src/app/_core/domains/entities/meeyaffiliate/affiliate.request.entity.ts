import { LookupData } from '../../data/lookup.data';
import { MAFRequestStatusType } from './enums/affiliate.type';
import { ConstantHelper } from '../../../../_core/helpers/constant.helper';
import { BaseEntity } from '../../../../_core/domains/entities/base.entity';
import { ImageDecorator } from '../../../../_core/decorators/image.decorator';
import { TableDecorator } from '../../../../_core/decorators/table.decorator';
import { StringDecorator } from '../../../../_core/decorators/string.decorator';
import {StringType, DateTimeType} from '../../../../_core/domains/enums/data.type';
import { DropDownDecorator } from '../../../../_core/decorators/dropdown.decorator';
import { DateTimeDecorator } from "../../../../_core/decorators/datetime.decorator";

@TableDecorator()
export class MAFAffiliateRequestEntity extends BaseEntity {
    @StringDecorator({ label: "Khách hàng", type: StringType.Text, placeholder: "Nhập Số điện thoại, Email, MeeyId, Mã Ref", max: 50 })
    Customer: string;

    @DropDownDecorator({ label: "Trạng thái", required: true, lookup: { items: ConstantHelper.MAF_REQUEST_STATUS_TYPES } })
    Status: MAFRequestStatusType;

    @DropDownDecorator({ label: 'Người tạo', lookup: LookupData.ReferenceUrl('/user/Lookup', ['FullName', 'Email'], 'Id') })
    UserId: number;

    @DateTimeDecorator({ label: 'Ngày tạo', required: true, type: DateTimeType.Date })
    DateRequest: Date;

    @DropDownDecorator({ label: 'Người xác nhận', lookup: LookupData.ReferenceUrl('/user/Lookup', ['FullName', 'Email'], 'Id') })
    UserApproveId: number;

    @DateTimeDecorator({ label: 'Ngày duyệt', required: true, type: DateTimeType.Date })
    DateApprove: Date;    

    @StringDecorator({ label: "Ghi chú/Lý do", type: StringType.MultiText, required: true, max: 500 })
    Note: string;

    @ImageDecorator({ label: 'File đính kèm', url: 'upload/uploadavatar', required: true })
    File: string;
}