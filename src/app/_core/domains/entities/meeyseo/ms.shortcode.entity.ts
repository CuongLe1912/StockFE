import { BaseEntity } from "../base.entity";
import { MSUrlType } from "./enums/ms.url.type";
import { LookupData } from "../../data/lookup.data";
import { ConstantHelper } from "../../../../_core/helpers/constant.helper";
import { TableDecorator } from "../../../../_core/decorators/table.decorator";
import { StringDecorator } from "../../../../_core/decorators/string.decorator";
import { NumberDecorator } from "../../../../_core/decorators/number.decorator";
import { DropDownDecorator } from "../../../../_core/decorators/dropdown.decorator";
import { DateTimeDecorator } from "../../../../_core/decorators/datetime.decorator";
import { DateTimeType, DropdownType, NumberType, StringType } from "../../enums/data.type";

@TableDecorator({ title: 'SHORT CODE' })
export class MSShortCodeEntity extends BaseEntity {
    @StringDecorator({ label: 'Mã ShortCode', type: StringType.Text, required: true, max: 20 })
    Code: string;

    @StringDecorator({ label: 'Title', required: true, type: StringType.Text, max: 200 })
    Title: string;

    @StringDecorator({ label: 'URL', required: true, type: StringType.Text, max: 500 })
    Url: string;

    @DropDownDecorator({ label: 'Loại Url', required: true, lookup: LookupData.ReferenceItems(ConstantHelper.MS_URL_TYPES) })
    UrlType: MSUrlType;

    @StringDecorator({ label: 'ShortCode', type: StringType.Text })
    ShortCode: string;

    @NumberDecorator({ label: 'Số lượng tin hiển thị', required: true, type: NumberType.Text, min: 5, max: 99 })
    TotalShow: number;

    @StringDecorator({ label: 'Trang hiển thị', type: StringType.MultiText, max: 1000 })
    PageDisplay: string;

    @StringDecorator({ label: 'Text Button', required: true, type: StringType.Text, max: 50 })
    TextButton: string;

    @DateTimeDecorator({ label: 'Thời gian tạo', type: DateTimeType.Date })
    StartDate: Date;

    @DropDownDecorator({ label: 'Loại Url', lookup: LookupData.ReferenceItems(ConstantHelper.MS_URL_TYPES) })
    FilterUrlType: MSUrlType;

    @DateTimeDecorator({ label: 'Thời gian tạo', type: DateTimeType.DateRange })
    FilterDateRange: Date[];

    @DropDownDecorator({ label: 'Người tạo', lookup: LookupData.ReferenceUrl('/user/Lookup', ['FullName', 'Email'], 'Id') })
    FilterCreatedBy: number;

    @StringDecorator({ label: 'Ghi chú', type: StringType.Text, max: 500 })
    Note: string;

    // @NumberDecorator({ label: 'Từ', required: true, type: NumberType.Numberic, min: 1, maxDepend: 'ExportTo' })
    // ExportFrom: number;

    // @NumberDecorator({ label: 'Đến', required: true, type: NumberType.Numberic, min: 1, minDepend: 'ExportFrom' })
    // ExportTo: number;
}