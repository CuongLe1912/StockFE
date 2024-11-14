import { Component, Input, OnInit } from "@angular/core";
import { GridComponent } from "../../../../_core/components/grid/grid.component";
import { GridData } from "../../../../_core/domains/data/grid.data";
import { DataType } from "../../../../_core/domains/enums/data.type";
import { ModalSizeType } from "../../../../_core/domains/enums/modal.size.type";
import { MOOrdersEntity } from "../../../../_core/domains/entities/meeyorder/order.entity";
import { MOOrdersService } from "../orders.service";
import { AppInjector } from "../../../../app.module";
import { UtilityExHelper } from "../../../../_core/helpers/utility.helper";
import { OptionItem } from "../../../../_core/domains/data/option.item";
import { ConstantHelper } from "../../../../_core/helpers/constant.helper";
import { MPPaymentMethodType } from "../../../../_core/domains/entities/meeypay/enums/mp.transaction.status.type";

@Component({
    selector: 'mo-order-payment-grid',
    templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class MOOrderPaymentGridComponent extends GridComponent implements OnInit {
    obj: GridData = {
      Exports: [],
      Imports: [],
      Filters: [],
      Actions: [],
      Features: [],
      IsPopup: true,
      UpdatedBy: false,
      HideSearch: true,
      Title: "Thông báo",
      NotKeepPrevData: true,
      HideHeadActions: true,
      HideCustomFilter: true,
      Reference: MOOrdersEntity,
      Size: ModalSizeType.ExtraLarge,
      HidePaging: true,
    };
    historyData: any = [];
    @Input() params: any;
    @Input() filter: { meeyId: string, trans: string[] };

    service: MOOrdersService;

    constructor() {
        super();
        this.service = AppInjector.get(MOOrdersService);
    }
    
    async ngOnInit() {
      let filter = (this.params && this.params["filter"]) || null;
      this.properties = [
        {
          Property: 'MeeyIdText', Title: 'MeeyId', Type: DataType.String,
          Format: (item: any) => {
            return UtilityExHelper.renderIdFormat(0, item.MeeyId, false);
          }
        },
        {
          Property: 'CreateDate', Title: 'Thời gian', Type: DataType.DateTime,
        },
        {
          Property: 'TransactionId', Title: 'Mã giao dịch', Type: DataType.String
        },
        {
          Property: 'PaymentMethod', Title: 'PTTT', Type: DataType.String,
          Format: ((trans: any) =>{
            if (trans.PaymentMethodId != MPPaymentMethodType.OnlineATM) return trans.PaymentMethod

            let text = '<p>' + trans.PaymentMethod + '</p>';
            text += '<p><span style="width: 120px; display: inline-block;"><i class=\'la la-caret-right\'></i> Đối tác: </span><span>' + (trans.PaymentProvider ? trans.PaymentProvider : '') + '</span></p>';
            text += '<p><span style="width: 120px; display: inline-block;"><i class=\'la la-caret-right\'></i> Ngân hàng: </span><span>' + (trans.BankName ? trans.BankName : '') + '</span></p>';
            return text;
          })
        },
        {
          Property: 'StatusText', Title: 'Trạng thái', Type: DataType.String,
          Format: ((item: any) => {
            if (item.Status == null) return ""
            let option: OptionItem = ConstantHelper.MO_ORDER_STATUS_PAYMENT_TYPES.find((c) => c.value == item.Status);
            let text = '<p class="' + (option && option.color) + '">' + (option && option.label) + "</p>";
            return text;
          })
        },
        {
          Property: 'Amount', Title: 'Số tiền (đ)', Type: DataType.String,
          Format: ((item: any) => {
            if(item.Amount) {              
              return item.Amount.toLocaleString("vi-VN", { maximumFractionDigits: 2 })
            }
            return "";
          })
        },
        {
          Property: "PaymentDetail", Title: "Chi tiết", Type: DataType.String,
          Format: (trans: any) => {
            if (trans.PaymentMethodId == MPPaymentMethodType.OnlineATM || trans.PaymentMethodId == MPPaymentMethodType.TransactionReward) return '' 
            let mainMoney = '--', discountBalance1 = '--', discountBalance2 = '--';
            if(!trans.DetailPayment) return "";
            mainMoney = trans.DetailPayment[1] == null ? '--' : trans.DetailPayment[1].toLocaleString("vi-VN", { maximumFractionDigits: 2 }) + ' đ'
            discountBalance1 = trans.DetailPayment[2] == null ? '--' : trans.DetailPayment[2].toLocaleString("vi-VN", { maximumFractionDigits: 2 }) + ' đ'
            discountBalance2 = trans.DetailPayment[3] == null ? '--' : trans.DetailPayment[3].toLocaleString("vi-VN", { maximumFractionDigits: 2 }) + ' đ'
            if(!isNaN(parseInt(mainMoney))){
              mainMoney = parseInt(mainMoney) > 0 ? '-' + mainMoney : mainMoney
            }
            if(!isNaN(parseInt(discountBalance1))){
              discountBalance1 = parseInt(discountBalance1) > 0 ? '-' + discountBalance1 : discountBalance1
            }
            if(!isNaN(parseInt(discountBalance2))){
              discountBalance2 = parseInt(discountBalance2) > 0 ? '-' + discountBalance2 : discountBalance2
            }
            
            let text = '';
            text += '<p style="color: #5867dd;" class="d-flex align-items-center justify-content-between"><span style="width: 120px; display: inline-block;"><i class=\'la la-caret-right\'></i> <b>TK Chính: </span><span>' + mainMoney + '</span></b></p>';
            text += '<p class="d-flex align-items-center justify-content-between"><span style="width: 120px; display: inline-block;"><i class=\'la la-caret-right\'></i> TKKM1: </span><span>' + discountBalance1 + '</span></p>';
            text += '<p class="d-flex align-items-center justify-content-between"><span style="width: 120px; display: inline-block;"><i class=\'la la-caret-right\'></i> TKKM2: </span><span>' + discountBalance2 + '</span></p>';
            return text;
          },
        },
      ]
      if(filter) {
        this.filter = filter
      }
      if(this.filter){
        let filters = [];
        if (this.filter.meeyId) {
          filters.push({
            Name: "MeeyId",
            Value: this.filter.meeyId,
          });
        }
        if (this.filter.trans) {
          filters.push({
            Name: "ids",
            Value: this.filter.trans,
          });
        }
        this.itemData.Filters = filters;
      }
      this.obj.Url = '/admin/moorders/TransGridMeeyIdByIds';
      this.render(this.obj);
    }

}