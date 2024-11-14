import { BaseEntity } from "../base.entity";
import { StringType } from "../../enums/data.type";
import { AppConfig } from "../../../../_core/helpers/app.config";
import { TableDecorator } from "../../../../_core/decorators/table.decorator";
import { ImageDecorator } from "../../../../_core/decorators/image.decorator";
import { StringDecorator } from "../../../../_core/decorators/string.decorator";
import { NumberDecorator } from "../../../../_core/decorators/number.decorator";

@TableDecorator({ title: 'Văn phòng' })
export class MROfficeEntity extends BaseEntity {
    @NumberDecorator({ max: 2000 })
    Top: number;

    @NumberDecorator({ max: 2000 })
    Left: number;

    @StringDecorator({ label: 'Loại văn phòng - Tiếng Việt', required: true, max: 250 })
    TopicVn: string;

    @StringDecorator({ label: 'Loại văn phòng - Tiếng Anh', max: 250 })
    TopicEn: string;

    @StringDecorator({ label: 'Tiêu đề - Tiếng Việt', required: true, max: 250 })
    TitleVn: string;

    @StringDecorator({ label: 'Tiêu đề - Tiếng Anh', max: 250 })
    TitleEn: string;

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

    @StringDecorator({ label: 'Email', type: StringType.Email  })
    Email: string;

    @StringDecorator({ label: 'Số điện thoại', type: StringType.PhoneText  })
    Phone: string;
    
    @StringDecorator({ label: 'Vị trí - Tiếng Việt', max: 500 })
    LocationVn: string;

    @StringDecorator({ label: 'Vị trí - Tiếng Anh', max: 500 })
    LocationEn: string;
    
    @StringDecorator({ label: 'Địa chỉ - Tiếng Việt', type: StringType.MultiText, max: 500 })
    AddressVn: string;

    @StringDecorator({ label: 'Địa chỉ - Tiếng Anh', type: StringType.MultiText, max: 500 })
    AddressEn: string;

    @StringDecorator({ label: 'Vĩ độ', required: true, type: StringType.Text, max: 50 })
    Lat: string;

    @StringDecorator({ label: 'Kinh độ', required: true, type: StringType.Text, max: 50 })
    Lng: string;

    @StringDecorator({ label: 'Nội dung - Tiếng Việt', required: true, type: StringType.Html, max: 100000 })
    ContentVn: string;

    @StringDecorator({ label: 'Nội dung - Tiếng Anh', type: StringType.Html, max: 100000 })
    ContentEn: string;
}