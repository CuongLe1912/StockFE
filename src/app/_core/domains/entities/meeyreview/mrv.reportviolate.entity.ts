import { LookupData } from "../../data/lookup.data";
import { AppConfig } from "../../../../_core/helpers/app.config";
import { ConstantHelper } from "../../../../_core/helpers/constant.helper";
import { FileDecorator } from "../../../../_core/decorators/file.decorator";
import { TableDecorator } from "../../../../_core/decorators/table.decorator";
import { ObjectDecorator } from "../../../../_core/decorators/object.decorator";
import { NumberDecorator } from "../../../../_core/decorators/number.decorator";
import { StringDecorator } from "../../../../_core/decorators/string.decorator";
import { BooleanDecorator } from "../../../../_core/decorators/boolean.decorator";
import { MRVReportViolateStatusType } from "./enums/mrv.reportviolate.status.type";
import { DateTimeType, DropdownLoadType, StringType } from "../../enums/data.type";
import { DateTimeDecorator } from "../../../../_core/decorators/datetime.decorator";
import { DropDownDecorator } from "../../../../_core/decorators/dropdown.decorator";

@TableDecorator({ title: 'Báo cáo vi phạm' })
export class MRVReportViolateEntity {
    @NumberDecorator({ allowSearch: true})
    Id?: number;

    @BooleanDecorator()
    IsActive?: boolean;

    @BooleanDecorator()
    IsDelete?: boolean;
    
    @StringDecorator()
    CreatedBy?: string;
    @DateTimeDecorator({ label: 'Ngày tạo'})
    CreatedDate?: Date;

    @DateTimeDecorator()
    UpdatedDate?: Date;

    @StringDecorator({ label: 'Nhập tên người báo cáo', max: 255, placeholder: 'Nhập tên tài khoản, biệt danh' })
    FilterName: string;

    @DropDownDecorator({ required: true, label: 'Dự án', lookup: { url: '/MeeyReviewProject/LookupProjects', loadType: DropdownLoadType.Ajax } })
    ProjectId: string;

    @DropDownDecorator({ label: 'Trạng thái', lookup: LookupData.ReferenceItems(ConstantHelper.MRV_REPORT_VIOLATE_STATUS_TYPE) })
    Status: MRVReportViolateStatusType;

    @DateTimeDecorator({ label: 'Thời gian báo cáo', type: DateTimeType.DateRange })
    FilterDateRange: Date;

    @StringDecorator({ label: 'Thời gian báo cáo',placeholder:' ', type: StringType.Text })
    CreateDate: string;

    @StringDecorator({ label: 'Thời gian xử lý', placeholder:' ',type: StringType.Text })
    TimeHandle: string;

    @StringDecorator({ label: 'Lý do báo cáo' , placeholder:' ',type: StringType.MultiText})
    Content: string;

    @StringDecorator({ label: 'Số phút' , type: StringType.Text})
    CountTimeSpan: string;
    
    @StringDecorator({ label: 'Tên dự án',placeholder:' ', type: StringType.Text })
    Project: string;

    @StringDecorator({ label: 'Người báo cáo',placeholder:' ', type: StringType.Text })
    CreatedByReport: string;

    @StringDecorator({ label: 'Người xử lý', placeholder:' ', type: StringType.Text })
    UpdatedByReport: string;

    // @ObjectDecorator({ label: 'Người báo cáo'})
    // UpdatedBy: object;

    @DateTimeDecorator({ label: 'Ngày tạo', type: DateTimeType.DateRange })
    CreatedAtReport: Date;

    @StringDecorator({ label: 'Nội dung báo cáo',placeholder:' ', type: StringType.MultiText })
    Comment: string;
    
    @ObjectDecorator({ label: 'Nội dung báo cáo',placeholder:' '})
    comment: object;

    @StringDecorator({ label: 'avata', type: StringType.Text })
    Avata: string;
    
    @StringDecorator({ label: 'NickName', type: StringType.Text })
    NickName: string;

    @StringDecorator({ label: 'ProjectTitle', type: StringType.Text })
    ProjectTitle: string;

    @StringDecorator({ label: 'UserHandler', type: StringType.Text })
    UserHandler: string;
    
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
    Media: any[];
}