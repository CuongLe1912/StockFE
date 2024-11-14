import { BaseEntity } from "../base.entity";
import { NumberType } from "../../enums/data.type";
import { LookupData } from "../../data/lookup.data";
import { ConstantHelper } from "../../../../_core/helpers/constant.helper";
import { MBankCategoryLeaderType } from "./enums/mbank.category.leader.type";
import { TableDecorator } from "../../../../_core/decorators/table.decorator";
import { StringDecorator } from "../../../../_core/decorators/string.decorator";
import { NumberDecorator } from "../../../../_core/decorators/number.decorator";
import { DropDownDecorator } from "../../../../_core/decorators/dropdown.decorator";
import { MBankCategoryAnnouncedType } from "./enums/mbank.category.announced.type";

@TableDecorator({ title: 'Chủ đề' })
export class MBankCategoryEntity extends BaseEntity {
    @StringDecorator({ label: 'Tên - Tiếng Việt', required: true, max: 150 })
    NameVn: string;

    @StringDecorator({ label: 'Tên - Tiếng Anh', max: 150 })
    NameEn: string;

    @NumberDecorator({ label: 'Thứ tự', type: NumberType.Numberic })
    Order: number;
}

@TableDecorator({ title: 'Chủ đề' })
export class MBankCategoryAnnouncedEntity extends BaseEntity {
    @StringDecorator({ label: 'Tên - Tiếng Việt', required: true, max: 150 })
    NameVn: string;

    @StringDecorator({ label: 'Tên - Tiếng Anh', max: 150 })
    NameEn: string;

    @NumberDecorator({ label: 'Thứ tự', type: NumberType.Numberic })
    Order: number;

    @DropDownDecorator({ label: 'Dạng hiển thị', lookup: { items: ConstantHelper.MBANK_CATEGORY_ANNOUNCED_TYPES } })
    Type: MBankCategoryAnnouncedType;

    @DropDownDecorator({ label: 'Chủ đề cha', lookup: LookupData.Reference(MBankCategoryAnnouncedEntity, ['NameVn', 'NameEn']) })
    ParentId?: number;
}

@TableDecorator({ title: 'Nhóm lãnh đạo' })
export class MBankCategoryLeaderEntity extends BaseEntity {
    @StringDecorator({ label: 'Tên - Tiếng Việt', required: true, max: 150 })
    NameVn: string;

    @StringDecorator({ label: 'Tên - Tiếng Anh', max: 150 })
    NameEn: string;

    @DropDownDecorator({ label: 'Loại', required: true, lookup: { items: ConstantHelper.MBANK_CATEGORY_LEADER_TYPES } })
    LeaderType: MBankCategoryLeaderType;
}