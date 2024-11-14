import { Component, Input, OnInit } from '@angular/core';
import { ResultApi } from '../../../../../_core/domains/data/result.api';
import { MAFContractType } from '../../../../../_core/domains/entities/meeyaffiliate/enums/contract.type';
import { MethodType } from '../../../../../_core/domains/enums/method.type';
import { ToastrHelper } from '../../../../../_core/helpers/toastr.helper';
import { AppInjector } from '../../../../../app.module';
import { MAFAffiliateService } from '../../../affiliate/affiliate.service';
import { TableData } from '../../../../../_core/domains/data/table.data';
import { CompareType } from '../../../../../_core/domains/enums/compare.type';
import { AdminAuthService } from '../../../../../_core/services/admin.auth.service';
import { ActionType } from '../../../../../_core/domains/enums/action.type';

@Component({
  templateUrl: './approve.payment.commission.component.html',
  styleUrls: ['./approve.payment.commission.component.scss']
})
export class MAFApprovePaymentCommissionComponent implements OnInit {
  @Input() params: any;

  item: any;
  action: string;
  title: string;
  type: MAFContractType;
  url: string;

  loading = false;
  allowViewDetail = false;

  disabled = true;

  service: MAFAffiliateService;
  authen: AdminAuthService;

  constructor() {
    this.service = AppInjector.get(MAFAffiliateService);
    this.authen = AppInjector.get(AdminAuthService);
  }

  async ngOnInit() {
    // this.item = this.params && this.params['item'];
    this.action = this.params && this.params['action'];
    this.type = this.params && this.params['type'];
    let FilterMonth = this.params && this.params['month'];

    if (this.action) {
      if (this.action == 'payment') {
        this.title = 'Thông tin hoa hồng chưa thanh toán về TKKM1'
      } else if (this.action == 'approve') {
        this.title = 'Thông tin hoa hồng cần kiểm duyệt'
      }
    }

    this.loadItems(FilterMonth);
  }

  async loadItems(FilterMonth) {
    this.loading = true;
    let action = "CommissionCollected";
    this.url = '/admin/mafsynthetic/view?month=';
    if (this.type) {
      action += "?type=" + this.type;
      if (this.type == MAFContractType.Individual) {
        this.url = '/admin/mafsynthetic/individual?month=';
      } else if (this.type == MAFContractType.Businesses) {
        this.url = '/admin/mafsynthetic/businesses?month=';
      }
    }
    let itemData = new TableData();
    itemData.Filters = [{
      Name: "FilterMonth",
      Value: FilterMonth,
      Compare: CompareType.D_Equals,
    }]
    await this.service.callApi("MAFAffiliateSynthetic", action, itemData, MethodType.Post).then((result: ResultApi) => {
      if (ResultApi.IsSuccess(result)) {
        this.item = result.Object;
        this.item.Month = this.item.Month + '/' + this.item.Year;
        this.disabled = false;
        if (this.action == 'payment') {
          if (this.item.MoneyNeedPaymentEligible < 1) {
            this.disabled = true;
          }
        }
      }
    });
    this.allowViewDetail = await this.authen.permissionAllow("MAFAffiliateSynthetic", ActionType.ViewDetail);
    this.loading = false;
  }

  public async confirm(): Promise<boolean> {
    if (this.action && this.item) {
      let date = this.item.Month;
      let dates = date && date.split("/")
      if (dates.length > 1) {
        let obj = {
          Year: dates[1],
          Month: dates[0],
          Accountant: '',
          Type: this.type,
        }
        if (this.action == 'payment') {
          return await this.service.callApi("MAFAffiliateSynthetic", "PaymentCommissionMonth", obj, MethodType.Post).then((result: ResultApi) => {
            if (ResultApi.IsSuccess(result)) {
              ToastrHelper.Success('Thanh toán hoa hồng thành công');
              return true;
            } else {
              ToastrHelper.ErrorResult(result);
              return false;
            }
          });
        } else if (this.action == 'approve') {
          return await this.service.callApi("MAFAffiliateSynthetic", "ApproveCommissionMonth", obj, MethodType.Post).then((result: ResultApi) => {
            if (ResultApi.IsSuccess(result)) {
              ToastrHelper.Success('Duyệt hoa hồng thành công');
              return true;
            } else {
              ToastrHelper.ErrorResult(result);
              return false;
            }
          });
        }
      }
    }
    return false;
  }

}
