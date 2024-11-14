import * as _ from 'lodash';
import { Component, OnInit } from '@angular/core';
import { HttpEventType } from '@angular/common/http';
import { AppConfig } from '../../../_core/helpers/app.config';
import { GridData } from '../../../_core/domains/data/grid.data';
import { DataType } from '../../../_core/domains/enums/data.type';
import { ResultApi } from '../../../_core/domains/data/result.api';
import { TableData } from '../../../_core/domains/data/table.data';
import { MLArticleService } from '../../meeyarticle/article.service';
import { OptionItem } from '../../../_core/domains/data/option.item';
import { ActionData } from '../../../_core/domains/data/action.data';
import { ActionType } from '../../../_core/domains/enums/action.type';
import { ExportType } from '../../../_core/domains/enums/export.type';
import { AssignType } from '../../../_core/domains/enums/assign.type';
import { ConstantHelper } from '../../../_core/helpers/constant.helper';
import { UtilityExHelper } from '../../../_core/helpers/utility.helper';
import { CompareType } from '../../../_core/domains/enums/compare.type';
import { BaseEntity } from "../../../_core/domains/entities/base.entity";
import { DecoratorHelper } from '../../../_core/helpers/decorator.helper';
import { ModalSizeType } from '../../../_core/domains/enums/modal.size.type';
import { GridComponent } from '../../../_core/components/grid/grid.component';
import { NavigationStateData } from '../../../_core/domains/data/navigation.state';
import { MAFApproveRankComponent } from './components/approve.rank/approve.rank.component';
import { MAFAssignAffiliateComponent } from './assign.affiliate/assign.affiliate.component';
import { MAFChangeTreeComponent } from './tree/components/change.tree/change.tree.component';
import { MafAffiliateEntity } from '../../../_core/domains/entities/meeyaffiliate/affiliate.entity';
import { ModalViewProfileComponent } from '../../../_core/modal/view.profile/view.profile.component';

@Component({
  templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class MAFAffiliateComponent extends GridComponent implements OnInit {
  itemsAssign: any[] = [];
  allowAssignSale: boolean;
  obj: GridData = {
    Reference: MafAffiliateEntity,
    Size: ModalSizeType.Large,
    UpdatedBy: false,
    Imports: [],
    Exports: [],
    Filters: [],
    Features: [
      {
        name: "Xuất dữ liệu",
        icon: "la la-download",
        className: 'btn btn-success',
        systemName: ActionType.Export,
        click: () => this.export(),
      },
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
        hidden: (item: any) => {
          return !item[ActionType.ViewDetail];
        },
        click: (item: any) => this.view(item)
      },
      {
        name: "Chuyển cây",
        icon: 'fa fa-reply',
        className: 'btn btn-info',
        systemName: ActionType.UpdateTree,
        hidden: (item) => {
          return !(item[ActionType.UpdateTree] && !this.checkRankIsCenter(item));
        },
        click: (item: any) => this.changeTree(item)
      },
      {
        name: "Duyệt cấp bậc",
        icon: 'fa fa-check',
        className: 'btn btn-success',
        systemName: ActionType.Approve,
        click: (item: any) => this.approveRank(item)
      },
    ],
    MoreFeatures: {
      Name: "Sơ đồ bảng",
      Icon: "la la-list",
      Actions: [
        {
          name: 'Sơ đồ cây',
          icon: "la la-map",
          systemName: this.ActionType.View,
          click: () => {
            let obj: NavigationStateData = {
              prevUrl: "/admin/mafaffiliate",
            };
            this.router.navigate(["/admin/mafaffiliate/tree"], {
              state: { params: JSON.stringify(obj) },
            });
          }
        },
      ],
    },
    CustomFilters: ["Customer", "BranchId", "FilterContractStatus", "FilterChannelType", "JoinDate", "Type", "FilterProduct", "FilterSource", "FilterRootId", "RankId", { Name: 'CumulativeAmount', AllowClear: true, Types: [CompareType.N_GreaterThanOrEqual, CompareType.N_LessThanOrEqual] }],
    DisableAutoLoad: true,
    Checkable: true,
  };

  constructor(private articleService: MLArticleService) {
    super();
  }

  async ngOnInit() {
    let type = this.params && this.params["type"];
    this.properties = [
      {
        Property: 'UserInfo', Title: 'Thông tin cá nhân', Type: DataType.String,
        Format: ((item: any) => {
          let text: string = '';
          if (item.Name)
            text += '<p><a routerLink="quickView" type="view">' + UtilityExHelper.escapeHtml(item.Name) + '</a></p>';
          if (item.Phone) text += '<p><i class=\'la la-phone\'></i> ' + UtilityExHelper.escapeHtml(item.Phone) + '</p>';
          if (item.Email) text += '<p><i class=\'la la-inbox\'></i> ' + UtilityExHelper.escapeHtml(item.Email) + '</p>';
          return text;
        })
      },
      { Property: 'JoinDate', Title: 'Ngày tham gia', Type: DataType.DateTime, Align: 'center' },
      { Property: 'Branch', Title: 'Nhánh', Type: DataType.String },
      {
        Property: 'Type', Title: 'Loại khách hàng', Type: DataType.String,
        Format: ((item) => {
          if (!item?.Contract?.Type) return 'Cá nhân';
          let text = ''
          let option: OptionItem = ConstantHelper.MAF_CONTRACT_TYPES.find((c) => c.value == item.Contract.Type);
          if (option) {
            text = option.label;
          }
          return text;
        }),
      },
      {
        Property: 'ParentText', Title: 'Người giới thiệu', Type: DataType.String,
        Format: ((item) => {
          if (!item?.Parent) return '';
          let text: string = '';
          if (item.Parent?.Name)
            text += '<p><a routerLink="quickView" type="parent">' + UtilityExHelper.escapeHtml(item.Parent.Name) + '</a></p>';
          if (item.Parent?.Phone) text += '<p><i class=\'la la-phone\'></i> ' + UtilityExHelper.escapeHtml(item.Parent.Phone) + '</p>';
          if (item.Parent?.Email) text += '<p><i class=\'la la-inbox\'></i> ' + UtilityExHelper.escapeHtml(item.Parent.Email) + '</p>';
          return text;
        })
      },
      {
        Property: 'ChannelType', Title: 'Kênh', Type: DataType.String,
        Format: ((item) => {
          let option: OptionItem = ConstantHelper.MAF_FILTER_CXHANNEL_TYPES.find((c) => c.value == item.ChannelType);
          return option?.label;
        })
      },
      {
        Property: 'RankCumulative', Title: 'Cấp bậc', Type: DataType.String, ColumnWidth: 200,
        Format: ((item) => {
          let text = ''
          if (item.RankCumulative) text += '<p>' + item.RankCumulative + '</p>';
          return text;
        })
      },
      {
        Property: 'F1Link', Title: 'Số liên kết', Type: DataType.String,
        Format: ((item) => {
          return item.F1Count + ' F1/ Tổng ' + item.FnCount;
        })
      },
      {
        Property: 'Source', Title: 'Nguồn', Type: DataType.String,
        Format: ((item) => {
          return item.Source ? item.Source : 'Không xác định';
        })
      },
      {
        Property: 'ClientId', Title: 'Sản phẩm vào', Type: DataType.String,
        Format: ((item) => {
          return item.ClientId ? item.ClientId : 'Không xác định';
        })
      },
      {
        Property: 'SaleEmail', Title: 'Nhân viên chăm sóc', Type: DataType.String,
        Format: ((item: any) => {
          let text: string = '';
          item['Sale'] = item.SaleEmail;
          item['Support'] = item.SupportEmail;
          text += '<p>Sale: <a routerLink="quickView" type="sale">' + UtilityExHelper.escapeHtml(item.SaleEmail) + '</a></p>';
          text += '<p>CSKH: <a routerLink="quickView" type="support">' + UtilityExHelper.escapeHtml(item.SupportEmail) + '</a></p>';
          return text;
        })
      },
      { Property: 'Amount', Title: 'Tiêu dùng', Type: DataType.Number, Align: 'right', ClassName: 'text-danger' },
      { Property: 'F1Amount', Title: 'Doanh số F1', Type: DataType.Number, Align: 'right', ClassName: 'text-danger' },
      { Property: 'Commission', Title: 'Hoa hồng tạm tính (F1)', Type: DataType.Number, Align: 'right', ClassName: 'text-danger' },
      { Property: 'ManageAmount', Title: 'Doanh số Cấp bậc (F1..Fn)', Type: DataType.Number, Align: 'right', ClassName: 'text-danger', Active: false },
      { Property: 'ManageCommission', Title: 'Hoa hồng Cấp bậc (F1..Fn)', Type: DataType.Number, Align: 'right', ClassName: 'text-danger', Active: false },
      { Property: 'CumulativeAmount', Title: 'Doanh số lũy kế (F1..Fn)', Type: DataType.Number, Align: 'right', ClassName: 'text-danger' },
    ]
    // button assign sale
    this.allowAssignSale = await this.authen.permissionAllow(this.obj.ReferenceName, ActionType.AssignSale);
    if (this.allowAssignSale) {
      this.obj.Features.unshift({
        hide: true,
        icon: 'la la-share-alt',
        name: ActionType.AssignSale,
        className: 'btn btn-primary',
        systemName: ActionType.AssignSale,
        click: ((item) => {
          let cloneItems = this.originalItems && this.originalItems.filter(c => c.Checked);
          if (!cloneItems || cloneItems.length == 0) {
            this.dialogService.Alert('Thông báo', 'Vui lòng chọn tối thiểu 1 bản ghi để phân sale');
            return;
          }
          this.assign(cloneItems, AssignType.Sale);
        })
      });
    }
    // refresh
    if (!this.subscribeRefreshGrids) {
      this.subscribeRefreshGrids = this.event.RefreshGrids.subscribe(() => {
        this.loadItems();
        this.checkAll = false;
        this.selectedIds = null;
      });
    }
    this.render(this.obj);
  }
  ngOnDestroy(): void {
    if (this.subscribeRefreshGrids) {
      this.subscribeRefreshGrids.unsubscribe();
      this.subscribeRefreshGrids = null;
    }
  }
  async loadComplete(): Promise<void> {
    if (this.itemData.Filters && (!this.items || this.items.length == 0)) {
      let customerSearch = this.itemData.Filters.find(c => c.Name == 'Customer')
      if (customerSearch && customerSearch.Value) {
        await this.articleService.findUseerByPhoneOrEmail(customerSearch.Value).then(async (result: ResultApi) => {
          if (ResultApi.IsSuccess(result) && result.Object) {
            this.message = 'Khách hàng này chưa tham gia cây hoa hồng. Xem thêm ở khách hàng MeeyId <a href="/admin/mluser/view?meeyId=' + result.Object.MeeyId + '" target="_blank">Tại đây</a>';
          }
        })
      }
    }
  }

  async quickView(item: any, type: string) {
    switch (type) {
      case 'sale': this.quickViewProfile(item['Sale']); break;
      case 'support': this.quickViewProfile(item['Support']); break;
    }
    if (!type || type == 'view') {
      this.view(item);
    } else if (!type || type == 'user') {
      let obj: NavigationStateData = {
        prevUrl: '/admin/mluser',
      };
      let url = AppConfig.getProtocol() + '//' + AppConfig.getDomain() + '/admin/mluser/view?meeyId=' + item.MeeyId;
      this.setUrlState(obj, 'mluser');
      window.open(url, "_blank");
    } else if (!type || type == 'parent') {
      let obj: NavigationStateData = {
        prevUrl: '/admin/mluser',
      };
      let url = AppConfig.getProtocol() + '//' + AppConfig.getDomain() + '/admin/mluser/view?meeyId=' + item.Parent.MeeyId;
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
      prevUrl: '/admin/mafaffiliate',
    };
    let url = AppConfig.getProtocol() + '//' + AppConfig.getDomain() + '/admin/mafaffiliate/view?id=' + item.Id;
    this.setUrlState(obj, 'mafaffiliate');
    window.open(url, "_blank");
  }

  changeTree(item: BaseEntity) {
    this.dialogService.WapperAsync({
      cancelText: 'Hủy',
      confirmText: 'Chuyển cây',
      size: ModalSizeType.Large,
      objectExtra: {
        id: item.Id,
      },
      title: 'Tạo yêu cầu chuyển cây',
      object: MAFChangeTreeComponent,
    });
  }

  approveRank(item: BaseEntity) {
    this.dialogService.WapperAsync({
      cancelText: 'Đóng',
      confirmText: 'Duyệt đồng ý',
      size: ModalSizeType.Large,
      objectExtra: {
        item: item,
      },
      title: 'Duyệt cấp bậc',
      object: MAFApproveRankComponent,
    }, async () => await this.loadItems());
  }

  checkRankIsCenter(item: any) {
    let option: OptionItem = ConstantHelper.MAF_RANK_TYPES.find((c) => c.value == item.RankId);
    if (option) {
      return false;
    } else {
      if (item.ParentId) {
        return false;
      } else {
        return true;
      }
    }
  }

  public quickViewProfile(email: string) {
    this.dialogService.WapperAsync({
      cancelText: 'Đóng',
      objectExtra: { email: email },
      size: ModalSizeType.Large,
      title: 'Thông tin tài khoản',
      object: ModalViewProfileComponent,
    });
  }

  export() {
    this.loading = true;
    let table = DecoratorHelper.decoratorClass(this.obj.Reference),
      objData: TableData = _.cloneDeep(this.itemData);
    objData.Export = {
      Type: ExportType.Excel,
    }
    objData.Name = "Danh sách cây hoa hồng"
    let fileName = "Danh sách cây hoa hồng_" + new Date().getTime();
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
  assign(items: any[], type: AssignType) {
    if (items && items.length > 0) {
      let cloneItems = _.cloneDeep(items).map(c => {
        let obj = {
          Id: c.Id,
          Code: c.Code,
          Name: c.Name,
          Phone: c.Phone,
          Email: c.Email,
          Parent: c.Parent,
          Branch: c.Branch,
          MeeyId: c.MeeyId,
          Sale: c.SaleEmail,
          Support: c.SupportEmail,
        };
        obj[ActionType.AssignSale] = c[ActionType.AssignSale];
        return obj;
      });
      this.dialogService.WapperAsync({
        cancelText: 'Hủy bỏ',
        confirmText: 'Xác nhận',
        size: ModalSizeType.ExtraLarge,
        title: 'Tạo yêu cầu chuyển cây',
        objectExtra: {
          type: type,
          items: cloneItems,
        },
        object: MAFAssignAffiliateComponent,
      }, async () => {
        this.loadItems();
        this.checkAll = false;
        this.selectedIds = null;
      });
    } else this.dialogService.Alert('Thông báo', 'Vui lòng chọn tối thiểu 1 bản ghi để điều chuyển');
  }
  eventCheckChange(count: number) {
    let allowAssignSale = this.authen.permissionAllow(this.obj.ReferenceName, ActionType.AssignSale);
    if (allowAssignSale) {
      let button = this.obj.Features.find(c => c.systemName == ActionType.AssignSale);
      if (button) {
        button.hide = !count;
      }
    }
  }
}
