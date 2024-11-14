import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { MPPaymentMethodType, MPTransactionFundsType, MPTransactionStatusType, MPTransactionType } from "../../../../../_core/domains/entities/meeypay/enums/mp.transaction.status.type";
import { MPTransactionWithdrawalEntity } from "../../../../../_core/domains/entities/meeypay/mp.transactions.entity";
import { AppInjector } from "../../../../../app.module";
import { validation } from "../../../../../_core/decorators/validator";
import { ResultApi } from "../../../../../_core/domains/data/result.api";
import { ToastrHelper } from "../../../../../_core/helpers/toastr.helper";
import { AdminDialogService } from "../../../../../_core/services/admin.dialog.service";
import { MPTransactionEventService, MPTransactionService } from "../../transactions.service";
import { UtilityExHelper } from "../../../../../_core/helpers/utility.helper";
import { EntityHelper } from "../../../../../_core/helpers/entity.helper";
import { EditorComponent } from "../../../../../_core/editor/editor.component";
import { MLUserService } from "../../../../../modules/meeyuser/user.service";

@Component({
  templateUrl: "./transaction.withdrawal.component.html",
})
export class MPTransactionWithdrawalCensorshipComponent implements OnInit {
  @ViewChild('uploadFile') uploadFile: EditorComponent;
  disabled: boolean;
  errorMessage: string;
  @Input() params: any;
  service: MPTransactionService;
  eventService: MPTransactionEventService;
  dialogService: AdminDialogService;
  userService: MLUserService;

  MPPaymentMethodType = MPPaymentMethodType;
  PaymentCode = null;
  loadingPaymentCode: boolean = false;
  browsingStatus = null;

  item: MPTransactionWithdrawalEntity = new MPTransactionWithdrawalEntity();
  mpRevenue: any = null;

  action: string = 'approve';
  showRequired = false;

  constructor() {
    this.service = AppInjector.get(MPTransactionService);
    this.eventService = AppInjector.get(MPTransactionEventService);
    this.dialogService = AppInjector.get(AdminDialogService);
    this.userService = AppInjector.get(MLUserService);
  }

  valueChange() {
    if (this.action == "reject") {
      let disabled = true;
      let showRequired = true;
      if (this.item.MeeyResponseCode) {
        if (this.item.MeeyResponseCode == '405')
          disabled = this.item.StaffNote ? false : true;
        else {
          disabled = false;
          showRequired = false;
        }
      }
      this.disabled = disabled;
      this.showRequired = showRequired;
    }
  }

  actionChange() {
    if (this.action == "reject") {
      this.item.MeeyResponseCode = null;
      this.item.StaffNote = null;
      this.disabled = this.item.StaffNote ? false : true;
    } else if (this.action == "approve") {
      this.item.StaffNote = null;
      this.disabled = false;
    }
  }

  async ngOnInit() {
    let item = this.params && this.params["item"];
    this.loadingPaymentCode = true;
    if (item) {
      this.item = EntityHelper.createEntity(MPTransactionWithdrawalEntity, item);
      if (this.item.Transaction.PaymentMethodId == MPPaymentMethodType.BankTransfer) {
        this.PaymentCode = MPTransactionFundsType.BANK;
      } else if (this.item.Transaction.PaymentMethodId == MPPaymentMethodType.Office) {
        this.PaymentCode = MPTransactionFundsType.COUNTER;
      }
      if (item?.Transaction?.ProviderTransactionId) {
        this.item.RevenueCode = item?.Transaction?.ProviderTransactionId;
      }
      if (item?.Transaction?.Status) {
        this.browsingStatus = item?.Transaction?.Status;
      }
    }
    this.loadingPaymentCode = false;
  }

  public async confirm(): Promise<boolean> {
    this.errorMessage = null;
    let valid = true;
    let item = this.item;
    if (this.browsingStatus == MPTransactionStatusType.Process || this.browsingStatus == MPTransactionStatusType.Waiting) {
      if (!item?.UserInfo?.Id) {
        // ToastrHelper.Error("Trạng thái tài khoản không hợp lệ!");
        this.dialogService.ConfirmRedirect('Giao dịch thất bại', 'Trạng thái Tài khoản không hợp lệ. Vui lòng kiểm tra lại.', async () => {
          window.location.reload();
        })
        return false;
      }
      if (!item?.Transaction?.BankAccountNumber && !item?.Transaction?.BankAccountName && !item?.Transaction?.BankName) {
        this.dialogService.ConfirmRedirect('Giao dịch thất bại', 'Trạng thái Ví không hợp lệ. Vui lòng kiểm tra lại.', async () => {
          window.location.reload();
        })
        return false;
      }

      let validPaymentCode = false;
      if (this.action == "reject") {
        if (item?.Transaction?.PaymentMethodId == MPPaymentMethodType.BankTransfer) {
          if (this.item.MeeyResponseCode) {
            if (this.item.MeeyResponseCode == 'Lý do khác') {
              valid = await validation(this.item, ["StaffNote"]);
            } else valid = await validation(this.item, ["MeeyResponseCode"]);
          } else
            valid = await validation(this.item, ["MeeyResponseCode"]);
        } else valid = await validation(this.item, ["StaffNote"]);
        validPaymentCode = true;
      } else if (this.action == "approve" && this.browsingStatus == MPTransactionStatusType.Waiting && item?.Transaction?.PaymentMethodId == MPPaymentMethodType.BankTransfer) {
        validPaymentCode = true;
      } else if (this.action == "approve" && this.browsingStatus == MPTransactionStatusType.Process && item?.Transaction?.PaymentMethodId == MPPaymentMethodType.BankTransfer) {
        validPaymentCode = await validation(this.item, ['RevenueCode', 'ActualPaidAmount']);
      }

      if (valid && validPaymentCode) {
        if (this.item) {
          let BankInvoiceImageUrl = '';
          if (this.uploadFile) {
            let files = await this.uploadFile.upload();
            if (files && files.length > 0) {
              let file = files[0];
              let fileJson = [{
                "Name": file.Name,
                "Url": file.Path,
                "MimeType": file.NativeData.type
              }];
              BankInvoiceImageUrl = JSON.stringify(fileJson);
            }
          }
          let obj: any = {
            MeeyId: item?.UserInfo?.MeeyId,
            BankInvoiceImageUrl: BankInvoiceImageUrl,
            RevenueCode: item.RevenueCode,
            TransactionId: item.Transaction?.Id,
            Amount: this.item.Transaction?.Amount ? UtilityExHelper.formatStringtoNumber(this.item.Transaction?.Amount) : 0,
            ActualPaidAmount: this.item.ActualPaidAmount ? UtilityExHelper.formatStringtoNumber(this.item.ActualPaidAmount) : 0,
            StaffNote: this.item.StaffNote,
            BankId: item.Transaction.BankId,
            BankCode: item.Transaction.BankCode,
            MeeyResponseCode: item.MeeyResponseCode,
            PaymentMethodId: item.Transaction.PaymentMethodId,
            Status: item.Transaction.Status,
            action: this.action

          };
          if (this.action) {
            let message = "";
            let textConfrim = ""
            if (this.action == "reject") {
              message = "Từ chối Giao dịch thành công";
              textConfrim = "<p>Bạn xác nhận từ chối giao dịch rút tiền cho khách hàng?</p>";
            } else if (this.action == "approve" && this.browsingStatus == 4) {
              message = "Giao dịch ở trạng thái Đang xử lý, cần kế toán phê duyệt";
              textConfrim += "<p>Bạn xác nhận duyệt giao dịch rút tiền cho khách hàng?</p>";
            } else if (this.action == "approve" && this.browsingStatus == 2) {
              message = "Rút tiền thành công";
              if (item?.Transaction?.Amount < this.item.ActualPaidAmount) {
                this.errorMessage = "Số tiền thực tế chuyển vào TK (" + (this.item.ActualPaidAmount ? this.item.ActualPaidAmount.toLocaleString("vi-VN", { maximumFractionDigits: 2 }) : 0)
                  + "đ) lớn hơn số tiền gốc (" + (item?.Transaction?.Amount ? item?.Transaction?.Amount.toLocaleString("vi-VN", { maximumFractionDigits: 2 }) : 0)
                  + "đ)";
                return false;
              }
              textConfrim = "<p>Bạn xác nhận duyệt giao dịch rút tiền cho khách hàng?</p>";
            }
            if (message) {
              if (this.action == "approve") {
                let checkMeeyId = false;
                await this.userService.getByPhoneOrEmail(item?.UserInfo?.MeeyId).then((result: ResultApi) => {
                  if (ResultApi.IsSuccess(result)) {
                    checkMeeyId = true;
                  } else {
                    ToastrHelper.ErrorResult(result);
                    this.errorMessage = result.Description;
                  }
                });
                if (!checkMeeyId) return false;
              }
              this.dialogService.ConfirmAsync(textConfrim, async () => {
                if (this.item.UrlFile) {
                  let files = await this.uploadFile.upload();
                  obj.UrlFile = files && files.length > 0 ? files[0].Path : '';
                }
                return await this.service.MPayWithdrawalApproveOrReject(obj).then((result: ResultApi) => {
                  if (ResultApi.IsSuccess(result)) {
                    if (this.action == "reject") {
                      ToastrHelper.Success(message);
                      // this.dialogService.ConfirmRedirect('Từ chối giao dịch thành công', `${message}`, async () => {
                      //   window.location.reload();
                      // })
                      setTimeout(() => window.location.reload(), 3000);
                    }
                    if (this.action == "approve") {
                      // this.dialogService.ConfirmRedirect('Duyệt Giao dịch thành công', `${message}`, async () => {
                      //   // window.location.reload();
                      //   // this.eventService.ConfirmTransaction.emit(true);
                      // })
                      ToastrHelper.Success(message);
                      setTimeout(() => window.location.reload(), 3000);
                    }
                    return true;
                  }
                  this.errorMessage = result && result.Description;
                  return false;
                }, (e) => {
                  ToastrHelper.Exception(e);
                  return false;
                });
              })
            }
          }
        }
      }
      return false;
    } else {
      // ToastrHelper.Error("Trạng thái giao dịch không hợp lệ!");
      this.dialogService.ConfirmRedirect('Giao dịch thất bại', 'Trạng thái giao dich không hợp lệ. Vui lòng kiểm tra lại giao dịch.', async () => {
        window.location.reload();
      })
      return false;
    }
  }

}
