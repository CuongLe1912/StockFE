import { BaseEntity } from "../base.entity";
import { MGPageType } from "./enums/mg.page.type";
import { ProjectType } from "../../enums/project.type";
import { NumberType, StringType } from "../../enums/data.type";
import { AppConfig } from "../../../../_core/helpers/app.config";
import { ConstantHelper } from "../../../../_core/helpers/constant.helper";
import { TableDecorator } from "../../../../_core/decorators/table.decorator";
import { ImageDecorator } from "../../../../_core/decorators/image.decorator";
import { StringDecorator } from "../../../../_core/decorators/string.decorator";
import { NumberDecorator } from "../../../../_core/decorators/number.decorator";
import { DropDownDecorator } from "../../../../_core/decorators/dropdown.decorator";

@TableDecorator({ title: 'Sản phẩm' })
export class MGProductEntity extends BaseEntity {
    @StringDecorator({ label: 'Tên - Tiếng Việt', required: true, max: 250 })
    NameVn: string;

    @StringDecorator({ label: 'Tên - Tiếng Anh', max: 250 })
    NameEn: string;

    @ImageDecorator({
        label: 'Icon',
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
    Icon: string;

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

    @ImageDecorator({
        multiple: false,
        label: 'Ảnh hệ sinh thái',
        description: 'Định dạng: jpg, png',
        customUpload: {
            needMove: true,
            url: AppConfig.MeeyMediaConfig.Api + '/v1/admin/media/upload-image',
            headers: [{ key: 'X-Client-Source', value: AppConfig.MeeyGroupConfig.Source }],
            authorization: { key: AppConfig.MeeyMediaConfig.UserName, value: AppConfig.MeeyMediaConfig.Password },
            data: [{ key: 'images', value: 'data' }, { key: 'createdBy[data][_id]', value: 'createdById' }, { key: 'createdBy[data][fullname]', value: 'createdByName' }, { key: 'createdBy[source]', value: 'admin' }]
        }
    })
    ImageFull: string;
    
    @StringDecorator({ label: 'Miêu tả - Tiếng Việt', type: StringType.MultiText, max: 500 })
    DescriptionVn: string;

    @StringDecorator({ label: 'Miêu tả - Tiếng Anh', type: StringType.MultiText, max: 500 })
    DescriptionEn: string;

    @NumberDecorator({ label: 'Thứ tự', type: NumberType.Numberic })
    Order: number;
    
    @StringDecorator({ label: 'Đường dẫn IOS', type: StringType.Link, max: 250 })
    LinkIos: string;
    
    @StringDecorator({ label: 'Đường dẫn Android', type: StringType.Link, max: 250 })
    LinkAndroid: string;
    
    @StringDecorator({ label: 'Đường dẫn Website', type: StringType.Link, max: 250 })
    LinkWebsite: string;

    @StringDecorator({ label: 'Màu sắc', max: 50 })
    Color: string;

    @DropDownDecorator({ label: 'Trang', required: true, lookup: { items: ConstantHelper.MG_PAGE_TYPES } })
    MGPageType: MGPageType;
}