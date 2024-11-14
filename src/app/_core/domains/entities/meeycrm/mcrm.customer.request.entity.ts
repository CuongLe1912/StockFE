import { DateTimeDecorator } from "../../../../_core/decorators/datetime.decorator";
import { DropDownDecorator } from "../../../../_core/decorators/dropdown.decorator";
import { StringDecorator } from "../../../../_core/decorators/string.decorator";
import { TableDecorator } from "../../../../_core/decorators/table.decorator";
import { ConstantHelper } from "../../../../_core/helpers/constant.helper";
import { LookupData } from "../../data/lookup.data";
import { DataType, DateTimeType, DropdownLoadType, StringType } from "../../enums/data.type";
import { BaseEntity } from "../base.entity";
import { MCRMCustomerRequestStatusType, MCRMCustomerStatusType } from "./enums/mcrm.customer.type";

@TableDecorator()
export class MCRMCustomerRequestEntity {
    Ids: number[];   
    RootId: number;     

    @StringDecorator({ required: true, type: StringType.Text, max: 100 })
    Name: string;

    @StringDecorator({ required: true, type: StringType.Text, max: 100 })
    Code: string;

    @StringDecorator({ type: StringType.Text, max: 100 })
    Email: string;

    @StringDecorator({ type: StringType.Text, min: 10, max: 200 })
    Phone: string;

    @DropDownDecorator({ label: 'Khách hàng', lookup: { url: '/MCRMCustomer/LookupCustomerHaveRole', loadType: DropdownLoadType.Ajax, propertyDisplay: ['Code', 'Name', 'Phone', 'Email'] } })
    CustomerId: number;  

    @StringDecorator({ required: true, label: 'Lý do yêu cầu', type: StringType.MultiText, max: 200 })
    Reason: string;

    @StringDecorator({ required: true, label: 'Ghi chú/Lý do', type: StringType.MultiText, max: 200 })
    ApproveReason: string;

    @DropDownDecorator({ required: true, label: 'Sale chăm sóc', lookup: LookupData.ReferenceUrl('/user/LookupSaleForMeeyCrm', ['FullName', 'Email']) })
    SaleId: number;

    @DropDownDecorator({ required: true, label: 'CSKH', lookup: LookupData.ReferenceUrl('/user/LookupSupportForMeeyCrm', ['FullName', 'Email']) })
    SupportId: number;

    @StringDecorator({ required: true, label: 'Người yêu cầu', type: StringType.Text, max: 100 })
    User: string;

    @DropDownDecorator({ required: true, label: 'Người yêu cầu', lookup: LookupData.ReferenceUrl('/user/LookupSaleForMeeyCrm', ['FullName', 'Email']) })
    UserId: number;

    @StringDecorator({ required: true, label: 'Người duyệt', type: StringType.Text, max: 100 })
    UserApprove: string;

    @DropDownDecorator({ required: true, label: 'Người xác nhận', lookup: LookupData.ReferenceUrl('/user/LookupSaleForMeeyCrm', ['FullName', 'Email']) })
    UserApproveId: number;

    @DropDownDecorator({ label: 'Trạng thái tiếp cận', lookup: { items: ConstantHelper.ML_CUSTOMER_STATUS_TYPES } })
    CustomerStatusType: MCRMCustomerStatusType;

    @DropDownDecorator({ label: 'Trạng thái', lookup: { items: ConstantHelper.ML_CUSTOMER_REQUEST_STATUS_TYPES } })
    Status: MCRMCustomerRequestStatusType;

    @DateTimeDecorator({ label: 'Ngày yêu cầu',  required: true, type: DateTimeType.Date, maxCurent: true })
    DateRequest?: Date;
    
    @DateTimeDecorator({ label: 'Ngày duyệt',  required: true, type: DateTimeType.Date, maxCurent: true })
    DateApprove?: Date;
}

@TableDecorator()
export class MCRMCustomerRequestDto {
    Ids: number[];   
    RootId: number;     

    @StringDecorator({ required: true, type: StringType.Text, max: 100 })
    Name: string;

    @StringDecorator({ type: StringType.Text, max: 100 })
    Email: string;

    @StringDecorator({ type: StringType.Text, min: 10, max: 200 })
    Phone: string;

    @DropDownDecorator({ label: 'Chọn khách hàng', placeholder: 'Nhập mã KH, SĐT', lookup: { url: '/MCRMCustomer/LookupCustomerHaveRole', loadType: DropdownLoadType.Ajax, propertyDisplay: ['Code', 'Name', 'Phone'] } })
    CustomerId: number;  

    @StringDecorator({ required: true, label: 'Lý do', type: StringType.MultiText, max: 200, rows: 2 })
    Reason: string;

    @DropDownDecorator({ required: true, label: 'Sale chăm sóc', lookup: LookupData.ReferenceUrl('/user/LookupSaleForMeeyCrm', ['FullName', 'Email']) })
    SaleId: number;

    @DropDownDecorator({ label: 'CSKH', lookup: LookupData.ReferenceUrl('/user/LookupSupportForMeeyCrm', ['FullName', 'Email']) })
    SupportId: number;

    @DropDownDecorator({ label: 'Trạng thái tiếp cận', lookup: { items: ConstantHelper.ML_CUSTOMER_STATUS_TYPES } })
    CustomerStatusType: MCRMCustomerStatusType;
}