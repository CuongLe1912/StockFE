import { Router } from '@angular/router';
import { MOOrdersService } from '../orders.service';
import { AppInjector } from '../../../../app.module';
import { Component, Input, OnInit } from '@angular/core';
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { OptionItem } from '../../../../_core/domains/data/option.item';
import { ActionData } from '../../../../_core/domains/data/action.data';
import { ActionType } from '../../../../_core/domains/enums/action.type';
import { MLUserService } from '../../../../modules/meeyuser/user.service';
import { UtilityExHelper } from '../../../../_core/helpers/utility.helper';
import { MeeyCrmService } from '../../../../modules/meeycrm/meeycrm.service';
import { DecoratorHelper } from '../../../../_core/helpers/decorator.helper';
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { AdminAuthService } from '../../../../_core/services/admin.auth.service';
import { MLArticleService } from '../../../../modules/meeyarticle/article.service';
import { AdminEventService } from '../../../../_core/services/admin.event.service';
import { AdminDialogService } from '../../../../_core/services/admin.dialog.service';
import { NavigationStateData } from '../../../../_core/domains/data/navigation.state';
import { MLUserEntity } from '../../../../_core/domains/entities/meeyland/ml.user.entity';
import { MOOrdersEntity } from '../../../../_core/domains/entities/meeyorder/order.entity';
import { MOOrderCreateEntity } from '../../../../_core/domains/entities/meeyorder/order.create.entity';
import { MPPaymentMethodType } from '../../../../_core/domains/entities/meeypay/enums/mp.transaction.status.type';
import { MOTransactionRewardService } from '../../transaction.reward/transactionreward.service';

@Component({
  templateUrl: "./add.order.component.html",
  styleUrls: ["./add.order.component.scss"],
})
export class MOAddOrderComponent extends EditComponent implements OnInit {
  @Input() params: any;
  actions: ActionData[] = [];

  loading: boolean = true;
  loadingService: boolean = true;
  loadingHistory: boolean = true;
  loadingTransaction: boolean = true;

  id: number;
  crmData: any;
  crmIds: number;
  router: Router;
  state: NavigationStateData;
  item: MOOrderCreateEntity = new MOOrderCreateEntity();
  userBalance: MLUserEntity;
  listService: any;
  serviceOption: OptionItem[];

  service: MOOrdersService;
  crmService: MeeyCrmService;
  authen: AdminAuthService;
  dialog: AdminDialogService;

  articleService: MLArticleService;
  eventService: AdminEventService;
  userService: MLUserService;
  serviceTransactionReward: MOTransactionRewardService;
  errorMesssageUser: string;
  successMesssageUser: string;
  errorMesssageTransaction: string;
  successMesssageTransaction: string;
  loadingUserBalance = false;
  itemTransactionReward: any;
  itemTransactionRewardNumb: any;
  transactionRewardType : MPPaymentMethodType;
  meeyPayAccountType : MPPaymentMethodType;
  showUserTransactionReward : boolean = false;
  meeymapServiceId : number[] = [];
  constructor() {
    super();
    this.router = AppInjector.get(Router);
    this.service = AppInjector.get(MOOrdersService);
    this.crmService = AppInjector.get(MeeyCrmService);
    this.authen = AppInjector.get(AdminAuthService);
    this.dialog = AppInjector.get(AdminDialogService);
    this.state = this.getUrlState();
    this.eventService = AppInjector.get(AdminEventService);
    this.articleService = AppInjector.get(MLArticleService);
    this.userService = AppInjector.get(MLUserService);
    this.serviceTransactionReward = AppInjector.get(MOTransactionRewardService);
  }

  ngOnInit() {
    this.id = this.params && this.params["id"];
    if (this.state) {
      this.id = this.id || this.state.id;
      this.addBreadcrumb("Tạo đơn hàng");
    }
    this.renderActions();
    this.loadItems();
    this.item.PaymentMethod = MPPaymentMethodType.MeeyPayAccount
    this.loading = false;
    this.transactionRewardType = MPPaymentMethodType.TransactionReward
    this.meeyPayAccountType = MPPaymentMethodType.MeeyPayAccount
  }

  loadItems() {
    this.service.ServiceForAdmin().then((result: ResultApi) => {
      if (ResultApi.IsSuccess(result)) {
        this.listService = result.Object;
        this.serviceOption = [];
        this.listService.forEach(service => {
          let option: OptionItem = {
            label: service.Name,
            value: service.Id,
            icon: null,
          };
          this.serviceOption.push(option);
        });
      }
    })
  }

  public async confirmAndBack() {
    await this.confirm(() => {
      this.back();
    });
  }

  async getGroupService(providerId){
    const result = await this.service.GetGroupService(providerId)
    this.meeymapServiceId = result.Object.map(x => x.Id);
  }

  async validServiceMeeyMap(){
    //Get service meeymap , providerId = 2 là dịch vụ của meeymap 
    await this.getGroupService(2)
    if(this.item.PaymentMethod == MPPaymentMethodType.TransactionReward){
      let groupId = this.listService.find(c => c.Id == this.item.ServiceId).GroupId 
      if(this.meeymapServiceId.includes(groupId)){
        return true;
      }
      else{
        ToastrHelper.Error("TK ưu đãi chỉ mua dịch vụ thuộc Meey Map")
        return false;
      }
    }
    return true;    
  }

  public async confirm(complete: () => void) {
    this.processing = true;
    let validCustom = false;
    let validator = await validation(this.item, ["ServiceId", "Price", "Note"])
    let validServiceMeeyMap = await this.validServiceMeeyMap();
    if (!this.item.UserMeeyId) {
      validCustom = true;
      let properties = DecoratorHelper.decoratorProperties(MOOrderCreateEntity, false);
      if (properties && properties.length > 0) {
        let property = properties.find(c => c.property == 'SearchCustom');
        if (property) {
          property.error = 'Cần thực hiện tìm kiếm thông tin khách hàng trước khi tạo đơn hàng';
          this.eventService.Validate.emit(property);
        }
      }
    }
    if (!validCustom && validator && validServiceMeeyMap) {
      let paymentMethod = this.item.PaymentMethod.toString()
      var checkUser = await this.checkUser()
      const getSale = await this.GetSaleAndSupport();
      if (checkUser && this.item.UserMeeyId) {        
        if(getSale){
          if(paymentMethod == MPPaymentMethodType.MeeyPayAccount.toString()){
            if (this.userBalance && this.userBalance.MPConnected) {                          
              if (this.checkBalance()) {
                this.item.Price = UtilityExHelper.formatStringtoNumber(this.item.Price)
                this.service.AddOrder(this.item).then((result: ResultApi) => {
                  this.processing = false;
                  if (ResultApi.IsSuccess(result)) {
                    ToastrHelper.Success('Tạo đơn hàng thành công');
                    if (complete) complete();
                    return true;
                  } else {
                    ToastrHelper.ErrorResult(result);
                    return false;
                  }
                });
              } else {
                if (this.userBalance?.MPConnected) {
                  let properties = DecoratorHelper.decoratorProperties(MOOrderCreateEntity, false);
                  if (properties && properties.length > 0) {
                    let property = properties.find(c => c.property == 'Price');
                    if (property) {
                      property.error = 'Số tiền thanh toán vượt quá số dư';
                      this.eventService.Validate.emit(property);
                    }
                  }
                }
                ToastrHelper.Error('Số dư khách hàng không đủ để thanh toán. Vui lòng báo khách hàng nạp tiền.');
                this.processing = false;
              }              
            } else {
              ToastrHelper.Error('Trạng thái tài khoản Meey Pay không hợp lệ.');
              this.processing = false;
            }
          }
          else if(paymentMethod == MPPaymentMethodType.TransactionReward.toString()){
            
              if (this.CheckBalanceTransactionReward()) {
                this.item.Price = UtilityExHelper.formatStringtoNumber(this.item.Price)
                this.service.AddOrder(this.item).then((result: ResultApi) => {
                  this.processing = false;
                  if (ResultApi.IsSuccess(result)) {
                    ToastrHelper.Success('Tạo đơn hàng thành công');
                    if (complete) complete();
                    return true;
                  } else {
                    ToastrHelper.ErrorResult(result);
                    return false;
                  }
                });
              } else {   
                let properties = DecoratorHelper.decoratorProperties(MOOrderCreateEntity, false);
                    if (properties && properties.length > 0) {
                      let property = properties.find(c => c.property == 'Price');
                      if (property) {
                        property.error = 'Số tiền thanh toán vượt quá số dư';
                        this.eventService.Validate.emit(property);
                      }
                    }                 
                ToastrHelper.Error('Số dư khách hàng không đủ để thanh toán. Vui lòng báo khách hàng nạp tiền.');
                this.processing = false;
              }              
            
          }  
        }
        else{
          return false;
        }              
      } 
      else {
        ToastrHelper.Error('Trạng thái tài khoản MeeyID không hợp lệ. Vui lòng kiểm tra lại khách hàng.');
        this.processing = false;
      }
    } 
    else
    {
      this.processing = false;
    } 
    
  }

  private async GetSaleAndSupport() : Promise<boolean>{
    var result = await this.service.GetSaleAndSupport(this.item.UserMeeyId)
    this.processing = false;
    if(ResultApi.IsSuccess(result)){
      let obj = result.Object;
      if(this.crmIds > 1){
        ToastrHelper.Error('Tồn tại 2 Sale. Yêu cầu gộp khách hàng lại chỉ để 1 Sale chăm sóc');
        return false;
      }
      if (obj && obj.Sale != null && this.crmData.Sale != obj.Sale.Email) {
        ToastrHelper.Error('Tồn tại 2 Sale. Yêu cầu gộp khách hàng lại chỉ để 1 Sale chăm sóc');
          return false;
      }
      return true;
    }
    else{
      ToastrHelper.ErrorResult(result);
      return false;
    }
  }
  private async renderActions() {
    let actions: ActionData[] = [
      ActionData.back(() => {
        this.back();
      }),
      {
        name: "Tạo đơn hàng",
        processButton: true,
        icon: 'la la-plus-circle',
        className: 'btn btn-primary',
        systemName: ActionType.AddNew,
        click: async () => {
          await this.confirmAndBack();
        }
      }
    ];
    this.actions = await this.authen.actionsAllow(MOOrdersEntity, actions);
  }

  clearCustomer() {
    this.item.UserMeeyId = null;
    this.item.CustomerName = null;
    this.item.CustomerEmail = null;
    this.userBalance = null;
    this.errorMesssageUser = null;
    this.successMesssageUser = null;
    this.errorMesssageTransaction = null;
    this.successMesssageTransaction = null;
    this.showUserTransactionReward = null;
  }

  async searchCustomer() {
    this.loadingUserBalance = true;
    this.clearCustomer()
    var regex = /^\s+$/; 
    let valid = await validation(this.item, ['SearchCustom']);
    if (valid && !regex.test(this.item.SearchCustom)) {
      this.item.SearchCustom = this.item.SearchCustom.trim().replace(/ /g, '')
      this.articleService.findUseerByPhoneOrEmail(this.item.SearchCustom).then(async (result: ResultApi) => {
        if (ResultApi.IsSuccess(result)) {
          let obj = result.Object;
          if (obj) {
            this.item.UserMeeyId = obj.MeeyId;
            this.item.CustomerName = obj.Name;
            this.item.CustomerEmail = obj.Email;
            this.item.CustomerPhone = obj.Phone;
            await this.loadWallet()
            if (this.userBalance) {
              this.checkBalance()
            }
            if(this.showUserTransactionReward){
              this.CheckBalanceTransactionReward()
            }
          }
        } else {
          let properties = DecoratorHelper.decoratorProperties(MOOrderCreateEntity, false);
          if (properties && properties.length > 0) {
            let property = properties.find(c => c.property == 'SearchCustom');
            if (property) {
              property.error = result && result.Description;
              this.eventService.Validate.emit(property);
            }
          }
        }
        this.loadingUserBalance = false;
      });
    }else{
      this.loadingUserBalance = false;
    }
  }

  private async loadWallet() { 
    if (this.item && this.item.UserMeeyId && this.item.PaymentMethod == MPPaymentMethodType.MeeyPayAccount) {
      await this.userService.itemByMeeyId(this.item.UserMeeyId).then(async (result: ResultApi) => {
        if (ResultApi.IsSuccess(result)) {
          this.userBalance = EntityHelper.createEntity(MLUserEntity, result.Object);
        }
      });
    }else if(this.item && this.item.UserMeeyId && this.item.PaymentMethod == MPPaymentMethodType.TransactionReward){
      this.showUserTransactionReward = true
      await this.getTransactionReward(this.item.UserMeeyId)
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
      if (this.item.ServiceId) {
        let service = this.listService.find(s => s.Id.toString() === this.item.ServiceId.toString());
        if (service && service.Code.toLowerCase() === 'ads') {
          codeAds = true;
        }
      }
      if (!codeAds) {
        if (user.DiscountBalance1) balance += user.DiscountBalance1;
        if (user.DiscountBalance2) balance += user.DiscountBalance2;
      }
      if (user.MPConnected) {
        const price = UtilityExHelper.formatStringtoNumber(this.item.Price)
        if (balance < price) {
          if (codeAds) this.errorMesssageUser = 'TK Chính không đủ số dư';
          else this.errorMesssageUser = 'Tài khoản không đủ số dư';
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
  async checkUser(): Promise<boolean> {
    return await this.articleService.findUseerByPhoneOrEmail(this.item.CustomerPhone).then(async (result: ResultApi) => {
      if (ResultApi.IsSuccess(result)) {
        let obj = result.Object;
        if (obj) {
          let customerIsActives = await this.crmService.checkCustomerIsActive({
            Phone: obj.Phone,
            Email: obj.Email
          });
          this.crmIds = customerIsActives.Object;
          let crmCustomer = await this.crmService.findCustomer({
            Phone: obj.Phone,
            Email: obj.Email
          });
          this.crmData = crmCustomer.Object;
          await this.loadWallet()
          if(this.item.PaymentMethod == MPPaymentMethodType.TransactionReward){
            return true;
          }
          return this.userBalance != null
        }
      } else {
        this.errorMesssageUser = result && result.Description;
      }
      return false;
    });
  }
  changeUnit(serviceId: number) {
    if (serviceId) {
      // this.item.Price =  this.listService.find(c => c.Id == serviceId)?.PriceConfig[0].PriceRoot;
      this.item.Price =  this.listService.find(c => c.Id == serviceId)?.PriceConfig[0].PriceDiscount;
    }
  }

}
