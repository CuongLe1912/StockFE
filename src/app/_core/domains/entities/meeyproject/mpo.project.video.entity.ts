import { BaseEntity } from "../base.entity";
import { UserEntity } from "../user.entity";
import { LookupData } from "../../data/lookup.data";
import { MPOAvatarType } from "./enums/mpo.avatar.type";
import { AppConfig } from "../../../../_core/helpers/app.config";
import { ConstantHelper } from "../../../../_core/helpers/constant.helper";
import { TableDecorator } from "../../../../_core/decorators/table.decorator";
import { ImageDecorator } from "../../../../_core/decorators/image.decorator";
import { VideoDecorator } from "../../../../_core/decorators/video.decorator";
import { BooleanType, DateTimeType, DropdownLoadType, StringType } from "../../enums/data.type";
import { StringDecorator } from "../../../../_core/decorators/string.decorator";
import { BooleanDecorator } from "../../../../_core/decorators/boolean.decorator";
import { DropDownDecorator } from "../../../../_core/decorators/dropdown.decorator";
import { DateTimeDecorator } from "../../../../_core/decorators/datetime.decorator";

@TableDecorator({ title: 'Video dự án' })
export class MPOProjectVideosEntity extends BaseEntity {

    @ImageDecorator({
        size: 5,
        required: true,
        label: 'Ảnh đại diện',
        accept: 'image/jpg,image/jpeg,image/png,.heic',
        regexTypes: /.(png|jpg|jpeg|heic)/,
        customUpload: {
            url: AppConfig.MeeyMediaConfig.Api + '/v1/admin/media',
            headers: [{ key: 'X-Client-Source', value: AppConfig.MeeyProjectConfig.Source }],
            authorization: { key: AppConfig.MeeyMediaConfig.UserName, value: AppConfig.MeeyMediaConfig.Password },
            data: [{ key: 'images', value: 'data' }, { key: 'createdBy[data][_id]', value: 'createdById' }, { key: 'createdBy[data][fullname]', value: 'createdByName' }, { key: 'createdBy[source]', value: 'admin' }]
        }
    })
    ImageFromUpload: any;

    @ImageDecorator({
        size: 5,
        required: true,
        label: 'Ảnh đại diện',
        accept: 'image/jpg,image/jpeg,image/png,.heic',
        regexTypes: /.(png|jpg|jpeg|heic)/,
        customUpload: {
            url: AppConfig.MeeyMediaConfig.Api + '/v1/admin/media',
            headers: [{ key: 'X-Client-Source', value: AppConfig.MeeyProjectConfig.Source }],
            authorization: { key: AppConfig.MeeyMediaConfig.UserName, value: AppConfig.MeeyMediaConfig.Password },
            data: [{ key: 'images', value: 'data' }, { key: 'createdBy[data][_id]', value: 'createdById' }, { key: 'createdBy[data][fullname]', value: 'createdByName' }, { key: 'createdBy[source]', value: 'admin' }]
        }
    })
    ImageFromVideo: any;

    @StringDecorator({ label: 'Mô tả', max: 1000, type: StringType.MultiText })
    Description: string;

    DescriptionEditor: string;

    @StringDecorator({ label: 'Tiêu đề', required: true, max: 200 })
    Title: string;

    @VideoDecorator({
        size: 500,
        required: true,
        label: 'Video',
        multiple: false,
        regexTypes: /.(mp4|avi|wmv|vob|mkv|flv|wmv9|3gp|3gpp|mpeg|webm|mov|hevc|mpg|mpegps|mpeg-1|mpeg-2|mpeg-4)/,
        description: 'Định dạng: .mp4, .avi, .wmv, .vob, .mkv, .flv, .wmv9, .mpeg, .3gp, .webm, .mov, .hevc, 3gpp, .mpegps, .mpg, .wmv, .mpeg-1, mpeg-2, mpeg-4',
        customUpload: {
            url: AppConfig.MeeyMediaConfig.Api + '/v1/admin/media',
            headers: [{ key: 'X-Client-Source', value: AppConfig.MeeyProjectConfig.Source }],
            authorization: { key: AppConfig.MeeyMediaConfig.UserName, value: AppConfig.MeeyMediaConfig.Password },
            data: [{ key: 'videos', value: 'data' }, { key: 'createdBy[data][_id]', value: 'createdById' }, { key: 'createdBy[data][fullname]', value: 'createdByName' }, { key: 'createdBy[source]', value: 'admin' }]
        },
        accept: 'video/mp4,video/avi,video/x-msvideo,video/x-ms-wmv,video/x-flv,video/mpeg,video/3gpp,video/webm,video/x-matroska,video/quicktime,.mp4,.avi,.wmv,.vob,.mkv,.flv,.wmv9,.3gp,.3gpp,.mpeg,.webm,.mov,.hevc',
    })
    Video: any;

    Image: any;

    @StringDecorator({ label: 'Hashtag', max: 100, maxTags: 10, type: StringType.Tag, requiredHashTag: true })
    Tags: string;

    @DropDownDecorator({ label: 'Dự án', required: true, lookup: LookupData.ReferenceUrl('/MPOProjectVideos/LookupMeeyProject') })
    ProjectId: string;

    @DropDownDecorator({ label: 'Dự án', required: true, lookup: { url: '/MPOProjectVideos/LookupMeeyProject', loadType: DropdownLoadType.Ajax, propertyDisplay: ['TradeName'] } })
    VideoProjectId: string;

    @DropDownDecorator({ label: 'Dự án', lookup: { url: '/MPOProjectVideos/LookupMeeyProject', loadType: DropdownLoadType.Ajax, propertyDisplay: ['TradeName'] } })
    FilterVideoProjectId: string;

    @DropDownDecorator({ label: 'Chủ đề', required: true, lookup: LookupData.ReferenceUrl('/MPOProject/LookupProjectCategory?active=true') })
    CategoryId: string;

    @BooleanDecorator({ label: "Loại đối tượng", type: BooleanType.RadioButton, required: true, lookup: { items: ConstantHelper.MPO_AVATAR_TYPES } })
    Type: MPOAvatarType;

    //Filter Videos
    @StringDecorator({ label: 'Tên video', placeholder: 'Nhập tên video để tìm kiếm' })
    Name: string;

    @DropDownDecorator({
        label: 'Trạng thái AI kiểm tra', lookup: LookupData.ReferenceItems([
            { label: 'Đang kiểm tra', value: 3 },
            { label: 'Phù hợp', value: 0 },
            { label: 'Nghi ngờ', value: 1 },
            { label: 'Không phù hợp', value: 2 }
        ])
    })
    Censored: number;

    @DropDownDecorator({
        label: 'Trạng thái duyệt',
        lookup: LookupData.ReferenceItems([
            { label: 'Đã duyệt', value: 0 },
            { label: 'Đang chờ duyệt', value: 1 },
            { label: 'Không duyệt', value: 2 }
        ])
    })
    CensoredType: number;

    @DropDownDecorator({
        label: 'Hình thức video',
        lookup: LookupData.ReferenceItems([
            { label: 'Video người dùng đóng góp', value: 'meeyId' },
            { label: 'Video upload từ hệ thống', value: 'admin' },
            { label: 'Video livestream', value: 'live' }
        ])
    })
    TypeUpload: number;

    @DropDownDecorator({
        label: 'Trạng thái',
        required: true, lookup: LookupData.ReferenceItems([
            { label: 'Không Livestream', value: false },
            { label: 'Đang Livestream', value: true }
        ])
    })
    IsLive: boolean;

    @DateTimeDecorator({ label: 'Ngày tạo', type: DateTimeType.DateRange })
    FilterDateRange: Date;

    @DropDownDecorator({ label: 'Người tạo', lookup: { url: '/MPOProjectVideos/LookupFilterCreatedBy', loadType: DropdownLoadType.Ajax, propertyDisplay: ['FullName', 'Email', 'Phone'] } })
    FilterCreatedBy: string;

    @BooleanDecorator({ label: ' ', type: BooleanType.Toggle })
    isPublished: boolean = false;

    @DropDownDecorator({
        label: 'Kiểm duyệt',
        lookup: LookupData.ReferenceItems([
            { label: 'Duyệt', value: 0 },
            { label: 'Không duyệt', value: 2 }
        ])
    })
    Censorship: number;

    _id: string;
    uri: string;
    title: string;
}