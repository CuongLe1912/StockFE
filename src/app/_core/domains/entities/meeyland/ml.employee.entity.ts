import { BaseEntity } from "../base.entity";
import { FileDecorator } from "../../../../_core/decorators/file.decorator";
import { ConstantHelper } from "../../../../_core/helpers/constant.helper";
import { BooleanType, DateTimeType, StringType } from "../../enums/data.type";
import { TableDecorator } from "../../../../_core/decorators/table.decorator";
import { StringDecorator } from "../../../../_core/decorators/string.decorator";
import { BooleanDecorator } from "../../../../_core/decorators/boolean.decorator";
import { DropDownDecorator } from "../../../../_core/decorators/dropdown.decorator";
import { DateTimeDecorator } from "../../../../_core/decorators/datetime.decorator";

@TableDecorator()
export class MLEmployeeEntity extends BaseEntity {
    @StringDecorator({ label: 'Họ tên', required: true, type: StringType.Account, max: 100 })
    Name: string;

    @StringDecorator({ required: true, type: StringType.Email, max: 100 })
    Email: string;

    @StringDecorator({ required: true, type: StringType.PhoneText, min: 10, max: 10 })
    Phone: string;

    @DropDownDecorator({ lookup: { items: ConstantHelper.ML_EMPLOYEE_STATUS_TYPES } })
    Status: any;

    @StringDecorator({ required: true, type: StringType.Search, max: 100 })
    Search: string;

    @StringDecorator({ required: true, type: StringType.MultiText, max: 500 })
    Reason: string;

    @BooleanDecorator({
        type: BooleanType.RadioButton,
        lookup: {
            items: [
                { value: 1, label: 'Tạo tài khoản mới' },
                { value: 2, label: 'Chọn tài khoản đã có' }
            ]
        }
    })
    CreateType: number;

    @DateTimeDecorator({ label: 'Ngày thực hiện gần nhất', type: DateTimeType.Date })
    DateTime: string;

    @StringDecorator({ required: true, type: StringType.Text, max: 100 })
    MeeyId: string;
    Notes: string;
}

@TableDecorator()
export class MLEmployeeHistoryEntity extends BaseEntity {
    @DropDownDecorator({ lookup: { items: ConstantHelper.ML_EMPLOYEE_STATUS_TYPES } })
    PrevStatus: any;

    @DropDownDecorator({ lookup: { items: ConstantHelper.ML_EMPLOYEE_STATUS_TYPES } })
    CurentStatus: any;

    @StringDecorator({ max: 1000 })
    Notes: string;

    @DropDownDecorator({ lookup: { items: ConstantHelper.ML_EMPLOYEE_HISTORY_ACTION_TYPES } })
    Action: string;

    @DateTimeDecorator({ label: 'Ngày thực hiện', type: DateTimeType.DateTime })
    DateTime: string;
}
@TableDecorator()
export class MLEmployeeImportSaleEntity extends BaseEntity {
    CompanyId: number;
    @FileDecorator({ label: 'Import Sale', required: true, size: 2,  accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel', description: 'Định dạng: xlsx, xls', })
    FileImport: string;
    
}