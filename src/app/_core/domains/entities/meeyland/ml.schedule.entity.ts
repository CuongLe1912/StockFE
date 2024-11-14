import { UserEntity } from '../user.entity';
import { BaseEntity } from '../base.entity';
import { LookupData } from '../../data/lookup.data';
import { CoordinateData } from '../../data/coordinate.data';
import { ConstantHelper } from '../../../../_core/helpers/constant.helper';
import { MLArticleAccessType, MLArticleType } from './enums/ml.article.type';
import { ImageDecorator } from '../../../../_core/decorators/image.decorator';
import { TableDecorator } from '../../../../_core/decorators/table.decorator';
import { NumberDecorator } from '../../../../_core/decorators/number.decorator';
import { StringDecorator } from '../../../../_core/decorators/string.decorator';
import { BooleanDecorator } from '../../../../_core/decorators/boolean.decorator';
import { DropDownDecorator } from '../../../../_core/decorators/dropdown.decorator';
import { DateTimeDecorator } from '../../../../_core/decorators/datetime.decorator';
import { BooleanType, DateTimeType, NumberType, StringType } from '../../enums/data.type';
import { MLScheduleActionType, MLScheduleCancelType, MLScheduleRejectType, MLScheduleStatusType, MLScheduleType } from './enums/ml.schedule.type';

@TableDecorator()
export class MLScheduleEntity extends BaseEntity {

    @DropDownDecorator({ lookup: LookupData.Reference(UserEntity, ['FullName', 'Email']) })
    UserId: number;

    @StringDecorator({ type: StringType.Text, max: 50 })
    MeeyId: string;

    @StringDecorator({ label: 'Mã đặt lịch', type: StringType.Code, max: 100 })
    Code: string;

    @DateTimeDecorator({ label: 'Thời gian xem nhà', type: DateTimeType.DateTime })
    ScheduleTime: Date;

    @DateTimeDecorator({ label: 'Thời gian đặt lịch', type: DateTimeType.DateTime })
    CreatedTime: Date;

    @BooleanDecorator({
        required: true,
        label: 'Loại xem',
        type: BooleanType.RadioButton,
        lookup: LookupData.ReferenceItems(ConstantHelper.ML_SCHEDULE_TYPES)
    })
    Type: MLScheduleType;

    @DropDownDecorator({
        label: 'Loại xem',
        lookup: LookupData.ReferenceItems(ConstantHelper.ML_SCHEDULE_TYPES)
    })
    LookupType: MLScheduleType;

    @DropDownDecorator({
        required: true,
        lookup: { items: ConstantHelper.ML_SCHEDULE_STATUS_TYPES }
    })
    Status: MLScheduleStatusType;

    @DropDownDecorator({ lookup: { items: ConstantHelper.ML_SCHEDULE_STATUS_TYPES } })
    OldStatus: MLScheduleStatusType;

    @StringDecorator({ type: StringType.MultiText, max: 1000 })
    Notes: string;

    @StringDecorator({ required: true, label: 'Họ và tên', type: StringType.Account, max: 250 })
    UserSheduleName: string;

    @StringDecorator({ required: true, label: 'Email', type: StringType.Email, max: 250 })
    UserSheduleEmail: string;

    @StringDecorator({ required: true, label: 'Số điện thoại', type: StringType.PhoneText, max: 10 })
    UserShedulePhone: string;

    @StringDecorator({ type: StringType.Text, max: 50 })
    UserArticleId: string;

    @StringDecorator({ required: true, label: 'Họ và tên', type: StringType.Account, max: 250 })
    UserArticleName: string;

    @StringDecorator({ required: true, label: 'Email', type: StringType.Email, max: 250 })
    UserArticleEmail: string;

    @StringDecorator({ required: true, label: 'Số điện thoại', type: StringType.PhoneText, max: 10 })
    UserArticlePhone: string;

    @DropDownDecorator({ label: 'Loại tin đăng', lookup: LookupData.ReferenceItems(ConstantHelper.ML_ARTICLE_TYPES) })
    ArticleType: MLArticleType;

    @StringDecorator({ type: StringType.Code, max: 50 })
    ArticleCode: string;

    @StringDecorator({ type: StringType.Text, max: 1000 })
    ArticleTitle: string;

    @StringDecorator({ type: StringType.Text, max: 1000 })
    ArticleSlug: string;

    @NumberDecorator({ type: NumberType.Text, label: 'Số lần hỗ trợ', max: 100 })
    SupportCount: number;

    @BooleanDecorator({
        required: true,
        label: 'Loại xem',
        type: BooleanType.RadioButton,
        lookup: {
            items: [
                { value: MLScheduleCancelType.Busy, label: 'Bận việc' },
                { value: MLScheduleCancelType.NotNeed, label: 'Không có nhu cầu' },
                { value: MLScheduleCancelType.OtherBooking, label: 'Đã đặt lịch khác' },
                { value: MLScheduleCancelType.OtherReason, label: 'Lý do khác' },
            ]
        }
    })
    CancelType: MLScheduleCancelType;

    @BooleanDecorator({
        required: true,
        label: 'Loại xem',
        type: BooleanType.RadioButton,
        lookup: {
            items: [
                { value: MLScheduleRejectType.Busy, label: 'Bận việc' },
                { value: MLScheduleRejectType.Sold, label: 'Đã bán' },
                { value: MLScheduleRejectType.OtherReason, label: 'Lý do khác' },
            ]
        }
    })
    RejectType: MLScheduleRejectType;

    @StringDecorator({ label: 'Lý do khác', required: true, type: StringType.MultiText, max: 500 })
    CancelText: string;

    @DropDownDecorator({ label: 'Ngày xem nhà' })
    ScheduleLookupDate: number;

    @StringDecorator()
    ScheduleLookupDateText: string;

    @DropDownDecorator({ label: 'Giờ xem nhà' })
    ScheduleLookupTime: number;

    @StringDecorator()
    ScheduleLookupTimeText: string;

    Ip: string;
    ArticleItem: MLScheduleArticleEntity;
}

@TableDecorator({ title: 'Lịch sử hỗ trợ' })
export class MLScheduleHistoryEntity extends BaseEntity {

    @NumberDecorator({ label: 'Lần hỗ trợ' })
    Index: number;

    @DropDownDecorator({ required: true, label: 'Người hỗ trợ', lookup: LookupData.ReferenceUrl('/user/LookupForMeeySchedule', ['FullName', 'Email']) })
    UserId: number;

    @DropDownDecorator({ required: true, label: 'Lịch xem nhà', lookup: LookupData.Reference(MLScheduleEntity, ['Code']) })
    MLScheduleId: number;

    @DateTimeDecorator({ required: true, label: 'Thời gian', type: DateTimeType.DateTime, maxCurent: true })
    DateTime: Date;

    @StringDecorator({ required: true, type: StringType.MultiText, max: 500 })
    Content: string;
}

@TableDecorator({ title: 'Tin đăng' })
export class MLScheduleArticleEntity extends BaseEntity {

    @StringDecorator({ type: StringType.Text, max: 50 })
    MeeyId: string;

    @DropDownDecorator({ label: 'Loại tin đăng', lookup: LookupData.ReferenceItems(ConstantHelper.ML_ARTICLE_TYPES) })
    Type: MLArticleType;

    @DropDownDecorator({ label: 'Trạng thái', lookup: LookupData.ReferenceItems(ConstantHelper.ML_ARTICLE_ACCESS_TYPES) })
    AccessType: MLArticleAccessType;

    @StringDecorator({ label: 'Mã tin', type: StringType.Code, max: 50 })
    Code: string;

    @StringDecorator({ label: 'Tiêu đề', type: StringType.Text, max: 1000 })
    Title: string;

    @StringDecorator({ label: 'Slug', type: StringType.Text, max: 1000 })
    Slug: string;

    @StringDecorator({ label: 'Slug', type: StringType.Text, max: 1000 })
    Path: string;

    @ImageDecorator()
    Image: string;

    @DateTimeDecorator({ label: 'Ngày đăng', type: DateTimeType.DateTime })
    StartDate: Date;

    @DateTimeDecorator({ label: 'Ngày đăng', type: DateTimeType.DateTime })
    PublishedDate: Date;

    @DateTimeDecorator({ label: 'Ngày hết hạn', type: DateTimeType.DateTime })
    EndDate: Date;

    @StringDecorator({ label: 'Địa chỉ', type: StringType.Text, max: 1000 })
    Location: string;

    @StringDecorator({ label: 'Địa chỉ', type: StringType.Text, max: 1000 })
    Address: string;

    @StringDecorator({ label: 'Chuyên mục', type: StringType.Text, max: 1000 })
    CategoryName: string;

    Coordinates: CoordinateData;
}

@TableDecorator({ title: 'Lịch sử thao tác lịch xem nhà' })
export class MLScheduleLogEntity extends BaseEntity {

    @StringDecorator({ label: 'Địa chỉ IP' })
    Ip: string;

    @StringDecorator({ label: 'Người thực hiện' })
    User: number;

    @StringDecorator({ required: true, type: StringType.MultiText, max: 500 })
    Content: string;

    @DropDownDecorator({ required: true, label: 'Lịch xem nhà', lookup: LookupData.Reference(MLScheduleEntity, ['Code']) })
    MLScheduleId: number;

    @DateTimeDecorator({ required: true, label: 'Thời gian', type: DateTimeType.DateTime, min: new Date() })
    DateTime: Date;

    @DropDownDecorator({
        required: true,
        lookup: {
            items: [
                { value: MLScheduleActionType.AddNew, label: 'Tạo mới' },
                { value: MLScheduleActionType.Edit, label: 'Sửa lịch' },
                { value: MLScheduleActionType.EditStatus, label: 'Cập nhật trạng thái' },
                { value: MLScheduleActionType.Cancel, label: 'Hủy lịch' },
            ]
        }
    })
    Action: MLScheduleStatusType;
}