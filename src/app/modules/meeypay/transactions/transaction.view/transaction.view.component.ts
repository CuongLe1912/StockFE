import { Component, Input, OnInit } from '@angular/core';
import { AppConfig } from "../../../../_core/helpers/app.config";
import { MPTransactionEventService, MPTransactionService } from "../transactions.service";
import { ResultApi } from "../../../../_core/domains/data/result.api";
import { ActionData } from "../../../../_core/domains/data/action.data";
import { OptionItem } from "../../../../_core/domains/data/option.item";
import { ActionType } from "../../../../_core/domains/enums/action.type";
import { ConstantHelper } from "../../../../_core/helpers/constant.helper";
import { ModalSizeType } from '../../../../_core/domains/enums/modal.size.type';
import { EditComponent } from "../../../../_core/components/edit/edit.component";
import { NavigationStateData } from "../../../../_core/domains/data/navigation.state";
import { MPTransactionsEntity } from '../../../../_core/domains/entities/meeypay/mp.transactions.entity';
import { MPTransactionApproveComponent } from '../components/transaction.approve/transaction.approve.component';
import { MPTransactionWithdrawalCensorshipComponent } from '../components/transaction.withdrawal/transaction.withdrawal.component';
import { MPPaymentMethodType, MPTransactionStatusType, MPTransactionType, TransactionHistoryType } from "../../../../_core/domains/entities/meeypay/enums/mp.transaction.status.type";
import { AppInjector } from '../../../../app.module';
import { ToastrHelper } from "../../../../_core/helpers/toastr.helper";
import { UtilityExHelper } from "../../../../_core/helpers/utility.helper";
import { MOOrdersService } from "../../../meeyorder/orders/orders.service";
import { MPTransactionAddNoteComponent } from '../components/transaction.add.note/transaction.add.note.component';

@Component({
  templateUrl: "./transaction.view.component.html",
  styleUrls: ["./transaction.view.component.scss"],
})
export class MPTransactionDetailComponent extends EditComponent implements OnInit {
  @Input() params: any;
  id: number;
  approve: boolean;
  item: any;
  tab: string = 'historyTransaction';
  statusTransaction = '';
  MPPaymentMethodType = MPPaymentMethodType;
  MPTransactionType = MPTransactionType;
  verifyData: object;
  paymentMethod = '<div class="kt-spinner kt-spinner--v2 kt-spinner--primary"></div>';
  contentTransactionPayment: string = '<div class="kt-spinner kt-spinner--v2 kt-spinner--primary"></div>'
  Author: string;
  VerifyBy: string;
  VerifyTime: string;
  StaffNote: string;
  MPRevenue: any = null;
  ProcessSearchPaymentCode = false;
  ListClient = []

  eventService: MPTransactionEventService;
  orderService: MOOrdersService;

  constructor(public service: MPTransactionService) {
    super();
    this.eventService = AppInjector.get(MPTransactionEventService);
    this.orderService = AppInjector.get(MOOrdersService);
  }

  async ngOnInit() {
    this.id = this.params && this.params["id"];
    if (this.router?.routerState?.snapshot?.root?.queryParams["id"]) {
      this.id = this.router?.routerState?.snapshot?.root?.queryParams["id"]
    }
    this.approve = this.params && this.params["approve"];
    if (this.router?.routerState?.snapshot?.root?.queryParams["approve"]) {
      this.approve = this.router?.routerState?.snapshot?.root?.queryParams["approve"]
    }
    this.addBreadcrumb("Chi tiết giao dịch");
    if (this.state) {
      this.id = this.id || this.state.id;
    }

    await this.orderService.getClient().then((result: ResultApi) => {
      if (ResultApi.IsSuccess(result) && result.Object) {
        this.ListClient = result.Object
      }
    })

    await this.loadItem();
    this.renderActions();
    this.loading = false;

    // this.eventService.ConfirmTransaction.subscribe(async (check) => {
    //   if (check) {
    //     this.dialogService.HideAllDialog();
    //     await this.loadItem();
    //     this.renderActions();
    //   }
    // })
  }

  private async renderActions() {
    let actions: ActionData[] = [
      ActionData.back(() => {
        this.router.navigate(['/admin/mptransactions']);
      }),
    ];

    //chuyển khoản, nộp tại văn phòng
    if (this.checkApprovePayment() && this.approve) {
      actions.push({
        name: "Thêm ghi chú",
        systemName: ActionType.AddNew,
        className: 'btn btn-success',
        click: () => {
          this.addNotes()
        }
      })
      actions.push({
        icon: '',
        name: ActionType.ApproveDeposit,
        systemName: ActionType.ApproveDeposit,
        className: 'btn btn-success',
        click: () => {
          this.verify();
        }
      })
    }

    //Kiểm duyệt giao dịch rút tiền
    if (this.checkApproveWithdrawalPayment() && this.approve) {
      let systemName = ActionType.ApproveWithdraw;
      if (this.item.Transaction.Status == MPTransactionStatusType.Process) {
        systemName = ActionType.AccountantApprove;
      }
      actions.push({
        name: "Thêm ghi chú",
        systemName: ActionType.AddNew,
        className: 'btn btn-success',
        click: () => {
          this.addNotes()
        }
      })
      actions.push({
        icon: '',
        name: ActionType.Verify,
        systemName: systemName,
        className: 'btn btn-success',
        click: () => {
          this.transCensorship();
        }
      })
    }

    //Thêm ghi chú với giao dịch rút tiền
    // if (add) {
    //   actions.push({
    //     icon: '',
    //     name: 'Thêm ghi chú',
    //     systemName: ActionType.Notes,
    //     className: 'btn btn-success',
    //     click: () => {
    //       this.addNotes();
    //     }
    //   })
    // }

    this.actions = await this.authen.actionsAllow(MPTransactionsEntity, actions);
  }

  async transCensorship() {
    this.processing = true;
    this.dialogService.WapperAsync({
      cancelText: 'Hủy',
      confirmText: 'Xác nhận',
      size: ModalSizeType.Large,
      objectExtra: {
        item: this.item,
        paymentMethod: this.paymentMethod,
      },
      title: 'Kiểm duyệt giao dịch',
      object: MPTransactionWithdrawalCensorshipComponent,
    });
    this.processing = false;
  }

  async addNotes() {
    this.processing = true;
    this.dialogService.WapperAsync({
      cancelText: 'Hủy',
      confirmText: 'Xác nhận',
      size: ModalSizeType.Large,
      objectExtra: {
        item: this.item,
      },
      title: 'Thêm ghi chú',
      object: MPTransactionAddNoteComponent,
    }, () => this.loadItem());
    this.processing = false;
  }

  private async loadItem() {
    if (this.id) {
      if (this.item?.Transaction?.TransactionHistories) {
        this.item.Transaction.TransactionHistories = null;
      }
      await this.service.item("mptransactions", this.id).then((result: ResultApi) => {
        if (ResultApi.IsSuccess(result)) {
          this.item = result.Object
          let option: OptionItem = ConstantHelper.MP_TRANSACTION_STATUS_TYPES.find((c) => c.value == this.item.Transaction.Status);
          this.statusTransaction = '<p class="' + (option && option.color) + '">' + (option && option.label) + "</p>";

          if (this.item.Transaction.BankInvoiceImageUrl) {
            this.item.Transaction.BankInvoiceImageUrl = JSON.parse(this.item.Transaction.BankInvoiceImageUrl)
          }

          if (this.item.Transaction.BankAccountStatus) {
            let optionBankAccountStatus: OptionItem = ConstantHelper.MP_TRANSACTION_STATUS_BANK_TYPES.find((c) => c.value == this.item.Transaction.BankAccountStatus);
            this.item.Transaction.BankAccountStatus = optionBankAccountStatus.label
          }

          if (this.item?.Transaction?.TransactionHistories) {
            let authorTransaction = this.item.Transaction.TransactionHistories[0];
            this.Author = this.getCreateBy(authorTransaction.CreateBy)

            let approveTransaction = this.item.Transaction.TransactionHistories.find(c => c.HistoryTypeId == TransactionHistoryType.ApproveTransaction)
            if (approveTransaction) {
              this.VerifyBy = this.getCreateBy(approveTransaction.CreateBy);
              this.VerifyTime = approveTransaction.CreateTime;
            } else {
              let failTransaction = this.item.Transaction.TransactionHistories.find(c => c.HistoryTypeId == TransactionHistoryType.UpdateTransactionFail && c.StatusBeforeEnum == MPTransactionStatusType.Waiting)
              if (failTransaction) {
                this.VerifyBy = this.getCreateBy(failTransaction.CreateBy);
                this.VerifyTime = failTransaction.CreateTime;
                this.item.CancelReason = failTransaction.Description;
              }
            }
            let successTransaction = this.item.Transaction.TransactionHistories.find(c => c.HistoryTypeId == TransactionHistoryType.UpdateTransactionSuccess)
            if (successTransaction) {
              this.item.AccountantVerify = this.getCreateBy(successTransaction.CreateBy);
              this.VerifyTime = successTransaction.CreateTime;
            } else {
              let cancelTransaction = this.item.Transaction.TransactionHistories.find(c => c.HistoryTypeId == TransactionHistoryType.UpdateTransactionFail && c.StatusBeforeEnum == MPTransactionStatusType.Process)
              if (cancelTransaction) {
                this.item.AccountantVerify = this.getCreateBy(cancelTransaction.CreateBy);
                this.VerifyTime = cancelTransaction.CreateTime;
                this.item.CancelReason = cancelTransaction.Description;
              }
            }
          }

          if (!this.VerifyBy && !this.VerifyTime && this.item?.Transaction?.TransactionHistories[1]) {
            this.VerifyBy = this.getCreateBy(this.item?.Transaction?.TransactionHistories[1].CreateBy)
            this.VerifyTime = this.item?.Transaction?.TransactionHistories[1].CreateTime
          }

          this.StaffNote = this.item.Transaction.StaffNote
          if ([MPTransactionStatusType.Fail, MPTransactionStatusType.Cancel].includes(this.item.Transaction.Status)) {
            this.StaffNote = this.item.Transaction.MeeyResponseDetail
          }
          this.checkPaymentCode()
          this.loadHistoryWalletMeeyPay(this.item.UserInfo.MeeyId, this.item.Transaction.TransactionTypeId, this.item.Transaction.PaymentMethodId, this.item.Transaction.PaymentMethod)
          // this.loadHyperLink()
        }
      });
    }
  }

  loadHistoryWalletMeeyPay(meeyId, transactionType, paymentMethodId, PaymentMethod) {
    if (meeyId && this.id) {
      if (paymentMethodId == MPPaymentMethodType.MeeyPayAccount && transactionType === MPTransactionType.Payment) {
        this.service.TransMeeyIdByIds(meeyId, [this.id.toString()]).then((result: ResultApi) => {
          if (ResultApi.IsSuccess(result) && result.Object) {
            let trans = result.Object && result.Object.find(c => c.TransactionId == this.id);
            if (trans) {
              if (trans.PaymentMethodId == MPPaymentMethodType.MeeyPayAccount && transactionType === MPTransactionType.Payment) {
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
            }
          }
        });
      } else if (paymentMethodId == MPPaymentMethodType.OnlineATM) {
        this.paymentMethod = PaymentMethod;
      } else {
        this.paymentMethod = PaymentMethod;
      }
    }
  }

  // loadHyperLink() {
  //   if (this.item.Transaction.TransactionTypeId === MPTransactionType.Payment) {
  //     this.service.getHyperLink(this.id.toString()).then((result: ResultApi) => {
  //       if (ResultApi.IsSuccess(result) && result.Object) {
  //         this.contentTransactionPayment = `Thanh toán MeeyLand - ${result.Object.order_id} - mã tin đăng ${result.Object.refId}`
  //       } else {
  //         this.contentTransactionPayment = ''
  //       }
  //     })
  //   } else {
  //     this.contentTransactionPayment = ''
  //   }
  // }

  viewUser(meeyId: string) {
    let obj: NavigationStateData = {
      prevUrl: '/admin/mluser',
    };
    let url = AppConfig.getProtocol() + '//' + AppConfig.getDomain() + '/admin/mluser/view?meeyId=' + meeyId;
    this.setUrlState(obj, 'mluser');
    window.open(url, "_blank");
  }

  viewCrm(codeCrm: string) {
    let obj: NavigationStateData = {
      prevUrl: '/admin/meeycrm',
    };
    let url = AppConfig.getProtocol() + '//' + AppConfig.getDomain() + '/admin/meeycrm/customer/view?id=' + codeCrm;
    this.setUrlState(obj, 'meeycrm');
    window.open(url, "_blank");
  }

  selectedTab(tab: string) {
    this.tab = tab;
  }

  async verify() {
    this.processing = true;
    this.dialogService.WapperAsync({
      cancelText: 'Hủy bỏ',
      confirmText: 'Xác nhận',
      size: ModalSizeType.Large,
      objectExtra: {
        item: this.item,
        paymentMethod: this.paymentMethod,
      },
      title: 'Kiểm duyệt giao dịch',
      object: MPTransactionApproveComponent,
    });
    this.processing = false;
  }

  checkApprovePayment() {
    let checkMethod = false;
    if (this.item.Transaction.PaymentMethodId == MPPaymentMethodType.MeeyPayAccount) {
      if (this.item.Transaction.TransactionTypeId == MPTransactionType.Donate) checkMethod = true;
    } else {
      if (this.item.Transaction.TransactionTypeId == MPTransactionType.Topup) checkMethod = true;
    }
    return [MPPaymentMethodType.Transfer, MPPaymentMethodType.Office, MPPaymentMethodType.MeeyPayAccount].includes(this.item.Transaction.PaymentMethodId)
      && (this.item.Transaction.Status == MPTransactionStatusType.Waiting)
      && checkMethod
  }

  checkApproveWithdrawalPayment() {
    let checkMethod = false;
    if (this.item.Transaction.PaymentMethodId == MPPaymentMethodType.BankTransfer) {
      if (this.item.Transaction.TransactionTypeId == MPTransactionType.Withdrawal) checkMethod = true;
    }
    return [MPPaymentMethodType.Transfer, MPPaymentMethodType.Office, MPPaymentMethodType.BankTransfer].includes(this.item.Transaction.PaymentMethodId)
      && (this.item.Transaction.Status == MPTransactionStatusType.Waiting || this.item.Transaction.Status == MPTransactionStatusType.Process)
      && checkMethod
  }

  getCreateBy(item: string) {
    if (item == null) return "Khách hàng"
    if (item.includes('@')) return item
    let option: OptionItem = ConstantHelper.MP_TRANSACTION_AUTHOR_TYPES.find((c) => c.value == item.toLowerCase());
    if (option === undefined) {
      return item
    }
    return option.label;
  }

  async searchPaymentCode() {
    if (!this.MPRevenue) {
      return await this.checkPaymentCode();
    }
    return this.viewProviderTransactionId(this.MPRevenue)
  }

  viewProviderTransactionId(item: any) {
    let text = '';
    if (item.BankName) {
      text += '<p>' + item.BankName + '</p>';
    }
    if (item.ReceiveDate) {
      let date = UtilityExHelper.dateTimeString(item.ReceiveDate);
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
    this.dialogService.Alert('Kiểm tra thông tin', text)
  }

  async checkPaymentCode() {
    if (this.item.Transaction.ProviderTransactionId && [MPPaymentMethodType.Transfer, MPPaymentMethodType.Office].includes(this.item.Transaction.PaymentMethodId)) {
      this.MPRevenue = null;
      await this.service.MPayCheckPaymentCode(this.item.Transaction.ProviderTransactionId).then(async (result: ResultApi) => {
        if (ResultApi.IsSuccess(result)) {
          let obj = result.Object;
          if (obj) {
            this.MPRevenue = obj;
          }
        } else {
          // ToastrHelper.Error('Mã tiền thu không tồn tại trên hệ thống');
        }
      });
    }
  }

  getClientName(code) {
    if (this.ListClient) {
      let client = this.ListClient.find(c => c.ClientId == code)
      if (client) {
        return client.Name
      }
    }

    return code
  }

  getNameUploadFile(file) {
    let text = '';
    if (file) {
      text = file.replace(/^.*[\\\/]/, '');
    }
    return text;
  }
}
