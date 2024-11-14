import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { AppInjector } from "../../../../app.module";
import { EditComponent } from "../../../../_core/components/edit/edit.component";
import { ActionData } from "../../../../_core/domains/data/action.data";
import { NavigationStateData } from "../../../../_core/domains/data/navigation.state";
import { MOServicesEntity } from "../../../../_core/domains/entities/meeyorder/services.entity";
import { AdminAuthService } from "../../../../_core/services/admin.auth.service";
import { AdminDialogService } from "../../../../_core/services/admin.dialog.service";
import { ResultApi } from "../../../../_core/domains/data/result.api";
import { MOOrdersEntity } from "../../../../_core/domains/entities/meeyorder/order.entity";
import { MOOrdersService } from "../orders.service";
import { ConstantHelper } from "../../../../_core/helpers/constant.helper";
import { OptionItem } from "../../../../_core/domains/data/option.item";
import { MOOrderServiceGridComponent } from "../components/order.service.grid.component";
import { MOOrderStatusPaymentType } from "../../../../_core/domains/entities/meeyorder/enums/order.status.type";
import { ModalSizeType } from "../../../../_core/domains/enums/modal.size.type";
import { MOOrderHistoryGridComponent } from "../components/order.history.grid.component";
import { PriceConfigEntity } from "../../../../_core/domains/entities/meeyorder/price.config.entity";
import { MPPaymentMethodType } from "../../../../_core/domains/entities/meeypay/enums/mp.transaction.status.type";
import { EntityHelper } from "../../../../_core/helpers/entity.helper";
import { AppConfig } from "../../../../_core/helpers/app.config";
import { LookupData } from "../../../../_core/domains/data/lookup.data";
import { MLPartnerEntity } from "../../../../_core/domains/entities/meeyland/ml.partner.entity";

@Component({
  templateUrl: "./view.detail.component.html",
  styleUrls: ["./view.detail.component.scss"],
})
export class MOOrderDetailComponent extends EditComponent implements OnInit {
  @ViewChild('serviceGrid') serviceGridComponent: MOOrderServiceGridComponent;
  @Input() params: any;
  actions: ActionData[] = [];

  loading: boolean = true;
  loadingService: boolean = true;
  loadingHistory: boolean = true;
  loadingTransaction: boolean = true;

  id: number;
  router: Router;
  state: NavigationStateData;
  item: MOOrdersEntity = new MOOrdersEntity();
  listService: MOServicesEntity[] = [];
  listCombo: MOServicesEntity[] = [];
  userOrder: any;
  couponOder: any;
  combo: boolean;
  buyService: boolean;

  service: MOOrdersService;
  authen: AdminAuthService;
  dialog: AdminDialogService;

  paymentMethod = '<div class="kt-spinner kt-spinner--v2 kt-spinner--primary"></div>';
  statusPayment = '<div class="kt-spinner kt-spinner--v2 kt-spinner--primary"></div>'
  statusOrder = ''
  tab: string = 'services';
  PaymentHistory: any;
  TransactionId = '';
  serviceType = 'Đơn lẻ'
  comboName = ''
  filterTrans: any = {};
  isOrderAdmin = false;
  listAffiliate = [];
  comboAmount: number = 0;

  constructor() {
    super();
    this.router = AppInjector.get(Router);
    this.service = AppInjector.get(MOOrdersService);
    this.authen = AppInjector.get(AdminAuthService);
    this.dialog = AppInjector.get(AdminDialogService);
    this.state = this.getUrlState();
  }

  async ngOnInit() {
    this.id = this.params && this.params["id"];
    if (this.router?.routerState?.snapshot?.root?.queryParams["id"]) {
      this.id = this.router?.routerState?.snapshot?.root?.queryParams["id"]
    }
    if (this.state) {
      this.id = this.id || this.state.id;
      this.addBreadcrumb("Xem chi tiết");
    }
    await this.loadItem();
    this.renderActions();
    this.loading = false;
  }

  private async loadItem() {
    if (this.id) {
      await this.service.item("moorders", this.id).then((result: ResultApi) => {
        if (ResultApi.IsSuccess(result)) {
          this.item = result.Object
          this.userOrder = result.Object.User
          this.couponOder = result.Object.Coupon
          this.PaymentHistory = result.Object.PaymentHistory
          this.filterTrans.meeyId = result.Object.MeeyId
          if (this.item.Status != null) {
            let option: OptionItem = ConstantHelper.MO_ORDER_STATUS_TYPES.find((c) => c.value == this.item.Status);
            this.statusOrder = '<p class="' + (option && option.color) + '">' + (option && option.label) + "</p>";
          }
          if (result.Object.ProductOrder) {
            result.Object.ProductOrder.forEach(p => {
              let combo = false;
              if (p.ServiceData) {
                p.ServiceData.forEach(s => {
                  if (s.TypeObject == 2) {
                    s.Amount = p.Amount
                    this.listCombo.push(s)
                    combo = true;
                    this.combo = true;
                  }
                  else {
                    if (!combo) {
                      this.buyService = true
                      s.Amount = p.Amount
                      s.ProductId = p.Id
                      s.UseStatus = p.UseStatus
                      s.UseProcess = p.UseProcess
                      s.PriceConfig.PriceDiscount = s.PriceConfig.PriceDiscount * s.Amount
                      this.listService.push(s)
                    }
                    else {
                      if (s.Product && s.PriceProductCombo) {
                        let comboService = this.listCombo.find(c => c.Id == s.ComboId);
                        const product = s.Product
                        const price = s.PriceProductCombo
                        s.Name = product.name
                        s.Code = product.code
                        s.Id = product.id
                        s.ProductId = p.Id
                        s.UseStatus = p.UseStatus
                        s.UseProcess = p.UseProcess
                        s.GroupId = product.group_id
                        s.PriceConfig = new PriceConfigEntity()
                        s.PriceConfig.PriceRoot = price.price_root
                        s.PriceConfig.Discount = price.discount
                        s.PriceConfig.DiscountType = price.discountType
                        s.PriceConfig.PriceDiscount = price.price_discount
                        if (comboService && comboService['Amount']) {
                          let amountCombo = comboService['Amount']
                          s.Amount = s.Amount * amountCombo;
                        }
                        this.listService.push(s)
                      }
                    }
                  }
                });
              }
            });
            if (result.Object.ProductOrder.length > 0) {
              this.comboAmount = result.Object.ProductOrder[0].Amount;
            }
          }
          if (this.combo && this.listCombo.length > 0) {
            this.comboName = this.listCombo.map(c => c.Name).join(', ');
          }
          if (this.combo && this.buyService) {
            this.serviceType = 'Hỗn hợp'
          } else if (this.combo) {
            this.serviceType = 'Combo'
          }
        }
      });
      await this.service.lookup(LookupData.Reference(MLPartnerEntity).url, ["Name", "Id"]).then((result: ResultApi) => {
        if (ResultApi.IsSuccess(result)) {
          if (result.Object)
            this.listAffiliate = result.Object
        }
      });
      await this.service.PaymentHistory(this.id).then((result: ResultApi) => {
        if (ResultApi.IsSuccess(result)) {
          if (result.Object)
            this.filterTrans.trans = result.Object.filter(c => c.transaction_id).map(c => c.transaction_id)
        }
      });
      if (this.PaymentHistory && this.PaymentHistory.transaction_id) {
        this.loadTransaction(this.item.MeeyId, this.PaymentHistory)
      }
      else {
        this.paymentMethod = ''
        if (this.item.PaymentMethodId == null) {
          this.paymentMethod = "";
        } else {
          let option: OptionItem = ConstantHelper.MP_PAYMENT_METHOD_TYPES.find((c) => c.value == this.item.PaymentMethodId);
          let text = '<p class="' + (option && option.color) + '">' + (option && option.label) + "</p>";
          this.paymentMethod = text;
        }
        this.setStatusPayment(MOOrderStatusPaymentType.NEW)
      }
    }
  }

  public async confirmAndBack() {
    await this.confirm(() => {
      this.back();
    });
  }

  private async renderActions() {
    let actions: ActionData[] = [
      ActionData.back(() => {
        this.back();
      }),
    ];
    this.actions = await this.authen.actionsAllow(MOOrdersEntity, actions);
  }

  public async confirm(complete: () => void): Promise<boolean> {
    if (this.item) {

    } else return false;
  }

  loadTransaction(MeeyId, PaymentHistory) {
    let ids: string[] = []
    if (PaymentHistory.transaction_id) {
      ids.push(PaymentHistory.transaction_id)
      this.TransactionId = PaymentHistory.transaction_id
    }
    if (MeeyId && ids.length > 0) {
      this.service.TransMeeyIdByIds(MeeyId, ids).then((result: ResultApi) => {
        if (ResultApi.IsSuccess(result) && result.Object) {
          let trans = result.Object && result.Object.find(c => c.TransactionId == PaymentHistory.transaction_id);
          if (trans) {
            if(trans.PaymentMethodId == MPPaymentMethodType.TransactionReward){
              let text = '<p>' + 'Tài khoản ưu đãi' + '</p>';
              this.paymentMethod = text;
            }
            else if (trans.PaymentMethodId == MPPaymentMethodType.OnlineATM || trans.PaymentMethodId == MPPaymentMethodType.Card) {
              let text = '<p>' + trans.PaymentMethod + '</p>';
              text += '<p><span style="width: 60px; display: inline-block;"><i class=\'la la-caret-right\'></i> Đối tác: </span><span>' + (trans.PaymentProvider ? trans.PaymentProvider : '') + '</span></p>';
              text += '<p><span style="width: 60px; display: inline-block;"><i class=\'la la-caret-right\'></i> Ngân hàng: </span><span>' + (trans.BankName ? trans.BankName : '') + '</span></p>';
              this.paymentMethod = text;
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

              let text = '<p>' + trans.PaymentMethod + ': <b style="color: #5867dd;">' + trans.PhoneNumber + '</b></p>';
              text += '<p class="d-flex align-items-center justify-content-between"><span style="width: 120px; display: inline-block;"><i class=\'la la-caret-right\'></i> TK Chính: </span><span>' + mainMoney + '</span></p>';
              text += '<p class="d-flex align-items-center justify-content-between"><span style="width: 120px; display: inline-block;"><i class=\'la la-caret-right\'></i> TKKM1: </span><span>' + discountBalance1 + '</span></p>';
              text += '<p class="d-flex align-items-center justify-content-between"><span style="width: 120px; display: inline-block;"><i class=\'la la-caret-right\'></i> TKKM2: </span><span>' + discountBalance2 + '</span></p>';
              this.paymentMethod = text;
            }
            if (trans.Status == null) {
              this.setStatusPayment(MOOrderStatusPaymentType.NEW)
            }
            else {
              this.setStatusPayment(trans.Status)
            }
          } else {
            this.paymentMethod = "";
            this.setStatusPayment(null)
          }
        } else {
          this.paymentMethod = "";
          this.setStatusPayment(null)
        }
      });
    }
  }

  setStatusPayment(statusPayment) {
    if (statusPayment) {
      let option: OptionItem = ConstantHelper.MO_ORDER_STATUS_PAYMENT_TYPES.find((c) => c.value == statusPayment);
      this.statusPayment = '<p class="' + (option && option.color) + '">' + (option && option.label) + "</p>";
    }
    else this.statusPayment = "";
  }

  selectedTab(tab: string) {
    this.tab = tab;
  }

  popupHistory() {
    this.dialogService.WapperAsync({
      cancelText: "Đóng",
      title: "Lịch sử đơn hàng",
      object: MOOrderHistoryGridComponent,
      size: ModalSizeType.ExtraLarge,
      objectExtra: {
        orderId: this.id,
      },
    });
  }

  quickView(type: string) {
    if (!type || type == 'view') {
      // this.view(item);
    }
    else if (!type || type == 'user') {
      let obj: NavigationStateData = {
        id: this.item.UserId,
        prevUrl: '/admin/mluser',
      };
      const link = this.router.serializeUrl(
        this.router.createUrlTree(["/admin/mluser/view"], { state: { params: JSON.stringify(obj) }, })
      );
      window.open(link, '_blank');
    }
    else {
      return false;
    }
  }

  viewUser(meeyId: string) {
    let obj: NavigationStateData = {
      prevUrl: '/admin/mluser',
    };
    let url = AppConfig.getProtocol() + '//' + AppConfig.getDomain() + '/admin/mluser/view?meeyId=' + meeyId;
    this.setUrlState(obj, 'mluser');
    window.open(url, "_blank");
  }

  getAffiliateName(AffiliateId) {
    if (!AffiliateId) return ''
    if (this.listAffiliate && this.listAffiliate.length > 0) {
      let affiliate = this.listAffiliate.find(f => f.Id == AffiliateId)
      if (affiliate) {
        return affiliate.Name
      }
    }
    return AffiliateId
  }

  getCreateBy() {
    if (this.item.CreatedBy == null) return "Khách hàng"
    if (this.item.CreatedBy.includes('@')) return this.item.CreatedBy
    let option: OptionItem = ConstantHelper.MO_ORDER_AUTHOR_STATUS_TYPES.find((c) => c.value == this.item.CreatedBy);
    let text = '<p class="' + (option && option.color) + '">' + (option && option.label) + "</p>";
    return text;
  }
}
