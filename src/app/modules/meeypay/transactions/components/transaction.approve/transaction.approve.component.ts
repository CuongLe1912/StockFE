import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { MPPaymentMethodType, MPTransactionFundsType } from "../../../../../_core/domains/entities/meeypay/enums/mp.transaction.status.type";
import { MPTransactionsEntity } from "../../../../../_core/domains/entities/meeypay/mp.transactions.entity";
import { AppInjector } from "../../../../../app.module";
import { validation } from "../../../../../_core/decorators/validator";
import { ResultApi } from "../../../../../_core/domains/data/result.api";
import { ToastrHelper } from "../../../../../_core/helpers/toastr.helper";
import { AdminDialogService } from "../../../../../_core/services/admin.dialog.service";
import { MPTransactionEventService, MPTransactionService } from "../../transactions.service";
import { UtilityExHelper } from "../../../../../_core/helpers/utility.helper";
import { EntityHelper } from "../../../../../_core/helpers/entity.helper";
import { EditorComponent } from "../../../../../_core/editor/editor.component";

@Component({
  templateUrl: "./transaction.approve.component.html",
  styleUrls: ["./transaction.approve.component.scss"],
})
export class MPTransactionApproveComponent implements OnInit {
  @ViewChild('uploadFile') uploadFile: EditorComponent;
  active: boolean;
  disabled: boolean;
  errorMessage: string;
  @Input() params: any;
  service: MPTransactionService;
  eventService: MPTransactionEventService;
  dialogService: AdminDialogService;

  MPPaymentMethodType = MPPaymentMethodType;

  PaymentCode = null;
  processSearchPaymentCode = false;
  processing = false;
  disabledPaymentCode = false;
  loadingPaymentCode: boolean = false;

  item: MPTransactionsEntity = new MPTransactionsEntity();
  mpRevenue: any = null;

  labelNote: string = "Ghi chú";
  paymentMethod: string;
  action: string = 'approve';

  constructor() {
    this.service = AppInjector.get(MPTransactionService);
    this.eventService = AppInjector.get(MPTransactionEventService);
    this.dialogService = AppInjector.get(AdminDialogService);
  }

  valueChange() {
    if (this.action == "reject") {
      this.disabled = this.item.Note ? false : true;
    }
  }

  actionChange() {
    if (this.action == "reject") {
      this.disabled = this.item.Note ? false : true;
      this.labelNote = "Lý do";
    } else if (this.action == "approve") {
      this.labelNote = "Ghi chú";
      this.disabled = false;
    }
  }

  async ngOnInit() {
    let item = this.params && this.params["item"];
    this.loadingPaymentCode = true;
    if (item) {
      this.item = EntityHelper.createEntity(MPTransactionsEntity, item);
      if (this.item.Transaction.PaymentMethodId == MPPaymentMethodType.Transfer) {
        this.PaymentCode = MPTransactionFundsType.BANK;
      } else if (this.item.Transaction.PaymentMethodId == MPPaymentMethodType.Office) {
        this.PaymentCode = MPTransactionFundsType.COUNTER;
      }
      if (item?.Transaction?.ProviderTransactionId) {
        this.item.SearchPaymentCode = item?.Transaction?.ProviderTransactionId;
        this.disabledPaymentCode = true;
      }
    }
    this.loadingPaymentCode = false;

    let paymentMethod = this.params && this.params["paymentMethod"];
    this.paymentMethod = paymentMethod || paymentMethod;
  }

  public async confirm(): Promise<boolean> {
    this.errorMessage = null;
    let valid = true;
    let item = this.item;
    if (this.action == "reject") {
      if (item?.Transaction?.PaymentMethodId != MPPaymentMethodType.MeeyPayAccount) {
        valid = await validation(this.item, ["Note", "MeeyResponseCode"]);
      } else valid = await validation(this.item, ["Note"]);
    }
    let ActualPaidAmount = item?.Transaction?.Amount;
    let validPaymentCode = false;
    if (this.item?.Transaction?.PaymentMethodId == MPPaymentMethodType.Transfer && this.action != "reject") {
      validPaymentCode = await validation(this.item, ['SearchPaymentCode']);
      if (validPaymentCode && this.mpRevenue) {
        ActualPaidAmount = this.mpRevenue?.Amount;
      }
    } else {
      if (this.mpRevenue?.Amount) {
        ActualPaidAmount = this.mpRevenue?.Amount;
      }
      validPaymentCode = true;
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
        let obj = {
          MeeyId: item.MeeyId,
          BankInvoiceImageUrl: BankInvoiceImageUrl,
          RevenueCode: item.SearchPaymentCode,
          TransactionId: item.Transaction.Id,
          ActualPaidAmount: ActualPaidAmount,
          StaffNote: this.item.Note,
          BankId: item.Transaction.BankId,
          BankCode: item.Transaction.BankCode,
          BuyerPhone: item.UserInfo.PhoneNumber,
          BuyerName: item.UserInfo.FirstName,
          BuyerEmail: item.UserInfo.Email,
          MeeyResponseCode: item.MeeyResponseCode,
          PaymentMethodId: item.Transaction.PaymentMethodId,
          action: this.action
        };
        if (this.action) {
          let message = "";
          let textConfrim = ""
          if (this.action == "reject") {
            message = "Từ chối thành công";
            textConfrim = "<p>Bạn xác nhận từ chối giao dịch nạp tiền cho khách hàng?</p>";
          } else if (this.action == "approve") {
            message = "Kiểm duyệt thành công";
            if (item?.Transaction?.Amount != ActualPaidAmount) {
              textConfrim = "<p><h6 class='text-danger'>Số tiền thực tế (" + (ActualPaidAmount ? ActualPaidAmount.toLocaleString("vi-VN", { maximumFractionDigits: 2 }) : 0)
                + "đ) khác số tiền gốc (" + (item?.Transaction?.Amount ? item?.Transaction?.Amount.toLocaleString("vi-VN", { maximumFractionDigits: 2 }) : 0)
                + "đ)</h6></p>"
            }
            textConfrim += "<p>Bạn xác nhận duyệt giao dịch nạp tiền cho khách hàng?</p>";
          }
          if (message) {
            this.dialogService.ConfirmAsync(textConfrim, async () => {
              return await this.service.ApproveOrReject(obj).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                  ToastrHelper.Success(message);
                  this.eventService.ConfirmTransaction.emit(true);
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
  }

  async searchPaymentCode() {
    if (!this.mpRevenue) {
      await this.checkPaymentCode();
    }

    if (this.mpRevenue) {
      this.viewDetail(this.mpRevenue)
    }
  }

  async changePaymentCode(code) {
    if (!this.processSearchPaymentCode && code) {
      this.processSearchPaymentCode = true;
      this.item.SearchPaymentCode = code;
      await this.checkPaymentCode();

      this.processSearchPaymentCode = false;
    }
  }

  async checkPaymentCode() {
    let valid = await validation(this.item, ['SearchPaymentCode']);
    if (valid) {
      this.mpRevenue = null;
      await this.service.MPayCheckPaymentCode(this.item.SearchPaymentCode).then(async (result: ResultApi) => {
        if (ResultApi.IsSuccess(result)) {
          let obj = result.Object;
          if (obj) {
            this.mpRevenue = obj;
          }
        } else {
          ToastrHelper.Error('Mã tiền thu không tồn tại trên hệ thống');
        }
      });
    }
  }

  viewDetail(item: any) {
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
}
