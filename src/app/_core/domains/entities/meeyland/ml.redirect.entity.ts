import { StringDecorator } from "../../../../_core/decorators/string.decorator";
import { DropDownDecorator } from "../../../../_core/decorators/dropdown.decorator";
import { TableDecorator } from "../../../../_core/decorators/table.decorator";
import { LookupData } from "../../data/lookup.data";
import { BaseEntity } from "../base.entity";
import { DateTimeType, NumberType, StringType } from "../../enums/data.type";
import { DateTimeDecorator } from "../../../../_core/decorators/datetime.decorator";
import { UserEntity } from "../user.entity";
import { NumberDecorator } from "../../../../_core/decorators/number.decorator";
import { FileDecorator } from "../../../../_core/decorators/file.decorator";
import { MethodType } from "../../enums/method.type";
import { AppConfig } from "../../../../_core/helpers/app.config";

@TableDecorator({ title: 'Chuyển hướng 301,302' })
export class MLRedirectEntity extends BaseEntity {
    @DropDownDecorator({
        label: 'Loại chuyển hướng',
        required: true, lookup: LookupData.ReferenceItems([
            { label: 'Chuyển hướng vĩnh viễn', value: 301 },
            { label: 'Chuyển hướng tạm thời', value: 302 }
        ])
    })
    Type: Number;

    @DropDownDecorator({
        label: 'Trạng thái',
        allowSearch: true, lookup: LookupData.ReferenceItems([
            { label: 'Hoạt động', value: true },
            { label: 'Xóa', value: false }
        ])
    })
    Active: Boolean;

    @DropDownDecorator({
        label: 'Trạng thái',
        placeholder: 'Tất cả',
        allowSearch: true, lookup: LookupData.ReferenceItems([
            { label: 'Hoạt động', value: true },
            { label: 'Xóa', value: false }
        ])
    })
    ActiveSearch: Boolean;

    @StringDecorator({ label: 'URL cũ', type: StringType.Text, allowSearch: true, required: true, max: 5000 })
    OriginUrl: string;

    @DateTimeDecorator({ label: 'Ngày cập nhật', type: DateTimeType.DateTime, allowSearch: true })
    UpdatedAt: Date;

    @StringDecorator({ label: 'URL mới', type: StringType.Text, allowSearch: true, required: true, max: 5000 })
    RedirectUrl: string;

    @DropDownDecorator({ label: 'Nguời tạo', lookup: LookupData.Reference(UserEntity, ['FullName', 'Email']) })
    CreatedBy: string;

    @StringDecorator({ label: 'Người cập nhật', type: StringType.Text })
    Source: string;

    @DropDownDecorator({ label: 'Nguời cập nhật', lookup: LookupData.Reference(UserEntity, ['FullName', 'Email'], 'Email'), multiple: true, placeholder: 'Tất cả'  })
    UpdatedBySearch: string;

    @DropDownDecorator({
        label: 'Loại chuyển hướng',
        placeholder: 'Tất cả',
        required: true, lookup: LookupData.ReferenceItems([
            { label: '301 - Vĩnh viễn', value: 301 },
            { label: '302 - Tạm thời', value: 302 }
        ])
    })
    TypeInsert: Number;

    Author: any;

    @StringDecorator({ label: 'Email', type: StringType.Text })
    Email: string;

    @StringDecorator({ label: 'Ghi chú', type: StringType.Text, max: 500 })
    Note: string;

    @NumberDecorator({ label: 'Loại', type: NumberType.Numberic, allowSearch: true })
    TypeColunm: string;

    @StringDecorator({ label: 'URL cũ', type: StringType.Text, allowSearch: true, max: 5000 })
    OriginUrlSearch: string;

    @StringDecorator({ label: 'URL mới', type: StringType.Text, allowSearch: true, max: 5000 })
    RedirectUrlSearch: Number;

    @FileDecorator({
        size: 10,
        required: true,
        label: 'Tên file',
        description: 'Định dạng: xls, xlxs',
        accept: 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        customUpload: {
            method: MethodType.Post,
            data: [{ key: 'file', value: 'data' }],
            authorization: { value: '2AdQycU9I5b1RZ0qJMspLTs6qMVyGesf' },
            url: AppConfig.MeeyLandV3Config.Url + '/admin/v3/redirect/read-xlsx',
        }
    }) 
    FileImport: any;
}

@TableDecorator({ title: 'Lịch sử chuyển hướng' })
export class MLRedirectHistoryEntity extends BaseEntity {

    @DateTimeDecorator({ label: 'Ngày thực hiện', type: DateTimeType.DateTime, allowSearch: true })
    UpdatedAt: Date;

    Author: any;

    @StringDecorator({ label: 'Hành động', type: StringType.Text, allowSearch: true })
    Action: string;

    @StringDecorator({ label: 'Hành động', type: StringType.Text, allowSearch: true })
    ActionText: string;

    Note: string;

    OldValue: MLRedirectEntity;

    NewValue: MLRedirectEntity; 
}