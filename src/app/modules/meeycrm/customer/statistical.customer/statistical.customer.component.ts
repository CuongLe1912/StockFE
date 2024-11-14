import { Component, OnInit } from "@angular/core";
import { AppInjector } from "../../../../app.module";
import { MeeyCrmService } from "../../meeycrm.service";
import { ResultApi } from "../../../../_core/domains/data/result.api";

@Component({
    templateUrl: "./statistical.customer.component.html",
    styleUrls: ["./statistical.customer.component.scss"]
})
export class StatisticalCustomerComponent implements OnInit {
    loading: boolean;
    chartOptions: any;
    service: MeeyCrmService;
    
    constructor() {
        this.service = AppInjector.get(MeeyCrmService);
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
                    categories = items.map(c => c.DateTime);
                this.chartOptions = {
                    series: [
                        {
                            data: data,
                            name: "Số lượng",
                        }
                    ],
                    chart: {
                        height: 350,
                        type: "bar"
                    },
                    title: {
                        text: "Thống kê khách hàng CRM"
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