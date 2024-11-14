import { BaseEntity } from "../base.entity";
import { BooleanType, DateTimeType, StringType } from "../../enums/data.type";
import { TableDecorator } from "../../../../_core/decorators/table.decorator";
import { StringDecorator } from "../../../../_core/decorators/string.decorator";
import { DateTimeDecorator } from "../../../../_core/decorators/datetime.decorator";
import { BooleanDecorator } from "../../../../_core/decorators/boolean.decorator";

@TableDecorator({ title: 'Khách hàng' })
export class MPOProjectCustomerEntity extends BaseEntity {
    @StringDecorator({ label: 'MeeyId', required: true, type: StringType.Text, max: 150 })
    MeeyId: string;

    @StringDecorator({ label: 'Tên Người dùng', required: true, type: StringType.Text, max: 150 })
    Name: string;

    @StringDecorator({ label: 'Số điện thoại', required: true, type: StringType.PhoneText, max: 150 })
    Phone: string;

    @StringDecorator({ label: 'Email', required: true, type: StringType.Email, max: 150 })
    Email: string;

    @BooleanDecorator({
        label: 'Giới tính', required: true, type: BooleanType.RadioButton, lookup: {
            items: [
                { value: 'male', label: 'Nam', selected: true },
                { value: 'female', label: 'Nữ' }
            ]
        }
    })
    Sex: string;

    @StringDecorator({ label: 'Tỉnh/ Thành phố', required: true, type: StringType.Text, max: 150 })
    CityId: string;

    @StringDecorator({ label: 'Quận/ Huyện', required: true, type: StringType.Text, max: 150 })
    DistrictId: string;

    @StringDecorator({ label: 'Nhóm quyền', required: true, type: StringType.Text, max: 150 })
    Role: string;

    @DateTimeDecorator({ label: 'Đăng nhập lần đầu', required: true, type: DateTimeType.DateTime })
    FirstLogin: string;

    @DateTimeDecorator({ label: 'Đăng nhập gần nhất', required: true, type: DateTimeType.DateTime })
    LastLogin: string;

    @StringDecorator({ label: 'Mô tả', required: true, type: StringType.MultiText, max: 150 })
    Introduce: string;
}