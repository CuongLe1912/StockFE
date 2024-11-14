import { Router } from "@angular/router";
import { AppInjector } from "../../../app.module";
import { Component, Input, OnInit } from "@angular/core";
import { TableData } from "../../../_core/domains/data/table.data";
import { FilterData } from "../../../_core/domains/data/filter.data";
import { CompareType } from "../../../_core/domains/enums/compare.type";
import { AdminEventService } from "../../../_core/services/admin.event.service";

@Component({
    templateUrl: "./article.button.component.html",
    styleUrls: ["./article.button.component.scss"]
})
export class MLArticleButtonComponent implements OnInit {
    router: Router;
    loading: boolean;
    chartOptions: any;
    @Input() params: any;
    activeIndex: number = 0;
    event: AdminEventService;
    buttons: any[] = [
        { id: 0, name: 'Tất cả' },
        { id: 2, name: 'Tin chờ duyệt' },
        { id: 3, name: 'Chờ thanh toán' },
        { id: 4, name: 'Tin đang đăng' },
        { id: 10, name: 'Tin chờ đăng' },
        { id: 5, name: 'Tin bị hạ' },
        { id: 6, name: 'Tin hết hạn' },
        { id: 8, name: 'Tin từ chối đăng' },
        { id: 7, name: 'Tin nháp' },
        { id: 9, name: 'Tin đã xóa' }
    ]

    constructor() {
        this.event = AppInjector.get(AdminEventService);
        this.router = AppInjector.get(Router);
        if (this.router.url.indexOf('crawl') >= 0) {
            this.buttons = [
                { id: 0, name: 'Tất cả' },
                { id: 4, name: 'Tin đang đăng' },
                // { id: 2, name: 'Tin chờ duyệt' },
                { id: 5, name: 'Tin bị hạ' },
                { id: 6, name: 'Tin hết hạn' },
                { id: 9, name: 'Tin đã xóa' }
            ];
        }
    }

    ngOnInit() {
        let tableData: TableData = this.params && this.params['TableData'];
        if (tableData && tableData.Filters) {
            let filterAccess = tableData.Filters.find(c => c.Name == 'Access');
            if (filterAccess) {
                this.activeIndex = filterAccess.Value;
            }
        }
    }

    filter(item: any) {
        this.activeIndex = item.id;     
        
        // filter
        let filter: FilterData = {
            Name: 'Access',
            Value: item.id,
            Compare: CompareType.N_Equals
        };
        let obj: TableData = { Filters: [filter] };
        this.event.RefreshGrids.emit(obj);
    }
}