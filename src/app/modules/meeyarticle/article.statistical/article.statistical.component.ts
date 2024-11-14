import { Component, OnInit } from "@angular/core";
import { AppInjector } from "../../../app.module";
import { MLArticleService } from "../article.service";
import { ResultApi } from "../../../_core/domains/data/result.api";

@Component({
    templateUrl: "./article.statistical.component.html",
    styleUrls: ["./article.statistical.component.scss"]
})
export class MLArticleStatisticalComponent implements OnInit {
    loading: boolean;
    chartOptions: any;
    service: MLArticleService;
    
    constructor() {
        this.service = AppInjector.get(MLArticleService);
    }

    ngOnInit() {
        this.loadItems();
    }

    private async loadItems() {
        this.loading = true;
        await this.service.statistical().then((result: ResultApi) => {
            if (ResultApi.IsSuccess(result) && result.Object) {
                let items = result.Object as any[],
                    data = items.map(c => c.Count),
                    categories = items.map(c => c.DateTime),
                    dataCrawl = items.map(c => c.CountCrawl);
                this.chartOptions = {
                    series: [
                        {
                            data: data,
                            name: "Tin tự xuất bản",
                        },
                        {
                            data: dataCrawl,
                            name: "Tin crawl",
                        }
                    ],
                    chart: {
                        height: 350,
                        type: "bar"
                    },
                    title: {
                        text: "Thống kê tin đăng theo ngày"
                    },
                    plotOptions: {
                        bar: {
                          columnWidth: "45%",
                          distributed: true
                        }
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
                    }
                };
            }
        });
        this.loading = false;
    }
}