import * as _ from 'lodash';
import { Component, OnInit } from '@angular/core';
import { OptionItem } from '../../../_core/domains/data/option.item';
import { DataType } from '../../../_core/domains/enums/data.type';
import { ConstantHelper } from '../../../_core/helpers/constant.helper';
import { UtilityExHelper } from '../../../_core/helpers/utility.helper';
import { GridComponent } from '../../../_core/components/grid/grid.component';
import { ActionData } from '../../../_core/domains/data/action.data';
import { GridData } from '../../../_core/domains/data/grid.data';
import { MOOrdersEntity } from '../../../_core/domains/entities/meeyorder/order.entity';
import { ModalSizeType } from '../../../_core/domains/enums/modal.size.type';
import { MOOrdersService } from './orders.service';
import { NavigationStateData } from '../../../_core/domains/data/navigation.state';
import { BaseEntity } from '../../../_core/domains/entities/base.entity';
import { ResultApi } from '../../../_core/domains/data/result.api';
import { ActionType } from '../../../_core/domains/enums/action.type';
import { MOOrderStatisticalComponent } from './components/order.statistical.component';
import { CalculationUnitType } from '../../../_core/domains/entities/meeyorder/enums/calculation.unit.type';
import { MPPaymentMethodType } from '../../../_core/domains/entities/meeypay/enums/mp.transaction.status.type';
import { AppConfig } from '../../../_core/helpers/app.config';
import { TableData } from '../../../_core/domains/data/table.data';
import { ExportType } from '../../../_core/domains/enums/export.type';
import { HttpEventType } from '@angular/common/http';
import { EnumHelper } from '../../../_core/helpers/enum.helper';
import { DecoratorHelper } from '../../../_core/helpers/decorator.helper';
import { PdfPageSizeType } from '../../../_core/domains/enums/pdf.page.site.type';
import { MLOrderStatisticalComponent } from './order.statistical/order.statistical.component';
import { MOOrderStatusType } from '../../../_core/domains/entities/meeyorder/enums/order.status.type';

@Component({
  templateUrl: "../../../_core/components/grid/grid.component.html",
})
export class MOOrderComponent extends GridComponent {
  listClient = []
  obj: GridData = {
    Reference: MOOrdersEntity,
    Size: ModalSizeType.Large,
    UpdatedBy: false,
    DisableAutoLoad: true,
    Imports: [],
    Exports: [],
    Filters: [],
    SearchText: 'Nhập Số điện thoại, Email, MeeyId',
    Features: [
      {
        icon: 'la la-plus',
        name: 'Tạo đơn hàng',
        className: 'btn btn-primary',
        systemName: ActionType.AddNew,
        click: () => this.addNew()
      },
      ActionData.reload(() => {
        this.loadItems();
      }),
    ],
    MoreFeatures: {
      Name: "Xuất dữ liệu",
      Icon: "la la-download",
      Actions: [
        {
          name: 'Excel',
          icon: "la la-file-excel-o",
          systemName: ActionType.Export,
          click: () => this.export(ExportType.Excel),
        },
        {
          name: 'CSV',
          icon: "la la-file-text-o",
          systemName: ActionType.Export,
          click: () => this.export(ExportType.Csv),
        }
      ],
    },
    Actions: [
      {
        icon: 'la la-check',
        name: ActionType.ApproveOrder,
        className: 'btn btn-success',
        systemName: ActionType.ApproveOrder,
        hidden: ((item) => {
          if (item.Status === MOOrderStatusType.WAIT_CONFIRM) return false;
          return true;
        }),
        click: (item: any) => {
          this.approve(item);
        }
      },
      {
        icon: 'la la-eye',
        name: ActionType.View,
        className: 'btn btn-warning',
        systemName: ActionType.ViewDetail,
        click: (item: any) => {
          this.view(item);
        }
      },
    ],
    CustomFilters: [
      "Code", "Phone", "Status", "Sale",
      "ServiceId", "Email", "StartDate", "Support",
      "ProviderId", "MeeyId", "ClientId", "PartnerId",
      "ParentGroupId", "GroupId",
    ],
    AsynLoad: () => this.asynLoad(),
    EmbedComponent: MOOrderStatisticalComponent,
    StatisticalComponent: MLOrderStatisticalComponent,
  };

  constructor(public apiService: MOOrdersService) {
    super();
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
          let text = '<p><a routerLink="quickView">' + item.Code + '</a></p>';
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
        Property: "StatusText", Title: "Trạng thái đơn hàng", Type: DataType.String, Align: 'center',
        Format: (item: any) => {
          if (item.Status == null) return "";
          let option: OptionItem = ConstantHelper.MO_ORDER_STATUS_TYPES.find((c) => c.value == item.Status);
          let text = '<p class="' + (option && option.color) + '">' + (option && option.label) + "</p>";
          if (item.ApproveCount) text += '<p><em style="font-size: 11px;">(Đã duyệt ' + item.ApproveCount + ' lần)</em></p>'

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
        Property: "PriceText", Title: "Số tiền (vnđ)", Type: DataType.String, Align: 'right',
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
    await this.apiService.getClient().then((result: ResultApi) => {
      if (ResultApi.IsSuccess(result) && result.Object) {
        this.listClient = result.Object
      }
    })

    await this.render(this.obj);
    this.summaryText = 'Tổng tiền giao dịch: <b>' + UtilityExHelper.formatNumbertoString(this.itemTotal) + ' vnđ</b>';
  }

  addNew() {
    let obj: NavigationStateData = {
      prevData: this.itemData,
      prevUrl: "/admin/moorders",
    };
    this.router.navigate(["/admin/moorders/add"], {
      state: { params: JSON.stringify(obj) },
    });
  }

  async quickView(item: any, type: string) {
    if (!type || type == 'view') {
      this.view(item);
    }
    else if (!type || type == 'user') {
      let obj: NavigationStateData = {
        prevUrl: '/admin/mluser',
      };
      let url = AppConfig.getProtocol() + '//' + AppConfig.getDomain() + '/admin/mluser/view?meeyId=' + item.MeeyId;
      this.setUrlState(obj, 'mluser');
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

  view(item: BaseEntity) {
    let obj: NavigationStateData = {
      id: item.Id,
      prevData: this.itemData,
      prevUrl: "/admin/moorders",
    };
    this.router.navigate(["/admin/moorders/view-detail"], {
      state: { params: JSON.stringify(obj) },
    });
  }

  approve(item: BaseEntity) {
    let obj: NavigationStateData = {
      id: item.Id,
      prevData: this.itemData,
      prevUrl: "/admin/moorders",
    };
    this.router.navigate(["/admin/moorders/approve"], {
      state: { params: JSON.stringify(obj) },
    });
  }

  asynLoad() {
    let ids = this.items && this.items.filter(c => c['OrderHistory'] && c['OrderHistory']['transaction_id']).map(c => c['MeeyId'] + '_' + c['OrderHistory']['transaction_id']);

    if (ids && ids.length > 0) {
      this.apiService.TransByIds(ids).then((result: ResultApi) => {
        if (ResultApi.IsSuccess(result)) {
          this.items.forEach((item: any) => {
            let trans = result.Object && result.Object.find(c => c.TransactionId == item.OrderHistory?.transaction_id);
            if (trans) {
              if(trans.PaymentMethodId == MPPaymentMethodType.TransactionReward){
                let text = '<p>' + 'Tài khoản ưu đãi' + '</p>';
                item['PaymentMethod'] = text;
              }
              else if (trans.PaymentMethodId == MPPaymentMethodType.OnlineATM || trans.PaymentMethodId == MPPaymentMethodType.Card) {
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

  getUnitName(unitName) {
    let keys = Object.keys(CalculationUnitType).find(x => CalculationUnitType[x] == unitName);
    if (keys) {
      return UtilityExHelper.createLabel(keys)
    }
    return unitName;
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

  export(exportType: ExportType) {
    this.loading = true
    let table = DecoratorHelper.decoratorClass(this.obj.Reference),
      objData: TableData = _.cloneDeep(this.itemData);
    objData.Export = {
      Type: exportType,
    }
    if (exportType == ExportType.Pdf) {
      objData.Export.PageSize = PdfPageSizeType.A4
      objData.Export.Landscape = true
    }
    objData.Name = "Danh sách đơn hàng"
    let fileName = "Danh sách đơn hàng_" + new Date().getTime();
    return this.service.downloadFile(table.name, objData).toPromise().then(data => {
      this.loading = false
      switch (data.type) {
        case HttpEventType.DownloadProgress:
          break;
        case HttpEventType.Response:
          let extension = exportType == ExportType.Excel
            ? 'xlsx'
            : EnumHelper.exportName(ExportType, exportType).toLowerCase();
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

  loadComplete() {
    this.summaryText = 'Tổng tiền giao dịch: <b>' + UtilityExHelper.formatNumbertoString(this.itemTotal) + ' vnđ</b>';
  }

}
