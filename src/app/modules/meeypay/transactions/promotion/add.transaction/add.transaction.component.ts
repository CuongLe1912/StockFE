import * as _ from 'lodash';
import { Router } from '@angular/router';
import { AppInjector } from '../../../../../app.module';
import { Component, Input, OnInit } from '@angular/core';
import { MLUserService } from '../../../../meeyuser/user.service';
import { MPTransactionService } from '../../transactions.service';
import { AppConfig } from "../../../../../_core/helpers/app.config";
import { validation } from '../../../../../_core/decorators/validator';
import { ResultApi } from '../../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../../_core/helpers/toastr.helper';
import { ActionData } from '../../../../../_core/domains/data/action.data';
import { UtilityExHelper } from '../../../../../_core/helpers/utility.helper';
import { DecoratorHelper } from '../../../../../_core/helpers/decorator.helper';
import { EditComponent } from '../../../../../_core/components/edit/edit.component';
import { AdminAuthService } from '../../../../../_core/services/admin.auth.service';
import { AdminEventService } from '../../../../../_core/services/admin.event.service';
import { AdminDialogService } from '../../../../../_core/services/admin.dialog.service';
import { NavigationStateData } from '../../../../../_core/domains/data/navigation.state';
import { ActionType, ControllerType } from '../../../../../_core/domains/enums/action.type';
import { MLUserEntity } from '../../../../../_core/domains/entities/meeyland/ml.user.entity';
import { CustomerStoreType } from '../../../../../_core/domains/entities/meeycrm/enums/mcrm.customer.type';
import { MPTransactionBalanceEntity } from '../../../../../_core/domains/entities/meeypay/mp.transactions.entity';
import { MPTransactionFundsType } from '../../../../../_core/domains/entities/meeypay/enums/mp.transaction.status.type';
import { MeeyCrmService } from '../../../../../modules/meeycrm/meeycrm.service';

@Component({
  templateUrl: "./add.transaction.component.html",
  styleUrls: ['./add.transaction.component.scss']
})
export class MPAddTransactionComponent extends EditComponent implements OnInit {
  @Input() params: any;
  actions: ActionData[] = [];

  loading: boolean = true;
  router: Router;
  state: NavigationStateData;
  item: MPTransactionBalanceEntity = new MPTransactionBalanceEntity();
  userBalance: MLUserEntity;
  listService: any;
  disabled: boolean = false;

  service: MPTransactionService;
  authen: AdminAuthService;
  dialog: AdminDialogService;
  eventService: AdminEventService;
  userService: MLUserService;
  crmService: MeeyCrmService;

  loadingUserInfo = false;
  userInfo: any;
  crmIds: number;
  walletInfo: any;
  walletType: number = 1;
  loadingPaymentCode = false;
  dataPaymentCode: any;
  isInfoFunds: boolean = false;
  code: string;
  phone: string;
  saleEmail: string;
  customerType: CustomerStoreType;
  statusFunds: boolean = false;
  promotionPercentage: number = 0;
  processSearchPaymentCode: boolean = false;

  constructor() {
    super();
    this.router = AppInjector.get(Router);
    this.service = AppInjector.get(MPTransactionService);
    this.authen = AppInjector.get(AdminAuthService);
    this.dialog = AppInjector.get(AdminDialogService);
    this.state = this.getUrlState();
    this.eventService = AppInjector.get(AdminEventService);
    this.userService = AppInjector.get(MLUserService);
    this.crmService = AppInjector.get(MeeyCrmService);
  }

  async ngOnInit() {
    let breadCrumb = 'Tạo GD Nạp tiền vào tài khoản';
    if (this.router?.routerState?.snapshot?.root?.queryParams["code"]) {
      this.code = this.router?.routerState?.snapshot?.root?.queryParams["code"];
      breadCrumb = 'Tạo GD Nạp tiền vào tài khoản [Mã tiền thu: ' + this.code + ']';
    }
    if (this.router?.routerState?.snapshot?.root?.queryParams["phone"]) {
      this.phone = this.router?.routerState?.snapshot?.root?.queryParams["phone"];
      breadCrumb = 'Tạo GD Nạp tiền vào tài khoản [Tài khoản: ' + this.phone + ']';
    }
    this.addBreadcrumb(breadCrumb);

    this.code || this.phone ? await this.loadParams() : '';
    this.renderActions();
    await this.loadItem();
    this.loading = false;
  }

  private async loadParams() {
    if (this.code && !this.phone) {
      this.item.SearchPaymentCode = this.code;
      this.updatePaymentCode();
    } else if (!this.code && this.phone) {
      this.item.SearchCustom = this.phone;
      this.searchCustomer();
    } else if (this.code && this.phone) {
      this.item.SearchCustom = this.phone;
      this.searchCustomer();
      this.item.SearchPaymentCode = this.code;
      this.updatePaymentCode();
    }

  }

  private async loadItem() {
    this.item.MeeyPay = true;
  }

  private async renderActions() {
    let actions: ActionData[] = [
      ActionData.back(() => {
        // this.back();
        this.router.navigate(['/admin/mptransactions']);
      }),
      {
        name: "Xác nhận tạo giao dịch",
        processButton: true,
        icon: 'la la-plus-circle',
        className: 'btn btn-primary',
        systemName: ActionType.AddNew,
        click: async () => {
          await this.confirmAndBack();
        }
      }
    ];
    this.actions = await this.authen.actionsAllowName(ControllerType.MPTransactions, actions);
  }

  public async confirmAndBack() {
    this.processing = true;
    let validCustom = false;
    if (_.isEmpty(this.userInfo)) {
      validCustom = true;
      let properties = DecoratorHelper.decoratorProperties(MPTransactionBalanceEntity, false);
      if (properties && properties.length > 0) {
        let property = properties.find(c => c.property == 'SearchCustom');
        if (property) {
          property.error = 'Cần thực hiện tìm kiếm thông tin khách hàng trước khi tạo giao dịch';
          this.eventService.Validate.emit(property);
        }
      }
    }
    if (!this.item.MeeyPay && !this.item.ServiceAds) {
      this.dialog.Alert('Thông báo', 'Vui lòng chọn ít nhất 1 dịch vụ để tạo giao dịch');
      this.processing = false;
      return;
    }
    //Check validate Tài khoản chính
    if (!validCustom && this.walletType === 1) {
      let columns = ["StaffNote", "Funds", "ContentOption", "SearchPaymentCode"];
      if (this.item.MeeyPay)
        columns.push('Amount');
      if (this.item.ServiceAds)
        columns.push(...['AmountAds', 'NeedAmount']);
      if (this.item.HavePromotion)
        columns.push("AmountKM2");
      if (this.item.HaveInvoice)
        columns.push(...['CustomerName', 'CustomerEmail', 'ContentVAT']);
      let validate = await validation(this.item, columns)
      if (validate) {
        this.dialog.ConfirmAsync('Bạn xác nhận Đồng ý nạp tiền? ', async () => {
          await this.confirm();
        }, () => this.processing = false, 'Xác nhận tạo giao dịch')
      } else this.processing = false;
    }
    //Check validate TKKM2
    if (!validCustom && this.walletType === 3) {
      let columns = ["StaffNote", "Description"];
      if (this.item.MeeyPay)
        columns.push('Amount');
      if (this.item.ServiceAds)
        columns.push(...['AmountAds', 'NeedAmount']);
      if (this.item.HaveInvoice)
        columns.push(...['CustomerName', 'CustomerEmail', 'ContentVAT']);
      let validate = await validation(this.item, columns)
      if (validate) {
        this.dialog.ConfirmAsync('Bạn xác nhận Đồng ý nạp tiền? ', async () => {
          await this.confirm();
        }, () => this.processing = false, 'Xác nhận tạo giao dịch')
      } else this.processing = false;
    } else this.processing = false;
  }

  public async confirm() {
    this.processing = true;
    if (this.userInfo && this.walletInfo) {
      if (!this.userInfo.id && !this.userInfo.status) {
        this.dialog.Alert('Giao dịch thất bại', 'Trạng thái tài khoản ví không hợp lệ.')
        this.processing = false;
        return false;
      }
      //Check CrmId
      if(this.crmIds > 1){
        this.dialog.Alert('Giao dịch thất bại', 'Tồn tại 2 CrmId. Yêu cầu gộp khách hàng lại chỉ để 1 Sale chăm sóc');
        this.processing = false;
        return false;
      }
      if(this.crmIds == 0){
        this.dialog.Alert('Giao dịch thất bại', 'Không tìm thấy thông tin khách hàng trên CRM');
        this.processing = false;
        return false;
      }
      //Check Sale
      if(!this.saleEmail && this.customerType != CustomerStoreType.Affiliate){
        this.dialog.Alert('Giao dịch thất bại', 'Hệ thống không tìm thấy thông tin sale chăm sóc khách hàng, Vui lòng làm mới màn hình và tạo lại giao dịch.')
        this.processing = false;
        return false;
      }
      //Cộng tiền tài khoản chính
      if (this.walletType === 1) {
        this.loadingPaymentCode = true;
        let statusPaymentCode = await this.service.MPayCheckPaymentCode(this.item.SearchPaymentCode).then(async (result: ResultApi) => {
          if (ResultApi.IsSuccess(result)) {
            let obj = result.Object;
            return obj.Status
          } else {
            ToastrHelper.Error('Mã tiền thu đang chờ xử lý hoặc đã sử dụng. Vui lòng thực hiện lại hoặc liên hệ bộ phận kỹ thuật.');
          }
          this.loadingPaymentCode = false;
        });
        if (statusPaymentCode === 0) {
          let dataWalletTKC: any = {
            "MeeyPayId": this.userInfo.id,
            "Amount": UtilityExHelper.formatStringtoNumber(this.item.Amount),
            "Description": this.item.StaffNote,
            "TransactionTypeId": 101,
            "Content": this.item.ContentOption,
            "ProviderTransactionId": this.item.SearchPaymentCode, //mã tiền thu
            "UsePromotion": this.item.HavePromotion,
            "BonusAmount": this.item.HavePromotion ? UtilityExHelper.formatStringtoNumber(this.item.AmountKM2) ? UtilityExHelper.formatStringtoNumber(this.item.AmountKM2) : 0 : 0, // số tiền khuyến mãi
            "BankCode": this.item.Funds === MPTransactionFundsType.BANK ? this.dataPaymentCode.BankCode : null,
            "BuyerPhone": this.userInfo.phoneNumber,
            "BuyerName": this.userInfo.firstName,
            "BuyerEmail": this.userInfo.email,
            "BankAccountNo": this.dataPaymentCode.AccountNumber ? this.dataPaymentCode.AccountNumber : null,
            "MeeyId": this.userInfo.meeyId ? this.userInfo.meeyId : ''
          }
          if (this.item.Funds === MPTransactionFundsType.BANK) {
            this.service.MPayCreateTransactionAddMainByBank(dataWalletTKC).then(async (result: ResultApi) => {
              this.processing = false;
              if (ResultApi.IsSuccess(result)) {
                this.dialog.ConfirmRedirect('Tạo giao dịch thành công', 'Giao dịch ở trạng thái Chờ xác nhận, cần người quản lý phê duyệt', async () => {
                  this.router.navigate(['/admin/mptransactions']);
                })
                return true;
              } else {
                result ? this.dialog.Alert('Giao dịch thất bại', `${result && result.Description ? result.Description : 'Vui lòng thực hiện lại hoặc liên hệ bộ phận kỹ thuật.'}`) :
                  this.dialog.Alert('Giao dịch thất bại', 'Vui lòng thực hiện lại hoặc liên hệ bộ phận kỹ thuật.');
                this.processing = false;
                return false;
              }
            });
          } else if (this.item.Funds === MPTransactionFundsType.COUNTER) {
            this.service.MPayCreateTransactionAddMainByCounter(dataWalletTKC).then(async (result: ResultApi) => {
              this.processing = false;
              if (ResultApi.IsSuccess(result)) {
                this.dialog.ConfirmRedirect('Tạo giao dịch thành công', 'Giao dịch ở trạng thái Chờ xác nhận, cần người quản lý phê duyệt', async () => {
                  this.router.navigate(['/admin/mptransactions']);
                })
                return true;
              } else {
                result ? this.dialog.Alert('Giao dịch thất bại', `${result && result.Description ? result.Description : 'Vui lòng thực hiện lại hoặc liên hệ bộ phận kỹ thuật.'}`) :
                  this.dialog.Alert('Giao dịch thất bại', 'Vui lòng thực hiện lại hoặc liên hệ bộ phận kỹ thuật.');
                this.processing = false;
                return false;
              }
            });
          }
        } else {
          this.dialog.Alert('Giao dịch thất bại', 'Mã tiền thu đã được sử dụng');
          this.processing = false;
          return false;
        }
      }
      //Cộng tiền TKKM2
      if (this.walletType === 3) {
        if (!this.userInfo.id && !this.item.Amount && !this.item.Description && !this.item.StaffNote) {
          this.dialog.Alert('Giao dịch thất bại', 'Định dạng dữ liệu bản tin không hợp lệ. Vui lòng thực hiện lại hoặc liên hệ bộ phận kỹ thuật');
          this.processing = false;
          return false;
        }
        let data: any = {
          "MeeyPayId": this.userInfo.id,
          "Amount": UtilityExHelper.formatStringtoNumber(this.item.Amount),
          "Description": this.item.Description,
          "StaffNote": this.item.StaffNote,
          "Source": "meeyadmin"
        }
        this.service.MPayAddRequestPromotion(data).then(async (result: ResultApi) => {
          this.processing = false;
          if (ResultApi.IsSuccess(result)) {
            this.dialog.ConfirmRedirect('Tạo giao dịch thành công', 'Giao dịch nạp tiền tài khoản khuyến mại ở trạng thái chờ xác nhận', async () => {
              this.router.navigate(['/admin/mptransactions']);
            })
            return true;
          } else {
            this.dialog.Alert('Giao dịch thất bại', 'Vui lòng thực hiện lại hoặc liên hệ bộ phận kỹ thuật')
            this.processing = false;
            return false;
          }
        });
      }
    } else {
      this.dialog.Alert('Giao dịch thất bại', 'Trạng thái tài khoản Meey Pay không hợp lệ.')
      this.processing = false;
    }
  }

  async searchCustomer() {
    this.loadingUserInfo = true;
    this.clearCustomer()
    let valid = await validation(this.item, ['SearchCustom']);
    if (valid) {
      this.item.SearchCustom = this.item.SearchCustom.trim().replace(/ /g, '')
      await this.service.MPaySearchCustomer(this.item.SearchCustom).then(async (result: ResultApi) => {
        if (ResultApi.IsSuccess(result)) {
          let obj = result.Object;
          if (obj) {
            //Kiểm tra tài khoản có trong ds tk merchant, có thì hiện thông báo lỗi
            let listMerchants = await this.service.MPayListMerchants().then(async (result: ResultApi) => {
              if (ResultApi.IsSuccess(result)) {
                return result.Object;
              } else {
                ToastrHelper.Error('Lấy danh sách tài khoản merchant đang có vấn đề!');
              }
            })
            let isMerchant = _.filter(listMerchants, { 'userId': obj.userInfo.id }) || [];
            if (!_.isEmpty(isMerchant)) {
              ToastrHelper.Error('Đây là Tài khoản nội bộ, không cho phép nạp ở chức năng này');
              this.loadingUserInfo = false;
            } else {
              this.userInfo = obj.userInfo;
              this.isInfoFunds = true;
              this.walletInfo = obj.walletInfo && obj.walletInfo.data ? obj.walletInfo.data : '';
              if (this.userInfo) {
                let customerIsActives = await this.crmService.checkCustomerIsActive({
                  Phone: this.userInfo.phoneNumber,
                  Email: this.userInfo.email
                });
                this.crmIds = customerIsActives.Object;
                this.service.GetCustomerCrmInfo(this.userInfo.meeyId).then((result: ResultApi) => {
                  if (ResultApi.IsSuccess(result)){
                    if(result.Object){
                      this.customerType = result.Object?.CustomerStoreType;
                      this.service.GetSaleAndSupport(this.userInfo.meeyId).then((result: ResultApi) => {
                        if (ResultApi.IsSuccess(result)) {
                          let obj = result.Object;
                          if (obj && obj.Sale == null) {
                            this.saleEmail = null;
                            ToastrHelper.Error('Hệ thống không tìm thấy thông tin sale chăm sóc khách hàng, Vui lòng làm mới màn hình và tạo lại giao dịch.');
                            return false;
                          }
                          else{
                            this.saleEmail = obj.Sale;
                          }
                        }
                      })
                    }
                    else{
                      this.crmIds = 0;
                      ToastrHelper.Error('Không tìm thấy thông tin khách hàng trên CRM');
                      this.customerType = result.Object?.CustomerStoreType;
                    }
                  }
                })
              }
            }
          }
        } else {
          ToastrHelper.Error('Không tìm thấy khách hàng');
        }
        this.loadingUserInfo = false;
      });
    }
  }

  clearCustomer() {
    if (this.code) {
      this.userInfo = null;
      this.walletInfo = null;
    } else {
      this.isInfoFunds = false;
      this.userInfo = null;
      this.walletInfo = null;
    }
  }

  walletTypeChange() {
    if (this.walletType != this.item.WalletypeId) {
      this.clearWalletChange();
      this.walletType = this.item.WalletypeId;
      if (this.item.WalletypeId == 1 || this.item.WalletypeId == 3)
        this.item.MeeyPay = true;
      else if (this.item.WalletypeId == 10) {
        this.item.MeeyPay = false;
        this.item.ServiceAds = true;
      }
    }
  }

  haveInvoiceChange() {

  }

  viewUser(meeyId: string) {
    let obj: NavigationStateData = {
      prevUrl: '/admin/mluser',
    };
    let url = AppConfig.getProtocol() + '//' + AppConfig.getDomain() + '/admin/mluser/view?meeyId=' + meeyId;
    this.setUrlState(obj, 'mluser');
    window.open(url, "_blank");
  }

  selectedItem(item: any) {
    if (this.walletType != item.walletTypeId) {
      this.clearWalletChange();
      this.walletType = item.walletTypeId;
    }
  }

  async changeAmount() {
    let numberAmount = this.item.Amount;
    let isPromotion = UtilityExHelper.calculatePromotionPercentage(numberAmount);
    if (isPromotion != 0) {
      this.item.HavePromotion = true;
      this.item.AmountKM2 = this.item.Amount * isPromotion;
      this.promotionPercentage = isPromotion * 100;
    } else {
      this.item.HavePromotion = false;
      this.promotionPercentage = 0;
    }

    //show ghi chú có số tiền
    if (this.item.ContentOption && numberAmount > 0) {
      setTimeout(() => {
        let showAmount = numberAmount ? UtilityExHelper.convertNumberMoney(numberAmount) : '';
        this.item.StaffNote = `${this.item.ContentOption}${showAmount ? ` + ${showAmount} vnđ` : ''}`
      }, 300)
    }
  }

  async changeNeedAmount() {
    let numberAmount = this.item.NeedAmount;
    let numberVat = this.item.HaveVAT
      ? numberAmount * 10 / 100
      : null;
    this.item.AmountVAT = numberVat;
  }

  changeFunds(item: any) {
    if (item && !this.statusFunds) {
      this.item.SearchPaymentCode = '';
      //Thay nguồn tiền, thì các giá trị thông tin mã cũ sẽ null
      this.item.ContentOption = null;
      this.item.Amount = null;
      this.item.AmountKM2 = null;
      this.item.HavePromotion = false;
      this.item.StaffNote = null;
      this.promotionPercentage = 0;
    }
    this.statusFunds = false;
  }

  changeContentOption(item: any) {
    if (item) {
      let showAmount = this.item.Amount ? UtilityExHelper.convertNumberMoney(this.item.Amount) : '';
      this.item.StaffNote = `${item}${showAmount ? ` + ${showAmount} vnđ` : ''}`
    }
  }

  async changePaymentCode(code: any) {
    if (code) {
      if (!this.processSearchPaymentCode) {
        this.processSearchPaymentCode = true;
        await this.updatePaymentCode();
        this.processSearchPaymentCode = false;
      }
    }
  }

  async updatePaymentCode() {
    this.loadingPaymentCode = true;
    let valid = await validation(this.item, ['SearchPaymentCode']);
    if (valid) {
      await this.service.MPayCheckPaymentCode(this.item.SearchPaymentCode).then(async (result: ResultApi) => {
        if (ResultApi.IsSuccess(result)) {
          let obj = result.Object;
          if (obj) {
            this.dataPaymentCode = obj;
            let numberAmount = obj.Amount;
            this.item.Amount = numberAmount;
            obj.BankId ? this.item.Funds = MPTransactionFundsType.BANK : this.item.Funds = MPTransactionFundsType.COUNTER;
            this.isInfoFunds = true;
            //tính % khuyến mãi
            let isPromotion = UtilityExHelper.calculatePromotionPercentage(numberAmount);
            if (isPromotion != 0) {
              this.item.HavePromotion = true;
              let numberAmountKM2 = numberAmount * isPromotion;
              let numberAmountKM2Fixed = Number(numberAmountKM2.toFixed());
              this.item.AmountKM2 = numberAmountKM2Fixed;
              this.promotionPercentage = isPromotion * 100;
            } else {
              this.item.HavePromotion = false;
              this.promotionPercentage = 0;
            }
            //show ghi chú có số tiền
            if (this.item.ContentOption && numberAmount > 0) {
              setTimeout(() => {
                let showAmount = numberAmount ? UtilityExHelper.convertNumberMoney(numberAmount) : '';
                this.item.StaffNote = `${this.item.ContentOption}${showAmount ? ` + ${showAmount} vnđ` : ''}`
              }, 300)
            }
            this.statusFunds = true;
          }
        } else {
          ToastrHelper.Error('Mã tiền thu không tồn tại');
        }
        this.loadingPaymentCode = false;
      });
    }
  }

  async checkPaymentCode() {
    this.viewDetail(this.dataPaymentCode);
  }

  clearWalletChange() {
    this.item.Funds = null;
    this.item.ContentOption = null;
    this.item.Amount = null;
    this.item.AmountKM2 = null;
    this.item.HavePromotion = false;
    this.item.SearchPaymentCode = null;
    this.item.StaffNote = null;
    this.item.Description = null;
    this.promotionPercentage = 0;
  }

  viewDetail(item: any) {
    let text = '';
    if (item.BankName) {
      text += '<p>' + item.BankName + '</p>';
    }
    if (item.ReceiveDate) {
      let date = UtilityExHelper.dateString(item.ReceiveDate);
      text += '<p>+ Thời gian nhận: ' + date + '</p>';
    }
    if (item.CreatedDate) {
      let day = UtilityExHelper.dateString(item.CreatedDate);
      text += '<p>+ Ngày: ' + day + '</p>';
    }
    if (item.Amount) {
      let amount = UtilityExHelper.convertNumberMoney(item.Amount);
      text += '<p>+ Nộp tiền: +' + amount + '</p>';
    }
    if (item.Note) {
      text += '<p>+ Nội dung: ' + item.Note + '</p>';
    }
    this.dialog.Alert('Kiểm tra thông tin', text)
  }
}