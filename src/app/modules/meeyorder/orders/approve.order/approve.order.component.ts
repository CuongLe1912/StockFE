import { Router } from "@angular/router";
import { AppInjector } from "../../../../app.module";
import { MOOrdersService } from "../orders.service";
import { AppConfig } from "../../../../_core/helpers/app.config";
import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { ResultApi } from "../../../../_core/domains/data/result.api";
import { EntityHelper } from "../../../../_core/helpers/entity.helper";
import { ToastrHelper } from "../../../../_core/helpers/toastr.helper";
import { ActionData } from "../../../../_core/domains/data/action.data";
import { OptionItem } from "../../../../_core/domains/data/option.item";
import { LookupData } from "../../../../_core/domains/data/lookup.data";
import { ActionType } from "../../../../_core/domains/enums/action.type";
import { MLUserService } from "../../../../modules/meeyuser/user.service";
import { ConstantHelper } from "../../../../_core/helpers/constant.helper";
import { UtilityExHelper } from "../../../../_core/helpers/utility.helper";
import { ModalSizeType } from "../../../../_core/domains/enums/modal.size.type";
import { AdminAuthService } from "../../../../_core/services/admin.auth.service";
import { EditComponent } from "../../../../_core/components/edit/edit.component";
import { MLArticleService } from "../../../../modules/meeyarticle/article.service";
import { AdminDialogService } from "../../../../_core/services/admin.dialog.service";
import { NavigationStateData } from "../../../../_core/domains/data/navigation.state";
import { MOOrderServiceGridComponent } from "../components/order.service.grid.component";
import { MOOrderHistoryGridComponent } from "../components/order.history.grid.component";
import { MLUserEntity } from "../../../../_core/domains/entities/meeyland/ml.user.entity";
import { MOOrdersEntity } from "../../../../_core/domains/entities/meeyorder/order.entity";
import { MLPartnerEntity } from "../../../../_core/domains/entities/meeyland/ml.partner.entity";
import { MOServicesEntity } from "../../../../_core/domains/entities/meeyorder/services.entity";
import { MOTransactionRewardService } from "../../transaction.reward/transactionreward.service";
import { MOOrderApproveRejectComponent } from "../components/order.approve/order.approve.component";
import { PriceConfigEntity } from "../../../../_core/domains/entities/meeyorder/price.config.entity";
import { MOOrderStatusType } from "../../../../_core/domains/entities/meeyorder/enums/order.status.type";
import { MPPaymentMethodType } from "../../../../_core/domains/entities/meeypay/enums/mp.transaction.status.type";

@Component({
  templateUrl: "./approve.order.component.html",
  styleUrls: ["./approve.order.component.scss"],
})
export class MOApproveOrderComponent extends EditComponent implements OnInit {
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
  userBalance: MLUserEntity;
  listService: MOServicesEntity[] = [];
  listCombo: MOServicesEntity[] = [];
  userOrder: any;
  combo: boolean;
  buyService: boolean;
  //Service
  service: MOOrdersService;
  userService: MLUserService;
  articleService: MLArticleService;
  authen: AdminAuthService;
  dialog: AdminDialogService;
  serviceTransactionReward: MOTransactionRewardService

  paymentMethod = '<div class="kt-spinner kt-spinner--v2 kt-spinner--primary"></div>';
  statusPayment = '<div class="kt-spinner kt-spinner--v2 kt-spinner--primary"></div>'
  statusOrder = ''
  tab: string = 'services';
  PaymentHistory: any;
  TransactionId = '';
  serviceType = 'Đơn lẻ'
  comboName = ''
  listAffiliate = [];
  comboAmount: number = 0;
  //Error message
  errorMesssageUser: string;
  successMesssageUser: string;
  errorMesssageTransaction : string;
  successMesssageTransaction : string;
  //Tài khoản ưu đãi
  itemTransactionReward: any;
  itemTransactionRewardNumb: any;
  //paymentMethodType
  transactionRewardType : MPPaymentMethodType = MPPaymentMethodType.TransactionReward
  meeyPayAccountType : MPPaymentMethodType = MPPaymentMethodType.MeeyPayAccount

  constructor() {
    super();
    this.router = AppInjector.get(Router);
    this.service = AppInjector.get(MOOrdersService);
    this.userService = AppInjector.get(MLUserService);
    this.articleService = AppInjector.get(MLArticleService);
    this.authen = AppInjector.get(AdminAuthService);
    this.dialog = AppInjector.get(AdminDialogService);
    this.serviceTransactionReward = AppInjector.get(MOTransactionRewardService);
    this.state = this.getUrlState();
  }

  async ngOnInit() {
    this.id = this.params && this.params["id"];
    if (this.router?.routerState?.snapshot?.root?.queryParams["id"]) {
      this.id = this.router?.routerState?.snapshot?.root?.queryParams["id"]
    }
    if (this.state) {
      this.id = this.id || this.state.id;
      this.addBreadcrumb("Kiểm duyệt đơn hàng");
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
          this.PaymentHistory = result.Object.PaymentHistory
          if (this.item.Status != null) {
            let option: OptionItem = ConstantHelper.MO_ORDER_STATUS_TYPES.find((c) => c.value == this.item.Status);
            this.statusOrder = '<p class="' + (option && option.color) + '">' + (option && option.label) + "</p>";

            if (this.item.Status != MOOrderStatusType.WAIT_CONFIRM) {
              let obj: NavigationStateData = {
                prevUrl: "/admin/moorders",
              };
              this.router.navigate(["/admin/moorders"], {
                state: { params: JSON.stringify(obj) },
              });
            }
          } else {
            let obj: NavigationStateData = {
              prevUrl: "/admin/moorders",
            };
            this.router.navigate(["/admin/moorders"], {
              state: { params: JSON.stringify(obj) },
            });
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
            this.comboName = this.listCombo.filter(c => c.Name).map(c => c.Name).join(', ')
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

      await this.checkUser();
      if (this.userBalance) {
        this.checkBalance()
      }
    }
  }

  private async renderActions() {
    let actions: ActionData[] = [
      ActionData.back(() => {
        this.back();
      }),
      {
        name: 'Từ chối',
        icon: 'la la-ban',
        systemName: ActionType.ApproveOrder,
        className: 'btn btn-danger',
        click: () => this.Reject()
      },
      {
        name: 'Duyệt',
        icon: 'la la-check',
        systemName: ActionType.ApproveOrder,
        className: 'btn btn-success',
        processButton: true,
        click: () => this.Approve()
      },
    ];
    this.actions = await this.authen.actionsAllow(MOOrdersEntity, actions);
  }

  async Approve() {
    this.processing = true;
    var checkUser = await this.checkUser()
    if (checkUser) {
      if(this.item.PaymentMethodId == MPPaymentMethodType.TransactionReward){
        if (this.CheckBalanceTransactionReward()) {
          this.dialogService.WapperAsync({
            cancelText: 'Hủy bỏ',
            confirmText: 'Xác nhận',
            size: ModalSizeType.Medium,
            objectExtra: {
              id: this.item.Id,
              meeyId: this.item.MeeyId,
              action: 'approve',
              paymentProviderId : 15
            },
            title: 'Xác nhận duyệt giao dịch',
            object: MOOrderApproveRejectComponent,
          }, async () => this.viewDetail(this.item));
        } 
        else {
          ToastrHelper.Error("Số dư khách hàng không đủ để thanh toán. Vui lòng báo khách hàng nạp tiền");
        }  
      }else if(this.item.PaymentMethodId == MPPaymentMethodType.MeeyPayAccount){
        if (this.checkBalance()) {
          this.dialogService.WapperAsync({
            cancelText: 'Hủy bỏ',
            confirmText: 'Xác nhận',
            size: ModalSizeType.Medium,
            objectExtra: {
              id: this.item.Id,
              meeyId: this.item.MeeyId,
              action: 'approve',
              paymentProviderId: 1
            },
            title: 'Xác nhận duyệt giao dịch',
            object: MOOrderApproveRejectComponent,
          }, async () => this.viewDetail(this.item));
        } 
        else {
          ToastrHelper.Error("Số dư khách hàng không đủ để thanh toán. Vui lòng báo khách hàng nạp tiền");
        }  
      }
          
    } 
    else {
      ToastrHelper.Error('Trạng thái tài khoản MeeyID không hợp lệ. Vui lòng kiểm tra lại khách hàng');
    }    
    this.processing = false;
  }

  Reject() {
    this.dialogService.WapperAsync({
      cancelText: 'Hủy bỏ',
      confirmText: 'Xác nhận',
      size: ModalSizeType.Medium,
      objectExtra: {
        id: this.item.Id,
        meeyId: this.item.MeeyId,
        action: 'reject'
      },
      title: 'Xác nhận từ chối giao dịch',
      object: MOOrderApproveRejectComponent,
    }, async () => this.viewDetail(this.item));
  }

  viewDetail(item: MOOrdersEntity) {
    let obj: NavigationStateData = {
      id: item.Id,
      prevUrl: "/admin/moorders",
    };
    this.router.navigate(["/admin/moorders/view-detail"], {
      state: { params: JSON.stringify(obj) },
    });
  }

  private async loadWallet() {
    if (this.item && this.item.MeeyId) {
      if(this.item.PaymentMethodId == MPPaymentMethodType.MeeyPayAccount){
        await this.userService.itemByMeeyId(this.item.MeeyId).then(async (result: ResultApi) => {
          if (ResultApi.IsSuccess(result)) {
            this.userBalance = EntityHelper.createEntity(MLUserEntity, result.Object);
            let mainMoney = '--', discountBalance1 = '--', discountBalance2 = '--';
            if (this.userBalance.MPConnected) {
              mainMoney = this.userBalance.Balance == null ? '--' : this.userBalance.Balance.toLocaleString("vi-VN", { maximumFractionDigits: 2 }) + ' đ'
              discountBalance1 = this.userBalance.DiscountBalance1 == null ? '--' : this.userBalance.DiscountBalance1.toLocaleString("vi-VN", { maximumFractionDigits: 2 }) + ' đ'
              discountBalance2 = this.userBalance.DiscountBalance2 == null ? '--' : this.userBalance.DiscountBalance2.toLocaleString("vi-VN", { maximumFractionDigits: 2 }) + ' đ'
            }
            let text = '<p>SĐT Meey Pay: <b style="color: #5867dd;">' + this.userBalance.MPPhone + '</b></p>';
            text += '<p class="d-flex align-items-center justify-content-between"><span style="width: 120px; display: inline-block;"><i class=\'la la-caret-right\'></i> TK Chính: </span><span>' + mainMoney + '</span></p>';
            text += '<p class="d-flex align-items-center justify-content-between"><span style="width: 120px; display: inline-block;"><i class=\'la la-caret-right\'></i> TKKM1: </span><span>' + discountBalance1 + '</span></p>';
            text += '<p class="d-flex align-items-center justify-content-between"><span style="width: 120px; display: inline-block;"><i class=\'la la-caret-right\'></i> TKKM2: </span><span>' + discountBalance2 + '</span></p>';
            this.paymentMethod = text;
            this.checkBalance()
          } else {
            this.paymentMethod = '';
          }
        });
      }else if(this.item.PaymentMethodId == MPPaymentMethodType.TransactionReward){
        await this.getTransactionReward(this.item.MeeyId);
        let text = '<p>Tài khoản ưu đãi</p>';
        // text += '<p class="d-flex align-items-center justify-content-between"><span style="width: 120px; display: inline-block;"><i class=\'la la-caret-right\'></i> Số dư TK ưu đãi: </span><span>' + this.itemTransactionReward + '</span></p>';
        this.paymentMethod = text;
      }
      
    }
  }
  async getTransactionReward(id:string){
    if (id) {
        await this.serviceTransactionReward.getNumbUserWalletTransactionReward(id).then((result: ResultApi) => {
            if (ResultApi.IsSuccess(result)) {             
              this.itemTransactionRewardNumb = result.Object ? result.Object?.available : 0
              this.itemTransactionReward = result.Object?.available ? result.Object?.available.toLocaleString("vi-VN", { maximumFractionDigits: 2 }) + ' đ' : 0
            } else {
              this.itemTransactionRewardNumb = 0
              ToastrHelper.ErrorResult(result);
            }
        });
    }
  }
  private checkBalance(): boolean {
    this.errorMesssageUser = null;
    this.successMesssageUser = null;
    const user = this.userBalance
    if (user) {
      let balance = user.Balance || 0;
      let codeAds = false

      this.listService.forEach(s => {
        if (s.Code && s.Code.toLowerCase() === 'ads') {
          codeAds = true;
        }
      })

      if (!codeAds) {
        if (user.DiscountBalance1) balance += user.DiscountBalance1;
        if (user.DiscountBalance2) balance += user.DiscountBalance2;
      }
      if (user.MPConnected) {
        const price = UtilityExHelper.formatStringtoNumber(this.item.Price)
        if (balance < price) {
          if (codeAds) this.errorMesssageUser = 'TK Chính không đủ số dư, không thể tiếp tục thanh toán';
          else this.errorMesssageUser = 'Tài khoản không đủ số dư, không thể tiếp tục thanh toán';
        }
        else {
          this.successMesssageUser = 'Đủ số dư'
          return true
        }
      } else this.errorMesssageUser = 'Chưa liên kết Meey Pay';
    }

    return false;
  }
  private CheckBalanceTransactionReward(): boolean{
    this.errorMesssageTransaction = null;
    this.successMesssageTransaction = null;
    let balance = this.itemTransactionRewardNumb || 0;
    const price = UtilityExHelper.formatStringtoNumber(this.item.Price)
    if (balance < price) {
      this.errorMesssageTransaction = 'Tài khoản không đủ số dư';
      return false;
    }
    else {
      this.successMesssageTransaction = 'Đủ số dư'
      return true
    }
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

  async checkUser(): Promise<boolean> {
    var result =  await this.articleService.findUseerByPhoneOrEmail(this.item.MeeyId)
    if (ResultApi.IsSuccess(result)) {
      let obj = result.Object;
      if (obj) {
        await this.loadWallet()
        if(this.item.PaymentMethodId == MPPaymentMethodType.TransactionReward){
          return true;
        }
        return this.userBalance != null
      }
    } else {
      this.paymentMethod = '';
      this.errorMesssageUser = result && result.Description;
    }
      return false;
    
  }

  getCreateBy() {
    if (this.item.CreatedBy == null) return "Khách hàng"
    if (this.item.CreatedBy.includes('@')) return this.item.CreatedBy
    let option: OptionItem = ConstantHelper.MO_ORDER_AUTHOR_STATUS_TYPES.find((c) => c.value == this.item.CreatedBy);
    let text = '<p class="' + (option && option.color) + '">' + (option && option.label) + "</p>";
    return text;
  }
}
