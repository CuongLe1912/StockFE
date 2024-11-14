import { BooleanDecorator } from "../../../../_core/decorators/boolean.decorator";
import { DropDownDecorator } from "../../../../_core/decorators/dropdown.decorator";
import { StringDecorator } from "../../../../_core/decorators/string.decorator";
import { TableDecorator } from "../../../../_core/decorators/table.decorator";
import { LookupData } from "../../../../_core/domains/data/lookup.data";
import { BaseEntity } from "../../../../_core/domains/entities/base.entity";
import { BooleanType, StringType } from "../../../../_core/domains/enums/data.type";
import { DecoratorType, SystemType } from "../enums/decorator.type";

@TableDecorator()
export class ModuleEntity extends BaseEntity {
	@StringDecorator({ label: "E:/Meey land/Project/meey-admin-ui/", required: true, type: StringType.Text })
	FolderPath: string;

	@StringDecorator({ label: "meeyland", required: true, type: StringType.Text })
	GroupName: string;

	@StringDecorator({ label: "Module Name", required: true, type: StringType.Text, max: 150 })
	ModuleName: string;

	ModuleFolder: string;

	@BooleanDecorator({ label: "Extends BaseEntity", type: BooleanType.Checkbox })
	BaseEntity: boolean;

	ListDecorator: DecoratorEntity[]
	ContentEntity: string
	ContentModule: string
	ContentComponent: string
}

@TableDecorator()
export class DecoratorEntity extends BaseEntity {	

	@StringDecorator({ label: "Property", required: true, type: StringType.Text, max: 150 })
	Name: string;

	@StringDecorator({ label: "Label", required: true, type: StringType.Text, max: 150 })
	Label: string;

    @DropDownDecorator({ label: "Type", required: true, lookup: LookupData.ReferenceEnum(DecoratorType) })
    Type: number;

	@DropDownDecorator({ label: "System Type", required: true, lookup: LookupData.ReferenceEnum(SystemType) })
	SystemType: string;
}
