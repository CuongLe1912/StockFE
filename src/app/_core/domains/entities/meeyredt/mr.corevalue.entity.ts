import { StringType } from "../../enums/data.type";
import { AppConfig } from "../../../../_core/helpers/app.config";
import { ImageDecorator } from "../../../../_core/decorators/image.decorator";
import { TableDecorator } from "../../../../_core/decorators/table.decorator";
import { StringDecorator } from "../../../../_core/decorators/string.decorator";

@TableDecorator({ title: 'Giá trị cốt lõi' })
export class MRCoreValueEntity {
    @StringDecorator({ label: 'Tiêu đề - Tiếng Việt', required: true, max: 150 })
    TitleVn: string;

    @StringDecorator({ label: 'Tiêu đề - Tiếng Anh', max: 150 })
    TitleEn: string;

    @StringDecorator({ label: 'Nội dung - Tiếng Việt', required: true, type: StringType.Html, max: 100000 })
    ContentVn: string;

    @StringDecorator({ label: 'Nội dung - Tiếng Anh', type: StringType.Html, max: 100000 })
    ContentEn: string;

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
}