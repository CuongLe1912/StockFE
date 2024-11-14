import { BooleanDecorator } from "../../../../_core/decorators/boolean.decorator";
import { DateTimeDecorator } from "../../../../_core/decorators/datetime.decorator";
import { DropDownDecorator } from "../../../../_core/decorators/dropdown.decorator";
import { NumberDecorator } from "../../../../_core/decorators/number.decorator";
import { StringDecorator } from "../../../../_core/decorators/string.decorator";
import { TableDecorator } from "../../../../_core/decorators/table.decorator";
import { ConstantHelper } from "../../../../_core/helpers/constant.helper";
import { LookupData } from "../../data/lookup.data";
import { BooleanType, DateTimeType, StringType } from "../../enums/data.type";
import { BaseEntity } from "../base.entity";
import { UserEntity } from "../user.entity";

@TableDecorator()
export class MPOProjectInvestorUnitTypeEntity extends BaseEntity {

    @StringDecorator({ label: 'Mô tả', placeholder: 'Nhập mô tả', type: StringType.MultiText, max: 500 })
    Description?: string;

    @StringDecorator({ label: 'Người tạo', allowSearch: true, type: StringType.Text})
    CreatedBy?: string;

    @BooleanDecorator({ label: 'Kích hoạt', type: BooleanType.Toggle })
    Active?: boolean;

    //Search data
    @StringDecorator({ allowSearch: true, label: 'Từ khóa', required: true, placeholder: 'Nhập tên loại đơn vị để tìm kiếm', type: StringType.Text, max: 150 })
    Name: string;

    @DateTimeDecorator({ allowSearch: true, label: 'Ngày tạo', required: true, type: DateTimeType.DateTime })
    CreatedAt?: Date;

    @DropDownDecorator({ allowSearch: true, label: 'Chọn người tạo', lookup: LookupData.Reference(UserEntity, ['Id', 'FullName']) })
    CreatedBySearch: string;

    @DropDownDecorator({ allowSearch: true, label: "Kích hoạt", placeholder: 'Chọn trạng thái kích hoạt', lookup: { items: ConstantHelper.UNIT_TYPE_ACTIVE } })
    ActiveSearch?: boolean;
}