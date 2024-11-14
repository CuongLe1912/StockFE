import { BaseEntity } from "./base.entity";
import { StringType } from "../enums/data.type";
import { DepartmentType } from "../enums/department.type";
import { ConstantHelper } from "../../helpers/constant.helper";
import { LookupData, LookupUniqueData } from "../data/lookup.data";
import { TableDecorator } from "../../decorators/table.decorator";
import { StringDecorator } from "../../decorators/string.decorator";
import { DropDownDecorator } from "../../decorators/dropdown.decorator";

@TableDecorator({ title: 'Phòng ban' })
export class DepartmentEntity extends BaseEntity {
    @StringDecorator({ label: 'Tên phòng ban', required: true, type: StringType.Text, max: 150, unique: LookupUniqueData.Reference(DepartmentEntity, 'Name') })
    Name: string;
    
    @StringDecorator({ label: 'Tên viết tắt', required: true, type: StringType.Text, max: 10, unique: LookupUniqueData.Reference(DepartmentEntity, 'Code') })
    Code: string;

    @StringDecorator({ label: 'Ghi chú', type: StringType.MultiText, max: 1000 })
    Description: string;

    @DropDownDecorator({ label: 'Loại phòng', lookup: LookupData.ReferenceItems(ConstantHelper.DEPARTMENT_TYPES) })
    Type: DepartmentType;
}