import { BaseEntity } from "../base.entity";
import { NumberType, StringType } from "../../enums/data.type";
import { AppConfig } from "../../../../_core/helpers/app.config";
import { TableDecorator } from "../../../../_core/decorators/table.decorator";
import { ImageDecorator } from "../../../../_core/decorators/image.decorator";
import { StringDecorator } from "../../../../_core/decorators/string.decorator";
import { NumberDecorator } from "../../../../_core/decorators/number.decorator";

@TableDecorator({ title: 'Banner' })
export class MRBannerEntity extends BaseEntity {

    @StringDecorator({ label: 'Loại' })
    Type: string;

    @StringDecorator({ label: 'Text1' })
    Text1: string;

    @StringDecorator({ label: 'Text2' })
    Text2: string;

    @StringDecorator({ label: 'Button 1' })
    Button1Vn: string;

    @StringDecorator({ label: 'Button 2' })
    Button2Vn: string;

    @StringDecorator({ label: 'Button 1' })
    Button1En: string;

    @StringDecorator({ label: 'Button 2' })
    Button2En: string;

    @ImageDecorator({
        required: true,
        multiple: false,
        label: 'Ảnh',
        description: 'Định dạng: jpg, png',
        customUpload: {
            url: AppConfig.MeeyMediaConfig.Api + '/v1/admin/media/upload-image',
            headers: [{ key: 'X-Client-Source', value: AppConfig.MeeyGroupConfig.Source }],
            authorization: { key: AppConfig.MeeyMediaConfig.UserName, value: AppConfig.MeeyMediaConfig.Password },
            data: [{ key: 'images', value: 'data' }, { key: 'createdBy[data][_id]', value: 'createdById' }, { key: 'createdBy[data][fullname]', value: 'createdByName' }, { key: 'createdBy[source]', value: 'admin' }]
        }
    })
    Image: string;

    @StringDecorator({ label: 'Đường dẫn 1', type: StringType.Link, max: 250 })
    LinkButton1: string;

    @StringDecorator({ label: 'Đường dẫn 2', type: StringType.Link, max: 250 })
    LinkButton2: string;

    @NumberDecorator({ type: NumberType.Numberic })
    Order: number;
}