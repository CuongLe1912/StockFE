import { StringType } from "../enums/data.type";
import { DepartmentType } from "../enums/department.type";
import { ConstantHelper } from "../../helpers/constant.helper";
import { DepartmentEntity } from "../entities/department.entity";
import { TableDecorator } from "../../decorators/table.decorator";
import { LookupUniqueData, LookupData } from "../data/lookup.data";
import { NumberDecorator } from "../../decorators/number.decorator";
import { StringDecorator } from "../../decorators/string.decorator";
import { BooleanDecorator } from "../../decorators/boolean.decorator";
import { DropDownDecorator } from "../../decorators/dropdown.decorator";

TableDecorator()
export class DepartmentDto {
    @NumberDecorator()
    Id: number;

    @NumberDecorator()
    Amount?: number;

    @BooleanDecorator()
    Allow?: boolean;

    @StringDecorator({ label: 'Tên viết tắt', required: true, allowSearch: true, type: StringType.Text, max: 100, unique: LookupUniqueData.Reference(DepartmentEntity, 'Code') })
    Code: string;

    @StringDecorator({ label: 'Tên phòng ban', required: true, allowSearch: true, type: StringType.Text, max: 100, unique: LookupUniqueData.Reference(DepartmentEntity, 'Name') })
    Name: string;

    @StringDecorator({ label: 'Ghi chú', type: StringType.MultiText, max: 1000 })
    Description: string;

    @DropDownDecorator({ label: 'Loại phòng', lookup: LookupData.ReferenceItems(ConstantHelper.DEPARTMENT_TYPES) })
    Type: DepartmentType;

    UserIds: number[];
}