import { BaseEntity } from "../base.entity";
import { DateTimeType, NumberType, StringType } from "../../enums/data.type";
import { LookupData } from "../../data/lookup.data";
import { TableDecorator } from "../../../decorators/table.decorator";
import { StringDecorator } from "../../../decorators/string.decorator";
import { DropDownDecorator } from "../../../decorators/dropdown.decorator";
import { MOGroupServiceEntity } from "./groupservice.entity";
import { NumberDecorator } from "../../../../_core/decorators/number.decorator";
import { DateTimeDecorator } from "../../../../_core/decorators/datetime.decorator";
import { MOServicesEntity } from "./services.entity";
import { MOOrderStatusType } from "./enums/order.status.type";
import { ConstantHelper } from "../../../../_core/helpers/constant.helper";
import { MLPartnerEntity } from "../meeyland/ml.partner.entity";
import { MOClientEntity } from "./client.entity";
import { MOProviderEntity } from "./provider.entity";
import { RegexType } from "../../enums/regex.type";

@TableDecorator()
export class MOOrdersEntity extends BaseEntity {

    @StringDecorator({ label: "Mã đơn hàng", required: true, type: StringType.Text, max: 20 })
    Code: string;

    @NumberDecorator({ type: NumberType.Text, label: "Giá", required: true, allowSearch: true, allowZero:true })
    PriceRoot: number;

    @StringDecorator({ label: "SĐT", required: true, type: StringType.Text, max: 100 })
    Phone: string;

    @DropDownDecorator({ label: "Trạng thái", required: true, multiple: true, lookup: { items: ConstantHelper.MO_ORDER_STATUS_TYPES } })
    Status: MOOrderStatusType;

    @DropDownDecorator({ label: 'Sale', required: true, multiple: true, lookup: LookupData.ReferenceUrl('/user/LookupSaleForMeeyOrder', ['FullName', 'Email'], 'Email') })
    Sale: string;

    @DropDownDecorator({ label: "Dịch vụ", required: true, multiple: true, lookup: LookupData.Reference(MOServicesEntity, ['Name', 'Code']) })
    ServiceId: number;

    @StringDecorator({ label: "Email", required: true, type: StringType.Text, max: 100 })
    Email: string;

    @DateTimeDecorator({ label: 'Thời gian tạo', required: true, type: DateTimeType.Date })
    StartDate: Date;

    @DropDownDecorator({ label: 'CSKH', required: true, multiple: true, lookup: LookupData.ReferenceUrl('/user/LookupSupportForMeeyOrder', ['FullName', 'Email'], 'Email') })
    Support: string;

    @DropDownDecorator({ allowSearch: true, label: "Nhà cung cấp", required: true, lookup: LookupData.Reference(MOProviderEntity) })
    ProviderId: number;

    @StringDecorator({ required: true, type: StringType.Text, max: 100 })
    MeeyId: string;

    @DropDownDecorator({ label: "Nơi tạo", required: true, multiple: true, lookup: LookupData.Reference(MOClientEntity, ['Name'], 'ClientId') })
    ClientId: number;

    @DropDownDecorator({ label: "Nguồn giới thiệu", required: true, multiple: true, lookup: LookupData.Reference(MLPartnerEntity) })
    PartnerId: number;

    @StringDecorator({ required: true, type: StringType.Text, max: 150 })
    Source: string;

    @DropDownDecorator({ allowSearch: true, label: "Nhóm dịch vụ", required: true, lookup: LookupData.Reference(MOGroupServiceEntity, ['Name'], 'Id', 'ProviderId'), autoHide: true })
    ParentGroupId: number;

    @DropDownDecorator({ allowSearch: true, label: "", required: true, multiple: true, lookup: LookupData.ReferenceUrl('/mogroupservice/lookupParent', ['Name'], 'Id', 'ParentGroupId'), autoHide: true })
    GroupId: number;

    @StringDecorator({ label: "Ghi chú", type: StringType.MultiText, required: true, max: 200, customValidators: [{ pattern: RegexType.TextNoSpecial, message: 'Không được nhập ký tự đặc biệt' }] })
    Note: string;
    
    Price: number;
    UserId: number;
    PaymentMethodId: number;

}