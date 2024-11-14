import { BaseEntity } from "../base.entity";
import { AppConfig } from "../../../../_core/helpers/app.config";
import { ImageDecorator } from "../../../../_core/decorators/image.decorator";
import { TableDecorator } from "../../../../_core/decorators/table.decorator";
import { StringDecorator } from "../../../../_core/decorators/string.decorator";

@TableDecorator({ title: 'Lãnh đạo' })
export class MRLeaderEntity extends BaseEntity {
    @StringDecorator({ label: 'Họ và tên', required: true, max: 150 })
    Name: string;

    // @StringDecorator({ label: 'Đường dẫn', type: StringType.Link, max: 250 })
    // Link: string;

    @ImageDecorator({
        required: true,
        multiple: false,
        label: 'Ảnh đại diện',
        description: 'Định dạng: jpg, png',
        customUpload: {
            url: AppConfig.MeeyMediaConfig.Api + '/v1/admin/media/upload-image',
            headers: [{ key: 'X-Client-Source', value: AppConfig.MeeyGroupConfig.Source }],
            authorization: { key: AppConfig.MeeyMediaConfig.UserName, value: AppConfig.MeeyMediaConfig.Password },
            data: [{ key: 'images', value: 'data' }, { key: 'createdBy[data][_id]', value: 'createdById' }, { key: 'createdBy[data][fullname]', value: 'createdByName' }, { key: 'createdBy[source]', value: 'admin' }]
        }
    })
    Image: string;

    @StringDecorator({ label: 'Chức vụ - Tiếng Việt', max: 150 })
    PositionVn: string;

    @StringDecorator({ label: 'Chức vụ - Tiếng Anh', max: 150 })
    PositionEn: string;
}