import { BaseEntity } from "../base.entity";
import { StringType } from "../../enums/data.type";
import { LookupData } from "../../data/lookup.data";
import { MShareNewsType } from "./enums/ms.news.type";
import { MShareStatusType } from "./enums/ms.status.type";
import { AppConfig } from "../../../../_core/helpers/app.config";
import { ImageDecorator } from "../../../../_core/decorators/image.decorator";
import { TableDecorator } from "../../../../_core/decorators/table.decorator";
import { StringDecorator } from "../../../../_core/decorators/string.decorator";
import { DropDownDecorator } from "../../../../_core/decorators/dropdown.decorator";
import { DateTimeDecorator } from "../../../../_core/decorators/datetime.decorator";

@TableDecorator({ title: 'Tin tức' })
export class MeeyShareNewsEntity extends BaseEntity {
    @StringDecorator({ label: 'Tiêu đề', max: 250 })
    Title: string;

    @StringDecorator({ label: 'Mô tả ngắn', type: StringType.MultiText, max: 1000 })
    Summary: string;

    @StringDecorator({ label: 'Nội dung', type: StringType.Html, max: 100000 })
    Content: string;

    @StringDecorator({ label: 'Từ khóa', type: StringType.Tag, max: 250 })
    Tags: string;

    @StringDecorator({ label: 'Link liên kết', type: StringType.Link, max: 250 })
    Link: string;

    @ImageDecorator({
        label: 'Ảnh',
        required: true,
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

    @DropDownDecorator({ label: 'Chuyên mục', lookup: { url: '/MeeyShareCategory/LookupCategories' } })
    CategoryId: number;

    @DropDownDecorator({
        label: 'Loại tin', lookup: LookupData.ReferenceItems([
            { label: 'Tin crawl chung', value: MShareNewsType.CRAWL_NEWS },
            { label: 'Tin crawl từ meeyland', value: MShareNewsType.MEEYLAND_NEWS },
            { label: 'Tin người dùng chia sẻ', value: MShareNewsType.SHARE_NEWS },
            { label: 'Video từ Meey Project', value: MShareNewsType.MPS_VIDEO },
        ])
    })
    Type: MShareNewsType;

    @DropDownDecorator({
        label: 'Trạng thái', lookup: LookupData.ReferenceItems([
            { label: 'Tin nháp', value: MShareStatusType.Draft },
            { label: 'Tin đang đăng', value: MShareStatusType.Published },
            { label: 'Tin đã hạ', value: MShareStatusType.Reject },
        ])
    })
    Status: MShareStatusType;

    @StringDecorator({ required: true, label: 'Nội dung ý kiến người đăng', type: StringType.MultiText, max: 10000 })
    Comment: string;

    @DateTimeDecorator({ label: 'Ngày tạo báo gốc' })
    CreatedAt: Date;

    @DateTimeDecorator({ label: 'Ngày sửa' })
    UpdatedAt: Date;

    @DateTimeDecorator({ label: 'Ngày đăng tin' })
    PublishedAt: Date;
}