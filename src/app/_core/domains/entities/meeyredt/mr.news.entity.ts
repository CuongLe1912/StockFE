import { BaseEntity } from "../base.entity";
import { AppConfig } from "../../../../_core/helpers/app.config";
import { ImageDecorator } from "../../../../_core/decorators/image.decorator";
import { TableDecorator } from "../../../../_core/decorators/table.decorator";
import { StringDecorator } from "../../../../_core/decorators/string.decorator";
import { DateTimeType, DropdownLoadType, StringType } from "../../enums/data.type";
import { DropDownDecorator } from "../../../../_core/decorators/dropdown.decorator";
import { DateTimeDecorator, DateTimeFormat } from "../../../../_core/decorators/datetime.decorator";

@TableDecorator({ title: 'Tin tức' })
export class MRNewsEntity extends BaseEntity {
    @StringDecorator({ label: 'Tiêu đề - Tiếng Việt', required: true, max: 250 })
    TitleVn: string;

    @StringDecorator({ label: 'Tiêu đề - Tiếng Anh', max: 250 })
    TitleEn: string;

    @StringDecorator({ label: 'Tóm tắt - Tiếng Việt', required: true, type: StringType.MultiText, max: 1000 })
    SummaryVn: string;

    @StringDecorator({ label: 'Tóm tắt - Tiếng Anh', type: StringType.MultiText, max: 1000 })
    SummaryEn: string;

    @StringDecorator({ label: 'Nội dung - Tiếng Việt', required: true, type: StringType.Html, max: 100000 })
    ContentVn: string;

    @StringDecorator({ label: 'Nội dung - Tiếng Anh', type: StringType.Html, max: 100000 })
    ContentEn: string;

    @StringDecorator({ label: 'Từ khóa - Tiếng Việt', type: StringType.Tag, max: 250 })
    TagVn: string;

    @StringDecorator({ label: 'Từ khóa - Tiếng Anh', type: StringType.Tag, max: 250 })
    TagEn: string;

    // @ImageDecorator({ label: 'Ảnh', url: 'upload/MGUpload' })
    // Image: string;

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

    @DateTimeDecorator({ label: 'Thời gian đăng tin', type: DateTimeType.DateTime, format: DateTimeFormat.DMYHM })
    PublishDate: string;

    @DropDownDecorator({ label: 'Chủ đề', required: true, lookup: { url: '/MRNews/LookupCategories', propertyDisplay: ['Name'], loadType: DropdownLoadType.Ajax }  })
    CategoryId: number;

    @StringDecorator({ label: 'Slug - Tiếng Việt', max: 250 })
    SlugVn: string;

    @StringDecorator({ label: 'Slug - Tiếng Anh', max: 250 })
    SlugEn: string;
}