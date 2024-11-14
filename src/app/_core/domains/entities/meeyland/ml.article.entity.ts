import { BaseEntity } from "../base.entity";
import { OptionItem } from "../../data/option.item";
import { LookupData } from "../../data/lookup.data";
import { CoordinateData } from "../../data/coordinate.data";
import { DepartmentType } from "../../enums/department.type";
import { MLScheduleDateType } from "./enums/ml.schedule.type";
import { ConstantHelper } from "../../../../_core/helpers/constant.helper";
import { VideoDecorator } from "../../../../_core/decorators/video.decorator";
import { ImageDecorator } from "../../../../_core/decorators/image.decorator";
import { TableDecorator } from "../../../../_core/decorators/table.decorator";
import { StringDecorator } from "../../../../_core/decorators/string.decorator";
import { NumberDecorator } from "../../../../_core/decorators/number.decorator";
import { BooleanDecorator } from "../../../../_core/decorators/boolean.decorator";
import { DateTimeDecorator } from "../../../../_core/decorators/datetime.decorator";
import { DropDownDecorator } from "../../../../_core/decorators/dropdown.decorator";
import { BooleanType, DateTimeType, DropdownLoadType, DropdownType, NumberType, StringType } from "../../enums/data.type";
import {
    MLArticleType,
    MLArticleNeedType,
    MLArticleViewType,
    MLArtilceSyncType,
    MLArticlePostType,
    MLArticleStatusType,
    MLArticleAccessType,
    MLArticleReasonType,
    MLArtilceMediateType,
    MLArticlePackageType,
    MLArticleReferenceType,
    MLArticleRejectOptionType,
    MLArticleReasonReportType,
    MLArticleApproveContentType,
    MLArticleReportStatusType,
} from "./enums/ml.article.type";

@TableDecorator({ title: 'Tin đăng' })
export class MLArticleEntity extends BaseEntity {

    @StringDecorator({ type: StringType.Text, max: 50 })
    MeeyId: string;

    @StringDecorator({ type: StringType.Text, label: 'MeeyId', required: true, max: 50 })
    UserMeeyId: string;

    @StringDecorator({ type: StringType.Text, label: 'Đơn hàng', required: true, max: 50 })
    OrderId: string;

    @DropDownDecorator({ label: 'Tình trạng', lookup: LookupData.ReferenceItems(ConstantHelper.ML_ARTICLE_VIEW_TYPES) })
    ViewType: MLArticleViewType;

    @DropDownDecorator({ label: 'Trạng thái', lookup: LookupData.ReferenceItems(ConstantHelper.ML_ARTICLE_STATUS_TYPES) })
    StatusType: MLArticleStatusType;

    @DropDownDecorator({ label: 'Loại tin đăng', lookup: LookupData.ReferenceItems(ConstantHelper.ML_ARTICLE_TYPES) })
    Type: MLArticleType;

    @DropDownDecorator({ label: 'Trạng thái', lookup: LookupData.ReferenceItems(ConstantHelper.ML_ARTICLE_ACCESS_TYPES) })
    AccessType: MLArticleAccessType;

    @StringDecorator({ label: 'Mã tin', type: StringType.Text, max: 50 })
    Code: string;

    @StringDecorator({ label: 'Tiêu đề', required: true, type: StringType.Text, max: 500, min: 6 })
    Title: string;

    @StringDecorator({ label: 'Slug', type: StringType.Text, max: 1000 })
    Slug: string;

    @StringDecorator({ label: 'Slug', type: StringType.Text, max: 1000 })
    Path: string;

    @ImageDecorator()
    Image: string;

    @DateTimeDecorator({ label: 'Ngày đăng', type: DateTimeType.DateTime })
    StartDate: Date;

    @DateTimeDecorator({ label: 'Ngày hết hạn', type: DateTimeType.DateTime })
    EndDate: Date;

    @StringDecorator({ label: 'Địa chỉ', type: StringType.Text, max: 1000 })
    Location: string;

    @StringDecorator({ label: 'Chuyên mục', type: StringType.Text, max: 1000 })
    CategoryName: string;

    Coordinates: CoordinateData;

    @StringDecorator({ label: 'Sale', type: StringType.Text, max: 150 })
    SaleV2: string;

    @StringDecorator({ label: 'CSKH', type: StringType.Text, max: 150 })
    SupportV2: string;

    @StringDecorator({ label: 'Sale', type: StringType.Text, max: 150 })
    Sale: string;

    @StringDecorator({ label: 'CSKH', type: StringType.Text, max: 150 })
    Support: string;

    @StringDecorator({ label: 'Người duyệt', type: StringType.Text, max: 150 })
    ApproveV2: string;

    @StringDecorator({ label: 'Loại tin', type: StringType.Text, max: 150 })
    TypeArticle: string;

    @StringDecorator({ label: 'Loại tin', type: StringType.Text, max: 150 })
    GroupArticle: string;

    @DropDownDecorator({ label: 'Sale', required: true, lookup: LookupData.ReferenceUrl('/user/LookupSaleForMeeyArticle', ['FullName', 'Email']) })
    SaleId: number;

    @DropDownDecorator({ label: 'CSKH', required: true, lookup: LookupData.ReferenceUrl('/user/LookupSupportForMeeyArticle', ['FullName', 'Email']) })
    SupportId: number;

    @DropDownDecorator({ label: 'Sale', required: true, lookup: LookupData.ReferenceUrl('/user/LookupSaleForMeeyId', ['FullName']) })
    SaleNameId: number;

    @DropDownDecorator({ label: 'CSKH', required: true, lookup: LookupData.ReferenceUrl('/user/LookupSupportForMeeyId', ['FullName']) })
    SupportNameId: number;

    @DropDownDecorator({ label: 'Sale', required: true, multiple: true, lookup: LookupData.ReferenceUrl('/user/LookupSaleForMeeyArticle', ['FullName', 'Email']) })
    SaleIds: number[];

    @DropDownDecorator({ label: 'CSKH', required: true, multiple: true, lookup: LookupData.ReferenceUrl('/user/LookupSupportForMeeyArticle', ['FullName', 'Email'], null, null, null, { label: 'Chưa gán', value: 999999999 }) })
    SupportIds: number[];

    @NumberDecorator()
    Index: number;

    @StringDecorator({ label: 'Số điện thoại', required: true, type: StringType.PhoneText, min: 10, max: 10 })
    CustomerPhone: string;

    @StringDecorator({ label: 'Họ tên', required: true, type: StringType.Account, max: 50 })
    CustomerName: string;

    @StringDecorator({ label: 'Email', type: StringType.Email, max: 150 })
    CustomerEmail: string;

    @DropDownDecorator({ label: 'Đối tượng', placeholder: 'Chọn đối tượng', required: true, lookup: LookupData.ReferenceUrlWithCache('/MLArticleConfig/LookupReferenceV4/' + MLArticleReferenceType.UserTypes) })
    ObjectType: number;

    @StringDecorator({ label: 'Số điện thoại', required: true, type: StringType.PhoneText, min: 10, max: 10 })
    ContactPhone: string;

    @StringDecorator({ label: 'Họ tên', required: true, type: StringType.Account, max: 50 })
    ContactName: string;

    @StringDecorator({ label: 'Email', type: StringType.Email, max: 150 })
    ContactEmail: string;

    @DropDownDecorator({ label: 'Tỉnh/Thành phố', required: true, allowSearch: true, lookup: LookupData.ReferenceUrlWithCache('/MLArticleConfig/LookupCity') })
    CityMeeyId: string;

    @StringDecorator({ label: 'Tỉnh/Thành phố' })
    CityName: string;

    @DropDownDecorator({ label: 'Quận/Huyện', required: true, allowSearch: true, lookup: LookupData.ReferenceUrl('/MLArticleConfig/LookupDistrict', null, null, 'CityMeeyId') })
    DistrictMeeyId: string;

    @DropDownDecorator({ label: 'Quận/Huyện', required: true, max: 3, allowSearch: true, multiple: true, lookup: LookupData.ReferenceUrl('/MLArticleConfig/LookupDistrict', null, null, 'CityMeeyId') })
    DistrictMeeyIds: string[];

    @StringDecorator({ label: 'Quận/Huyện' })
    DistrictName: string;

    @DropDownDecorator({ label: 'Phường/xã', allowSearch: true, lookup: LookupData.ReferenceUrl('/MLArticleConfig/LookupWard', null, null, 'DistrictMeeyId') })
    WardMeeyId: string;

    @DropDownDecorator({ label: 'Phường/xã', allowSearch: true, max: 5, multiple: true, lookup: LookupData.ReferenceUrl('/MLArticleConfig/LookupWard', null, null, 'DistrictMeeyIds', 'Group') })
    WardMeeyIds: string[];

    @StringDecorator({ label: 'Phường/xã' })
    WardName: string;

    @DropDownDecorator({ label: 'Đường phố', allowSearch: true, max: 5, lookup: LookupData.ReferenceUrl('/MLArticleConfig/LookupStreet', null, null, 'DistrictMeeyId') })
    StreetMeeyId: string;

    @DropDownDecorator({ label: 'Đường phố', allowSearch: true, multiple: true, lookup: LookupData.ReferenceUrl('/MLArticleConfig/LookupStreet', null, null, 'DistrictMeeyIds', 'Group') })
    StreetMeeyIds: string[];

    @StringDecorator({ label: 'Đường phố' })
    StreetName: string;

    @DropDownDecorator({ label: 'Dự án', lookup: { url: '/MLArticleConfig/LookupProjectByCity', loadType: DropdownLoadType.Ajax, dependId: 'CityMeeyId' } })
    ProjectMeeyId: string;

    @DropDownDecorator({ label: 'Dự án', multiple: true, max: 3, lookup: { url: '/MLArticleConfig/LookupProjectByCity', loadType: DropdownLoadType.Ajax, dependId: 'CityMeeyId' } })
    ProjectMeeyIds: string[];

    @StringDecorator({ label: 'Dự án' })
    ProjectName: string;

    @StringDecorator({ label: 'Địa chỉ cụ thể', type: StringType.MultiText, max: 500, rows: 6 })
    Address: string;

    @DropDownDecorator({ label: 'Trạng thái đồng bộ', placeholder: 'Chọn đối tượng', required: true, lookup: { items: ConstantHelper.ML_ARTILCE_SYNC_TYPES } })
    StatusSync: MLArtilceSyncType;

    @DropDownDecorator({ label: 'Nguồn', multiple: true, lookup: LookupData.ReferenceUrlWithCache('/MLArticleConfig/LookupReferenceV4/' + MLArticleReferenceType.Source) })
    Source: string;

    @DropDownDecorator({ label: 'Duyệt nội dung', lookup: LookupData.ReferenceUrlWithCache('/MLArticleConfig/LookupReference/' + MLArticleReferenceType.ApprovalContent) })
    ApprovalContent: string;

    @DropDownDecorator({ label: 'Trạng thái tin', lookup: LookupData.ReferenceUrlWithCache('/MLArticleConfig/LookupReferenceV4/' + MLArticleReferenceType.Access) })
    Access: string;

    @DropDownDecorator({ label: 'Nhu cầu', required: true, lookup: LookupData.ReferenceUrlWithCache('/MLArticleConfig/LookupReferenceV4/' + MLArticleReferenceType.Need), autoSelect: true })
    NeedMeeyId: string;

    @DropDownDecorator({ label: 'Tiện ích', multiple: true, lookup: LookupData.ReferenceUrlWithCache('/MLArticleConfig/LookupReferenceV4/' + MLArticleReferenceType.Utilities) })
    Utilities: string[];

    @StringDecorator({ label: 'Nhu cầu' })
    NeedName: string;

    @DropDownDecorator({ label: 'Loại nhà đất', required: true, multiple: true, max: 3, allowSearch: true, lookup: LookupData.ReferenceUrl('/MLArticleConfig/LookupReferenceV4/' + MLArticleReferenceType.TypeOfHouses, null, null, 'NeedMeeyId', 'Group') })
    TypeHouse: string[];

    @StringDecorator({ label: 'Loại nhà đất', allowSearch: true })
    TypeHouseName: string;

    @DropDownDecorator({ label: 'Loại hình BĐS', lookup: LookupData.ReferenceUrl('/MLArticleConfig/LookupReferenceV4/' + MLArticleReferenceType.TypeOfRealEstate, null, null, 'NeedMeeyId', 'Group') })
    TypeRealEstate: string;

    @DropDownDecorator({ label: 'Hướng nhà/đất', multiple: true, max: 4, allowSearch: true, lookup: LookupData.ReferenceUrl('/MLArticleConfig/LookupReferenceV4/' + MLArticleReferenceType.Directions, null, null, null, 'Group', null, 3600) })
    Direction: string[];

    @DropDownDecorator({ label: 'Hướng lô gia/ban công', multiple: true, max: 4, allowSearch: true, lookup: LookupData.ReferenceUrl('/MLArticleConfig/LookupReferenceV4/' + MLArticleReferenceType.BalconyDirection, null, null, null, 'Group', null, 3600) })
    BalconyDirection: string[];

    @DropDownDecorator({ label: 'Đường rộng', lookup: LookupData.ReferenceUrlWithCache('/MLArticleConfig/LookupReferenceV4/' + MLArticleReferenceType.WideRoads) })
    WideRoad: string;

    @DropDownDecorator({ label: 'Giấy tờ pháp lý', multiple: true, max: 3, lookup: LookupData.ReferenceUrlWithCache('/MLArticleConfig/LookupReferenceV4/' + MLArticleReferenceType.LegalPaper) })
    LegalPaper: string[];

    @DropDownDecorator({ label: 'Ưu điểm BĐS', multiple: true, max: 5, lookup: LookupData.ReferenceUrl('/MLArticleConfig/LookupReferenceV4/' + MLArticleReferenceType.Advantages, null, null, null, 'Group', null, 3600) })
    Feature: string[];

    @DropDownDecorator({ label: 'Mức độ giao dịch', lookup: LookupData.ReferenceUrlWithCache('/MLArticleConfig/LookupReferenceV4/' + MLArticleReferenceType.LevelTransaction) })
    LevelTransaction: string;

    @NumberDecorator({ label: 'Tổng diện tích', required: true, decimals: 2, step: 0.01, type: NumberType.Text, max: 9999999999 })
    Area: number;

    @DropDownDecorator({ label: 'Tổng diện tích', required: true, type: DropdownType.BetweenArea, lookup: { url: '/MLArticleConfig/LookupReferenceV4/' + MLArticleReferenceType.Area, numberMax: 9999999999, unit: 'm2', decimals: 2 } })
    AreaFromTo: string;

    @DropDownDecorator({ label: 'Đơn vị', required: true, lookup: LookupData.ReferenceUrlWithCache('/MLArticleConfig/LookupReferenceV4/' + MLArticleReferenceType.UnitArea), autoSelect: true })
    UnitArea: string;

    @NumberDecorator({ label: 'Diện tích sử dụng', decimals: 2, step: 0.01, type: NumberType.Text, max: 9999999999 })
    UseArea: number;

    @DropDownDecorator({ label: 'Đơn vị', lookup: LookupData.ReferenceUrlWithCache('/MLArticleConfig/LookupReferenceV4/' + MLArticleReferenceType.UnitArea), autoSelect: true })
    UnitUseArea: string;

    @NumberDecorator({ label: 'Mặt tiền', decimals: 2, step: 0.01, type: NumberType.Text, max: 99999 })
    Facade: number;

    @NumberDecorator({ label: 'Mặt tiền (m)', decimals: 2, step: 0.01, type: NumberType.Between, max: 99999 })
    FacadeFromTo: number[];

    @DropDownDecorator({ label: 'Đơn vị', lookup: LookupData.ReferenceUrlWithCache('/MLArticleConfig/LookupReferenceV4/' + MLArticleReferenceType.UnitLength), autoSelect: true })
    UnitFacade: string;

    @NumberDecorator({ label: 'Chiều sâu', decimals: 2, step: 0.01, type: NumberType.Text, max: 99999 })
    Depth: number;

    @NumberDecorator({ label: 'Chiều sâu (m)', decimals: 2, step: 0.01, type: NumberType.Between, max: 99999 })
    DepthFromTo: number[];

    @DropDownDecorator({ label: 'Đơn vị', lookup: LookupData.ReferenceUrlWithCache('/MLArticleConfig/LookupReferenceV4/' + MLArticleReferenceType.UnitLength), autoSelect: true })
    UnitDepth: string;

    @NumberDecorator({ label: 'Tổng số tầng', step: 1, decimals: 1, type: NumberType.Numberic, max: 200 })
    Floor: number;

    @DropDownDecorator({ label: 'Số tầng', type: DropdownType.Between, lookup: { url: '/MLArticleConfig/LookupReferenceV4/' + MLArticleReferenceType.Floor, numberMax: 200, unit: 'tầng' } })
    FloorFromTo: string;

    @NumberDecorator({ label: 'Tầng thứ', step: 1, type: NumberType.Numberic, max: 200 })
    NumberFloor: number;

    @NumberDecorator({ label: 'Số phòng tắm/toilet', type: NumberType.Numberic, max: 200 })
    Bathroom: number;

    @DropDownDecorator({ label: 'Số phòng tắm/toilet', type: DropdownType.Between, lookup: { url: '/MLArticleConfig/LookupReferenceV4/' + MLArticleReferenceType.Bathroom, numberMax: 200, unit: 'phòng', cached: 3600 * 1000 } })
    BathroomFromTo: string;

    @NumberDecorator({ label: 'Số phòng ngủ', type: NumberType.Numberic, max: 200 })
    Bedroom: number;

    @DropDownDecorator({ label: 'Số phòng ngủ', type: DropdownType.Between, lookup: { url: '/MLArticleConfig/LookupReferenceV4/' + MLArticleReferenceType.Bedroom, numberMax: 200, unit: 'phòng', cached: 3600 * 1000 } })
    BedroomFromTo: string;

    @NumberDecorator({ label: 'Số lô gia/ban công', type: NumberType.Numberic, max: 200 })
    Balcony: number;

    @DropDownDecorator({ label: 'Số lô gia/ban công', type: DropdownType.Between, lookup: { url: '/MLArticleConfig/LookupReferenceV4/' + MLArticleReferenceType.Balcony, numberMax: 200, unit: 'ban công', cached: 3600 * 1000 } })
    BalconyFromTo: string;

    @NumberDecorator({ label: 'Giá bán', decimals: 2, step: 0.01, type: NumberType.Text, max: 9999999 })
    Price: number;

    @NumberDecorator({ label: 'Tổng giá', decimals: 2, step: 0.01, type: NumberType.Text, max: 9999999 })
    TotalPrice: number;

    @DropDownDecorator({ label: 'Giá', required: true, type: DropdownType.BetweenPrice, lookup: { url: '/MLArticleConfig/LookupReferenceV4/' + MLArticleReferenceType.TotalPrice, numberMax: 999999999999999, unit: 'đ', decimals: 2, dependId: 'NeedMeeyId' } })
    PriceFromTo: string;

    @DropDownDecorator({ required: true, label: 'Đơn vị', lookup: LookupData.ReferenceUrl('/MLArticleConfig/LookupReferenceV4/' + MLArticleReferenceType.Units, null, null, 'NeedMeeyId'), autoSelect: true })
    UnitPrice: string;

    @NumberDecorator({ label: 'Giá thuê', decimals: 2, step: 0.01, type: NumberType.Text, max: 9999999 })
    RentPrice: number;

    @DropDownDecorator({ required: true, label: 'Đơn vị', lookup: LookupData.ReferenceUrlWithCache('/MLArticleConfig/LookupReferenceV4/' + MLArticleReferenceType.UnitRentPrice), autoSelect: true })
    UnitRentPrice: string;

    @BooleanDecorator({ label: 'Có thể thương lượng' })
    NegotiateFlg: boolean;

    @BooleanDecorator({ label: 'Hiển thị đơn giá trên tin đăng' })
    ShowPriceFlg: boolean;

    @BooleanDecorator({ label: 'Dành cho môi giới', type: BooleanType.RadioButton, lookup: LookupData.ReferenceItems(ConstantHelper.ML_ARTILCE_MEDIATE_TYPES) })
    MediateType: MLArtilceMediateType;

    @DropDownDecorator({ label: 'Hoa hồng', lookup: LookupData.ReferenceUrlWithCache('/MLArticleConfig/LookupReferenceV4/' + MLArticleReferenceType.PerCommission) })
    PerCommission: string;

    @NumberDecorator({ label: 'Tiền hoa hồng', decimals: 2, step: 0.01, type: NumberType.Text, max: 999999999999 })
    Commission: number;

    @StringDecorator({ label: 'Miêu tả', required: true, type: StringType.Html, max: 8000, min: 100 })
    Content: string;

    @ImageDecorator({ label: 'Ảnh', required: true, multiple: true, url: 'upload/MLArticleUploadV4', max: 30, min: 1, choice: true, note: true, dimension: { width: 300, height: 300 } })
    Images: any[];

    @VideoDecorator({ label: 'Video', multiple: true, url: 'upload/MLArticleUploadV4', max: 3 })
    Videos: string[];

    VideoYoutubes: MLArticleVideo[];

    @BooleanDecorator({ label: 'Gói đăng tin', type: BooleanType.RadioButton, lookup: LookupData.ReferenceUrlWithCache('/MLArticleConfig/LookupReference/' + MLArticleReferenceType.VipType) })
    VipType: string;

    @StringDecorator({ label: 'Gói đăng tin' })
    VipTypeName: string;

    @DropDownDecorator({ label: 'Gói đăng tin', multiple: true, lookup: LookupData.ReferenceUrlWithCache('/MLArticleConfig/LookupReference/' + MLArticleReferenceType.VipType) })
    FilterVipType: string;

    @DateTimeDecorator({ required: true, label: 'Ngày tạo', type: DateTimeType.DateTime })
    CreatedTime: Date;

    @DateTimeDecorator({ required: true, label: 'Ngày tạo', type: DateTimeType.DateTime })
    CreatedDate: Date;

    @DateTimeDecorator({ required: true, label: 'Ngày ưu tiên (SEO)', type: DateTimeType.DateTime })
    PriorityDate: Date;

    @DateTimeDecorator({ required: true, label: 'Ngày đăng tin', type: DateTimeType.DateTime, minCurent: true })
    PublishTime: Date;

    @DateTimeDecorator({ label: 'Ngày đăng tin', type: DateTimeType.DateTime })
    PublishedDate: Date;

    @DateTimeDecorator({ required: true, label: 'Ngày bắt đầu', type: DateTimeType.Date, min: new Date() })
    PushTime: Date;

    @NumberDecorator({ required: true, label: 'Số ngày đăng', type: NumberType.Text, min: 1, max: 180, allowClear: false })
    PublishDayNumber: number;

    @DropDownDecorator({ required: true, label: 'Số ngày đăng', lookup: LookupData.ReferenceNumbers([7, 15, 30, 90]), autoSelect: true, allowClear: false })
    PublishDayChoice: number;

    @DateTimeDecorator({ required: true, label: 'Ngày hết hạn', type: DateTimeType.DateTime, readonly: true })
    ExpireTime: Date;

    @DateTimeDecorator({ label: 'Ngày hết hạn', type: DateTimeType.DateTime, readonly: true })
    ExpriedDate: Date;

    @BooleanDecorator({ label: 'Đẩy tin tự động' })
    AutoPost: boolean;

    @BooleanDecorator({ label: 'Kiểu đẩy tin', type: BooleanType.RadioButton, lookup: LookupData.ReferenceItems(ConstantHelper.ML_ARTILCE_SCHEDULE_TYPES) })
    PostType: MLArticlePostType;

    @NumberDecorator({ label: 'Số ngày đẩy tin', type: NumberType.Numberic, allowClear: false })
    PostNumber: number;

    @NumberDecorator({ label: 'Số ngày đẩy tin', type: NumberType.Numberic, allowClear: false })
    MaxPostNumber: number;

    @DateTimeDecorator({ type: DateTimeType.Date, inline: true, multiple: 100, min: new Date() })
    PostDays: Date[];

    @BooleanDecorator({ label: 'Thiết lập cho từng ngày' })
    PostByEachDay: boolean;

    PushTimes: MLArticlePushTime[];

    @BooleanDecorator({ label: 'Đặt lịch xem nhà' })
    AllowSchedule: boolean;

    @BooleanDecorator({ label: 'Loại xem', type: BooleanType.Checkbox, lookup: LookupData.ReferenceItems(ConstantHelper.ML_SCHEDULE_TYPES) })
    ReviewTypes: string;

    ReviewTypeStrings: string;

    @DateTimeDecorator({ type: DateTimeType.Date, inline: true, multiple: 100 })
    ScheduleDays: Date[];
    ScheduleTimes: string[];

    @BooleanDecorator({ label: 'Trong giờ hành chính' })
    WorkingTime: boolean;

    @BooleanDecorator({ label: 'Ngoài giờ hành chính' })
    HouseTime: boolean;

    @NumberDecorator({ label: 'Số lượt cảnh báo giá', type: NumberType.Text, allowZero: true })
    CountWaringPrice: number;

    @StringDecorator({ label: 'Nhóm tin' })
    GroupArticleName: string;

    @StringDecorator({ label: 'Trạng thái xác minh' })
    VerificationName: string;

    @StringDecorator({ label: 'Trạng thái tin' })
    Status: string;

    @StringDecorator({ label: 'Trạng thái duyệt' })
    Approved: boolean;

    @StringDecorator({ label: 'Trạng thái xác minh' })
    IsReal: boolean;

    @DropDownDecorator({ lookup: LookupData.ReferenceItems(ConstantHelper.ML_ARTICLE_APPROVE_CONTENT_TYPES) })
    ApproveContentType: MLArticleApproveContentType;

    @StringDecorator({ label: 'Tin bị hạ bởi admin' })
    IsDownByAdmin: boolean;

    @BooleanDecorator()
    SyncElastic: boolean;

    @NumberDecorator()
    TotalAmount: number;

    @StringDecorator()
    BundlePostId: string;

    @StringDecorator()
    BundlePushId: string;

    @DateTimeDecorator({ label: 'Ngày hẹn', type: DateTimeType.DateTime })
    AppointmentDate: Date;

    OrderInfos: MLArticleOrderInfoEntity[];
    ProjectOptionItem: OptionItem | OptionItem[];

    @NumberDecorator()
    BundlePostAmount: number;

    @NumberDecorator()
    BundlePushAmount: number;

    @NumberDecorator()
    ChargeAmount: number;

    @DropDownDecorator({ label: 'Nhu cầu', lookup: LookupData.ReferenceEnum(MLArticleNeedType) })
    NeedType: number;

    @DropDownDecorator({ label: 'Nội thất', multiple: true, selectAll: true, lookup: LookupData.ReferenceUrlWithCache('/MLArticleConfig/LookupReferenceV4/' + MLArticleReferenceType.Furniture) })
    Furniture: string;

    @DropDownDecorator({ label: 'Thiết bị', multiple: true, selectAll: true, lookup: LookupData.ReferenceUrlWithCache('/MLArticleConfig/LookupReferenceV4/' + MLArticleReferenceType.Equipment) })
    Equipment: string;

    @NumberDecorator({ label: 'Giá nước', type: NumberType.Text, max: 9999999 })
    WaterRate: number;

    @BooleanDecorator({ label: 'Giá nhà dân' })
    WaterRateNormal: boolean;

    @DropDownDecorator({ label: 'Đơn vị', lookup: LookupData.ReferenceUrlWithCache('/MLArticleConfig/LookupReferenceV4/' + MLArticleReferenceType.WaterUnit), autoSelect: true })
    WaterUnit: string;

    @NumberDecorator({ label: 'Giá điện', type: NumberType.Text, max: 99999 })
    EnergyRate: number;

    @BooleanDecorator({ label: 'Giá nhà dân' })
    EnergyRateNormal: boolean;

    @DropDownDecorator({ label: 'Đơn vị', lookup: LookupData.ReferenceUrlWithCache('/MLArticleConfig/LookupReferenceV4/' + MLArticleReferenceType.EnergyUnit), autoSelect: true })
    EnergyUnit: string;

    @DropDownDecorator({ label: 'Thời gian thuê tối thiểu', lookup: LookupData.ReferenceUrlWithCache('/MLArticleConfig/LookupReferenceV4/' + MLArticleReferenceType.MinimumRentalPeriod) })
    MinimumRentalPeriod: string;

    @DropDownDecorator({ label: 'Kỳ thanh toán', lookup: LookupData.ReferenceUrlWithCache('/MLArticleConfig/LookupReferenceV4/' + MLArticleReferenceType.PaymentPeriod) })
    PaymentPriod: string;

    @DropDownDecorator({ label: 'Đặt cọc', lookup: LookupData.ReferenceUrlWithCache('/MLArticleConfig/LookupReferenceV4/' + MLArticleReferenceType.Deposit) })
    DepositPriod: string;

    @StringDecorator({ type: StringType.MultiText, max: 500 })
    Reason?: string;

    Projects: any[];

    @DropDownDecorator({ label: 'Thiết lập ngày', multiple: true, lookup: LookupData.ReferenceUrlWithCache('/MLArticleConfig/LookupReferenceV4/' + MLArticleReferenceType.BusinessDates) })
    BusinessDates: string[];

    @DropDownDecorator({ label: 'Thiết lập giờ', lookup: LookupData.ReferenceUrlWithCache('/MLArticleConfig/LookupReferenceV4/' + MLArticleReferenceType.BusinessTimes) })
    BusinessTimes: string;

    @BooleanDecorator({ label: 'Ngày xem', type: BooleanType.RadioButton, lookup: LookupData.ReferenceItems(ConstantHelper.ML_SCHEDULE_DATE_TYPES) })
    ScheduleDateType: MLScheduleDateType;

    @BooleanDecorator({ label: 'Tin crawl' })
    Crawl: boolean;

    @DropDownDecorator({ label: 'Nguồn Crawl', lookup: LookupData.ReferenceItems(ConstantHelper.ML_ARTICLE_SOURCE_CRAWL)})
    Tenants: string;

    @StringDecorator({ label: 'Đường dẫn', required: true, max: 500, type: StringType.Link })
    Link: string;

    @NumberDecorator({ label: 'Độ trùng tin', type: NumberType.Text, max: 100, min: 0 })
    FilterSimilarity: number;

    @DropDownDecorator({ label: 'Hiển thị', multiple: true, lookup: LookupData.ReferenceUrl('/MLArticleConfig/LookupReferenceV4/' + MLArticleReferenceType.TenantArticle) })
    TenantArticle: string;

    @StringDecorator({ label: 'Link page/group', required: false , max: 500, type: StringType.Link })
    FacebookGroupUrl : string

    Report: MLArticleReportEntity;
}

@TableDecorator({ title: 'Từ chối tin' })
export class MLArticleRejectEntity {
    @NumberDecorator()
    Id: number;

    @StringDecorator()
    Code: string;

    @DropDownDecorator({ label: 'Trạng thái', lookup: LookupData.ReferenceItems(ConstantHelper.ML_ARTICLE_ACCESS_TYPES) })
    AccessType: MLArticleAccessType;

    @DropDownDecorator({ label: 'Trạng thái', lookup: LookupData.ReferenceItems(ConstantHelper.ML_ARTICLE_STATUS_TYPES) })
    StatusType: MLArticleStatusType;

    @DropDownDecorator({ required: true, lookup: { items: ConstantHelper.ML_ARTICLE_REASON_TYPES } })
    Type: MLArticleReasonType;

    @StringDecorator({ required: true, type: StringType.MultiText, max: 500 })
    Reason?: string;

    @ImageDecorator({ max: 6, url: 'upload/MLArticleUpload', multiple: true })
    Images: string[];

    @BooleanDecorator({ required: true, type: BooleanType.RadioButton, lookup: { items: ConstantHelper.ML_ARTICLE_REJECT_OPTION_TYPES } })
    OptionType: MLArticleRejectOptionType;

    @BooleanDecorator({ description: 'Gửi email/sms cho khách hàng', type: BooleanType.Checkbox })
    SendEmail: boolean;
}

@TableDecorator({ title: 'Hạ tin' })
export class MLArticleCancelEntity {
    @NumberDecorator()
    Id: number;

    @StringDecorator({ required: true, type: StringType.MultiText, max: 500 })
    Reason?: string;

    @BooleanDecorator({ required: true, type: BooleanType.RadioButton, lookup: { items: ConstantHelper.ML_ARTICLE_REASON_REPORT_TYPES } })
    OptionType: MLArticleReasonReportType;

    @BooleanDecorator({ description: 'Gửi thông báo cho khách hàng', type: BooleanType.Checkbox })
    SendEmail: boolean;
}

@TableDecorator({ title: 'Đánh dấu báo cáo tin đăng' })
export class MLMarkReportEntity {
    @NumberDecorator()
    ReportId: number;

    @StringDecorator({ required: true, type: StringType.MultiText, max: 500 })
    Reason?: string;
}

@TableDecorator({ title: 'Điều chuyển tin' })
export class MLArticleTransferDto {
    @DropDownDecorator({ required: true, lookup: LookupData.ReferenceUrl('/department/lookupItems/' + <number>DepartmentType.Support) })
    DepartmentId: number;

    @DropDownDecorator({ label: 'Chuyển tới', required: true, lookup: LookupData.ReferenceUrl('/user/AllUsersByDepartmentId', ['FullName', 'Email'], 'Id', 'DepartmentId') })
    SupportId: number;

    @StringDecorator({ label: 'Người điều phối' })
    Coordinator: string;

    @StringDecorator({ label: 'Ghi chú', type: StringType.MultiText, max: 500 })
    Notes: string;
}

@TableDecorator({ title: 'Thanh toán tin' })
export class MLArticlePaymentEntity {
    @NumberDecorator()
    Id: number;

    @StringDecorator()
    Code: string;

    @StringDecorator({ required: true, label: 'OTP', type: StringType.Otp, min: 6, max: 6 })
    Otp: string;

    @StringDecorator()
    MeeyId: string;

    Amount: number;
    OrderId: string;
    BuyerName: string;
    BuyerPhone: string;
    BuyerEmail: string;
}

@TableDecorator({ title: 'Thông tin dịch vụ' })
export class MLArticleOrderInfoEntity extends BaseEntity {
    @NumberDecorator()
    Index: number;

    @StringDecorator()
    Code: string;

    @StringDecorator()
    Status: string;
}

export class MLArticlePushTime {
    Day: string;
    Times: string[];
}

export class MLArticlePackageConfig {
    Id?: string;
    Days: number;
    Price: number;
    Name?: string;
    Percent?: number;
    TotalPrice?: number;
    BundlePostId?: string;
    TotalPriceFinal?: number;
    Type: MLArticlePackageType;
}

@TableDecorator({ title: 'Đường dẫn youtube' })
export class MLArticleVideo {
    @StringDecorator({ label: 'Đường dẫn Youtube', type: StringType.LinkYoutube, max: 250 })
    Url: string;

    @StringDecorator({ label: 'Miêu tả video', type: StringType.Text, max: 150 })
    Note: string;
}

@TableDecorator({ title: 'Báo cáo tin đăng' })
export class MLArticleReportEntity {

    @StringDecorator({ label: 'Mã tin', type: StringType.Text, max: 50 })
    Code: string;

    @StringDecorator({ label: 'Tiêu đề', required: true, type: StringType.Text, max: 500, min: 6 })
    Title: string;

    @DateTimeDecorator({ label: 'Ngày báo cáo', type: DateTimeType.Date })
    ReportDate: Date;

    @DropDownDecorator({ label: 'CSKH', required: true, multiple: true, lookup: LookupData.ReferenceUrl('/user/LookupSupportForMeeyArticle', ['FullName', 'Email']) })
    SupportIds: number[];

    @StringDecorator({ label: 'NV xử lý', type: StringType.Text, max: 250 })
    Actor: string;

    @StringDecorator({ label: 'Tên', type: StringType.Text, max: 250 })
    Name: string;

    @StringDecorator({ label: 'Email', type: StringType.Email, max: 50 })
    Email: string;

    @StringDecorator({ label: 'Điện thoại', type: StringType.Text, max: 15 })
    Phone: string;

    @StringDecorator({ label: 'Nội dung xử lý', type: StringType.MultiText, max: 500 })
    Description: string;

    @StringDecorator({ label: 'Nội dung báo cáo', type: StringType.MultiText, max: 500 })
    Reason: string;

    @DropDownDecorator({ label: 'Trạng thái', lookup: LookupData.ReferenceItems(ConstantHelper.ML_ARTICLE_REPORT_STATUS_TYPES) })
    Status: MLArticleReportStatusType;

    @DateTimeDecorator({ label: 'Ngày báo cáo', type: DateTimeType.DateTime })
    CreatedDate: Date;
}
export class MLArticleSyncDataTime {
    @DateTimeDecorator({ label: 'Ngày bắt đầu'})
    StartDate: Date;
    @DateTimeDecorator({ label: 'Ngày kết thúc'})
    EndDate: Date;
    
}