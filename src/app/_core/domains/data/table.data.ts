import { ExportData } from "./export.data";
import { FilterData } from "./filter.data";
import { PagingData } from "./paging.data";
import { SortingData } from "./sorting.data";

export class TableData {
    Name?: string;
    Search?: string;
    Columns?: string[];
    Paging?: PagingData;
    Export?: ExportData;
    IgnoreIds?: number[];
    Orders?: SortingData[];
    Filters?: FilterData[];

    constructor() {
        this.Orders = [];
    }
}