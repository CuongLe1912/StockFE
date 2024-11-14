import { LookupData } from '../../data/lookup.data';
import { MAFRankCumulativeType } from './enums/rank.cumulative.type';
import { BaseEntity } from '../../../../_core/domains/entities/base.entity';
import { TableDecorator } from '../../../../_core/decorators/table.decorator';
import { NumberDecorator } from '../../../../_core/decorators/number.decorator';
import { StringDecorator } from '../../../../_core/decorators/string.decorator';
import { NumberType, StringType } from '../../../../_core/domains/enums/data.type';
import { DropDownDecorator } from '../../../../_core/decorators/dropdown.decorator';

@TableDecorator()
export class MAFRankCumulativeEntity extends BaseEntity {
	@NumberDecorator({ label: "Doanh số lũy kế", required: true, type: NumberType.Text, min: 1, max: 999999999999999 })
	Volume: number;

	@StringDecorator({ label: "Cấp bậc", type: StringType.Text })
	Name: string;

	@NumberDecorator({ label: "Mức hoa hồng", required: true, type: NumberType.Text, min: 0, max: 100 })
	Commission: number;

	@DropDownDecorator({ label: "Type", lookup: LookupData.ReferenceEnum(MAFRankCumulativeType) })
	Type: number;
}