import { BaseEntity } from "../../base.entity";
import { CityEntity } from "../../city.entity";
import { DistrictEntity } from "../../district.entity";
import { LookupData } from "../../../data/lookup.data";
import { AppConfig } from "src/app/_core/helpers/app.config";
import { ConstantHelper } from "../../../../helpers/constant.helper";
import { ImageDecorator } from "../../../../decorators/image.decorator";
import { TableDecorator } from "../../../../decorators/table.decorator";
import { NumberDecorator } from "../../../../decorators/number.decorator";
import { StringDecorator } from "../../../../decorators/string.decorator";
import { BooleanDecorator } from "../../../../decorators/boolean.decorator";
import { DropDownDecorator } from "../../../../decorators/dropdown.decorator";
import { DateTimeType, NumberType, StringType } from "../../../enums/data.type";
import { DateTimeDecorator, DateTimeFormat } from "../../../../decorators/datetime.decorator";

@TableDecorator({ title: 'Tin tức' })
export class MgRecruitmentEntity extends BaseEntity {
    @StringDecorator({ label: 'Chức danh tuyển dụng', required: true, max: 250 })
    TitleVn: string;

    @StringDecorator({ label: 'Chức danh tuyển dụng', max: 250, required: true })
    TitleEn: string;

    @StringDecorator({ label: 'Slug - Tiếng Việt', max: 250 })
    SlugVn: string;

    @StringDecorator({ label: 'Slug - Tiếng Anh', max: 250 })
    SlugEn: string;

    @StringDecorator({ label: 'Mô tả tin nổi bật - Tiếng Việt', type: StringType.Text, max: 150, required: true })
    SummaryVn: string;

    @StringDecorator({ label: 'Mô tả tin nổi bật - Tiếng Anh', type: StringType.Text, max: 150, required: true })
    SummaryEn: string;

    @StringDecorator({
        label: 'Mô tả công việc', required: true, type: StringType.Html, max: 5000,
        customUpload: {
            needMove: true,
            url: AppConfig.MeeyMediaConfig.Api + '/v1/admin/media/upload-image',
            headers: [{ key: 'X-Client-Source', value: AppConfig.MeeyGroupConfig.Source }],
            authorization: { key: AppConfig.MeeyMediaConfig.UserName, value: AppConfig.MeeyMediaConfig.Password },
            data: [{ key: 'images', value: 'data' }, { key: 'createdBy[data][_id]', value: 'createdById' }, { key: 'createdBy[data][fullname]', value: 'createdByName' }, { key: 'createdBy[source]', value: 'admin' }]
        }
    })
    ContentVn: string;

    @StringDecorator({
        label: 'Mô tả công việc', type: StringType.Html, max: 5000, required: true,
        customUpload: {
            needMove: true,
            url: AppConfig.MeeyMediaConfig.Api + '/v1/admin/media/upload-image',
            headers: [{ key: 'X-Client-Source', value: AppConfig.MeeyGroupConfig.Source }],
            authorization: { key: AppConfig.MeeyMediaConfig.UserName, value: AppConfig.MeeyMediaConfig.Password },
            data: [{ key: 'images', value: 'data' }, { key: 'createdBy[data][_id]', value: 'createdById' }, { key: 'createdBy[data][fullname]', value: 'createdByName' }, { key: 'createdBy[source]', value: 'admin' }]
        }
    })
    ContentEn: string;

    @StringDecorator({
        label: 'Yêu cầu công việc', required: true, type: StringType.Html, max: 5000,
        customUpload: {
            needMove: true,
            url: AppConfig.MeeyMediaConfig.Api + '/v1/admin/media/upload-image',
            headers: [{ key: 'X-Client-Source', value: AppConfig.MeeyGroupConfig.Source }],
            authorization: { key: AppConfig.MeeyMediaConfig.UserName, value: AppConfig.MeeyMediaConfig.Password },
            data: [{ key: 'images', value: 'data' }, { key: 'createdBy[data][_id]', value: 'createdById' }, { key: 'createdBy[data][fullname]', value: 'createdByName' }, { key: 'createdBy[source]', value: 'admin' }]
        }
    })
    JobRequirementVn: string;

    @StringDecorator({
        label: 'Yêu cầu công việc', type: StringType.Html, max: 5000, required: true,
        customUpload: {
            needMove: true,
            url: AppConfig.MeeyMediaConfig.Api + '/v1/admin/media/upload-image',
            headers: [{ key: 'X-Client-Source', value: AppConfig.MeeyGroupConfig.Source }],
            authorization: { key: AppConfig.MeeyMediaConfig.UserName, value: AppConfig.MeeyMediaConfig.Password },
            data: [{ key: 'images', value: 'data' }, { key: 'createdBy[data][_id]', value: 'createdById' }, { key: 'createdBy[data][fullname]', value: 'createdByName' }, { key: 'createdBy[source]', value: 'admin' }]
        }
    })
    JobRequirementEn: string;

    @DateTimeDecorator({ label: 'Ngày đăng tin', type: DateTimeType.Date, format: DateTimeFormat.DMY })
    PublishDate: string;

    @DateTimeDecorator({ label: 'Ngày tạo', type: DateTimeType.Date, format: DateTimeFormat.DMY })
    CreatedDate?: Date;

    @DateTimeDecorator({ label: 'Ngày hết hạn', required: true, type: DateTimeType.Date, format: DateTimeFormat.DMY, allowSearch: true })
    ExpireDate: string;

    @DateTimeDecorator({ label: 'Ngày hết hạn', required: true, type: DateTimeType.Date, format: DateTimeFormat.DMY, allowSearch: true, min: new Date(new Date().getTime() + 24 * 60 * 60 * 1000) })
    ExpireDateEdit: string;

    @DropDownDecorator({ label: 'Trạng thái', lookup: { items: ConstantHelper.MG_RECRUITMENT_STATUS_TYPES } })
    Status: number;

    @DropDownDecorator({ label: 'Loại tin', lookup: { items: ConstantHelper.MG_RECRUITMENT_TYPES } })
    TypeId: number;

    @BooleanDecorator()
    TypeIdBool: any;

    @DropDownDecorator({ label: 'Ngành nghề', lookup: LookupData.ReferenceUrl('/MGRecruitment/LookupJob', ['NameVn'], 'Id', null), multiple: true, required: true })
    JobIds: number[];

    @DropDownDecorator({ lookup: LookupData.Reference(CityEntity, ['Name'], 'Id'), required: true })
    CityId: number;

    @DropDownDecorator({ lookup: LookupData.Reference(DistrictEntity, ['Name'], 'Id', 'CityId'), required: true })
    DistrictId: number;

    @NumberDecorator({ label: "Mức lương", placeholder: 'Tối thiểu', type: NumberType.Text, required: true, allowSearch: true, allowZero: true, min: 0, max: 9999999999999999999 })
    SalaryMin: number;

    @NumberDecorator({ label: "Mức lương", placeholder: 'Tối đa', type: NumberType.Text, required: true, allowSearch: true, allowZero: true, min: 0, max: 9999999999999999999 })
    SalaryMax: number;

    @DropDownDecorator({ label: 'Đơn vị', lookup: { items: ConstantHelper.MG_RECRUITMENT_SALARY_UNIT_TYPES }, required: true, autoSelect: true })
    SalaryUnit: number;

    @BooleanDecorator({ label: "Phúc lợi", required: true, lookup: LookupData.ReferenceUrl('/MGRecruitment/LookupWelfare', ['NameVn'], 'Id') })
    WelfareIds: any;

    @BooleanDecorator({ label: "Hình thức", required: true, lookup: LookupData.ReferenceUrl('/MGRecruitment/LookupPosition', ['NameVn'], 'Id') })
    PositionIds: any;

    @StringDecorator({ label: 'Kinh nghiệm - Tiếng Việt', placeholder: '2 năm', type: StringType.Text, required: true, max: 100 })
    ExperienceVn: string;

    @StringDecorator({ label: 'Kinh nghiệm - Tiếng Anh', placeholder: '2 years', type: StringType.Text, max: 100, required: true })
    ExperienceEn: string;

    @DropDownDecorator({ label: 'Loại kinh nghiệm', lookup: { items: ConstantHelper.MG_RECRUITMENT_EXPERIENCE_VN_TYPES }, required: true })
    ExperienceDropVn: number;

    @DropDownDecorator({ label: 'Loại kinh nghiệm', lookup: { items: ConstantHelper.MG_RECRUITMENT_EXPERIENCE_VN_TYPES }, required: true })
    ExperienceDropEn: number;

    @DropDownDecorator({ label: "Cấp bậc", required: true, lookup: LookupData.ReferenceUrl('/MGRecruitment/LookupRank', ['NameVn'], 'Id') })
    RankId: number;

    @DropDownDecorator({ label: "Bằng cấp", required: true, lookup: LookupData.ReferenceUrl('/MGRecruitment/LookupDegree', ['NameVn'], 'Id'), autoSelect: true })
    DegreeId: number;

    @BooleanDecorator({ label: "Thỏa thuận" })
    SalaryIsAgreement: boolean;

    @ImageDecorator({ label: 'Ảnh', url: 'upload/MGUpload', required: true })
    Image: string;

    @StringDecorator({ label: 'Thông tin liên hệ - Tiếng Việt', type: StringType.MultiText, max: 250 })
    ContactVn: string;

    @StringDecorator({ label: 'Thông tin liên hệ - Tiếng Anh', type: StringType.MultiText, max: 250 })
    ContactEn: string;
}
