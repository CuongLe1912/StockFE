import { BaseEntity } from "../base.entity";
import { LookupData } from "../../data/lookup.data";
import { MGProductEntity } from "./mg.product.entity";
import { ProjectType } from "../../enums/project.type";
import { MGSectionType } from "./enums/mg.section.type";
import { NumberType, StringType } from "../../enums/data.type";
import { AppConfig } from "../../../../_core/helpers/app.config";
import { ConstantHelper } from "../../../../_core/helpers/constant.helper";
import { TableDecorator } from "../../../../_core/decorators/table.decorator";
import { ImageDecorator } from "../../../../_core/decorators/image.decorator";
import { StringDecorator } from "../../../../_core/decorators/string.decorator";
import { NumberDecorator } from "../../../../_core/decorators/number.decorator";
import { DropDownDecorator } from "../../../../_core/decorators/dropdown.decorator";

@TableDecorator({ title: 'Nội dung' })
export class MGSectionEntity extends BaseEntity {
    @StringDecorator({ label: 'Tên', required: true, max: 250 })
    Name: string;

    @DropDownDecorator({ label: 'Loại', lookup: { items: ConstantHelper.MG_SECTION_TYPES } })
    Type: MGSectionType;

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

    @StringDecorator({ label: 'Chi tiết - Tiếng Việt', type: StringType.Json, max: 100000 })
    JsonValueVn: string;

    @StringDecorator({ label: 'Chi tiết - Tiếng Anh', type: StringType.Json, max: 100000 })
    JsonValueEn: string;
}

@TableDecorator({ title: 'Những con số' })
export class MGSectionNumberEntity {
    @NumberDecorator({ type: NumberType.Text })
    Amount: number;
    
    @StringDecorator({ label: 'Tiêu đề', required: true, max: 250 })
    Title: string;
}

@TableDecorator({ title: 'Hệ sinh thái' })
export class MGSectionProductEntity {
    @DropDownDecorator({ lookup: LookupData.Reference(MGProductEntity, ['NameVn', 'NameEn']) })
    ProductId: number;
    
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
}

@TableDecorator({ title: 'Văn phòng/Chi nhánh' })
export class MGSectionOfficeEntity {
    @DropDownDecorator({ lookup: LookupData.Reference(MGProductEntity, ['NameVn', 'NameEn']) })
    OfficeId: number;

    @NumberDecorator({ type: NumberType.Numberic })
    Point: number;
    
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
}