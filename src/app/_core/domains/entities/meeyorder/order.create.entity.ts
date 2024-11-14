import { BaseEntity } from "../base.entity";
import { RegexType } from "../../enums/regex.type";
import { NumberType, StringType } from "../../enums/data.type";
import { TableDecorator } from "../../../decorators/table.decorator";
import { StringDecorator } from "../../../decorators/string.decorator";
import { DropDownDecorator } from "../../../decorators/dropdown.decorator";
import { ConstantHelper } from "../../../../_core/helpers/constant.helper";
import { NumberDecorator } from "../../../../_core/decorators/number.decorator";
import { MPPaymentMethodType } from "../meeypay/enums/mp.transaction.status.type";

@TableDecorator()
export class MOOrderCreateEntity extends BaseEntity {

    @NumberDecorator({ label: "Số tiền", type: NumberType.Text, required: true, allowSearch: true, allowZero: true, min: 0, max: 9999999999999999999 })
    Price: number;

    @DropDownDecorator({ label: "Dịch vụ", required: true })
    ServiceId: number;

    @DropDownDecorator({ label: 'Phương thức thanh toán', lookup: { items: ConstantHelper.MP_PAYMENT_METHOD_TYPES_CUSTOM } })
    PaymentMethod: MPPaymentMethodType;

    @StringDecorator({ label: "Ghi chú", type: StringType.MultiText, required: true, max: 500 })
    Note: string;

    @StringDecorator({ label: "MeeyId", type: StringType.Text, required: true })
    UserMeeyId: string;

    @StringDecorator({ required: true, placeholder: "Tìm kiếm theo số điện thoại, email, MeeyID", type: StringType.Search, max: 100, label:"Thông tin khách hàng" }) 
    SearchCustom: string;

    CustomerName: string;
    CustomerEmail: string;
    CustomerPhone: string;

}