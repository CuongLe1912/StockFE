import { BaseEntity } from "../base.entity";
import { LookupData } from "../../data/lookup.data";
import { M3DContactFromStatus } from "./enums/contactform.status";
import { ConstantHelper } from "../../../../_core/helpers/constant.helper";
import { TableDecorator } from "../../../../_core/decorators/table.decorator";
import { DropDownDecorator } from "../../../../_core/decorators/dropdown.decorator";

@TableDecorator()
export class M3DCustomerEntity extends BaseEntity{
    _Id: string
    // @DateTimeDecorator({ label: 'Ngày tạo', type: DateTimeType.DateTime })
    CreatedAt: Date
    // @DateTimeDecorator({ label: 'Ngày sửa', type: DateTimeType.DateTime })
    UpdatedAt: Date
    // @StringDecorator({ label: 'Họ và tên' })
    Name : string
    // @StringDecorator({ label: 'Số điện thoại' })
    Phone: string
    // @StringDecorator({ label: 'Email' })
    Email: string
    // @StringDecorator({ label: 'Địa chỉ liên hệ' })
    Address: string
    // @StringDecorator({ label: 'Mô tả' })
    Description :string
    @DropDownDecorator({ label: 'Trạng thái', required: true, lookup: LookupData.ReferenceItems(ConstantHelper.M3D_CUSTOMER_STATUS_TYPE) })
    Status: M3DContactFromStatus

    StatusString : string
}