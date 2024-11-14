import { M3DService } from "../meey3d.service";
import { Component, OnInit } from "@angular/core";
import { AppInjector } from "../../../app.module";
import { ResultApi } from "../../../_core/domains/data/result.api";
import { M3DChartDashboardEntity } from "../../../_core/domains/entities/meey3d/m3d.chart.dashboard";


@Component({
    templateUrl: "./3d.chart.dashboard.component.html",
    styleUrls: ["./3d.chart.dashboard.component.scss"]
})

export class M3DChardDashboardComponent implements OnInit{
    loading: boolean;
    chartOptions: any;
    service: M3DService
    dayStatistic: number = 30
    categoryStatistic: string = ''
    item : M3DChartDashboardEntity
    constructor() {
        this.service = AppInjector.get(M3DService);
    }

    ngOnInit() {        
        this.loadItems();
    }
    async onChangeDay(day) {
        this.dayStatistic = day
        await this.loadItems();
    }
    async onChangeCategory(category) {
        this.categoryStatistic = category
        await this.loadItems();
    }
    private async loadItems() {
        this.loading = true;
        const data = {
            day : this.dayStatistic,
            categoryId: this.categoryStatistic
        }
        var result = await this.service.statistical(data);
        if(ResultApi.IsSuccess(result)){
            let items = result.Object as any[]
            let categories = items.map(c => c.date)
            let totalCall = items.map(c => c.totalCall)
            let totalDevice = items.map(c => c.totalDevice)
            let totalSub = items.map(c => c.totalSub)
            let totalView = items.map(c => c.totalView)
            this.chartOptions = {
                series: [
                    {
                        data: totalView,
                        name: "Tổng số lượt xem (" + totalView.reduce((a, b) => a + b, 0) + ")",
                    },
                    {
                        data: totalDevice,
                        name: "Tổng số người xem (" + totalDevice.reduce((a, b) => a + b, 0) + ")",
                    },
                    {
                        data: totalSub,
                        name: "Tổng số lượt đăng kí tư vấn (" + totalSub.reduce((a, b) => a + b, 0) + ")",
                    },
                    {
                        data: totalCall,
                        name: "Tổng số lượt xem điện thoại (" + totalCall.reduce((a, b) => a + b, 0) + ")",
                    }
                    
                ],
                chart: {
                    height: 350,
                    type: "line"
                },
                title: {
                    text: "Thống kê theo ngày"
                },
                plotOptions: {
                },
                dataLabels: {
                    enabled: false
                },
                legend: {
                    show: false
                },
                grid: {
                    show: false
                },
                xaxis: {
                    categories: categories
                },
                
            };
        }
        this.loading = false;
    }
    
}