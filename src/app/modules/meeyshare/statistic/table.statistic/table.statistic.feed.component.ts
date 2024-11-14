import { Component, OnInit } from "@angular/core";
import { GridData } from "../../../../_core/domains/data/grid.data";
import { DataType } from "../../../../_core/domains/enums/data.type";
import { TableData } from "../../../../_core/domains/data/table.data";
import { CompareType } from "../../../../_core/domains/enums/compare.type";
import { GridComponent } from "../../../../_core/components/grid/grid.component";
import { MeeyShareStatisticEntity } from "../../../../_core/domains/entities/meeyshare/ms.statistic.entity";

@Component({
    selector: 'grid-statistic-feed',
    styleUrls: ['../statistic.component.scss'],
    templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class TableStatisticFeedComponentComponent extends GridComponent implements OnInit {
    obj: GridData = {
        Imports: [],
        Exports: [],
        Filters: [],
        Actions: [],
        Features: [],
        IsPopup: true,
        UpdatedBy: false,
        HidePaging: true,
        HideSearch: true,
        DisableAutoLoad: true,
        HideCustomFilter: true,
        Reference: MeeyShareStatisticEntity,
        Url: '/admin/meeyShareStatistic/feeds',
        ClassName: 'meeyshare-statistic-feed-grid',
    };

    constructor() {
        super();
        this.properties = [
            { Property: 'Name', Title: ' ', Type: DataType.String, ColSpanTitle: ' ', ColSpan: 1, DisableOrder: true, Align: 'right' },
            {
                Property: 'AllPublish', Title: 'Đang đăng', ColSpanTitle: 'Tổng bài đăng', ColSpan: 4, Type: DataType.Number, DisableOrder: true, Align: 'center',
                SumOrCount: () => {
                    let value = this.statisticals.find(c => c.label == 'AllFeeds')?.value;
                    if (value) return value.toLocaleString("vi-VN", { maximumFractionDigits: 2 });
                    return '';
                }
            },
            { Property: 'AllDraft', Title: 'Nháp', Type: DataType.Number, DisableOrder: true, Align: 'center' },
            { Property: 'AllDown', Title: 'Bị hạ', Type: DataType.Number, DisableOrder: true, Align: 'center' },
            { Property: 'AllDeleted', Title: 'Xóa', Type: DataType.Number, DisableOrder: true, Align: 'center' },
            {
                Property: 'UserPublish', Title: 'Đang đăng', ColSpanTitle: 'Bài đăng theo người dùng', ColSpan: 4, Type: DataType.Number, DisableOrder: true, Align: 'center',
                SumOrCount: () => {
                    let value = this.statisticals.find(c => c.label == 'UserFeeds')?.value;
                    if (value) return value.toLocaleString("vi-VN", { maximumFractionDigits: 2 });
                    return '';
                }
            },
            { Property: 'UserDraft', Title: 'Nháp', Type: DataType.Number, DisableOrder: true, Align: 'center' },
            { Property: 'UserDown', Title: 'Bị hạ', Type: DataType.Number, DisableOrder: true, Align: 'center' },
            { Property: 'UserDeleted', Title: 'Xóa', Type: DataType.Number, DisableOrder: true, Align: 'center' },
            {
                Property: 'CrawlPublish', Title: 'Đang đăng', ColSpanTitle: 'Bài đăng Crawl', ColSpan: 4, Type: DataType.Number, DisableOrder: true, Align: 'center',
                SumOrCount: () => {
                    let value = this.statisticals.find(c => c.label == 'CrawlFeeds')?.value;
                    if (value) return value.toLocaleString("vi-VN", { maximumFractionDigits: 2 });
                    return '';
                }
            },
            { Property: 'CrawlDraft', Title: 'Nháp', Type: DataType.Number, DisableOrder: true, Align: 'center' },
            { Property: 'CrawlDown', Title: 'Bị hạ', Type: DataType.Number, DisableOrder: true, Align: 'center' },
            { Property: 'CrawlDeleted', Title: 'Xóa', Type: DataType.Number, DisableOrder: true, Align: 'center' },
        ];
    }

    async ngOnInit() {
        this.breadcrumbs = null;

        // set filters
        let date: Date = new Date();
        date.setDate(date.getDate() - 6);
        this.itemData = new TableData();
        this.itemData.Filters = [
            {
                Value: date,
                Value2: new Date(),
                Name: 'ReportDate',
                Compare: CompareType.D_Between,
            }
        ];

        // render
        await this.render(this.obj);
    }

    public async reloadGrid(reportDate: Date[]) {
        if (reportDate && reportDate.length > 0) {
            await this.filters([
                {
                    Name: 'ReportDate',
                    Value: reportDate[0],
                    Value2: reportDate[1],
                    Compare: CompareType.D_Between,
                }
            ]);
        } else await this.filters();
    }
}