import { Component, OnInit } from '@angular/core';
import { ActionData } from '../../../../_core/domains/data/action.data';
import { GridData } from '../../../../_core/domains/data/grid.data';
import { ActionType } from '../../../../_core/domains/enums/action.type';
import { ModalSizeType } from '../../../../_core/domains/enums/modal.size.type';
import { GridComponent } from '../../../../_core/components/grid/grid.component';
import { MAFAffiliateRequestEntity } from '../../../../_core/domains/entities/meeyaffiliate/affiliate.request.entity';
import { DataType } from '../../../../_core/domains/enums/data.type';
import { UtilityExHelper } from '../../../../_core/helpers/utility.helper';
import { OptionItem } from '../../../../_core/domains/data/option.item';
import { ConstantHelper } from '../../../../_core/helpers/constant.helper';
import { NavigationStateData } from '../../../../_core/domains/data/navigation.state';
import { AppConfig } from '../../../../_core/helpers/app.config';
import { MAFViewRequestComponent } from './view/view.component';
import { MAFRequestStatusType } from '../../../../_core/domains/entities/meeyaffiliate/enums/affiliate.type';

@Component({
  templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class MAFRequestComponent extends GridComponent implements OnInit {

  obj: GridData = {
    Reference: MAFAffiliateRequestEntity,
    Size: ModalSizeType.Large,
    UpdatedBy: false,
    Imports: [],
    Exports: [],
    Filters: [],
    Features: [
      ActionData.reload(() => {
        this.loadItems();
      }),
    ],
    Actions: [
      {
        icon: 'la la-check',
        className: 'btn btn-success',
        name: ActionType.Verify,
        systemName: ActionType.Verify,
        hidden: ((item) => {
          return !(item.Status == MAFRequestStatusType.Init);
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
        click: (item: any) => this.view(item)
      },
    ],
    CustomFilters: ["Status", "Customer", "UserId", "DateRequest", "UserApproveId", "DateApprove"],
    DisableAutoLoad: true,
  };

  constructor() {
    super();
  }

  ngOnInit() {
    this.properties = [
      { Property: 'Code', Title: 'Mã yêu cầu', Type: DataType.String },
      {
        Property: 'CustomerInfo', Title: 'Thông tin KH', Type: DataType.String,
        Format: ((item: any) => {
          let text: string = '';
          if (item.Name)
            text += '<p><a routerLink="quickView" type="customer">' + UtilityExHelper.escapeHtml(item.Name) + '</a></p>';
          if (item.Phone) text += '<p><i class=\'la la-phone\'></i> ' + UtilityExHelper.escapeHtml(item.Phone) + '</p>';
          if (item.Email) text += '<p><i class=\'la la-inbox\'></i> ' + UtilityExHelper.escapeHtml(item.Email) + '</p>';

          return text;
        })
      },
      {
        Property: 'Request', Title: 'Yêu cầu chuyển cây', Type: DataType.String,
        Format: ((item: any) => {
          let text: string = '';
          text += '<p>Hiện tại: <a routerLink="quickView" type="currentRef">' + UtilityExHelper.escapeHtml(item.RefCurrentName) + '</a></p>';
          text += '<p>Chuyển sang: <a routerLink="quickView" type="changeRef">' + UtilityExHelper.escapeHtml(item.RefChangeName) + '</a></p>';
          return text;
        })
      },
      {
        Property: 'UserRequest', Title: 'Người yêu cầu', Type: DataType.String,
        Format: ((item: any) => {
          let text: string = '';
          if (item.User) text += '<p><i class=\'la la-user\'></i> ' + UtilityExHelper.escapeHtml(item.User) + '</p>';
          if (item.DateRequest) text += '<p><i class=\'la la-inbox\'></i> ' + UtilityExHelper.dateTimeString(item.DateRequest) + '</p>';

          return text;
        })
      },
      {
        Property: "StatusText", Title: "Trạng thái", Type: DataType.String, Align: 'center',
        Format: (item: any) => {
          if (item.Status == null) return "";
          let option: OptionItem = ConstantHelper.MAF_REQUEST_STATUS_TYPES.find((c) => c.value == item.Status);
          let text = '<p class="' + (option && option.color) + '">' + (option && option.label) + "</p>";
          return text;
        },
      },
      {
        Property: "FileText", Title: "File Đính kèm", Type: DataType.String, Align: 'center',
        Format: (item: any) => {
          if (!item.File) return "";
          return '<a href="' + item.File + '" target="_blank">' + item.File + '</a>';
        },
      },
      {
        Property: 'UserApproveText', Title: 'Người duyệt/Từ chối', Type: DataType.String,
        Format: ((item: any) => {
          let text: string = '';
          if (item.UserApprove) text += '<p><i class=\'la la-user\'></i> ' + UtilityExHelper.escapeHtml(item.UserApprove) + '</p>';
          if (item.DateApprove) text += '<p><i class=\'la la-inbox\'></i> ' + UtilityExHelper.dateTimeString(item.DateApprove) + '</p>';

          return text;
        })
      },
    ]
    this.render(this.obj);
  }

  async quickView(item: any, type: string) {
    if (!type || type == 'view') {
      this.view(item);
    }
    else if (!type || type == 'customer') {
      let obj: NavigationStateData = {
        prevUrl: '/admin/mluser',
      };
      let url = AppConfig.getProtocol() + '//' + AppConfig.getDomain() + '/admin/mluser/view?meeyId=' + item.MeeyId;
      this.setUrlState(obj, 'mluser');
      window.open(url, "_blank");
    }
    else if (!type || type == 'currentRef') {
      let obj: NavigationStateData = {
        prevUrl: '/admin/mluser',
      };
      let url = AppConfig.getProtocol() + '//' + AppConfig.getDomain() + '/admin/mluser/view?meeyId=' + item.RefCurrentMeeyId;
      this.setUrlState(obj, 'mluser');
      window.open(url, "_blank");
    }
    else if (!type || type == 'changeRef') {
      let obj: NavigationStateData = {
        prevUrl: '/admin/mluser',
      };
      let url = AppConfig.getProtocol() + '//' + AppConfig.getDomain() + '/admin/mluser/view?meeyId=' + item.RefChangeMeeyId;
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

  view(item) {
    this.dialogService.WapperAsync({
      cancelText: 'Đóng',
      size: ModalSizeType.ExtraLarge,
      objectExtra: {
        id: item.Id,
      },
      title: 'Chi tiết yêu cầu chuyển cây',
      object: MAFViewRequestComponent,
    });
  }

  approve(item) {
    this.dialogService.WapperAsync({
      cancelText: 'Đóng',
      rejectText: 'Từ chối',
      confirmText: 'Xác nhận',
      size: ModalSizeType.ExtraLarge,
      objectExtra: {
        id: item.Id,
        approve: true,
      },
      title: 'Duyệt yêu cầu chuyển cây',
      object: MAFViewRequestComponent,
    },
      () => this.loadItems(),
      () => this.loadItems());
  }

}
