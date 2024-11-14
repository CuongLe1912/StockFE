import { BaseEntity } from '../base.entity';
import { StringType } from '../../enums/data.type';
import { LookupData } from '../../data/lookup.data';
import { MMQuestionLevelType } from './enums/mm.question.level.type';
import { TableDecorator } from '../../../../_core/decorators/table.decorator';
import { StringDecorator } from '../../../../_core/decorators/string.decorator';
import { DropDownDecorator } from '../../../../_core/decorators/dropdown.decorator';

@TableDecorator()
export class MMQuestionEntity extends BaseEntity {
    @StringDecorator({ required: true, type: StringType.Text, max: 500 })
    Title: string;

    @StringDecorator({ required: true, type: StringType.Html, max: 1000 })
    Content: string;

    @DropDownDecorator({ label: 'Câu hỏi cha', lookup: LookupData.Reference(MMQuestionEntity, ['Title']) })
    ParentId: number;

    @DropDownDecorator({ label: 'Cấp độ', lookup: LookupData.ReferenceEnum(MMQuestionLevelType) })
    Level: number;
}