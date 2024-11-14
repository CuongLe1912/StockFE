import { StringDecorator } from "../../../../_core/decorators/string.decorator";
import { BaseEntity } from "../base.entity";
import { DropDownDecorator } from "../../../../_core/decorators/dropdown.decorator";
import { MRVUserStatusType } from "./enums/mrv.user.status.type";
import { BooleanType, DateTimeType, StringType } from "../../enums/data.type";
import { DateTimeDecorator } from "../../../../_core/decorators/datetime.decorator";
import { ImageDecorator } from "../../../../_core/decorators/image.decorator";
import { AppConfig } from "../../../../_core/helpers/app.config";
import { TableDecorator } from "../../../../_core/decorators/table.decorator";
import { ConstantHelper } from "../../../../_core/helpers/constant.helper";
import { LookupData } from "../../data/lookup.data";
import { BooleanDecorator } from "../../../../_core/decorators/boolean.decorator";
import { GenderType } from "../../enums/gender.type";
import { MRVUserType } from "./enums/mrv.user.type";
import { MRVUserGenderType } from "./enums/mrv.user.gender.type";

@TableDecorator({ title: 'Danh sách người dùng' })
export class MeeyReviewUserEntity extends BaseEntity {

    @StringDecorator({ label: 'Tài khoản/Device ID' ,required: true})
    Name: string;

    @StringDecorator({ label: 'Tên tài khoản/biệt danh', max: 255, placeholder: 'Nhập tên tài khoản, biệt danh' })
    FilterName: string;

    @StringDecorator({ label: 'Biệt danh', type: StringType.MultiText })
    NickNames: string[];

    @StringDecorator({ label: 'Device ID', type: StringType.Text })
    DeviceId: string;

    @DropDownDecorator({ label: 'Loại tài khoản', required: true, lookup: LookupData.ReferenceItems(ConstantHelper.MRV_USER_TYPE) })
    UserType: MRVUserType;

    @DateTimeDecorator({ label: 'Ngày tạo', type: DateTimeType.DateRange })
    FilterDateRange: Date;

    // @StringDecorator({ label: 'Số dự án tương tác' })
    // TotalInteract: string;

    // @StringDecorator({ label: 'Số lượt review' })
    // TotalReview: string;

    // @StringDecorator({ label: 'Số lượt câu hỏi' })
    // TotalQuestion: string;

    // @StringDecorator({ label: 'Số lượt phản hồi' })
    // TotalReply: string;

    @DropDownDecorator({ label: 'Trạng thái', lookup: LookupData.ReferenceItems(ConstantHelper.MRV_USER_STATUS_TYPE) })
    StatusType: MRVUserStatusType;

    @StringDecorator({ label: 'Email' })
    Email: string;

    @StringDecorator({ required: true, type: StringType.PhoneText, min: 10, max: 10 })
    Phone: string;

    @ImageDecorator({
        multiple: false,
        label: 'Avatar',
        customUpload: {
            needMove: true,
            url: AppConfig.MeeyMediaConfig.Api + '/v1/admin/media',
            headers: [{ key: 'X-Client-Source', value: AppConfig.MeeyLandConfig.Source }],
            authorization: { key: AppConfig.MeeyMediaConfig.UserName, value: AppConfig.MeeyMediaConfig.Password },
            data: [{ key: 'images', value: 'data' }, { key: 'createdBy[data][_id]', value: 'createdById' }, { key: 'createdBy[data][fullname]', value: 'createdByName' }, { key: 'createdBy[source]', value: 'admin' }]
        }
    })
    Avatar: string;

    @BooleanDecorator({ type: BooleanType.RadioButton, lookup: LookupData.ReferenceItems(ConstantHelper.MRV_USER_GENDER_TYPE) })
    Gender: MRVUserGenderType;

    @BooleanDecorator({ label: 'Hoạt động', type: BooleanType.Toggle })
    StatusTypeToogle: boolean = true;
}