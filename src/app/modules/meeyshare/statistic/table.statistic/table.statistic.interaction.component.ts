import { Component, OnInit } from "@angular/core";
import { GridData } from "../../../../_core/domains/data/grid.data";
import { DataType } from "../../../../_core/domains/enums/data.type";
import { TableData } from "../../../../_core/domains/data/table.data";
import { CompareType } from "../../../../_core/domains/enums/compare.type";
import { GridComponent } from "../../../../_core/components/grid/grid.component";
import { MeeyShareStatisticEntity } from "../../../../_core/domains/entities/meeyshare/ms.statistic.entity";

@Component({
    selector: 'grid-statistic-interaction',
    templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class TableStatisticInteractionComponentComponent extends GridComponent implements OnInit {
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
        Url: '/admin/meeyShareStatistic/interactions',
        ClassName: 'meeyshare-statistic-interaction-grid',
    };

    constructor() {
        super();
        this.properties = [
            { Property: 'Name', Title: ' ', ColSpanTitle: ' ', ColSpan: 1, Type: DataType.String, DisableOrder: true, Align: 'right' },
            {
                Property: 'View', Title: 'Xem', ColSpanTitle: 'Tương tác', ColSpan: 3, Type: DataType.String, DisableOrder: true, Align: 'center',
                Format: (item: any) => {
                    if (item.View) return item.View.toLocaleString("vi-VN", { maximumFractionDigits: 2 });
                    else return '--';
                }
            },
            { Property: 'Vote', Title: 'Vote', Type: DataType.Number, DisableOrder: true, Align: 'center' },
            { Property: 'Comment', Title: 'Bình luận', Type: DataType.Number, DisableOrder: true, Align: 'center' },
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