export enum ExportType {
    Csv = 0,
    Pdf,
    Excel,
}
export function ExportTypeAware(constructor: Function) {
    constructor.prototype.ExportType = ExportType;
}
