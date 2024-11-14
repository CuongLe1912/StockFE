import { BaseEntity } from "../base.entity";
import { LookupData } from "../../data/lookup.data";
import { TableDecorator } from "../../../decorators/table.decorator";
import { StringDecorator } from "../../../decorators/string.decorator";
import { DropDownDecorator } from "../../../decorators/dropdown.decorator";
import { ConstantHelper } from "../../../../_core/helpers/constant.helper";
import { MCRMSaleAssignConfigHistoryTypes } from "./enums/mcrm.customer.type";

@TableDecorator({ title: 'Mày đoán xem' })
export class MCRMSaleAssignConfigHistoryEntity extends BaseEntity {
    // @StringDecorator({ required: true, label: 'Thao tác'})
    // Action: string;
    @DropDownDecorator({ label: 'Thao tác', required: true, lookup: LookupData.ReferenceItems(ConstantHelper.MCRM_SALE_ASSIGN_CONFIG_HISTORY_TYPES) })
    Action: MCRMSaleAssignConfigHistoryTypes;

    @StringDecorator({ required: true, label: 'Nội dung'})
    Detail: string;

    @StringDecorator({ required: true, label: 'Ghi chú'})
    Note: string;

    @StringDecorator({ required: true, label: 'Thực hiện'})
    UpdatedBy: string;

    @StringDecorator({ required: true})
    User: string;

    @StringDecorator({ required: true})
    CreatedDateHistory: string;

}