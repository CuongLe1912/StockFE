import { BaseEntity } from "../base.entity";
import { NumberType } from "../../enums/data.type";
import { LookupData } from "../../data/lookup.data";
import { ConstantHelper } from "../../../../_core/helpers/constant.helper";
import { MGCategoryAnnouncedType } from "./enums/mg.category.announced.type";
import { TableDecorator } from "../../../../_core/decorators/table.decorator";
import { StringDecorator } from "../../../../_core/decorators/string.decorator";
import { NumberDecorator } from "../../../../_core/decorators/number.decorator";
import { DropDownDecorator } from "../../../../_core/decorators/dropdown.decorator";
import { MGCategoryLeaderType } from "./enums/mg.category.leader.type";

@TableDecorator({ title: 'Chủ đề' })
export class MGCategoryEntity extends BaseEntity {
    @StringDecorator({ label: 'Tên - Tiếng Việt', required: true, max: 150 })
    NameVn: string;

    @StringDecorator({ label: 'Tên - Tiếng Anh', max: 150 })
    NameEn: string;

    @NumberDecorator({ label: 'Thứ tự', type: NumberType.Numberic })
    Order: number;
}

@TableDecorator({ title: 'Chủ đề' })
export class MGCategoryAnnouncedEntity extends BaseEntity {
    @StringDecorator({ label: 'Tên - Tiếng Việt', required: true, max: 150 })
    NameVn: string;

    @StringDecorator({ label: 'Tên - Tiếng Anh', max: 150 })
    NameEn: string;

    @NumberDecorator({ label: 'Thứ tự', type: NumberType.Numberic })
    Order: number;

    @DropDownDecorator({ label: 'Dạng hiển thị', lookup: { items: ConstantHelper.MG_CATEGORY_ANNOUNCED_TYPES } })
    Type: MGCategoryAnnouncedType;

    @DropDownDecorator({ label: 'Chủ đề cha', lookup: LookupData.Reference(MGCategoryAnnouncedEntity, ['NameVn', 'NameEn']) })
    ParentId?: number;
}

@TableDecorator({ title: 'Nhóm lãnh đạo' })
export class MGCategoryLeaderEntity extends BaseEntity {
    @StringDecorator({ label: 'Tên - Tiếng Việt', required: true, max: 150 })
    NameVn: string;

    @StringDecorator({ label: 'Tên - Tiếng Anh', max: 150 })
    NameEn: string;

    @DropDownDecorator({ label: 'Loại', required: true, lookup: { items: ConstantHelper.MG_CATEGORY_LEADER_TYPES } })
    LeaderType: MGCategoryLeaderType;
}