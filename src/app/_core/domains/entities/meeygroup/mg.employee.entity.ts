import { BaseEntity } from "../base.entity";
import { ProjectType } from "../../enums/project.type";
import { AppConfig } from "../../../../_core/helpers/app.config";
import { ImageDecorator } from "../../../../_core/decorators/image.decorator";
import { TableDecorator } from "../../../../_core/decorators/table.decorator";
import { StringDecorator } from "../../../../_core/decorators/string.decorator";

@TableDecorator({ title: 'Nhân viên' })
export class MGEmployeeEntity extends BaseEntity {
    @StringDecorator({ label: 'Họ và tên', required: true, max: 150 })
    Name: string;

    @ImageDecorator({
        multiple: false,
        label: 'Ảnh đại diện',
        description: 'Định dạng: jpg, png',
        customUpload: {
            needMove: true,
            url: AppConfig.MeeyMediaConfig.Api + '/v1/admin/media/upload-image',
            headers: [{ key: 'X-Client-Source', value: AppConfig.MeeyGroupConfig.Source }],
            authorization: { key: AppConfig.MeeyMediaConfig.UserName, value: AppConfig.MeeyMediaConfig.Password },
            data: [{ key: 'images', value: 'data' }, { key: 'createdBy[data][_id]', value: 'createdById' }, { key: 'createdBy[data][fullname]', value: 'createdByName' }, { key: 'createdBy[source]', value: 'admin' }]
        }
    })
    Image: string;

    @StringDecorator({ label: 'Tiêu đề - Tiếng Việt', max: 150 })
    TitleVn: string;

    @StringDecorator({ label: 'Tiêu đề - Tiếng Anh', max: 150 })
    TitleEn: string;

    @StringDecorator({ label: 'Nhận xét - Tiếng Việt', max: 250 })
    ReviewVn: string;

    @StringDecorator({ label: 'Nhận xét - Tiếng Anh', max: 250 })
    ReviewEn: string;

    @StringDecorator({ label: 'Chức vụ - Tiếng Việt', max: 150 })
    PositionVn: string;

    @StringDecorator({ label: 'Chức vụ - Tiếng Anh', max: 150 })
    PositionEn: string;
}