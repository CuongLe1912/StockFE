import { BaseEntity } from "../base.entity";
import { StringType } from "../../enums/data.type";
import { ProjectType } from "../../enums/project.type";
import { MGPartnerType } from "./enums/mg.partner.type";
import { AppConfig } from "../../../../_core/helpers/app.config";
import { ConstantHelper } from "../../../../_core/helpers/constant.helper";
import { ImageDecorator } from "../../../../_core/decorators/image.decorator";
import { TableDecorator } from "../../../../_core/decorators/table.decorator";
import { StringDecorator } from "../../../../_core/decorators/string.decorator";
import { DropDownDecorator } from "../../../../_core/decorators/dropdown.decorator";

@TableDecorator({ title: 'Chủ đề' })
export class MGPartnerEntity extends BaseEntity {
    @StringDecorator({ label: 'Tên - Tiếng Việt', required: true, max: 150 })
    NameVn: string;

    @StringDecorator({ label: 'Tên - Tiếng Anh', max: 150 })
    NameEn: string;

    @ImageDecorator({
        label: 'Ảnh',
        multiple: false,
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

    @DropDownDecorator({ label: 'Loại', lookup: { items: ConstantHelper.MG_PARTNER_TYPES } })
    Type: MGPartnerType;

    @StringDecorator({ label: 'Miêu tả - Tiếng Việt', max: 500, type: StringType.MultiText, rows: 3 })
    DescriptionVn: string;

    @StringDecorator({ label: 'Miêu tả - Tiếng Anh', max: 500, type: StringType.MultiText, rows: 3 })
    DescriptionEn: string;

    @StringDecorator({ label: 'Đường dẫn', max: 250, type: StringType.Link })
    Link: string;
}