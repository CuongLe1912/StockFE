import { BaseEntity } from "../base.entity";
import { StringType } from "../../enums/data.type";
import { LookupData } from "../../data/lookup.data";
import { MGOfficeType } from "./enums/mg.office.type";
import { AppConfig } from "../../../../_core/helpers/app.config";
import { ConstantHelper } from "../../../../_core/helpers/constant.helper";
import { TableDecorator } from "../../../../_core/decorators/table.decorator";
import { ImageDecorator } from "../../../../_core/decorators/image.decorator";
import { StringDecorator } from "../../../../_core/decorators/string.decorator";
import { NumberDecorator } from "../../../../_core/decorators/number.decorator";
import { DropDownDecorator } from "../../../../_core/decorators/dropdown.decorator";

@TableDecorator({ title: 'Văn phòng' })
export class MGOfficeEntity extends BaseEntity {
    @NumberDecorator({ max: 2000 })
    Top: number;

    @NumberDecorator({ max: 2000 })
    Left: number;

    @StringDecorator({ label: 'Tên - Tiếng Việt', required: true, max: 250 })
    TitleVn: string;

    @StringDecorator({ label: 'Tên - Tiếng Anh', max: 250 })
    TitleEn: string;

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

    @StringDecorator({ label: 'Email', type: StringType.Email  })
    Email: string;

    @StringDecorator({ label: 'Số điện thoại', type: StringType.PhoneText  })
    Phone: string;
    
    @DropDownDecorator({ label: 'Vị trí - Tiếng Việt', lookup: LookupData.ReferenceStrings(['Miền Bắc', 'Miền Trung', 'Miền Nam', 'Nước ngoài']) })
    LocationVn: string;

    @DropDownDecorator({ label: 'Vị trí - Tiếng Anh', lookup: LookupData.ReferenceStrings(['Northern', 'Central', 'Southern', 'International']) })
    LocationEn: string;
    
    @StringDecorator({ label: 'Địa chỉ - Tiếng Việt', type: StringType.MultiText, max: 500 })
    AddressVn: string;

    @StringDecorator({ label: 'Địa chỉ - Tiếng Anh', type: StringType.MultiText, max: 500 })
    AddressEn: string;

    @DropDownDecorator({ label: 'Loại', lookup: { items: ConstantHelper.MG_OFFICE_TYPES } })
    Type: MGOfficeType;

    @StringDecorator({ label: 'Vĩ độ', type: StringType.Text, max: 50 })
    Lat: string;

    @StringDecorator({ label: 'Kinh độ', type: StringType.Text, max: 50 })
    Lng: string;
}