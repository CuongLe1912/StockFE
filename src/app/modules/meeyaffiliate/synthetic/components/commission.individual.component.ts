import { Component, Input, OnInit } from '@angular/core';
import { OptionItem } from '../../../../_core/domains/data/option.item';
import { ConstantHelper } from '../../../../_core/helpers/constant.helper';
import { GridComponent } from '../../../../_core/components/grid/grid.component';
import { GridData } from '../../../../_core/domains/data/grid.data';
import { DataType } from '../../../../_core/domains/enums/data.type';
import { ModalSizeType } from '../../../../_core/domains/enums/modal.size.type';
import { ActionData } from '../../../../_core/domains/data/action.data';
import { ActionType } from '../../../../_core/domains/enums/action.type';
import { MAFNodeType, MAFStatusCommissionType } from '../../../../_core/domains/entities/meeyaffiliate/enums/affiliate.type';
import { UtilityExHelper } from '../../../../_core/helpers/utility.helper';
import { MAFAffiliateSyntheticEntity } from '../../../../_core/domains/entities/meeyaffiliate/affiliate.synthetic.entity';
import { MAFContractStatus, MAFContractType } from '../../../../_core/domains/entities/meeyaffiliate/enums/contract.type';
import { NavigationStateData } from '../../../../_core/domains/data/navigation.state';
import { AppConfig } from '../../../../_core/helpers/app.config';
import { CompareType } from '../../../../_core/domains/enums/compare.type';
import { MAFNavDetailMenuComponent } from './nav.detail.menu/nav.detail.menu.component';
import { MAFApprovePaymentCommissionComponent } from './approve.payment.commission/approve.payment.commission.component';
import { TableData } from '../../../../_core/domains/data/table.data';
import { ExportType } from '../../../../_core/domains/enums/export.type';
import { HttpEventType } from '@angular/common/http';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { MLUserService } from '../../../../modules/meeyuser/user.service';
import { MethodType } from '../../../../_core/domains/enums/method.type';

@Component({
  templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class MAFCommissionIndividualComponent extends GridComponent implements OnInit {
  obj: GridData = {
    Reference: MAFAffiliateSyntheticEntity,
    Size: ModalSizeType.Large,
    UpdatedBy: false,
    Imports: [],
    Exports: [],
    Filters: [],
    Actions: [],
    Features: [
      {
        name: "Xuất dữ liệu",
        icon: "la la-download",
        className: 'btn btn-success',
        systemName: ActionType.Export,
        click: () => this.export()
      },
      ActionData.reload(() => {
        this.loadItems();
      }),
    ],
    CustomFilters: ['FilterCustomer', { Name: 'FilterMonth', AllowClear: false }, 'FilterContractStatusId', 'FilterPaymentStatusId', 'FilterInvoiceStatusId', 'FilterBranchId', 'FilterRankId', 'FilterParent'],
    DisableAutoLoad: true,
    NotKeepPrevData: true,
    AsynLoad: () => this.asynLoad(),
    EmbedComponent: MAFNavDetailMenuComponent,
  };

  @Input() params: any;

  constructor(public userService: MLUserService) {
    super();
    if (!this.breadcrumbs) {
      this.breadcrumbs = [];
      this.breadcrumbs.push({ Name: 'Khách hàng' })
      this.breadcrumbs.push({ Name: 'Cây hoa hồng KH' })
    }
    this.breadcrumbs.push({ Name: 'Danh sách hoa hồng Cá nhân' })
  }

  async ngOnInit() {
    this.properties = [
      {
        Property: 'UserInfo', Title: 'Thông tin cá nhân', Type: DataType.String,
        Format: ((item: any) => {
          let result = '<div style="position: relative;">';
          result += UtilityExHelper.renderUserInfoFormat(item.Name, item.Phone, item.Email, true);
          if (item.Ref) {
            result += '<p style="min-height: 25px; overflow: visible;">Mã Ref: <a routerLink="quickView" type="refcode" tooltip="Xem chi tiết">' + item.Ref + '</a></p>';
          }
          if (!item?.Contract || item?.Contract?.Status != MAFContractStatus.Approve) result += '<span flow="down" class="grid-row-corner-tooltip text-warning" tooltip="Chưa hoàn thiện hợp đồng"><i class="fa fa-info-circle"></i></span>'
          result += '</div>';
          return result;
        })
      },
      { Property: 'Branch', Title: 'Nhánh', Type: DataType.String },
      { Property: 'ContractTypeName', Title: 'Loại KH', Type: DataType.String },
      { Property: 'RankCumulative', Title: 'Cấp bậc', Type: DataType.String },
      { Property: 'Level', Title: 'Tầng', Type: DataType.String },
      {
        Property: 'FnAmount', Title: 'Doanh số nhóm', Type: DataType.String, Align: 'right',
        Format: ((item: any) => {
          return '<div class="kt-spinner kt-spinner--v2 kt-spinner--primary"></div>';
        })
      },
      {
        Property: 'F1Amount', Title: 'Doanh số F1', Type: DataType.String, Align: 'right',
        Format: ((item: any) => {
          if (!item.F1Amount) return ''
          return item.F1Amount.toLocaleString("vi-VN", { maximumFractionDigits: 2 });
        })
      },
      {
        Property: 'Commission', Title: 'Hoa hồng tạm tính', Type: DataType.String, Align: 'right',
        Format: ((item: any) => {
          if (!item.Commission) return '';
          let text = '<p>' + item.Commission.toLocaleString("vi-VN", { maximumFractionDigits: 2 }) + '</p>';
          if (item.PayCommissionAmount) text += '<p><em>(Thực nhận: ' + item.PayCommissionAmount.toLocaleString("vi-VN", { maximumFractionDigits: 2 }) + ')</em></p>'
          return text;
        })
      },
      {
        Property: 'PayAmount', Title: 'Hoa hồng thực nhận', Type: DataType.String, Align: 'right',
        Format: ((item: any) => {
          if (!item.PayAmount) return ''
          return item.PayAmount.toLocaleString("vi-VN", { maximumFractionDigits: 2 });
        })
      },
      {
        Property: 'PaymentUser', Title: 'Tài khoản nhận tiền', Type: DataType.String, Align: 'right',
        Format: ((item) => {
          return '<div class="kt-spinner kt-spinner--v2 kt-spinner--primary"></div>';
        })
      },
      {
        Property: 'StatusText', Title: 'Trạng thái', Type: DataType.String,
        Format: ((item: any) => {
          let text = '';          
          if (item.Status != MAFStatusCommissionType.Paid) {
            text = '<p><span class="kt-badge kt-badge--inline kt-badge--warning">Chưa thanh toán</span></p>';
          } else {
            let option: OptionItem = ConstantHelper.MAF_STATUS_COMMISSION_TYPES.find((c) => c.value == item.Status);
            text = '<p class="' + (option && option.color) + '">' + (option && option.label) + "</p>";
          }
          // if (item.Message) {
          //   text += '<p class="error">' + item.Message + '</p>';
          // }
          return text
        })
      },
      { Property: 'PaymentDateTime', Title: 'Thời gian TT', Type: DataType.DateTime },
      {
        Property: 'TransactionText', Title: 'Mã giao dịch', Type: DataType.String,
        Format: ((item) => {
          if (!item.TransactionId) return '';
          if (typeof item.TransactionId != "string") {
            return item.TransactionId;
          }
          if (!isNaN(item.TransactionId) && !isNaN(parseFloat(item.TransactionId))) {
            return '<a routerLink="quickView" type="transaction" tooltip="Xem chi tiết">' + item.TransactionId + '</a></p>';
          } else return item.TransactionId;
        })
      },
    ];

    let date = new Date();
    let month = date.getMonth() + "/" + date.getFullYear();
    let FilterMonth = this.params && this.params['month'];
    if (this.router?.routerState?.snapshot?.root?.queryParams["month"]) {
      FilterMonth = this.router?.routerState?.snapshot?.root?.queryParams["month"];
    }
    if (!FilterMonth) FilterMonth = month;

    this.setFilter([{
      Name: "FilterMonth",
      Value: FilterMonth,
      Compare: CompareType.D_Equals,
    }])

    this.obj.Url = '/admin/mafaffiliatesynthetic/CommissionItems?type=' + MAFContractType.Individual;

    this.render(this.obj);
  }

  async loadComplete() {
    this.obj.Features = [
      {
        name: "Xuất dữ liệu",
        icon: "la la-download",
        className: 'btn btn-success',
        systemName: ActionType.Export,
        click: () => this.export()
      },
      ActionData.reload(() => {
        this.loadItems();
      }),
    ]
    let action = "CommissionCollected?type=" + MAFContractType.Individual;
    await this.service.callApi("MAFAffiliateSynthetic", action, this.itemData, MethodType.Post).then((result: ResultApi) => {
      if (ResultApi.IsSuccess(result)) {
        if (result.Object) {
          if (result.Object?.UserEligible) {
            if (result.Object.UserEligible > 0) {
              this.obj.Features = [
                {
                  name: "Xuất dữ liệu",
                  icon: "la la-download",
                  className: 'btn btn-success',
                  systemName: ActionType.Export,
                  click: () => this.export()
                },
                {
                  icon: 'la la-money',
                  name: "Thanh toán hoa hồng",
                  className: 'btn btn-primary',
                  systemName: ActionType.Payment,
                  click: (item: any) => this.payment(item)
                },
                ActionData.reload(() => {
                  this.loadItems();
                }),
              ]
            }
          }
        }
      }
    });
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
    } else if (!type || type == 'refcode') {
      let obj: NavigationStateData = {
        prevUrl: '/admin/affiliate',
      };
      let url = AppConfig.getProtocol() + '//' + AppConfig.getDomain() + '/admin/mafaffiliate/view?id=' + item.Ref;
      this.setUrlState(obj, 'affiliate');
      window.open(url, "_blank");
    } else if (!type || type == 'transaction') {
      let obj: NavigationStateData = {
        prevUrl: '/admin/mptransactions',
      };
      let url = AppConfig.getProtocol() + '//' + AppConfig.getDomain() + '/admin/mptransactions/view?id=' + item.TransactionId;
      this.setUrlState(obj, 'mptransactions');
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

  payment(item) {
    let date = new Date();
    let month = (date.getMonth() + 1) + "/" + date.getFullYear();
    let FilterMonth = this.itemData.Filters.find(c => c.Name == "FilterMonth")?.Value;
    if (!FilterMonth) {
      FilterMonth = this.params && this.params['month'];
      if (this.router?.routerState?.snapshot?.root?.queryParams["month"]) {
        FilterMonth = this.router?.routerState?.snapshot?.root?.queryParams["month"];
      }
    }
    if (!FilterMonth) FilterMonth = month;

    this.dialogService.WapperAsync({
      cancelText: 'Hủy',
      confirmText: 'Xác nhận',
      size: ModalSizeType.Large,
      objectExtra: {
        item: item,
        action: 'payment',
        type: MAFContractType.Individual,
        month: FilterMonth,
      },
      title: 'Thanh toán hoa hồng về TKKM1',
      object: MAFApprovePaymentCommissionComponent,
    }, async () => this.loadItems());
  }

  export() {
    this.loading = true
    let urlExport = '/admin/mafaffiliatesynthetic/ExportCommissionItems?type=' + MAFContractType.Individual;
    let objData: TableData = this.itemData;
    objData.Export = {
      Type: ExportType.Excel,
    }
    objData.Name = "Danh sách hoa hồng Cá nhân"
    let fileName = "Danh sách hoa hồng Cá nhân_" + new Date().getTime();
    return this.service.downloadFileByUrl(urlExport, objData).toPromise().then(data => {
      this.loading = false
      switch (data.type) {
        case HttpEventType.DownloadProgress:
          break;
        case HttpEventType.Response:
          let extension = 'xlsx';
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
      this.loading = true
    });
  }

  asynLoad() {
    let ids = this.items && this.items.filter(c => c['MeeyId']).map(c => c['MeeyId']);
    if (ids && ids.length > 0) {
      this.userService.GetAllWalletByMeeyIds(ids).then((result: ResultApi) => {
        if (ResultApi.IsSuccess(result)) {
          let items = result.Object;
          this.items.forEach((item: any) => {
            let itemDb = items.find(c => c.MeeyId == item.MeeyId);
            let text = '';
            if (itemDb) {
              if (item.PaymentInfomation) text += '<p>' + UtilityExHelper.escapeHtml(item.PaymentInfomation) + '</p>';
              if (itemDb.MPPhone) text += '<p>' + UtilityExHelper.escapeHtml(itemDb.MPPhone) + '</p>';
            } else {
              text = '<p style="color: #384AD7;"><b><i class="la la-info" style="margin-right: 2px;"></i></b>Chưa liên kết</p>';
            }
            item['PaymentUser'] = text;
          });
        }
      });
    }

    let nodeIds = this.originalItems && this.originalItems.filter(c => c['NodeId'])
      .filter(c => c['Commission'] > 0)
      .map(c => c['NodeId']);
    if (nodeIds && nodeIds.length > 0) {
      this.userService.GetAllFnAmounts(nodeIds).then((result: ResultApi) => {
        if (ResultApi.IsSuccess(result)) {
          let items = result.Object;
          this.items.forEach((item: any) => {
            let itemDb = items.find(c => c.NodeId == item.NodeId),
              originalItem = this.originalItems.find((c: any) => c.NodeId == item.NodeId),
              fnAmount = itemDb?.FnAmount | 0;
            item['FnAmount'] = (fnAmount + originalItem['F1Amount']).toLocaleString("vi-VN", { maximumFractionDigits: 2 });
          });
        }
      });
    }
  }

}