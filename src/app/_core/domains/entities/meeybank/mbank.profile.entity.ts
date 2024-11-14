import * as _ from 'lodash';
import { BaseEntity } from "../base.entity";
import { LookupData } from "../../data/lookup.data";
import { DateTimeType, StringType } from "../../enums/data.type";
import { ConstantHelper } from "../../../../_core/helpers/constant.helper";
import { TableDecorator } from "../../../../_core/decorators/table.decorator";
import { FileDecorator } from "../../../../_core/decorators/file.decorator";
import { StringDecorator } from "../../../../_core/decorators/string.decorator";
import { DropDownDecorator } from "../../../../_core/decorators/dropdown.decorator";
import { DateTimeDecorator } from "../../../../_core/decorators/datetime.decorator";
import { MBankProfileStatusType } from './enums/mbank.profile.type';

@TableDecorator({ title: 'Hồ sơ ứng viên' })
export class MBankProfileEntity extends BaseEntity {
    @StringDecorator({ label: 'Họ tên', required: true, max: 250 })
    Name: string;

    @StringDecorator({ label: 'Email', required: true, type: StringType.Email, max: 250 })
    Email: string;

    @StringDecorator({ label: 'Số điện thoại', required: true, type: StringType.PhoneText, max: 250 })
    Phone: string;

    @FileDecorator({ label: 'Tệp', required: true, url: 'upload/MGUpload' })
    File: string;

    @DropDownDecorator({ label: 'Vị trí ứng tuyển', lookup: LookupData.ReferenceUrl('MBankProfile/LookupRecruitment', ['TitleVn']) })
    RecruitmentId?: number;

    @DropDownDecorator({ label: 'Trạng thái', lookup: { items: ConstantHelper.MBANK_PROFILE_STATUS_TYPES } })
    Status: MBankProfileStatusType;

    @DropDownDecorator({ label: 'Trạng thái cập nhật', lookup: { items: ConstantHelper.MBANK_PROFILE_STATUS_TYPES.filter(item => item.value !== MBankProfileStatusType.New) } })
    StatusUpdate: MBankProfileStatusType;

    @DateTimeDecorator({ label: "Thời gian ứng tuyển", type: DateTimeType.DateTime })
    RequestDate: Date;

    // @StringDecorator({ label: 'Trung tâm/Phòng ban', max: 250 })
    // Center: string;

    // @StringDecorator({ label: 'Người phỏng vấn', max: 250 })
    // Manager: string;

    @StringDecorator({ label: 'Ghi chú', type: StringType.MultiText, max: 500 })
    Note: string;

    SlugUrlRecruitment : string
}