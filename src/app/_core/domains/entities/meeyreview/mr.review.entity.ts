import { BaseEntity } from "../base.entity";
import { MRVReviewType } from "./enums/review.type";
import { LookupData } from "../../data/lookup.data";
import { MRVReviewStatusType } from "./enums/review.status.typs";
import { AppConfig } from "../../../../_core/helpers/app.config";
import { FileDecorator } from "../../../../_core/decorators/file.decorator";
import { TableDecorator } from "../../../../_core/decorators/table.decorator";
import { StringDecorator } from "../../../../_core/decorators/string.decorator";
import { NumberDecorator } from "../../../../_core/decorators/number.decorator";
import { BooleanDecorator } from "../../../../_core/decorators/boolean.decorator";
import { DropDownDecorator } from "../../../../_core/decorators/dropdown.decorator";
import { DateTimeDecorator } from "../../../../_core/decorators/datetime.decorator";
import { BooleanType, DropdownLoadType, NumberType, StringType } from "../../enums/data.type";

@TableDecorator({ title: 'Review' })
export class MeeyReviewEntity extends BaseEntity {

    @DateTimeDecorator({ label: 'Thời gian gửi', required: false, minCurent: true })
    PublishedAt: Date;

    @DateTimeDecorator({ label: 'Thời gian gửi', required: false })
    PublishedAtFilter: Date;

    @DropDownDecorator({
        label: 'Loại nội dung', lookup: LookupData.ReferenceItems([
            { label: 'Review', value: MRVReviewType.Review },
            { label: 'Câu hỏi', value: MRVReviewType.Question },
            { label: 'Phản hồi', value: MRVReviewType.Reply },
        ])
    })
    Type: MRVReviewType;

    @DropDownDecorator({ label: 'Người tạo', lookup: { url: '/MeeyReviewUser/LookupUsers', loadType: DropdownLoadType.Ajax } })
    UserId: string;

    @DropDownDecorator({ required: true, label: 'Dự án', lookup: { url: '/MeeyReviewProject/LookupProjects', loadType: DropdownLoadType.Ajax } })
    ProjectId: string;

    @DropDownDecorator({
        label: 'Trạng thái đăng', lookup: LookupData.ReferenceItems([
            { label: 'Đã đăng', value: MRVReviewStatusType.Published },
            { label: 'Chờ đăng', value: MRVReviewStatusType.Pending },
        ])
    })
    Status: MRVReviewStatusType;

    @StringDecorator({ required: true, label: 'Nội dung', type: StringType.MultiText, max: 2000 })
    Comment: string;

    @NumberDecorator({ label: 'Điểm đánh giá', type: NumberType.Text, step: 1, max: 5 })
    Vote: number;

    @BooleanDecorator({ type: BooleanType.Star, allowUncheck: true })
    VoteScore: number;

    @BooleanDecorator({ type: BooleanType.Star, label: 'Vị trí', allowUncheck: true })
    Vote1: number;

    @BooleanDecorator({ type: BooleanType.Star, label: 'Giá bán', allowUncheck: true })
    Vote2: number;

    @BooleanDecorator({ type: BooleanType.Star, label: 'Pháp lý', allowUncheck: true })
    Vote3: number;

    @BooleanDecorator({ type: BooleanType.Star, label: 'Dịch vụ', allowUncheck: true })
    Vote4: number;

    @BooleanDecorator({ type: BooleanType.Star, label: 'Tiện ích', allowUncheck: true })
    Vote5: number;

    @BooleanDecorator({ type: BooleanType.Star, label: 'Chủ đầu tư', allowUncheck: true })
    Vote6: number;

    @BooleanDecorator({ type: BooleanType.Star, label: 'BQL Dự án', allowUncheck: true })
    Vote7: number;

    @BooleanDecorator({ type: BooleanType.Star, label: 'Chất lượng', allowUncheck: true })
    Vote8: number;

    @DateTimeDecorator({ label: 'Ngày sửa' })
    UpdatedAt: Date;

    @DateTimeDecorator({ label: 'Ngày tạo' })
    CreatedAt: Date;

    @StringDecorator({ label: 'Biệt danh', type: StringType.Text, max: 100 })
    NickName: string;

    @FileDecorator({
        size: 10,
        max: 10000,
        multiple: true,
        totalSize: 500,
        duplicate: false,
        label: 'Ảnh, Video, Tài liệu',
        customUpload: {
            url: AppConfig.MeeyMediaConfig.Api + '/v1/admin/media',
            headers: [{ key: 'X-Client-Source', value: AppConfig.MeeyReviewConfig.Source }],
            authorization: { key: AppConfig.MeeyMediaConfig.UserName, value: AppConfig.MeeyMediaConfig.Password },
            data: [{ key: 'files', value: 'data' }, { key: 'createdBy[data][_id]', value: 'createdById' }, { key: 'createdBy[data][fullname]', value: 'createdByName' }, { key: 'createdBy[source]', value: 'admin' }]
        },
        description: 'Định dạng: png, jpg, mp4, pdf, doc, docx, xls, xlsx, dwg, kmz...',
        regexTypes: /.(mp4|avi|mkv|wmv|vob|flv|wmv9|mpeg|3gp|webm|hevc|mov|mpg|3gpp|mpeg1|mpeg2|mpeg4|mpegps|jpg|jpeg|png|bmp|gif|heic|heif|tiff|svg|psd|webp|avif|pdf|xlsx|xls|doc|docx|pptx|dwg|kmz|mp3|wma)/,
        accept: '.mp4,.avi,.mkv,.wmv,.vob,.flv,.wmv9,.mpeg,.3gp,.webm,.hevc,.mov,.mpg,.3gpp,.mpeg1,.mpeg2,.mpeg4,.mpegps,.jpg,.jpeg,.png,.bmp,.gif,.heic,.heif,.tiff,.svg,.psd,.webp,.avif,.pdf,.xlsx,.xls,.doc,.docx,.pptx,.dwg,.kmz,.mp3,.wma',
    })
    Files: any[];

    @DropDownDecorator({
        multiple: true,
        label: 'Điểm đánh giá', lookup: LookupData.ReferenceItems([
            { label: 'Chưa có sao', value: 0 },
            { label: 'Từ 1 đến 2 sao', value: 1 },
            { label: 'Từ 2 đến 3 sao', value: 2 },
            { label: 'Từ 3 đến 4 sao', value: 3 },
            { label: 'Từ 4 đến 5 sao', value: 4 },
        ])
    })
    FilterVote: number[];

    @StringDecorator({ label: 'Người tạo', type: StringType.Text, max: 250 })
    FilterUser: string;

    @StringDecorator({ label: 'Nội dung', placeholder: 'Nhập nội dung review, câu hỏi, phản hồi', type: StringType.Text, max: 255 })
    FilterComment: string;

    TypeNumber:number;
    StatusNumber:number;
}