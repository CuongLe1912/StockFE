import { Component } from '@angular/core';
import { GridData } from '../../../_core/domains/data/grid.data';
import { ActionData } from '../../../_core/domains/data/action.data';
import { ModalSizeType } from '../../../_core/domains/enums/modal.size.type';
import { GridComponent } from '../../../_core/components/grid/grid.component';
import { ActionType } from '../../../_core/domains/enums/action.type';
import { MAFContractEntity } from '../../../_core/domains/entities/meeyaffiliate/contract.entity';
import { DataType } from '../../../_core/domains/enums/data.type';
import { UtilityExHelper } from '../../../_core/helpers/utility.helper';
import { NavigationStateData } from '../../../_core/domains/data/navigation.state';
import { AppConfig } from '../../../_core/helpers/app.config';
import { MAFContractService } from './contract.service';
import { MAFContractStatus } from '../../../_core/domains/entities/meeyaffiliate/enums/contract.type';
import { ResultApi } from '../../../_core/domains/data/result.api';
import { OptionItem } from '../../../_core/domains/data/option.item';
import { ConstantHelper } from '../../../_core/helpers/constant.helper';

@Component({
  templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class MAFContractComponent extends GridComponent {
  obj: GridData = {
    Reference: MAFContractEntity,
    Size: ModalSizeType.Large,
    UpdatedBy: false,
    Imports: [],
    Exports: [],
    Filters: [],
    CustomFilters: ["Customer", "Status", "SaleOrSupport", "SignStatus", "FilterType", "CreatedDate", "DateOfApprove"],
    Features: [
      ActionData.reload(() => {
        this.loadItems();
      }),
    ],
    Actions: [
      {
        icon: 'la la-check',
        name: ActionType.Verify,
        className: 'btn btn-success',
        systemName: ActionType.Verify,
        hidden: (item: any) => {
          return !(item.Status == MAFContractStatus.Pending && item[ActionType.Verify]);
        },
        click: (item: any) => this.approve(item)
      },
      {
        icon: 'la la-eye',
        name: 'Xem yc Đăng ký',
        className: 'btn btn-warning',
        systemName: ActionType.ViewDetail,
        hidden: ((item: any) => {
          return !(item[ActionType.ViewDetail])
        }),
        click: (item: any) => this.view(item)
      },
    ],
    DisableAutoLoad: true,
    AsynLoad: () => this.asynLoad(),
  };

  constructor(private apiService: MAFContractService) {
    super();
  }

  async ngOnInit() {
    this.properties = [
      { Property: 'Code', Title: 'Mã yêu cầu', Type: DataType.String },
      {
        Property: 'Customers', Title: 'Khách hàng', Type: DataType.String, ColumnWidth: 200,
        Format: ((item: any) => {
          let result = UtilityExHelper.renderUserInfoFormat(item.Name, item.Phone, item.Email, true);
          if (item.MeeyId) {
            result += '<p style="min-height: 25px; overflow: visible;">' +
              '<a style="text-decoration: none !important;" data="' + item.MeeyId + '" tooltip="Sao chép" flow="right"><i routerlink="copy" class="la la-copy"></i></a>' +
              '<a routerLink="quickView" type="user" tooltip="Xem chi tiết">' + item.MeeyId + '</a></p>';
          }
          return result;
        })
      },
      { Property: 'Type', Title: 'Loại đối tượng', Type: DataType.String },
      {
        Property: 'Sale', Title: 'NV Chăm sóc', Type: DataType.String,
        Format: ((item: any) => {
          return '<div class="kt-spinner kt-spinner--v2 kt-spinner--primary"></div>';
        })
      },
      { Property: 'SaleOrSupport', Title: 'Người duyệt/Từ chối', Type: DataType.String },
      {
        Property: 'StatusText', Title: 'Trạng thái', Type: DataType.String,
        Format: ((item) => {
          if (item.Status == null) return '';
          let option: OptionItem = ConstantHelper.MAF_CONTRACT_STATUS_TYPES.find((c) => c.value == item.Status);
          let text = ''
          text = '<p class="' + (option && option.color) + '">' + (option && option.label) + "</p>";
          return text;
        })
      },
      { Property: 'SignStatus', Title: 'Trạng thái ký', Type: DataType.String },
      { Property: 'CreatedDate', Title: 'Ngày tạo', Type: DataType.DateTime },
      { Property: 'DateOfApprove', Title: 'Ngày duyệt', Type: DataType.DateTime },

    ]
    this.render(this.obj);
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
    }
  }

  public setUrlState(state: NavigationStateData, controller: string = null) {
    if (!controller) controller = this.getController();
    let stateKey = 'params',
      navigation = this.router.getCurrentNavigation(),
      sessionKey = 'session_' + stateKey + '_' + controller;
    if (state) sessionStorage.setItem(sessionKey, JSON.stringify(state));
  }

  view(item: any) {
    let obj: NavigationStateData = {
      prevUrl: '/admin/mafcontract',
    };
    let url = AppConfig.getProtocol() + '//' + AppConfig.getDomain() + '/admin/mafcontract/view?id=' + item.Id;
    this.setUrlState(obj, 'mafcontract');
    window.open(url, "_blank");
  }

  approve(item: any) {
    let obj: NavigationStateData = {
      prevUrl: '/admin/mafcontract',
    };
    let url = AppConfig.getProtocol() + '//' + AppConfig.getDomain() + '/admin/mafcontract/view?id=' + item.Id + '&approve=true';
    this.setUrlState(obj, 'mafcontract');
    window.open(url, "_blank");
  }

  asynLoad() {
    let ids = this.items && this.items.map(c => c['MeeyId']);
    if (ids && ids.length > 0) {
      this.apiService.getAllSale(ids).then((result: ResultApi) => {
        if (ResultApi.IsSuccess(result)) {
          this.items.forEach((item: any) => {
            let sale = result.Object && result.Object.find(c => c.MeeyId == item.MeeyId);
            if (sale && (sale?.Sale || sale?.Support)) {
              let text: string = '';
              text += '<p>Sale: <a routerLink="quickView" type="sale">' + UtilityExHelper.escapeHtml(sale?.Sale) + '</a></p>';
              text += '<p>CSKH: <a routerLink="quickView" type="support">' + UtilityExHelper.escapeHtml(sale?.Support) + '</a></p>';
              item['Sale'] = text;
            } else {
              item['Sale'] = "";
            }
          })
        }
      });
    } else {
      this.items.map(c => { c['Sale'] = ""; return c });
    }
  }

}
