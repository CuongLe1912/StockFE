import * as _ from 'lodash';
import { Component, Input, OnInit } from '@angular/core';
import { OptionItem } from '../../../_core/domains/data/option.item';
import { ConstantHelper } from '../../../_core/helpers/constant.helper';
import { GridComponent } from '../../../_core/components/grid/grid.component';
import { GridData } from '../../../_core/domains/data/grid.data';
import { DataType } from '../../../_core/domains/enums/data.type';
import { ModalSizeType } from '../../../_core/domains/enums/modal.size.type';
import { ActionData } from '../../../_core/domains/data/action.data';
import { ActionType } from '../../../_core/domains/enums/action.type';
import { MAFNodeType, MAFStatusCommissionType } from '../../../_core/domains/entities/meeyaffiliate/enums/affiliate.type';
import { UtilityExHelper } from '../../../_core/helpers/utility.helper';
import { MAFAffiliateSyntheticEntity } from '../../../_core/domains/entities/meeyaffiliate/affiliate.synthetic.entity';
import { MAFNavMenuComponent } from './components/nav.menu/nav.menu.component';
import { MAFApprovePaymentCommissionComponent } from './components/approve.payment.commission/approve.payment.commission.component';
import { NavigationStateData } from '../../../_core/domains/data/navigation.state';
import { AppConfig } from '../../../_core/helpers/app.config';

@Component({
  templateUrl: '../../../_core/components/grid/grid.component.html',
  styleUrls: ['./synthetic.component.scss']
})
export class MAFAffiliateSyntheticComponent extends GridComponent implements OnInit {
  obj: GridData = {
    Reference: MAFAffiliateSyntheticEntity,
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
        icon: 'la la-eye',
        name: ActionType.View,
        className: 'btn btn-warning',
        systemName: ActionType.ViewDetail,
        click: (item: any) => this.view(item)
      },
      {
        icon: 'la la-money',
        name: "Thanh toán",
        className: 'btn btn-primary',
        systemName: ActionType.Payment,
        hidden: (item) => {
          return !(item.Status == MAFStatusCommissionType.Approved || item.Status == MAFStatusCommissionType.Pending)
        },
        click: (item: any) => this.payment(item)
      },
      {
        icon: 'la la-check',
        name: "Duyệt hoa hồng",
        className: 'btn btn-success',
        systemName: ActionType.MAFVerifyCommission,
        hidden: (item) => {
          return !(item.Status == MAFStatusCommissionType.Collected)
        },
        click: (item: any) => this.approve(item)
      }
    ],
    CustomFilters: ['Month', 'BranchId', 'RankId'],
    DisableAutoLoad: true,
    EmbedComponent: MAFNavMenuComponent,
  };

  @Input() params: any;

  constructor() {
    super();
  }

  async ngOnInit() {
    this.properties = [
      { Property: 'Month', Title: 'Kỳ hoa hồng', Type: DataType.String },
      {
        Property: 'UserCommissionCount', Title: 'Số lượng KH được thanh toán', Type: DataType.String, Align: 'right',
        Format: ((item: any) => {
          if (!item.UserCommissionCount) return ''
          return item.UserCommissionCount.toLocaleString("vi-VN", { maximumFractionDigits: 2 });
        })
      },
      {
        Property: 'F1Amount', Title: 'Tổng doanh số', Type: DataType.String, Align: 'right',
        Format: ((item: any) => {
          if (!item.F1Amount) return ''
          return item.F1Amount.toLocaleString("vi-VN", { maximumFractionDigits: 2 });
        })
      },
      {
        Property: 'Commission', Title: 'Tổng hoa hồng', Type: DataType.String, Align: 'right',
        Format: ((item: any) => {
          if (!item.Commission) return '';
          let text = '<p>' + item.Commission.toLocaleString("vi-VN", { maximumFractionDigits: 2 }) + '</p>';
          if (item.PayCommissionAmount) text += '<p><em>(Thực nhận tạm tính: ' + item.PayCommissionAmount.toLocaleString("vi-VN", { maximumFractionDigits: 2 }) + ')</em></p>'
          return text;
        })
      },
      {
        Property: 'PayAmount', Title: 'Tổng hoa hồng thực nhận', Type: DataType.String, Align: 'right',
        Format: ((item: any) => {
          if (!item.PayAmount) return ''
          return item.PayAmount.toLocaleString("vi-VN", { maximumFractionDigits: 2 });
        })
      },
      {
        Property: 'StatusText', Title: 'Trạng thái', Type: DataType.String,
        Format: ((item: any) => {
          let text = '<div style="position: relative;">';
          let option: OptionItem = ConstantHelper.MAF_STATUS_COMMISSION_TYPES.find((c) => c.value == item.Status);
          if (option) {
            text += '<p><span class="' + (option && option.color) + '">' + (option && option.label) + "</span></p>";
          }
          // if (item.Message) {
          //   text += '<p class="error">' + item.Message + '</p>';
          // }
          text += '<span flow="right" class="grid-row-corner-tooltip text-drak" tooltip="Cá nhân: ' + item?.PayIndividualAmount + '/' + item?.NeedPayIndividualAmount + ' Doanh nghiệp: ' + item?.PayBusinessAmount + '/' + item?.NeedPayBusinessAmount + ' Thiếu hợp đồng: ' + item?.MissingContractCount + '"><i class="fa fa-info-circle"></i></span>';
          text += '</div>';
          return text;
        })
      },
      {
        Property: 'UserApprove', Title: 'Người duyệt', Type: DataType.String,
        Format: ((item: any) => {
          if (!item.Accountant) return '';
          let text = '<p>' + item.Accountant + '</p>'
          if (item.DateOfApprove) text += '<p><i class="la la-calendar"></i> ' + UtilityExHelper.dateTimeString(item.DateOfApprove) + '</p>'
          return text;
        })
      },
    ];

    this.render(this.obj);
  }

  payment(item) {
    this.dialogService.WapperAsync({
      cancelText: 'Hủy',
      confirmText: 'Xác nhận',
      size: ModalSizeType.Large,
      objectExtra: {
        item: item,
        action: 'payment',
        month: item.Month,
      },
      title: 'Thanh toán hoa hồng về TKKM1',
      object: MAFApprovePaymentCommissionComponent,
    }, async () => this.loadItems());
  }

  approve(item) {
    this.dialogService.WapperAsync({
      cancelText: 'Hủy',
      confirmText: 'Xác nhận',
      size: ModalSizeType.Large,
      objectExtra: {
        item: item,
        action: 'approve',
        month: item.Month,
      },
      title: 'Phê duyệt dữ liệu hoa hồng',
      object: MAFApprovePaymentCommissionComponent,
    }, async () => this.loadItems());
  }

  view(item) {
    let obj: NavigationStateData = {
      object: {
        itemData: this.itemData
      },
      prevData: this.itemData,
      prevUrl: "/admin/mafsynthetic",
    };
    this.router.navigateByUrl('/admin/mafsynthetic/view?month=' + item.Month, {
      state: { params: JSON.stringify(obj) },
    });
  }

  public setUrlState(state: NavigationStateData, controller: string = null) {
    if (!controller) controller = this.getController();
    let stateKey = 'params',
      navigation = this.router.getCurrentNavigation(),
      sessionKey = 'session_' + stateKey + '_' + controller;
    if (state) sessionStorage.setItem(sessionKey, JSON.stringify(state));
  }

}