import { BaseEntity } from "../base.entity";
import { LookupData } from "../../data/lookup.data";
import { ProjectType } from "../../enums/project.type";
import { ModalSizeType } from "../../enums/modal.size.type";
import { MGCategoryAnnouncedEntity } from "./mg.category.entity";
import { DateTimeType, StringType } from "../../enums/data.type";
import { AppConfig } from "../../../../_core/helpers/app.config";
import { MGAnnouncedStatusType } from "./enums/mg.announced.type";
import { ConstantHelper } from "../../../../_core/helpers/constant.helper";
import { FileDecorator } from "../../../../_core/decorators/file.decorator";
import { TableDecorator } from "../../../../_core/decorators/table.decorator";
import { ImageDecorator } from "../../../../_core/decorators/image.decorator";
import { StringDecorator } from "../../../../_core/decorators/string.decorator";
import { DropDownDecorator } from "../../../../_core/decorators/dropdown.decorator";
import { DateTimeDecorator, DateTimeFormat } from "../../../../_core/decorators/datetime.decorator";
import { FileManagerComponent } from "../../../../_core/components/file.manager/file.manager.component";

@TableDecorator({ title: 'Thông báo' })
export class MGAnnouncedEntity extends BaseEntity {
    @StringDecorator({ label: 'Tiêu đề - Tiếng Việt', required: true, max: 250 })
    TitleVn: string;

    @StringDecorator({ label: 'Tiêu đề - Tiếng Anh', max: 250 })
    TitleEn: string;

    @StringDecorator({
        label: 'Nội dung - Tiếng Việt', type: StringType.Html,
        popupFile: {
            cancelText: 'Đóng',
            confirmText: 'Chọn',
            title: 'Quản lý tệp',
            object: FileManagerComponent,
            size: ModalSizeType.FullScreen,
        }
    })
    ContentVn: string;

    @StringDecorator({
        label: 'Nội dung - Tiếng Anh', type: StringType.Html,
        popupFile: {
            cancelText: 'Đóng',
            confirmText: 'Chọn',
            title: 'Quản lý tệp',
            object: FileManagerComponent,
            size: ModalSizeType.FullScreen,
        }
    })
    ContentEn: string;

    @StringDecorator({ label: 'Nhóm - Tiếng Việt', max: 50 })
    GroupVn: string;

    @StringDecorator({ label: 'Nhóm - Tiếng Anh', max: 50 })
    GroupEn: string;

    @StringDecorator({ label: 'Đường dẫn', max: 500 })
    Link: string;

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

    @FileDecorator({ label: 'Tệp', url: 'upload/MGUpload' })
    File: string;

    @DateTimeDecorator({ label: 'Thời gian đăng tin', type: DateTimeType.DateTime, format: DateTimeFormat.DMYHM })
    PublishDate: string;

    @DropDownDecorator({ label: 'Chủ đề', lookup: LookupData.Reference(MGCategoryAnnouncedEntity, ['NameVn', 'NameEn']) })
    CategoryId: number;

    @DropDownDecorator({ label: 'Trạng thái', lookup: { items: ConstantHelper.MG_ANNOUNCED_STATUS_TYPES } })
    Status: MGAnnouncedStatusType;
    // @DropDownDecorator({ label: 'Trạng thái', lookup: LookupData.ReferenceItems(ConstantHelper.MG_ANNOUNCED_STATUS_TYPES) })
    // Status: MGAnnouncedStatusType;
}