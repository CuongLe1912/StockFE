import { TableData } from "../data/table.data";
import { LookupData } from "../data/lookup.data";
import { DateTimeType } from "../enums/data.type";
import { ExportType } from "../enums/export.type";
import { PdfPageSizeType } from "../enums/pdf.page.site.type";
import { TableDecorator } from "../../decorators/table.decorator";
import { NumberDecorator } from "../../decorators/number.decorator";
import { BooleanDecorator } from "../../decorators/boolean.decorator";
import { DateTimeDecorator } from "../../decorators/datetime.decorator";
import { DropDownDecorator } from "../../decorators/dropdown.decorator";

@TableDecorator()
export class ExportDataDto {
    @DateTimeDecorator({ label: 'Khoảng thời gian', required: true, type: DateTimeType.DateRange })
    DateRange: Date[];

    @NumberDecorator({ label: 'Số lượng', required: true, min: 1, max: 10000 })
    Limit?: number;

    @DropDownDecorator({ lookup: LookupData.ReferenceEnum(ExportType) })
    Type: ExportType;

    @BooleanDecorator()
    Landscape: boolean;

    @DropDownDecorator({ lookup: LookupData.ReferenceEnum(PdfPageSizeType) })
    PageSize: PdfPageSizeType;
    
    Data: TableData;
    Reference?: new () => {};
}