import { BaseEntity } from "../base.entity";
import { StringType } from "../../enums/data.type";
import { AppConfig } from "../../../../_core/helpers/app.config";
import { ImageDecorator } from "../../../../_core/decorators/image.decorator";
import { TableDecorator } from "../../../../_core/decorators/table.decorator";
import { StringDecorator } from "../../../../_core/decorators/string.decorator";

@TableDecorator({ title: 'Lãnh đạo [QR]' })
export class MGQRLeaderEntity extends BaseEntity {
    @StringDecorator({ label: 'Mã URL', type: StringType.Code, required: true, max: 20 })
    Code: string;

    @StringDecorator({ label: 'Họ và tên - Tiếng Việt', required: true, max: 250 })
    NameVn: string;

    @StringDecorator({ label: 'Họ và tên - Tiếng Anh', required: true, max: 250 })
    NameEn: string;

    @StringDecorator({ label: 'Số điện thoại', type: StringType.Number, required: true, max: 15 })
    Phone: string;

    @StringDecorator({ label: 'Email', type: StringType.Email, required: true, max: 250 })
    Email: string;

    @StringDecorator({ label: 'Website', type: StringType.Link, max: 250 })
    Website: string;

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
    Avatar: string;

    @StringDecorator({ label: 'Chức vụ - Tiếng Việt', max: 250 })
    PositionVn: string;

    @StringDecorator({ label: 'Chức vụ - Tiếng Anh', max: 250 })
    PositionEn: string;

    @StringDecorator({ label: 'Công ty - Tiếng Việt', max: 250 })
    CompanyVn: string;

    @StringDecorator({ label: 'Công ty - Tiếng Anh', max: 250 })
    CompanyEn: string;
}