import { StringDecorator } from "../../../../_core/decorators/string.decorator";
import { BaseEntity } from "../base.entity";
import { DateTimeDecorator } from "../../../../_core/decorators/datetime.decorator";
import { BooleanType, DateTimeType, NumberType, StringType } from "../../enums/data.type";
import { DropDownDecorator } from "../../../../_core/decorators/dropdown.decorator";
import { LookupData } from "../../data/lookup.data";
import { MRVProjectStatusType } from "./enums/mrv.project.status.type";
import { TableDecorator } from "../../../../_core/decorators/table.decorator";
import { ConstantHelper } from "../../../../_core/helpers/constant.helper";
import { ImageDecorator } from "../../../../_core/decorators/image.decorator";
import { AppConfig } from "../../../../_core/helpers/app.config";
import { NumberDecorator } from "../../../../_core/decorators/number.decorator";
import { BooleanDecorator } from "../../../../_core/decorators/boolean.decorator";

@TableDecorator({ title: 'Danh sách dự án' })
export class MeeyReviewProjectEntity extends BaseEntity {
    @StringDecorator({ label: 'ID', placeholder: 'Nhập ID dự án', max: 255 })
    IdStr: string;

    @StringDecorator({ label: 'Tên thương mại dự án', placeholder: 'Nhập tên dự án', max: 255 })
    Title: string;

    @StringDecorator({ label: 'Mô tả dự án', type: StringType.MultiText, placeholder: ' ' })
    Description: string;

    @DateTimeDecorator({ label: 'Ngày tạo', type: DateTimeType.DateRange })
    FilterDateRange: Date;

    @NumberDecorator({ label: 'Số lượng câu hỏi', max: 9999999 })
    FilterNumberQuestion: number;

    @NumberDecorator({ label: 'Số lượng review', max: 9999999 })
    FilterTotalReview: number;

    @DropDownDecorator({ label: 'Điểm đánh giá' })
    VoteScore: number;

    @DropDownDecorator({ label: 'Điểm đánh giá', lookup: LookupData.ReferenceItems(ConstantHelper.MRV_PROJECT_VOTESCORE_TYPE) })
    FilterVoteScore: string;

    @NumberDecorator({ label: 'Số lượng review' })
    TotalReview: MRVProject_Statistic;

    @NumberDecorator({ label: 'Số lượt câu hỏi', type: NumberType.Range })
    TotalQuestion: MRVProject_Statistic;

    @NumberDecorator({ label: 'Số lượt phản hồi' })
    TotalReply: MRVProject_Statistic;

    @DropDownDecorator({ label: 'Trạng thái', lookup: LookupData.ReferenceItems(ConstantHelper.MRV_PROJECT_STATUS_TYPE) })
    StatusType: MRVProjectStatusType;

    @StringDecorator({ label: 'Tỉnh/thành phố' })
    City: string;

    @StringDecorator({ label: 'Quận/huyện' })
    District: string;

    @StringDecorator({ label: 'Phường/xã' })
    Ward: string;

    @StringDecorator({ label: 'Địa chỉ chi tiết' })
    Street: string;

    @DropDownDecorator({ label: 'Tỉnh/Thành phố', required: true, allowSearch: true,lookup: LookupData.ReferenceUrl('/MeeyReviewProject/LookupCity') })
    CityId: string;

    @DropDownDecorator({ label: 'Quận/Huyện', required: true, allowSearch: true, lookup: LookupData.ReferenceUrl('/MeeyReviewProject/LookupDistrict', null, null, 'CityId') })
    DistrictId: string;

    @DropDownDecorator({ label: 'Phường/Xã',required: true, allowSearch: true, lookup: LookupData.ReferenceUrl('/MeeyReviewProject/LookupWard', null, null, 'DistrictId') })
    WardId: string;

    @ImageDecorator({
        multiple: false,
        label: 'Ảnh bìa',
        customUpload: {
            needMove: true,
            url: AppConfig.MeeyMediaConfig.Api + '/v1/admin/media',
            headers: [{ key: 'X-Client-Source', value: AppConfig.MeeyLandConfig.Source }],
            authorization: { key: AppConfig.MeeyMediaConfig.UserName, value: AppConfig.MeeyMediaConfig.Password },
            data: [{ key: 'images', value: 'data' }, { key: 'createdBy[data][_id]', value: 'createdById' }, { key: 'createdBy[data][fullname]', value: 'createdByName' }, { key: 'createdBy[source]', value: 'admin' }]
        }
    })
    Banner: string;
    @ImageDecorator({
        multiple: false,
        label: 'Logo',
        customUpload: {
            needMove: true,
            url: AppConfig.MeeyMediaConfig.Api + '/v1/admin/media',
            headers: [{ key: 'X-Client-Source', value: AppConfig.MeeyLandConfig.Source }],
            authorization: { key: AppConfig.MeeyMediaConfig.UserName, value: AppConfig.MeeyMediaConfig.Password },
            data: [{ key: 'images', value: 'data' }, { key: 'createdBy[data][_id]', value: 'createdById' }, { key: 'createdBy[data][fullname]', value: 'createdByName' }, { key: 'createdBy[source]', value: 'admin' }]
        }
    })
    Logo: string;

    @BooleanDecorator({ label: 'Công khai', type: BooleanType.Toggle })
    IsPublish: boolean = true;


}
export class MRVProject_Statistic {
    Wait: number = 0
    Published: number = 0
}