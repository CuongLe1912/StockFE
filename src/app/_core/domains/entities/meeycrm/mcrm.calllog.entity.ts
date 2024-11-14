import { BaseEntity } from "../base.entity";
import { UserEntity } from "../user.entity";
import { LookupData } from "../../data/lookup.data";
import { MCRMCustomerEntity } from "./mcrm.customer.entity";
import { StringType, DateTimeType } from "../../enums/data.type";
import { ConstantHelper } from "../../../../_core/helpers/constant.helper";
import { MCRMCustomerNoteCallStatusType } from "./enums/mcrm.customer.type";
import { TableDecorator } from "../../../../_core/decorators/table.decorator";
import { NumberDecorator } from "../../../../_core/decorators/number.decorator";
import { StringDecorator } from "../../../../_core/decorators/string.decorator";
import { MCRMCallLogStatusType, MCRMCallLogType } from "./enums/mcrm.calllog.type";
import { DropDownDecorator } from "../../../../_core/decorators/dropdown.decorator";
import { DateTimeDecorator, DateTimeFormat } from "../../../../_core/decorators/datetime.decorator";

@TableDecorator({ title: 'Lịch sử gọi điện' })
export class MCRMCallLogEntity extends BaseEntity {

    @DropDownDecorator({ label: 'Nhân viên', lookup: LookupData.Reference(UserEntity, ['FullName', 'Email']) })
    UserId?: number;

    @StringDecorator({ required: true, type: StringType.PhoneText, min: 10, max: 10 })
    Phone: string;

    @NumberDecorator()
    Billsec?: number;

    @NumberDecorator()
    Duration?: number;

    @NumberDecorator()
    Extension: number;
    
    @StringDecorator({ required: true, type: StringType.Text, max: 100 })
    CallId?: string;

    @NumberDecorator()
    MCRMCustomerId?: number;

    @NumberDecorator()
    MCRMCustomerLeadId?: number;

    @DateTimeDecorator({ label: 'Thời gian kết nối', type: DateTimeType.DateTime, format: DateTimeFormat.DMYHM })
    CallTime?: Date;

    @DropDownDecorator({ label: 'Loại', lookup: { items: ConstantHelper.ML_CUSTOMER_CALLLOGS_TYPES } })
    Type: MCRMCallLogType;

    @DropDownDecorator({ label: 'Trạng thái', lookup: { items: ConstantHelper.ML_CUSTOMER_CALLLOGS_STATUS_TYPES } })
    Status?: MCRMCallLogStatusType;
    
    @StringDecorator({ type: StringType.Text, max: 500 })
    Recordingfile?: string;

    @StringDecorator({ label: 'Ghi chú', type: StringType.MultiText, max: 500 })
    Note?: string;

    @DropDownDecorator({ label: 'Kết quả', lookup: { items: ConstantHelper.ML_CUSTOMER_NOTE_CALL_STATUS_TYPES } })
    CallStatus?: MCRMCustomerNoteCallStatusType;

    @StringDecorator({ label: 'Ghi chú', type: StringType.MultiText, max: 500 })
    LastNote?: string;
    
    @StringDecorator({ label: 'Sự kiện', type: StringType.Text, max: 50 })
    Event?: string;
    
    @StringDecorator({ label: 'Thông báo', type: StringType.Text, max: 500 })
    Message: string;
    
    @StringDecorator({ label: 'Loại', type: StringType.Text, max: 500 })
    TypeName: string;
}

@TableDecorator({ title: 'Lịch sử gọi điện' })
export class MCRMCallLogDto extends MCRMCallLogEntity {
    Time?: number;
    Opening: boolean;
    IntervalTime?: any;
    Customer: MCRMCustomerEntity;
}