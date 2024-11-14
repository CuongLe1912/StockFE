import { BaseEntity } from "../base.entity";
import { ProductEntity } from "./product.entity";
import { RegexType } from "../../enums/regex.type";
import { LookupData } from "../../data/lookup.data";
import { MOProviderEntity } from "./provider.entity";
import { MOGroupServiceEntity } from "./groupservice.entity";
import { TableDecorator } from "../../../decorators/table.decorator";
import { TextTransformType, StringType } from "../../enums/data.type";
import { StringDecorator } from "../../../decorators/string.decorator";
import { DropDownDecorator } from "../../../decorators/dropdown.decorator";

@TableDecorator()
export class ComboEntity extends BaseEntity {
    @DropDownDecorator({ label: "Nhà cung cấp", required: true, lookup: LookupData.Reference(MOProviderEntity) })
    ProviderId: number;

    @DropDownDecorator({ allowSearch: true, label: "Nhóm dịch vụ", required: true, lookup: LookupData.Reference(MOGroupServiceEntity, ['Name'], 'Id', 'ProviderId') })
    ParentGroupId: number;

    @DropDownDecorator({ allowSearch: true, label: "Nhóm dịch vụ", required: true, lookup: LookupData.ReferenceUrl('/mogroupservice/lookupParent', ['Name'], 'Id', 'ParentGroupId') })
    GroupId: number;

    @StringDecorator({ label: "Tên định danh", required: true, type: StringType.Text, max: 150 })
    Name: string;

    @StringDecorator({ label: "Tên hiển thị", required: true, type: StringType.Text, max: 150 })
    NameShow: string;

    @StringDecorator({ label: "Mã combo", required: true, type: StringType.Text, max: 150, customValidators: [{ pattern: RegexType.CodeService, message: 'Chỉ được viết liền gồm chữ và số' }], textTransform: TextTransformType.UpperCase })
    Code: string;

    @StringDecorator({ type: StringType.MultiText })
    Description: string;

    unitDuration: number

    ProductCombo: ProductEntity[]
}