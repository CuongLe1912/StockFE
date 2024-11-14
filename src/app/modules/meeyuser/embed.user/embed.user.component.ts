import { MLUserService } from "../user.service";
import { AppInjector } from "../../../app.module";
import { Component, Input, OnInit } from "@angular/core";
import { ResultApi } from "../../../_core/domains/data/result.api";
import { TableData } from "../../../_core/domains/data/table.data";
import { FilterData } from "../../../_core/domains/data/filter.data";
import { CompareType } from '../../../_core/domains/enums/compare.type';
import { AdminEventService } from '../../../_core/services/admin.event.service';
import { MLUserStatisticalDto } from "../../../_core/domains/entities/meeyland/ml.user.entity";

@Component({
    templateUrl: "./embed.user.component.html",
    styleUrls: ["./embed.user.component.scss"]
})
export class MLEmbedUserComponent implements OnInit {
    active: string;
    loading: boolean;
    chartOptions: any;
    tableData: TableData;
    @Input() params: any;
    service: MLUserService;
    event: AdminEventService;
    item: MLUserStatisticalDto;

    constructor() {
        this.service = AppInjector.get(MLUserService);
        this.event = AppInjector.get(AdminEventService);
    }

    ngOnInit() {
        this.tableData = this.params && this.params['TableData'];
        this.loadItems();
    }

    private async loadItems() {
        this.loading = true;
        await this.service.statisticalEmbed(this.tableData).then((result: ResultApi) => {
            if (ResultApi.IsSuccess(result) && result.Object) {
                this.item = result.Object as MLUserStatisticalDto;
            }
        });
        this.loading = false;
    }

    filterToDay(type: string) {
        // toggle active
        let active = 'Today_' + type;
        if (this.active == active) {
            this.event.RefreshGrids.emit(null);
            this.active = null;
            return;
        }
        this.active = active;

        // filter
        let filter: FilterData = {
            Value: new Date(),
            Value2: new Date(),
            Name: 'CustomDateTime',
            Compare: CompareType.D_Between
        };
        switch (type) {
            case 'New': {
                let obj: TableData = {
                    Name: 'ToDay',
                    Filters: [filter],
                };
                this.event.RefreshGrids.emit(obj);
            } break;
            case 'NotSale': {
                let obj: TableData = {
                    Name: 'ToDay',
                    Filters: [filter, {
                        Value: true,
                        Name: 'NotSale',
                        Compare: CompareType.B_Equals
                    }],
                };
                this.event.RefreshGrids.emit(obj);
            } break;
            case 'HaveArticle': {
                let obj: TableData = {
                    Name: 'ToDay',
                    Filters: [filter, {
                        Value: true,
                        Name: 'HaveArticle',
                        Compare: CompareType.B_Equals
                    }],
                };
                this.event.RefreshGrids.emit(obj);
            } break;
        }
    }

    filterWeekend(type: string) {
        // toggle active
        let active = 'Weekend_' + type;
        if (this.active == active) {
            this.event.RefreshGrids.emit(null);
            this.active = null;
            return;
        }
        this.active = active;

        // filter
        let weekend = new Date();
        weekend.setDate(weekend.getDate() - 6);
        let filter: FilterData = {
            Value: weekend,
            Value2: new Date(),
            Name: 'CustomDateTime',
            Compare: CompareType.D_Between,
        };
        switch (type) {
            case 'New': {
                let obj: TableData = {
                    Name: 'Weekend',
                    Filters: [filter],
                };
                this.event.RefreshGrids.emit(obj);
            } break;
            case 'NotSale': {
                let obj: TableData = {
                    Name: 'Weekend',
                    Filters: [filter, {
                        Value: true,
                        Name: 'NotSale',
                        Compare: CompareType.B_Equals
                    }],
                };
                this.event.RefreshGrids.emit(obj);
            } break;
            case 'HaveArticle': {
                let obj: TableData = {
                    Name: 'Weekend',
                    Filters: [filter, {
                        Value: true,
                        Name: 'HaveArticle',
                        Compare: CompareType.B_Equals
                    }],
                };
                this.event.RefreshGrids.emit(obj);
            } break;
        }
    }

    filterCustom(type: string) {
        // toggle active
        let active = 'Custom_' + type;
        if (this.active == active) {
            this.event.RefreshGrids.emit(null);
            this.active = null;
            return;
        }
        this.active = active;

        // filter
        switch (type) {
            case 'New': {
                let obj: TableData = {
                    Name: 'Custom'
                };
                this.event.RefreshGrids.emit(obj);
            } break;
            case 'NotSale': {
                let obj: TableData = {
                    Name: 'Custom',
                    Filters: [{
                        Value: true,
                        Name: 'NotSale',
                        Compare: CompareType.B_Equals
                    }],
                };
                this.event.RefreshGrids.emit(obj);
            } break;
            case 'HaveArticle': {
                let obj: TableData = {
                    Name: 'Custom',
                    Filters: [{
                        Value: true,
                        Name: 'HaveArticle',
                        Compare: CompareType.B_Equals
                    }],
                };
                this.event.RefreshGrids.emit(obj);
            } break;
        }
    }
}