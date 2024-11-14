import { BaseEntity } from "../base.entity";
import { ConstantHelper } from "../../../../_core/helpers/constant.helper";
import { TableDecorator } from "../../../../_core/decorators/table.decorator";
import { StringDecorator } from "../../../../_core/decorators/string.decorator";
import { NumberDecorator } from "../../../../_core/decorators/number.decorator";
import { DropDownDecorator } from "../../../../_core/decorators/dropdown.decorator";
import { MCRMCustomerActionType, MCRMCustomerStatusType } from "./enums/mcrm.customer.type";
import { MCRMCustomerLeadStatusType } from "./enums/mcrm.customer.status.type";

@TableDecorator({ title: 'Lịch sử khách hàng' })
export class MCRMCustomerHistoryEntity extends BaseEntity {
    @StringDecorator({ label: 'Chi tiết', max: 10000 })
    Detail: string;

    @StringDecorator({ label: 'Người tạo', max: 250 })
    CreatedByName: string;

    @DropDownDecorator({ label: 'Hành động', lookup: { items: ConstantHelper.ML_CUSTOMER_ACTION_TYPES } })
    Action: MCRMCustomerActionType;

    @DropDownDecorator({ label: 'Trạng thái sau', lookup: { items: ConstantHelper.ML_CUSTOMER_STATUS_TYPES } })
    StatusAfter: MCRMCustomerStatusType;

    @DropDownDecorator({ label: 'Trạng thái trước', lookup: { items: ConstantHelper.ML_CUSTOMER_STATUS_TYPES } })
    StatusBefore: MCRMCustomerStatusType;

    @NumberDecorator()
    MCRMCustomerId: number;
}

@TableDecorator({ title: 'Lịch sử khách hàng' })
export class MCRMCustomerLeadHistoryEntity extends BaseEntity {
    @StringDecorator({ label: 'Chi tiết', max: 10000 })
    Detail: string;

    @StringDecorator({ label: 'Người tạo', max: 250 })
    CreatedByName: string;

    @DropDownDecorator({ label: 'Hành động', lookup: { items: ConstantHelper.ML_CUSTOMER_ACTION_TYPES } })
    Action: MCRMCustomerActionType;

    @DropDownDecorator({ label: 'Trạng thái sau', lookup: { items: ConstantHelper.ML_CUSTOMER_LEAD_STATUS_TYPES } })
    StatusAfter: MCRMCustomerLeadStatusType;

    @DropDownDecorator({ label: 'Trạng thái trước', lookup: { items: ConstantHelper.ML_CUSTOMER_LEAD_STATUS_TYPES } })
    StatusBefore: MCRMCustomerLeadStatusType;

    @NumberDecorator()
    MCRMCustomerId: number;
}