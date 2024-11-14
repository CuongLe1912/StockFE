import { Router } from "@angular/router";
import { AppInjector } from "../../../app.module";
import { Component, Input, OnInit } from "@angular/core";
import { TableData } from "../../../_core/domains/data/table.data";
import { FilterData } from "../../../_core/domains/data/filter.data";
import { CompareType } from "../../../_core/domains/enums/compare.type";
import { AdminEventService } from "../../../_core/services/admin.event.service";

@Component({
    templateUrl: "./article.report.button.component.html",
    styleUrls: ["./article.report.button.component.scss"]
})
export class MLArticleReportButtonComponent implements OnInit {
    router: Router;
    loading: boolean;
    chartOptions: any;
    @Input() params: any;
    activeIndex: number = -1;
    event: AdminEventService;
    buttons: any[] = [
        { id: -1, name: 'Tất cả' },
        { id: 0, name: 'Chưa xử lý' },
        { id: 1, name: 'Đã xử lý' }
    ]

    constructor() {
        this.router = AppInjector.get(Router);
        this.event = AppInjector.get(AdminEventService);
    }

    ngOnInit() {
        let tableData: TableData = this.params && this.params['TableData'];
        if (tableData && tableData.Filters) {
            let filterAccess = tableData.Filters.find(c => c.Name == 'Status');
            if (filterAccess) {
                this.activeIndex = filterAccess.Value;
            }
        }
    }

    filter(item: any) {
        this.activeIndex = item.id;

        // filter
        let filter: FilterData = {
            Name: 'Status',
            Value: item.id,
            Compare: CompareType.N_Equals
        };
        let obj: TableData = { Filters: [filter] };
        this.event.RefreshGrids.emit(obj);
    }
}