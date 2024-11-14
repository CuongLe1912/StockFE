import * as _ from 'lodash';
import { Component, OnInit } from "@angular/core";
import { MPTransactionService } from "./transactions.service";
import { AppConfig } from "../../../_core/helpers/app.config";
import { GridData } from "../../../_core/domains/data/grid.data";
import { DataType } from "../../../_core/domains/enums/data.type";
import { OptionItem } from "../../../_core/domains/data/option.item";
import { ActionData } from "../../../_core/domains/data/action.data";
import { ActionType, ControllerType } from "../../../_core/domains/enums/action.type";
import { ConstantHelper } from "../../../_core/helpers/constant.helper";
import { UtilityExHelper } from "../../../_core/helpers/utility.helper";
import { BaseEntity } from "../../../_core/domains/entities/base.entity";
import { ModalSizeType } from "../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../_core/components/grid/grid.component";
import { NavigationStateData } from "../../../_core/domains/data/navigation.state";
import { MPTransactionsEntity } from "../../../_core/domains/entities/meeypay/mp.transactions.entity";
import { MPTransactionStatisticalComponent } from "./transaction.statistical/transaction.statistical.component";
import { MPPaymentMethodType, MPTransactionStatusType, MPTransactionType } from "../../../_core/domains/entities/meeypay/enums/mp.transaction.status.type";
import { ResultApi } from "../../../_core/domains/data/result.api";
import { MOOrdersService } from "../../meeyorder/orders/orders.service";
import { AppInjector } from "../../../app.module";
import { MPMenuButtonComponent } from "./components/menu.button/menu.button.component";
import { MPInvoiceService } from "../invoice/invoice.service";
import { DecoratorHelper } from "../../../_core/helpers/decorator.helper";
import { TableData } from "../../../_core/domains/data/table.data";
import { ExportType } from "../../../_core/domains/enums/export.type";
import { HttpEventType } from "@angular/common/http";

@Component({
  templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class MPTransactionsComponent extends GridComponent implements OnInit {
  listClient = []
  obj: GridData = {
    ScrollX: true,
    DisableAutoLoad: true,
    Imports: [],
    Exports: [],
    Filters: [],
    Actions: [
      {
        icon: 'la la-check',
        className: 'btn btn-success',
        name: ActionType.ApproveDeposit,
        systemName: ActionType.ApproveDeposit,
        hidden: ((item) => {
          return !(item[ActionType.ApproveDeposit] && this.checkApprovePayment(item));
        }),
        click: (item: any) => {
          this.approve(item);
        }
      },
      {
        icon: 'la la-check',
        className: 'btn btn-primary',
        name: ActionType.ApproveWithdraw,
        systemName: ActionType.ApproveWithdraw,
        hidden: ((item) => {
          return !(item[ActionType.ApproveWithdraw] && this.checkApproveWithdrawalPayment(item) && item.Status == MPTransactionStatusType.Waiting);
        }),
        click: (item: any) => {
          this.approve(item);
        }
      },
      {
        icon: 'la la-check',
        className: 'btn btn-primary',
        name: ActionType.ApproveWithdraw,
        systemName: ActionType.AccountantApprove,
        hidden: ((item) => {
          return !(this.checkApproveWithdrawalPayment(item) && item.Status == MPTransactionStatusType.Process);
        }),
        click: (item: any) => {
          this.approve(item);
        }
      },
      {
        icon: 'la la-eye',
        name: ActionType.ViewDetail,
        className: 'btn btn-warning',
        systemName: ActionType.ViewDetail,
        hidden: ((item) => {
          return !item[ActionType.ViewDetail];
        }),
        click: (item: any) => {
          this.view(item);
        }
      }
    ],
    Features: [
      {
        name: "Xuất dữ liệu",
        icon: "la la-download",
        className: 'btn btn-success',
        systemName: ActionType.Export,
        click: () => {
          if (this.itemData?.Paging?.Total > 10000) {
            this.dialogService.Alert('Thông báo', 'File export tối đa 10 nghìn dòng!');
          } else this.export()
        },
      },
      ActionData.reload(() => { this.loadItems(); }),
    ],
    UpdatedBy: false,
    Title: 'Giao dịch nạp tiền',
    Size: ModalSizeType.ExtraLarge,
    Reference: MPTransactionsEntity,
    PageSizes: [5, 10, 20, 50, 100],
    SearchText: 'Nhập mã, tên, email, số điện thoại',
    CustomFilters: [
      'TransactionType', 'Code', 'CustomerCode', 'CreateTime',
      'PaymentMethod', 'RefTransaction', 'Phone', 'Sale',
      'Status', 'OrderCode', 'Email', 'Support',
      'Source', 'CreatedUser', 'ApprovedBy'
    ],
    EmbedComponent: MPMenuButtonComponent,
    StatisticalComponent: MPTransactionStatisticalComponent,
  };

  orderService: MOOrdersService;
  invoiceService: MPInvoiceService;

  constructor(private apiService: MPTransactionService) {
    super();
    this.orderService = AppInjector.get(MOOrdersService);
    this.invoiceService = AppInjector.get(MPInvoiceService);
  }

  async ngOnInit() {
    let allowAddNew = await this.authen.permissionAllow(ControllerType.MPTransactions, ActionType.AddNew); //quyền tạo
    if (allowAddNew) {
      this.obj.Features.unshift(ActionData.addNew(() => this.addNewTransaction()));
    }
    this.properties = [
      {
        Property: 'CodeText', Title: 'Mã giao dịch', Type: DataType.String, ColumnWidth: 150,
        Format: ((item: any) => {
          if (!item.Code) return ''
          return '<a routerLink="quickView" type="view">' + item.Code + '</a>';
        }),
        HideCheckbox: (item: any) => {
          let checkDate = false;
          if (item.UpdateDate) {
            let itemDate = new Date(item.UpdateDate);
            let date = new Date();
            if (date.getMonth() == itemDate.getMonth()) {
              checkDate = true;
            }
          }
          return !(item.Status == MPTransactionStatusType.Success && item.TransactionTypeId == MPTransactionType.Topup && checkDate);
        },
      },
      {
        Property: 'Customers', Title: 'Khách hàng', Type: DataType.String, ColumnWidth: 200,
        Format: ((item: any) => {
          let result = UtilityExHelper.renderUserInfoFormat(item.CustomerName, item.CustomerPhone, item.CustomerEmail, true);
          if (item.MeeyId) {
            result += '<p style="min-height: 25px; overflow: visible;">' +
              '<a style="text-decoration: none !important;" data="' + item.MeeyId + '" tooltip="Sao chép" flow="right"><i routerlink="copy" class="la la-copy"></i></a>' +
              '<a routerLink="quickView" type="user" tooltip="Xem chi tiết">' + item.MeeyId + '</a></p>';
          }
          return result;
        })
      },
      {
        Property: 'CreatedDateText', Title: 'Thời gian tạo', Type: DataType.String, ColumnWidth: 100,
        Format: ((item: any) => {
          if (!item.CreatedDate) return ''
          return UtilityExHelper.dateTimeString(item.CreatedDate);
        })
      },
      { Property: 'TransactionType', Title: 'Loại GD', Type: DataType.String, ColumnWidth: 150 },
      {
        Property: 'AmountText', Title: 'Số tiền (đ)', Type: DataType.String, ColumnWidth: 120, Align: 'right',
        Format: ((item: any) => {
          if (!item.Amount) return ''
          return item.Amount.toLocaleString("vi-VN", { maximumFractionDigits: 2 });
        })
      },
      {
        Property: 'PaymentMethodText', Title: 'Phương thức GD', Type: DataType.String, ColumnWidth: 150,
        Format: (item) => {
          let text = "<p>" + item.PaymentMethod + "</p>";
          if (item.PaymentMethodId != MPPaymentMethodType.Transfer) {
            if (item.BankName) text += "<p>" + item.BankName + "</p>"
          } else if (item.PaymentMethodId != MPPaymentMethodType.OnlineATM) {
            if (item.PaymentProvider) text += "<p>" + item.PaymentProvider + "</p>"
            if (item.BankName) text += "<p>" + item.BankName + "</p>"
          }
          return text;
        }
      },
      {
        Property: 'StatusText', Title: 'Trạng thái', Type: DataType.String, Align: 'center', ColumnWidth: 120,
        Format: ((item: any) => {
          if (item.Status == null) return "";
          let option: OptionItem = ConstantHelper.MP_TRANSACTION_STATUS_TYPES.find((c) => c.value == item.Status);
          let text = '<p class="' + (option && option.color) + '">' + (option && option.label) + "</p>";
          return text;
        })
      },
      {
        Property: 'ReceivedUser', Title: 'Tk nhận tiền', Type: DataType.String, ColumnWidth: 200,
        Format: ((item: any) => {
          if (item?.TransactionTypeId) {
            if (item.TransactionTypeId == MPTransactionType.Payment) {
              return item.MerchantName;
            }
            // if (item.TransactionTypeId == MPTransactionType.Transfer)
            //   return UtilityExHelper.renderUserInfoFormat(item.BuyerFullName, item.BuyerPhoneNumber, item.BuyerEmail, true, 'received');
            else if (item.TransactionTypeId == MPTransactionType.Withdrawal) {
              let text = '<a routerLink="quickView" type="received">' + UtilityExHelper.escapeHtml(item.BankAccountName) + '</a>'
              if (item?.BankAccountNumber) text += '<p><i class=\'la la-inbox\'></i>' + UtilityExHelper.escapeHtml(item.BankAccountNumber) + '</span></p>';
              if (item?.BankBranch) text += '<p><i class=\'la la-university\'></i>' + item?.BankName + ' - ' + UtilityExHelper.escapeHtml(item.BankBranch) + '</span></p>';
              return text;
            }
          }
          let result = UtilityExHelper.renderUserInfoFormat(item.ReceiveName, item.ReceivePhone, item.ReceiveEmail, true, 'received');
          return result;
        })
      },
      {
        Property: 'RefTransactionLink', Title: 'GD liên quan', Type: DataType.String, ColumnWidth: 150,
        Format: ((item: any) => {
          if (!item.RefTransaction) return ''
          return '<a routerLink="quickView" type="refTransaction">' + item.RefTransaction + '</a>';
        })
      },
      { Property: 'OrderCode', Title: 'Mã đơn hàng', Type: DataType.String, ColumnWidth: 150 },
      {
        Property: 'ProviderTransactionId', Title: 'Mã tham chiếu', Type: DataType.String, Active: false, ColumnWidth: 200,
        Format: ((item: any) => {
          if (!item.ProviderTransactionId) return ''
          return item.ProviderTransactionId != "0" ? item.ProviderTransactionId : '';
        })
      },
      {
        Property: 'WalletBalanceBefore', Title: 'Số dư trước (đ)', Type: DataType.String, ColumnWidth: 120, Align: 'right', Active: false,
        Format: ((item: any) => {
          if (!item.WalletBalanceBefore) return ''
          return item.WalletBalanceBefore.toLocaleString("vi-VN", { maximumFractionDigits: 2 });
        })
      },
      {
        Property: 'WalletBalanceAfter', Title: 'Số dư sau (đ)', Type: DataType.String, ColumnWidth: 120, Align: 'right',
        Format: ((item: any) => {
          if (!item.WalletBalanceAfter) return ''
          return item.WalletBalanceAfter.toLocaleString("vi-VN", { maximumFractionDigits: 2 });
        })
      },
      { Property: 'WalletType', Title: 'Loại TK', Type: DataType.String, Active: false, ColumnWidth: 200 },
      {
        Property: 'CreateBy', Title: 'Người tạo', Type: DataType.String, Active: false, ColumnWidth: 200,
        Format: ((item: any) => {
          if (!item.TransactionHistories || item.TransactionHistories.length < 1) return ''
          let user = item.TransactionHistories.find(c => c.HistoryTypeId == 1);
          if (!user) return ''
          return user.CreateBy == 'user' ? 'Khách hàng' : user.CreateBy;
        })
      },
      {
        Property: 'Staff', Title: 'Người duyệt', Type: DataType.String, Active: false, ColumnWidth: 200,
        Format: ((item: any) => {
          if (!item.TransactionHistories || item.TransactionHistories.length < 1) return ''
          let user = item.TransactionHistories.find(c => c.HistoryTypeId == 2);
          if (!user) return ''
          return user.CreateBy;
        })
      },
      {
        Property: 'Sale', Title: 'Người hỗ trợ', Type: DataType.String, Active: false, ColumnWidth: 250,
        Format: ((item: any) => {
          //return '<div class="kt-spinner kt-spinner--v2 kt-spinner--primary"></div>';
          let text: string = '';
          text += '<p>Sale: <a routerLink="quickView" type="sale">' + UtilityExHelper.escapeHtml(item.Sale) + '</a></p>';
          text += '<p>CSKH: <a routerLink="quickView" type="support">' + UtilityExHelper.escapeHtml(item.Support) + '</a></p>';
          return text;
        })
      },
      {
        Property: 'Source', Title: 'Nơi tạo', Type: DataType.String, Active: false, ColumnWidth: 200,
        Format: ((item) => {
          return this.getClientName(item.Source)
        })
      },
    ];
    await this.orderService.getClient().then((result: ResultApi) => {
      if (ResultApi.IsSuccess(result) && result.Object) {
        this.listClient = result.Object
      }
    })

    let allowAddInvoice = await this.authen.permissionAllow('MPInvoice', ActionType.AddNew);
    if (allowAddInvoice) {
      this.obj.Checkable = true;
      this.obj.Features.unshift({
        hide: true,
        icon: 'la la-share',
        toggleCheckbox: true,
        name: 'Yêu cầu xuất HĐ',
        className: 'btn btn-primary',
        systemName: ActionType.Empty,
        click: (async (item) => {
          let cloneItems: any[] = this.items && this.items.filter(c => c.Checked);
          if (!cloneItems || cloneItems.length == 0) {
            this.dialogService.Alert('Thông báo', 'Vui lòng chọn tối thiểu 1 bản ghi');
            return;
          }
          if (cloneItems.length > 0) {
            const invoices = cloneItems.map(c => { return { TransactionCode: c.Code } });
            let valid = await this.invoiceService.checkTransactions(invoices).then((result: ResultApi) => {
              if (ResultApi.IsSuccess(result)) {
                if (result.Object && result.Object.length > 0) {
                  this.dialogService.Alert('Thông báo', 'Đã tồn tại [' + result.Object.length + '] mã giao dịch cần xuất hóa đơn: ' + result.Object.map(c => c.TransactionCode).join(', '));
                  return false;
                } else return true;
              } else {
                this.dialogService.AlertResult('Lỗi', result);
                return false;
              }
            });
            if (valid) {
              let obj: NavigationStateData = {
                object: { transactions: cloneItems },
                prevData: this.itemData,
                prevUrl: "/admin/mptransactions",
              };
              this.router.navigate(["/admin/mpinvoice/add"], {
                state: { params: JSON.stringify(obj) },
              });
            }
          }
        })
      });
    }

    this.render(this.obj);
  }

  view(item: BaseEntity) {
    let obj: NavigationStateData = {
      prevUrl: '/admin/mptransactions',
    };
    let url = AppConfig.getProtocol() + '//' + AppConfig.getDomain() + '/admin/mptransactions/view?id=' + item.Id;
    this.setUrlState(obj, 'mp_transactions');
    window.open(url, "_blank");
  }

  approve(item: BaseEntity) {
    let obj: NavigationStateData = {
      prevUrl: '/admin/mptransactions',
    };
    let url = AppConfig.getProtocol() + '//' + AppConfig.getDomain() + '/admin/mptransactions/view?id=' + item.Id + '&approve=true';
    this.setUrlState(obj, 'mp_transactions');
    window.open(url, "_blank");
  }

  quickView(item: any, type: string) {
    if (!type || type == 'view') {
      this.view(item);
    } else if (!type || type == 'user') {
      let obj: NavigationStateData = {
        prevUrl: '/admin/mluser',
      };
      let url = AppConfig.getProtocol() + '//' + AppConfig.getDomain() + '/admin/mluser/view?meeyId=' + item.MeeyId;
      this.setUrlState(obj, 'mluser');
      window.open(url, "_blank");
    } else if (!type || type == 'refTransaction') {
      let obj: NavigationStateData = {
        prevUrl: '/admin/mptransactions',
      };
      let url = AppConfig.getProtocol() + '//' + AppConfig.getDomain() + '/admin/mptransactions/view?id=' + item.RefTransaction;
      this.setUrlState(obj, 'mp_transactions');
      window.open(url, "_blank");
    }
  }
  public setUrlState(state: NavigationStateData, controller: string = null) {
    if (!controller) controller = this.getController();
    let stateKey = 'params',
      navigation = this.router.getCurrentNavigation(),
      sessionKey = 'session_' + stateKey + '_' + controller;
    if (state) sessionStorage.setItem(sessionKey, JSON.stringify(state));
  }
  addNewTransaction() {
    let obj: NavigationStateData = {
      // prevData: this.itemData,
      prevUrl: '/admin/mptransaction',
    };
    this.router.navigate(['/admin/mptransactions/add'], { state: { params: JSON.stringify(obj) } });
  }

  checkApprovePayment(item: any) {
    let checkMethod = false;
    if (item.PaymentMethodId == MPPaymentMethodType.MeeyPayAccount) {
      if (item.TransactionTypeId == MPTransactionType.Donate) checkMethod = true;
    } else {
      if (item.TransactionTypeId == MPTransactionType.Topup) checkMethod = true;
    }
    return [MPPaymentMethodType.Transfer, MPPaymentMethodType.Office, MPPaymentMethodType.MeeyPayAccount].includes(item.PaymentMethodId)
      && (item.Status == MPTransactionStatusType.Waiting)
      && checkMethod
  }

  checkApproveWithdrawalPayment(item: any) {
    let checkMethod = false;
    if (item.PaymentMethodId == MPPaymentMethodType.BankTransfer) {
      if (item.TransactionTypeId == MPTransactionType.Withdrawal) checkMethod = true;
    }
    return [MPPaymentMethodType.Transfer, MPPaymentMethodType.Office, MPPaymentMethodType.BankTransfer].includes(item.PaymentMethodId)
      && (item.Status == MPTransactionStatusType.Waiting || item.Status == MPTransactionStatusType.Process)
      && checkMethod
  }

  getClientName(code) {
    if (this.listClient) {
      let client = this.listClient.find(c => c.ClientId == code)
      if (client) {
        return client.Name
      }
    }

    return code
  }

  export() {
    this.loading = true;
    let table = DecoratorHelper.decoratorClass(this.obj.Reference),
      objData: TableData = _.cloneDeep(this.itemData);
    objData.Export = {
      Type: ExportType.Excel,
    }
    objData.Name = "Danh sách giao dịch"
    let fileName = "Danh sách giao dịch_" + new Date().getTime();
    return this.service.downloadFile(table.name, objData).toPromise().then(data => {
      this.loading = false
      switch (data.type) {
        case HttpEventType.DownloadProgress:
          break;
        case HttpEventType.Response:
          let extension = 'xlsx'
          const downloadedFile = new Blob([data.body], { type: data.body.type });
          const a = document.createElement('a');
          a.setAttribute('style', 'display:none;');
          document.body.appendChild(a);
          a.download = fileName + '.' + extension;
          a.href = URL.createObjectURL(downloadedFile);
          a.target = '_blank';
          a.click();
          document.body.removeChild(a);
          break;
      }
      return true;
    }).catch(ex => {
      this.loading = false
    });
  }
}