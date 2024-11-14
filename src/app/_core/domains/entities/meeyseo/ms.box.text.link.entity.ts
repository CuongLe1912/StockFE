import { BaseEntity } from "../base.entity";
import { StringType } from "../../enums/data.type";
import { TableDecorator } from "../../../../_core/decorators/table.decorator";
import { NumberDecorator } from "../../../../_core/decorators/number.decorator";
import { StringDecorator } from "../../../../_core/decorators/string.decorator";

@TableDecorator()
export class MSBoxTextLink extends BaseEntity {
    @NumberDecorator({ label: 'Loại Tag', required: true })
    Type: number;

    @StringDecorator({ label: 'Tên Box', required: true, type: StringType.Text, max: 50 })
    Name: string;

    Details: MSTextLinkDetail[];
}

@TableDecorator()
export class MSTextLinkDetail extends BaseEntity {    
    @StringDecorator({ label: 'Nhập text link', required: true, type: StringType.Text, max: 50 })
    Name: string;

    @StringDecorator({ label: 'Nhập url', required: true, type: StringType.Text, max: 200, customValidators: [{ pattern: new RegExp(/^[a-zA-Z0-9].*[a-zA-Z0-9]$/g), message: 'Url không hợp lệ' }]  })
    Url: string;

    @StringDecorator({ label: "Rel", type: StringType.Text })
	Rel: string;

	@StringDecorator({ label: "Target", type: StringType.Text })
	Target: string;

    NeedUpdate?: boolean;
}