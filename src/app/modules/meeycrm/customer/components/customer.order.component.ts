import { AppInjector } from "../../../../app.module";
import { Component, Input, OnInit } from "@angular/core";
import { AppConfig } from "../../../../_core/helpers/app.config";
import { GridData } from "../../../../_core/domains/data/grid.data";
import { DataType } from "../../../../_core/domains/enums/data.type";
import { ResultApi } from "../../../../_core/domains/data/result.api";
import { OptionItem } from "../../../../_core/domains/data/option.item";
import { UtilityExHelper } from "../../../../_core/helpers/utility.helper";
import { ConstantHelper } from "../../../../_core/helpers/constant.helper";
import { BaseEntity } from "../../../../_core/domains/entities/base.entity";
import { ModalSizeType } from "../../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../../_core/components/grid/grid.component";
import { MOOrdersService } from "../../../../modules/meeyorder/orders/orders.service";
import { MOOrdersEntity } from "../../../../_core/domains/entities/meeyorder/order.entity";
import { CalculationUnitType } from "../../../../_core/domains/entities/meeyorder/enums/calculation.unit.type";
import { MPPaymentMethodType } from "../../../../_core/domains/entities/meeypay/enums/mp.transaction.status.type";
import { MLPopupViewUserComponent } from "../../../../modules/meeyuser/popup.view.user/popup.view.user.component";

@Component({
  selector: 'mcrm-customer-order',
  templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class MCRMCustomerOrderComponent extends GridComponent implements OnInit {
  obj: GridData = {
    Imports: [],
    Exports: [],
    Filters: [],
    Actions: [],
    Features: [],
    IsPopup: true,
    UpdatedBy: false,
    HideSearch: true,
    NotKeepPrevData: true,
    HideHeadActions: true,
    HideCustomFilter: true,
    Reference: MOOrdersEntity,
    Title: 'Danh sách đơn hàng',
    Size: ModalSizeType.ExtraLarge,
    PageSizes: [5, 10, 20, 50, 100],
    AsynLoad: () => this.asynLoad(),
  };

  listClient = [];
  @Input() id: number;
  orderService: MOOrdersService;

  constructor() {
    super();
    this.orderService = AppInjector.get(MOOrdersService);
  }

  async ngOnInit() {
    this.properties = [
      {
        Property: 'MeeyIdText', Title: 'Id', Type: DataType.String,
        Format: (item: any) => {
          return UtilityExHelper.renderIdFormat(item.Id, item.MeeyId, true);
        }
      },
      {
        Property: 'Code', Title: 'Mã đơn hàng', Type: DataType.String,
        Format: (item: any) => {
          let text = '<p><a routerLink="quickView" type="order">' + item.Code + '</a></p>';
          if (item.Source) {
            text += '<p>' + this.getClientName(item.Source) + '</p>';
          }
          if (item.CreatedDate) {
            text += '<p>' + UtilityExHelper.dateTimeString(item.CreatedDate) + '</p>';
          }
          return text;
        }
      },
      {
        Property: 'UserName', Title: 'Khách hàng', Type: DataType.String,
        Format: ((item: any) => {
          let text: string = '';
          if (!item.User) return ''
          if (item.User.name)
            text += '<p><a routerLink="quickView" type="user">' + UtilityExHelper.escapeHtml(item.User.name) + '</a></p>';
          if (item.User.phone) text += '<p><i class=\'la la-phone\'></i> ' + UtilityExHelper.escapeHtml(item.User.phone) + '</p>';
          if (item.User.email) text += '<p><i class=\'la la-inbox\'></i> ' + UtilityExHelper.escapeHtml(item.User.email) + '</p>';
          if (item.User.username) text += '<p><i class=\'la la-user\'></i> ' + UtilityExHelper.escapeHtml(item.User.username) + '</p>';

          return text;
        })
      },
      {
        Property: "StatusText", Title: "Trạng thái đơn hàng", Type: DataType.String,
        Format: (item: any) => {
          if (item.Status == null) return "";
          let option: OptionItem = ConstantHelper.MO_ORDER_STATUS_TYPES.find((c) => c.value == item.Status);
          let text = '<p class="' + (option && option.color) + '">' + (option && option.label) + "</p>";
          return text;
        },
      },
      {
        Property: "Services", Title: "Dịch vụ", Type: DataType.String,
        Format: (item: any) => {
          if (!item.ProductOrder) return "";
          let text = '';
          let index = 1;
          item.ProductOrder.forEach(p => {
            let combo = false;
            let amount = p.Amount
            if (p.ServiceData) {
              p.ServiceData.forEach(s => {
                let name = s.Name;
                if (s.TypeObject == 2) {
                  name = 'Combo: ' + name
                  text += '<p>' + index + ': ' + name + '</p>'
                  index++;
                  combo = true;
                }
                else {
                  if (!combo) {
                    let unitText = this.getUnitName(s.Unit);
                    text += '<p>' + index + ': ' + name + ' (' + amount + ' ' + unitText + ')</p>'
                    index++;
                  }
                  else {
                    if (s.Product) {
                      let unitText = this.getUnitName(s.Unit);
                      text += '<p> - ' + s.Product.name + ' (' + (amount * s.Amount) + ' ' + unitText + ')</p>'
                    }
                  }
                }
              });
            }
          });
          return text;
        },
      },
      {
        Property: "PriceText", Title: "Số tiền (vnđ)", Type: DataType.String,
        Format: (item: any) => {
          if (!item.Price) return "";

          return item.Price.toLocaleString("vi-VN", { maximumFractionDigits: 2 });
        },
      },
      {
        Property: "PaymentMethod", Title: "Phương thức thanh toán", Type: DataType.String,
        Format: (item: any) => {
          return '<div class="kt-spinner kt-spinner--v2 kt-spinner--primary"></div>';
        },
      },
      {
        Property: "SaleText", Title: "NV chăm sóc", Type: DataType.String,
        Format: (item: any) => {
          if (!item.Sale) return "";
          let text = '<p>Sale: ' + (item.Sale.sale_email ? item.Sale.sale_email : '') + '</p>'
            + '<p>CSKH: ' + (item.Sale.support_email ? item.Sale.support_email : '') + '</p>'
          return text;
        },
      },
    ]

    await this.orderService.getClient().then((result: ResultApi) => {
      if (ResultApi.IsSuccess(result) && result.Object) {
        this.listClient = result.Object
      }
    });

    if (this.id) {
      this.obj.Url = '/admin/MOOrders/ItemsByCustomer/' + this.id;
    }
    this.render(this.obj);
  }

  asynLoad() {
    let ids = this.items && this.items.filter(c => c['OrderHistory'] && c['OrderHistory']['transaction_id']).map(c => c['MeeyId'] + '_' + c['OrderHistory']['transaction_id']);

    if (ids && ids.length > 0) {
      this.orderService.TransByIds(ids).then((result: ResultApi) => {
        if (ResultApi.IsSuccess(result)) {
          this.items.forEach((item: any) => {
            let trans = result.Object && result.Object.find(c => c.TransactionId == item.OrderHistory?.transaction_id);
            if (trans) {
              if (trans.PaymentMethodId == MPPaymentMethodType.OnlineATM) {
                let text = '<p>' + trans.PaymentMethod + '</p>';
                text += '<p><span style="width: 120px; display: inline-block;"><i class=\'la la-caret-right\'></i> Đối tác: </span><span>' + (trans.PaymentProvider ? trans.PaymentProvider : '') + '</span></p>';
                text += '<p><span style="width: 120px; display: inline-block;"><i class=\'la la-caret-right\'></i> Ngân hàng: </span><span>' + (trans.BankName ? trans.BankName : '') + '</span></p>';
                item['PaymentMethod'] = text;
              } else {
                let mainMoney = '--', discountBalance1 = '--', discountBalance2 = '--';
                if (trans.DetailPayment) {
                  mainMoney = trans.DetailPayment[1] == null ? '--' : trans.DetailPayment[1].toLocaleString("vi-VN", { maximumFractionDigits: 2 }) + ' đ'
                  discountBalance1 = trans.DetailPayment[2] == null ? '--' : trans.DetailPayment[2].toLocaleString("vi-VN", { maximumFractionDigits: 2 }) + ' đ'
                  discountBalance2 = trans.DetailPayment[3] == null ? '--' : trans.DetailPayment[3].toLocaleString("vi-VN", { maximumFractionDigits: 2 }) + ' đ'
                }
                if (!isNaN(parseInt(mainMoney))) {
                  mainMoney = parseInt(mainMoney) > 0 ? '-' + mainMoney : mainMoney
                }
                if (!isNaN(parseInt(discountBalance1))) {
                  discountBalance1 = parseInt(discountBalance1) > 0 ? '-' + discountBalance1 : discountBalance1
                }
                if (!isNaN(parseInt(discountBalance2))) {
                  discountBalance2 = parseInt(discountBalance2) > 0 ? '-' + discountBalance2 : discountBalance2
                }

                let text = '<p>' + trans.PaymentMethod + ': <b style="color: #5867dd;">' + UtilityExHelper.escapeHtml(trans.PhoneNumber) + '</b></p>';
                text += '<p class="d-flex align-items-center justify-content-between"><span style="width: 120px; display: inline-block;"><i class=\'la la-caret-right\'></i> TK Chính: </span><span>' + mainMoney + '</span></p>';
                text += '<p class="d-flex align-items-center justify-content-between"><span style="width: 120px; display: inline-block;"><i class=\'la la-caret-right\'></i> TKKM1: </span><span>' + discountBalance1 + '</span></p>';
                text += '<p class="d-flex align-items-center justify-content-between"><span style="width: 120px; display: inline-block;"><i class=\'la la-caret-right\'></i> TKKM2: </span><span>' + discountBalance2 + '</span></p>';
                item['PaymentMethod'] = text;
              }
            } else {
              item['PaymentMethod'] = "";
            }
          })
        }
      });
    } else {
      this.items.map(c => { c['PaymentMethod'] = ""; return c });
    }
  }

  quickView(item: BaseEntity, type: string) {
    let originalItem = this.originalItems.find(c => c.Id == item.Id);
    if (originalItem) {
      switch (type) {
        case 'user': this.quickViewUser(item); break;
        case 'view': this.quickViewOrder(item.Id); break;
        case 'order': this.quickViewOrder(item.Id); break;
      }
    }
  }

  private quickViewUser(item: any) {
    this.dialogService.WapperAsync({
      cancelText: 'Đóng',
      size: ModalSizeType.Large,
      object: MLPopupViewUserComponent,
      title: 'Xem thông tin người dùng',
      objectExtra: {
        email: item.User.email,
        phone: item.User.phone,
      }
    });
  }
  private quickViewOrder(id: number) {
    if (id) {
      let url = AppConfig.getProtocol() + '//' + AppConfig.getDomain() + '/admin/moorders/view-detail?id=' + id;
      window.open(url, "_blank");
    } else this.dialogService.Alert('Thông báo', 'Mã dịch vụ không tồn tại, vui lòng thử lại sau');
  }
  private getClientName(code: string) {
    if (this.listClient) {
      let client = this.listClient.find(c => c.ClientId == code)
      if (client) {
        return client.Name
      }
    }

    return code
  }
  private getUnitName(unitName: string) {
    let keys = Object.keys(CalculationUnitType).find(x => CalculationUnitType[x] == unitName);
    if (keys) {
      return UtilityExHelper.createLabel(keys)
    }
    return unitName;
  }
}