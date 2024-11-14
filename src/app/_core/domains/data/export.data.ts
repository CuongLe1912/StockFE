import { ExportType } from "../enums/export.type";
import { PdfPageSizeType } from "../enums/pdf.page.site.type";

export class ExportData {
    Limit?: number;
    Type: ExportType;
    DateRange?: Date[];
    Landscape?: boolean;
    PageSize?: PdfPageSizeType;
}