import { BaseEntity } from "../base.entity";
import { UserEntity } from "../user.entity";
import { LookupData } from "../../data/lookup.data";
import { DateTimeType, StringType } from "../../enums/data.type";
import { ConstantHelper } from "../../../../_core/helpers/constant.helper";
import { TableDecorator } from "../../../../_core/decorators/table.decorator";
import { StringDecorator } from "../../../../_core/decorators/string.decorator";
import { NumberDecorator } from "../../../../_core/decorators/number.decorator";
import { DropDownDecorator } from "../../../../_core/decorators/dropdown.decorator";
import { DateTimeDecorator, DateTimeFormat } from "../../../../_core/decorators/datetime.decorator";
import { MCRMCustomerNoteCallStatusType, MCRMCustomerNoteCallType, MCRMCustomerNoteEmailStatusType } from "./enums/mcrm.customer.type";
import { FileDecorator } from "../../../../_core/decorators/file.decorator";

@TableDecorator({ title: 'Thông tin ghi chú' })
export class MCRMCustomerNoteEntity extends BaseEntity {

    @DropDownDecorator({ label: 'Nhân viên', lookup: LookupData.Reference(UserEntity, ['FullName', 'Email']) })
    UserId: number;
    
    @StringDecorator({ required: true, type: StringType.MultiText, max: 1000 })
    Note: string;

    @StringDecorator({ required: true, type: StringType.PhoneText, min: 10, max: 10 })
    Phone: string;

    @NumberDecorator()
    MCRMCustomerId: number;
}

@TableDecorator({ title: 'Thông tin gọi điện' })
export class MCRMCustomerNoteCallEntity extends BaseEntity {

    @DropDownDecorator({ label: 'Nhân viên', lookup: LookupData.Reference(UserEntity, ['FullName', 'Email']) })
    UserId: number;
    
    @StringDecorator({ required: true, type: StringType.MultiText, max: 1000 })
    Note: string;

    @StringDecorator({ required: true, type: StringType.PhoneText, min: 10, max: 10 })
    Phone: string;

    @NumberDecorator()
    MCRMCustomerId: number;

    @DateTimeDecorator({ label: 'Thời gian kết nối', type: DateTimeType.DateTime, format: DateTimeFormat.DMYHM })
    ConnectTime: Date;

    @DropDownDecorator({ label: 'Loại', lookup: { items: ConstantHelper.ML_CUSTOMER_NOTE_CALL_TYPES } })
    Type: MCRMCustomerNoteCallType;

    @DropDownDecorator({ label: 'Trạng thái', lookup: { items: ConstantHelper.ML_CUSTOMER_NOTE_CALL_STATUS_TYPES } })
    Status: MCRMCustomerNoteCallStatusType;
}

@TableDecorator({ title: 'Thông tin gửi email' })
export class MCRMCustomerNoteEmailEntity extends BaseEntity {

    @DropDownDecorator({ label: 'Nhân viên', lookup: LookupData.Reference(UserEntity, ['FullName', 'Email']) })
    UserId: number;
    
    @StringDecorator({ required: true, type: StringType.Text, max: 500 })
    Title: string;

    @StringDecorator({ required: true, type: StringType.Html, max: 10000 })
    Content: string;

    @StringDecorator({ required: true, type: StringType.Text, max: 500 })
    EmailTo: string;

    @StringDecorator({ required: true, type: StringType.Text, max: 500 })
    EmailCc: string;

    @StringDecorator({ required: true, type: StringType.Text, max: 500 })
    EmailBcc: string;

    @StringDecorator({ required: true, type: StringType.Text, max: 500 })
    EmailFrom: string;

    @NumberDecorator()
    MCRMCustomerId: number;

    @DropDownDecorator({ label: 'Trạng thái', lookup: { items: ConstantHelper.ML_CUSTOMER_NOTE_EMAIL_STATUS_TYPES } })
    Status: MCRMCustomerNoteEmailStatusType;

    @FileDecorator({ label: 'Tệp', url: 'upload/MCrmUpload', multiple: true })
    Attachments: string[];
}