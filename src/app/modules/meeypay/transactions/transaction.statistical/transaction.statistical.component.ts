import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartComponent } from 'ng-apexcharts';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { AppInjector } from '../../../../app.module';
import { MPTransactionService } from '../transactions.service';

@Component({
  selector: 'app-transaction.statistical',
  templateUrl: './transaction.statistical.component.html',
  styleUrls: ['./transaction.statistical.component.scss']
})
export class MPTransactionStatisticalComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent;
  loading: boolean;
  chartOptions: any;

  service: MPTransactionService;

  lstSeries = [
    { name: "Tổng GD", enable: true },
    { name: "Nạp tiền", enable: true },
    { name: "Thanh toán", enable: false },
    { name: "Chuyển tiền", enable: false },
    { name: "Rút tiền", enable: false }
  ]

  constructor() {
    this.service = AppInjector.get(MPTransactionService);
  }

  ngOnInit() {
    this.loadItems();
  }

  async loadItems() {
    this.loading = true;
    await this.service.statistical().then((result: ResultApi) => {
      if (ResultApi.IsSuccess(result) && result.Object) {
        const data = result.Object;
        this.chartOptions = {
          series: [
            {
              name: "Tổng GD",
              type: "column",
              data: data.total
            },
            {
              name: "Nạp tiền",
              type: "line",
              color: "#FF6D64",
              data: data.topup
            },
            {
              name: "Thanh toán",
              type: "line",
              color: "#00D623",
              data: data.payment
            },
            {
              name: "Chuyển tiền",
              type: "line",
              color: "#FFB800",
              data: data.transfer
            },
            {
              name: "Rút tiền",
              type: "line",
              color: "#282a3c",
              data: data.withdraw
            }
          ],
          chart: {
            height: 350,
            type: "line",
            stacked: false,
            toolbar: {
              tools: {
                download: true,
                selection: false,
                zoom: false,
                zoomin: false,
                zoomout: false,
                pan: false,
                reset: false,
              },
            }
          },
          title: {
            text: "Thống kê giao dịch"
          },
          legend: {
            position: 'top',
          },
          stroke: {
            width: [0, 3, 3, 3, 3],
            curve: "smooth"
          },
          plotOptions: {
            bar: {
              columnWidth: "50%"
            }
          },
          fill: {
            opacity: [0.85, 0.25, 1],
            gradient: {
              inverseColors: false,
              shade: "light",
              type: "vertical",
              opacityFrom: 0.85,
              opacityTo: 0.55,
              stops: [0, 100, 100, 100]
            }
          },
          labels: data.categories,
          markers: {
            size: 0
          },
          xaxis: {
            // type: "datetime"
          },
          yaxis: {
            title: {
              text: ""
            },
            min: 0,
            labels: {
              formatter: function (value) {
                let number = typeof value === 'number'
                  ? value
                  : parseFloat(value);
                return number.toLocaleString("vi-VN", { maximumFractionDigits: 2 });
              }
            },
          },
          tooltip: {
            shared: true,
            intersect: false,
            y: {
              formatter: function (y) {
                if (typeof y !== "undefined") {
                  let value = y.toFixed(0);
                  let number = typeof value === 'number'
                    ? value
                    : parseFloat(value);
                  return number.toLocaleString("vi-VN", { maximumFractionDigits: 2 }) + " vnđ";
                }
                return y;
              }
            }
          }
        };
      }
    });
    this.loading = false;
    setTimeout(() => {
      this.lstSeries.forEach(item => {
        if (!item.enable) {
          this.chart.toggleSeries(item.name)
        }
      });
    }, 200);
  }
}
