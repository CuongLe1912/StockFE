import { BaseEntity } from "../base.entity";
import { StringType } from "../../enums/data.type";
import { LookupData } from "../../data/lookup.data";
import { MShareReportStatusType } from "./enums/ms.status.type";
import { TableDecorator } from "../../../../_core/decorators/table.decorator";
import { StringDecorator } from "../../../../_core/decorators/string.decorator";
import { DropDownDecorator } from "../../../../_core/decorators/dropdown.decorator";
import { DateTimeDecorator } from "../../../../_core/decorators/datetime.decorator";

@TableDecorator({ title: 'Báo xấu tin tức' })
export class MeeyShareReportEntity extends BaseEntity {

    @DateTimeDecorator({ label: 'Ngày báo xấu' })
    CreatedAt: Date;

    @StringDecorator({ label: 'Người báo xấu', max: 250 })
    User: string;

    @DropDownDecorator({ label: 'Người báo xấu', lookup: { url: '/MeeyShareUser/LookupUsers' } })
    UserId: string;

    @DropDownDecorator({
        label: 'Trạng thái', lookup: LookupData.ReferenceItems([
            { label: 'Chưa xử lý', value: MShareReportStatusType.NotYet },
            { label: 'Hạ bài đăng', value: MShareReportStatusType.Cancel },
            { label: 'Không xử lý', value: MShareReportStatusType.Reject },
        ])
    })
    Status: MShareReportStatusType;

    @DropDownDecorator({
        required: true,
        label: 'Lựa chọn hình thức xử lý', lookup: LookupData.ReferenceItems([
            { label: 'Hạ bài đăng', value: MShareReportStatusType.Cancel },
            { label: 'Không xử lý', value: MShareReportStatusType.Reject },
        ])
    })
    ProcessStatus: MShareReportStatusType;

    @StringDecorator({ required: true, label: 'Nội dung xử lý', max: 500, type: StringType.MultiText })
    ProcessNote: string;

    @StringDecorator({ label: 'Nội dung xử lý', max: 500, type: StringType.MultiText })
    Note: string;

    @StringDecorator({ label: 'Lý do', max: 500, type: StringType.MultiText })
    Description: string;

    Feed: any;
}