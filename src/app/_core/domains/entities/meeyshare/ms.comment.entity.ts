import { BaseEntity } from "../base.entity";
import { StringType } from "../../enums/data.type";
import { LookupData } from "../../data/lookup.data";
import { TableDecorator } from "../../../../_core/decorators/table.decorator";
import { MShareCommentStatus, MShareCommentType } from "./enums/ms.status.type";
import { StringDecorator } from "../../../../_core/decorators/string.decorator";
import { DropDownDecorator } from "../../../../_core/decorators/dropdown.decorator";
import { DateTimeDecorator } from "../../../../_core/decorators/datetime.decorator";

@TableDecorator({ title: 'Bình luận' })
export class MeeyShareCommentEntity extends BaseEntity {

    @DropDownDecorator({ label: 'Người bình luận', lookup: LookupData.ReferenceUrl('/MeeyShareUser/LookupUsers', ['Id', 'Name']) })
    UserId: string;

    @DateTimeDecorator({ label: 'Ngày bình luận' })
    CreatedAt: Date;

    @StringDecorator({ label: 'Người bình luận', max: 250 })
    User: string;

    @DropDownDecorator({
        label: 'Loại bình luận', lookup: LookupData.ReferenceItems([
            { label: 'Bình luận cấp 1', value: MShareCommentType.One },
            { label: 'Bình luận cấp 2', value: MShareCommentType.Two },
        ])
    })
    Level: MShareCommentType;

    @DropDownDecorator({
        required: true,
        allowClear: false,
        label: 'Trạng thái bình luận', lookup: LookupData.ReferenceItems([
            { label: 'Đã ẩn', value: MShareCommentStatus.Hidden, color: 'kt-badge kt-badge--inline kt-badge--info' },
            { label: 'Đang hiển thị', value: MShareCommentStatus.Showing, color: 'kt-badge kt-badge--inline kt-badge--success' },
        ])
    })
    Status: MShareCommentStatus;

    @StringDecorator({ required: true, label: 'Lý do ẩn', max: 500, type: StringType.MultiText })
    Reason: string;

    @StringDecorator({ label: 'Nội dung bình luận', max: 500, type: StringType.MultiText })
    Content: string;

    Channel: string;
    FeedUrl: string;
}