import { Component } from '@angular/core';
import { GridData } from '../../../_core/domains/data/grid.data';
import { ActionData } from '../../../_core/domains/data/action.data';
import { ModalSizeType } from '../../../_core/domains/enums/modal.size.type';
import { GridComponent } from '../../../_core/components/grid/grid.component';
import { ActionType } from '../../../_core/domains/enums/action.type';
import { MOServiceHistoryEntity } from './entities/service.history.entity';
import { DataType } from '../../../_core/domains/enums/data.type';
import { UtilityExHelper } from '../../../_core/helpers/utility.helper';
import { OptionItem } from '../../../_core/domains/data/option.item';
import { ConstantHelper } from '../../../_core/helpers/constant.helper';
import { NavigationStateData } from '../../../_core/domains/data/navigation.state';
import { AppConfig } from '../../../_core/helpers/app.config';
import { MOServiceHistoryDetailComponent } from './components/service.history.detail.component';

@Component({
  templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class MOServiceHistoryComponent extends GridComponent {
  obj: GridData = {
    Reference: MOServiceHistoryEntity,
    Size: ModalSizeType.Large,
    UpdatedBy: false,
    Imports: [],
    Exports: [],
    Filters: [],
    SearchText: 'Nhập Sđt, Email, MeeyId, mã yêu cầu',
    Features: [
      ActionData.reload(() => {
        this.loadItems();
      }),
    ],
    Actions: [
      {
        icon: 'la la-eye',
        name: ActionType.View,
        className: 'btn btn-warning',
        systemName: ActionType.ViewDetail,
        click: (item: any) => this.view(item)
      },
    ],
    CustomFilters: [ "Code", "ServiceId", "StartDate", "Type", "FromMeeyId", "ToMeeyId" ],
    DisableAutoLoad: true,
  };

  constructor() {
    super();
  }

  async ngOnInit() {
    this.properties = [
      {
        Property: 'id', Title: 'Mã yêu cầu', Type: DataType.String,
      },
      {
        Property: 'type', Title: 'Loại yêu cầu', Type: DataType.String,
        Format: ((item: any) => {
          if (item.type == null) return "";
          let option: OptionItem = ConstantHelper.MO_REQUEST_TRANSFER_TYPES.find((c) => c.value == item.type);
          let text = option && option.label;
          return text;
        })
      },
      {
        Property: 'productingName', Title: 'Dịch vụ', Type: DataType.String,
      },
      {
        Property: 'amount', Title: 'Số lượng', Type: DataType.String,
        Format: ((item: any) => {
          if (!item.amount) return ''
          return '<a routerLink="quickView" type="view">' + UtilityExHelper.escapeHtml(item.amount) + '</a>'
        })
      },
      {
        Property: 'UserFrom', Title: 'Tài khoản chuyển', Type: DataType.String,
        Format: ((item: any) => {
          let text: string = '';
          if (!item.from) return ''
          if (item.from.name)
            text += '<p><a routerLink="quickView" type="userfrom">' + UtilityExHelper.escapeHtml(item.from.name) + '</a></p>';
          if (item.from.phone) text += '<p><i class=\'la la-phone\'></i> ' + UtilityExHelper.escapeHtml(item.from.phone) + '</p>';
          if (item.from.email) text += '<p><i class=\'la la-inbox\'></i> ' + UtilityExHelper.escapeHtml(item.from.email) + '</p>';
          if (item.from.username) text += '<p><i class=\'la la-user\'></i> ' + UtilityExHelper.escapeHtml(item.from.username) + '</p>';

          return text;
        })
      },
      {
        Property: 'UserTo', Title: 'Tài khoản nhận', Type: DataType.String,
        Format: ((item: any) => {
          let text: string = '';
          if (!item.to) return ''
          if (item.to.name)
            text += '<p><a routerLink="quickView" type="userto">' + UtilityExHelper.escapeHtml(item.to.name) + '</a></p>';
          if (item.to.phone) text += '<p><i class=\'la la-phone\'></i> ' + UtilityExHelper.escapeHtml(item.to.phone) + '</p>';
          if (item.to.email) text += '<p><i class=\'la la-inbox\'></i> ' + UtilityExHelper.escapeHtml(item.to.email) + '</p>';
          if (item.to.username) text += '<p><i class=\'la la-user\'></i> ' + UtilityExHelper.escapeHtml(item.to.username) + '</p>';

          return text;
        })
      },
    ]
    this.render(this.obj);
  }

  async quickView(item: any, type: string) {
    if (!type || type == 'userfrom') {
      let obj: NavigationStateData = {
        prevUrl: '/admin/mluser',
      };
      let url = AppConfig.getProtocol() + '//' + AppConfig.getDomain() + '/admin/mluser/view?meeyId=' + item.from._id;
      this.setUrlState(obj, 'mluser');
      window.open(url, "_blank");
    } else if (!type || type == 'userto') {
      let obj: NavigationStateData = {
        prevUrl: '/admin/mluser',
      };
      let url = AppConfig.getProtocol() + '//' + AppConfig.getDomain() + '/admin/mluser/view?meeyId=' + item.to._id;
      this.setUrlState(obj, 'mluser');
      window.open(url, "_blank");
    }
    else if (!type || type == 'view') {
      this.view(item);
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
    this.dialogService.WapperAsync({
      cancelText: "Đóng",
      title: 'Danh sách dịch vụ',
      object: MOServiceHistoryDetailComponent,
      size: ModalSizeType.ExtraLarge,
      objectExtra: {
        serviceCode: item.id,
      },
    });
  }

}