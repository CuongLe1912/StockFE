import { BaseEntity } from "../base.entity";
import { UserEntity } from "../user.entity";
import { LookupData } from "../../data/lookup.data";
import { DateTimeType, StringType } from "../../enums/data.type";
import { MLCouponHMCStatusType } from "./enums/ml.coupon.hmc.status.type";
import { ConstantHelper } from "../../../../_core/helpers/constant.helper";
import { TableDecorator } from "../../../../_core/decorators/table.decorator";
import { StringDecorator } from "../../../../_core/decorators/string.decorator";
import { DropDownDecorator } from "../../../../_core/decorators/dropdown.decorator";
import { DateTimeDecorator } from "../../../../_core/decorators/datetime.decorator";

@TableDecorator()
export class MLCouponHMCEntity extends BaseEntity {

    @DropDownDecorator({ required: true, lookup: LookupData.Reference(UserEntity, ['FullName', 'Email']) })
    UserId: number;

    @StringDecorator({ required: true, type: StringType.Text, max: 50 })
    MeeyId: string;

    @StringDecorator({ required: true, label: 'Mã nạp', allowSearch: true, type: StringType.Code, max: 250 })
    Code: string;

    @StringDecorator({ required: true, label: 'Seri', allowSearch: true, type: StringType.Code, max: 250 })
    Serial: string;

    @DropDownDecorator({
        required: true,
        allowSearch: true,
        icon: 'la la-ticket',
        lookup: { items: ConstantHelper.ML_COUPON_HMC_STATUS_TYPES }
    })
    Status: MLCouponHMCStatusType;

    @DateTimeDecorator({ required: true, allowSearch: true, label: 'Ngày tặng', type: DateTimeType.Date })
    IssuedDate: Date;

    @DropDownDecorator({
        required: true,
        allowSearch: true,
        icon: 'la la-user',
        lookup: { items: ConstantHelper.ML_COUPON_HMC_OBJECT_STATUS_TYPES }
    })
    Object: number;

    @StringDecorator({ required: true, allowSearch: true, type: StringType.PhoneText, min: 10, max: 10 })
    Phone: string;

    @StringDecorator({ required: true, allowSearch: true, type: StringType.Email, max: 50 })
    Email: string;

    @DateTimeDecorator({ required: true, allowSearch: true, type: DateTimeType.Date })
    UsedDate: Date;

    @StringDecorator({ type: StringType.Text, max: 50 })
    TransactionId: string;
}