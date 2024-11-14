import { Component, OnInit } from '@angular/core';
import { AppInjector } from '../../../../app.module';
import { MeeyCrmService } from '../../meeycrm.service';
import { AppConfig } from '../../../../_core/helpers/app.config';
import { GridData } from '../../../../_core/domains/data/grid.data';
import { DataType } from '../../../../_core/domains/enums/data.type';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { DialogData } from '../../../../_core/domains/data/dialog.data';
import { ActionData } from '../../../../_core/domains/data/action.data';
import { ActionType } from '../../../../_core/domains/enums/action.type';
import { UtilityExHelper } from '../../../../_core/helpers/utility.helper';
import { ConstantHelper } from '../../../../_core/helpers/constant.helper';
import { BaseEntity } from '../../../../_core/domains/entities/base.entity';
import { ModalSizeType } from '../../../../_core/domains/enums/modal.size.type';
import { GridComponent } from '../../../../_core/components/grid/grid.component';
import { NavigationStateData } from '../../../../_core/domains/data/navigation.state';
import { ViewMCRMRequestGroupComponent } from './components/view.request.group/view.request.group.component';
import { MCRMCustomerRequestStatusType } from '../../../../_core/domains/entities/meeycrm/enums/mcrm.customer.type';
import { MCRMCustomerRequestEntity } from '../../../../_core/domains/entities/meeycrm/mcrm.customer.request.entity';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';

@Component({
  templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class MCRMRequestGroupComponent extends GridComponent implements OnInit {
  obj: GridData = {
    Exports: [],
    Imports: [],
    Filters: [],
    UpdatedBy: false,
    NotKeepPrevData: true,
    DisableAutoLoad: true,
    Size: ModalSizeType.Large,
    Reference: MCRMCustomerRequestEntity,
    Actions: [
      ActionData.view((item) => {
        this.popupCustomerRequest(item);
      }),
      {
        icon: 'la la-check',
        name: ActionType.ApproveRequest,
        className: 'btn btn-success',
        systemName: ActionType.ApproveRequest,
        hidden: ((item) => {
          if (item.Status === MCRMCustomerRequestStatusType.Init) return false;
          return true;
        }),
        click: (item: any) => {
          this.popupCustomerRequest(item, false);
        }
      }
    ],
    Features: [
      ActionData.reload(() => {
        this.loadItems();
      }),
    ],
    CustomFilters: ['Status', 'UserId', 'UserApproveId', 'DateRequest', 'DateApprove']
  }

  apiService: MeeyCrmService;
  constructor() {
    super();
    this.apiService = AppInjector.get(MeeyCrmService);
  }

  async ngOnInit() {
    this.properties = [
      { Property: 'DateRequest', Title: 'Thời gian', Type: DataType.DateTime, },
      {
        Property: 'CodeText', Title: 'Mã yêu cầu', Type: DataType.String,
        Format: (item) => {
          if (!item.Code) return ''
          return '<a routerLink="quickView" type="view">' + UtilityExHelper.escapeHtml(item.Code) + '</a>'
        }
      },
      {
        Property: 'Type', Title: 'Loại yêu cầu', Type: DataType.String,
        Format: (item) => {
          return 'Gộp khách hàng'
        }
      },
      {
        Property: 'Customers', Title: 'Khách hàng', Type: DataType.String,
        Format: (item) => {
          let text = []
          if (item.Customers) {
            item.Customers.forEach(c => {
              if (item.Status == MCRMCustomerRequestStatusType.Accept ||
                item.Status == MCRMCustomerRequestStatusType.Reject) {
                if (c.Id == item.RootId) {
                  text.push('<a routerLink="quickView" type="' + c.Id + '">' + UtilityExHelper.escapeHtml(c.Name) + '</a>');
                } else {
                  text.push('<span>' + UtilityExHelper.escapeHtml(c.Name) + '</span>');
                }
              } else text.push('<a routerLink="quickView" type="' + c.Id + '">' + UtilityExHelper.escapeHtml(c.Name) + '</a>');
            });
          }
          return text.join(', ')
        }
      },
      {
        Property: 'StatusText', Title: 'Trạng thái', Type: DataType.String,
        Format: (item) => {
          let text = ''
          if (item.Status != null && item.Status != undefined) {
            let option = ConstantHelper.ML_CUSTOMER_REQUEST_STATUS_TYPES.find(c => c.value == item.Status);
            if (option) text = '<p class="' + (option && option.color) + '">' + (option && option.label) + '</p>';
          }
          return text
        }
      },
      { Property: 'User', Title: 'Người yêu cầu', Type: DataType.String, },
      { Property: 'UserApprove', Title: 'Người duyệt', Type: DataType.String, },
    ]

    if (this.authen.account.IsAdmin) {
      this.obj.Features.push({
        name: 'Tách yêu cầu',
        icon: 'la la-expand',
        className: 'btn btn-danger',
        systemName: ActionType.Empty,
        click: () => {
          this.loading = true;
          this.apiService.splitRequestGroup().then((result: ResultApi) => {
            this.loading = false;
            if (ResultApi.IsSuccess(result) && result.Object) {
              ToastrHelper.Success('Đã tách toàn bồ yêu cầu gộp khách hàng!');
              this.loadItems();
            } else {
              ToastrHelper.ErrorResult(result);
            }
          }, (e) => {
            ToastrHelper.Exception(e);
            return false;
          });
        }
      });

      this.obj.Actions.push({
        name: 'Tách yêu cầu',
        icon: 'la la-expand',
        className: 'btn btn-danger',
        systemName: ActionType.Empty,
        hidden: ((item) => {
          if (item.Status === MCRMCustomerRequestStatusType.Accept) return false;
          return true;
        }),
        click: (item) => {
          this.loading = true;
          this.apiService.splitRequestGroupById(item.Id).then((result: ResultApi) => {
            this.loading = false;
            if (ResultApi.IsSuccess(result) && result.Object) {
              ToastrHelper.Success('Đã tách toàn bồ yêu cầu gộp khách hàng!');
              this.loadItems();
            } else {
              ToastrHelper.ErrorResult(result);
            }
          }, (e) => {
            ToastrHelper.Exception(e);
            return false;
          });
        }
      })
    }

    await this.render(this.obj);
  }

  quickView(item: BaseEntity, type: string) {
    if (type) {
      if (type == 'view') {
        this.popupCustomerRequest(item);
      } else {
        let obj: NavigationStateData = {
          prevUrl: '/admin/meeycrm/customer',
        };
        let url = AppConfig.getProtocol() + '//' + AppConfig.getDomain() + '/admin/meeycrm/customer/view?id=' + type;
        this.setUrlState(obj, 'customer');
        window.open(url, "_blank");
      }
    }
  }

  public setUrlState(state: NavigationStateData, controller: string = null) {
    if (!controller) controller = this.getController();
    let stateKey = 'params',
      navigation = this.router.getCurrentNavigation(),
      sessionKey = 'session_' + stateKey + '_' + controller;
    if (state) sessionStorage.setItem(sessionKey, JSON.stringify(state));
  }

  popupCustomerRequest(item: any, viewDetail: boolean = true) {
    let obj: DialogData = {
      size: ModalSizeType.ExtraLarge,
      object: ViewMCRMRequestGroupComponent,
      title: 'Yêu cầu gộp khách hàng [' + item.Code + ']',
    };
    if (!viewDetail) {
      obj.cancelText = 'Hủy'
      obj.rejectText = 'Từ chối'
      obj.confirmText = 'Xác nhận'
    } else {
      obj.cancelText = 'Đóng';
      obj.title = 'Xem yêu cầu gộp khách hàng [' + item.Code + ']';
    }
    this.loading = true;
    this.apiService.getCustomerRequest(item.Id).then((result: ResultApi) => {
      this.loading = false;
      if (ResultApi.IsSuccess(result) && result.Object) {
        obj.objectExtra = {
          item: result.Object,
          viewDetail: viewDetail,
        };
        this.dialogService.WapperAsync(obj,
          async () => {
            this.loadItems();
          }, async () => {
            this.loadItems();
          });
      }
    })
  }
}
