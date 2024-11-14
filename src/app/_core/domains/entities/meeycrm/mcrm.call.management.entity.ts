import { BaseEntity } from "../base.entity";
import { LookupData } from "../../data/lookup.data";
import { DateTimeType, StringType } from "../../enums/data.type";
import { ConstantHelper } from "../../../../_core/helpers/constant.helper";
import { TableDecorator } from "../../../../_core/decorators/table.decorator";
import { StringDecorator } from "../../../../_core/decorators/string.decorator";
import { DropDownDecorator } from "../../../../_core/decorators/dropdown.decorator";
import { DateTimeDecorator } from "../../../../_core/decorators/datetime.decorator";
import { MCRMCustomerPotentialType, MCRMCustomerType } from "./enums/mcrm.customer.type";

@TableDecorator()
export class MCRMCallManagementCustomerEntity extends BaseEntity {
    @DropDownDecorator({ label: 'Người thực hiện', lookup: LookupData.ReferenceUrl('/user/LookupOperators', ['FullName', 'Email']) })
    OperatorId: number;

    @DropDownDecorator({ label: 'Trạng thái cuộc gọi', lookup: { items: ConstantHelper.ML_CUSTOMER_CALL_MANAGEMENT_TYPES } })
    Status: MCRMCustomerType;

    @StringDecorator({ label: "Khách hàng", placeholder: "Nhập SĐT, CRM ID, MeeyId", type: StringType.Text, max: 100 })
    IdOrPhone: string;

    @DropDownDecorator({ label: 'Loại cuộc gọi', lookup: { items: ConstantHelper.ML_CUSTOMER_NOTE_CALL_TYPES } })
    Type: MCRMCustomerPotentialType;

    @DateTimeDecorator({ label: 'Ngày thực hiện', type: DateTimeType.DateTime })
    CallTime: Date;
}

@TableDecorator()
export class MCRMCallManagementStaffEntity {
    @DropDownDecorator({ label: 'Người thực hiện', lookup: LookupData.ReferenceUrl('/user/LookupOperators', ['FullName', 'Email']) })
    OperatorId: number;

    @DateTimeDecorator({ label: 'Ngày thực hiện', type: DateTimeType.DateTime })
    CallTime: Date;
}

@TableDecorator()
export class MCRMCallLogByIdEntity {
    @StringDecorator({ label: 'Số điện thoại', type: StringType.Text })
    Phone: string;

    @StringDecorator({ label: 'Thời gian kết nối', type: StringType.Text })
    Duration: string;

    @StringDecorator({ label: 'Nghe lại', type: StringType.Text })
    Recordingfile: string;

    @StringDecorator({ label: 'Kết quả', type: StringType.Text })
    StatusName: string;

    @StringDecorator({ label: 'Nội dung', type: StringType.Text })
    Note: string;

    @DateTimeDecorator({ label: 'Thời gian tạo', type: DateTimeType.DateTime })
    CallTime: Date;

    @StringDecorator({ label: 'Người thực hiện', type: StringType.Text })
    OperatorName: string;
}