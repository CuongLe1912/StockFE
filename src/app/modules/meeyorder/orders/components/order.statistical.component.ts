import { Component, OnInit } from '@angular/core';
import { AppInjector } from '../../../../app.module';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { MOOrdersService } from '../orders.service';

@Component({
  selector: 'mo-order-statistical',
  template: `
    <div class="row" style="background: #efefef; margin-top: 10px;">
      <div class="col-sm-12">
          <div class="row">
              <label class="col-sm-1 col-form-label"><b>Hôm nay</b></label>
              <label class="col-sm-3 col-form-label">Tổng đơn hàng mới tạo: <b [innerHTML]="new"></b></label>
              <label class="col-sm-3 col-form-label">Chưa hoàn thành thanh toán: <b [innerHTML]="notComplete"></b></label>
            </div>
      </div>
    </div>
  `,
})
export class MOOrderStatisticalComponent implements OnInit {

  service: MOOrdersService;
  new: string = '<span class="kt-spinner kt-spinner--v2 kt-spinner--primary"></span>';
  notComplete: string = '<span class="kt-spinner kt-spinner--v2 kt-spinner--primary "></span>';

  constructor() { 
    this.service = AppInjector.get(MOOrdersService);
  }

  ngOnInit() {
    this.service.ReportDaily().then((result: ResultApi) => {
      if (ResultApi.IsSuccess(result)) {
        this.new = result.Object.new;
        this.notComplete = result.Object.notComplete;
      }
    })
  }

}
