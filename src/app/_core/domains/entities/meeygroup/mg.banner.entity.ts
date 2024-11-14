import { BaseEntity } from "../base.entity";
import { MGPageEntity } from "./mg.page.entity";
import { LookupData } from "../../data/lookup.data";
import { ProjectType } from "../../enums/project.type";
import { MGBannerDevice } from "./enums/mg.banner.type";
import { NumberType, StringType } from "../../enums/data.type";
import { AppConfig } from "../../../../_core/helpers/app.config";
import { ConstantHelper } from "../../../../_core/helpers/constant.helper";
import { TableDecorator } from "../../../../_core/decorators/table.decorator";
import { ImageDecorator } from "../../../../_core/decorators/image.decorator";
import { StringDecorator } from "../../../../_core/decorators/string.decorator";
import { NumberDecorator } from "../../../../_core/decorators/number.decorator";
import { DropDownDecorator } from "../../../../_core/decorators/dropdown.decorator";
import { VideoDecorator } from "../../../../_core/decorators/video.decorator";
import { FileDecorator } from "../../../../_core/decorators/file.decorator";

@TableDecorator({ title: 'Banner' })
export class MGBannerEntity extends BaseEntity {
    @DropDownDecorator({ label: 'Trang', lookup: LookupData.Reference(MGPageEntity), required: true })
    PageId: number;

    @StringDecorator({ label: 'Tên - Tiếng Việt', max: 250, required: true })
    NameVn: string;

    @StringDecorator({ label: 'Tên - Tiếng Anh', max: 250 })
    NameEn: string;

    @StringDecorator({ label: 'Button 1', max: 100 })
    Button1Vn: string;

    @StringDecorator({ label: 'Button 2', max: 100 })
    Button2Vn: string;

    @StringDecorator({ label: 'Button 1', max: 100 })
    Button1En: string;

    @StringDecorator({ label: 'Button 2', max: 100 })
    Button2En: string;

    @ImageDecorator({
        label: 'Ảnh/Video',
        required: true,
        multiple: false,
        description: 'Định dạng: jpg, png, jpeg',
        customUpload: {
            needMove: true,
            url: AppConfig.MeeyMediaConfig.Api + '/v1/admin/media/upload-image',
            headers: [{ key: 'X-Client-Source', value: AppConfig.MeeyGroupConfig.Source }],
            authorization: { key: AppConfig.MeeyMediaConfig.UserName, value: AppConfig.MeeyMediaConfig.Password },
            data: [{ key: 'images', value: 'data' }, { key: 'createdBy[data][_id]', value: 'createdById' }, { key: 'createdBy[data][fullname]', value: 'createdByName' }, { key: 'createdBy[source]', value: 'admin' }]
        }
    })
    Image: string;
    
    @FileDecorator({
        size: 100,
        label: 'Ảnh/Video',
        required: true,
        multiple: false,
        description: 'Định dạng: jpg, png, jpeg, mp4',
        customUpload: {
            needMove: true,
            url: AppConfig.MeeyMediaConfig.Api + '/v1/admin/media',
            headers: [{ key: 'X-Client-Source', value: AppConfig.MeeyGroupConfig.Source }],
            authorization: { key: AppConfig.MeeyMediaConfig.UserName, value: AppConfig.MeeyMediaConfig.Password },
            data: [{ key: 'files', value: 'data' }, { key: 'createdBy[data][_id]', value: 'createdById' }, { key: 'createdBy[data][fullname]', value: 'createdByName' }, { key: 'createdBy[source]', value: 'admin' }]
        },
        accept: 'image/jpg,image/jpeg,image/png,video/mp4'
    })
    File: string;
    

    @StringDecorator({ label: 'Đường dẫn 1', type: StringType.Link, max: 250 })
    LinkButton1: string;

    @StringDecorator({ label: 'Đường dẫn 2', type: StringType.Link, max: 250 })
    LinkButton2: string;

    @NumberDecorator({ type: NumberType.Numberic })
    Order: number;

    @DropDownDecorator({ label: 'Banner cho thiết bị', lookup: { items: ConstantHelper.MG_BANNER_DEVICE } })
    DeviceId: MGBannerDevice;
}