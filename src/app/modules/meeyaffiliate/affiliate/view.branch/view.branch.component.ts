import * as _ from 'lodash';
import { Component, Input, OnInit } from '@angular/core';
import { AppConfig } from '../../../../_core/helpers/app.config';
import { OptionItem } from '../../../../_core/domains/data/option.item';
import { ConstantHelper } from '../../../../_core/helpers/constant.helper';
import { GridComponent } from '../../../../_core/components/grid/grid.component';
import { GridData } from '../../../../_core/domains/data/grid.data';
import { DataType } from '../../../../_core/domains/enums/data.type';
import { ModalSizeType } from '../../../../_core/domains/enums/modal.size.type';
import { ActionData } from '../../../../_core/domains/data/action.data';
import { ActionType } from '../../../../_core/domains/enums/action.type';
import { MAFNodeType, MAFStatusCommissionType } from '../../../../_core/domains/entities/meeyaffiliate/enums/affiliate.type';
import { CompareType } from '../../../../_core/domains/enums/compare.type';
import { MafAffiliateDetailBranchEntity } from '../../../../_core/domains/entities/meeyaffiliate/affiliate.detail.branch.entity';
import { MAFAffiliateService } from '../affiliate.service';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { MAFViewBranchDetailComponent } from './components/view.branch.detail/view.branch.detail.component';
import { UtilityExHelper } from '../../../../_core/helpers/utility.helper';

@Component({
  selector: 'maf-view-branch',
  templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class MAFViewBranchComponent extends GridComponent implements OnInit {
  obj: GridData = {
    Reference: MafAffiliateDetailBranchEntity,
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
        systemName: ActionType.Empty,
        click: (item: any) => this.view(item)
      },
    ],
    CustomFilters: ['Month', 'BranchId', 'RankDependId'],
    DisableAutoLoad: true,
  };

  @Input() params: any;

  id: any;
  type: any;

  constructor(private affiliateService: MAFAffiliateService) {
    super();
    this.properties = [
      { Property: 'Month', Title: 'Kỳ hoa hồng', Type: DataType.String },
      {
        Property: 'UserCommissionCount', Title: 'Số lượng User được thanh toán', Type: DataType.String, Align: 'right',
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
          if (!item.Commission) return ''
          return item.Commission.toLocaleString("vi-VN", { maximumFractionDigits: 2 });
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
        Property: 'Status', Title: 'Trạng thái', Type: DataType.String,
        Format: ((item: any) => {
          let text = '';
          let option: OptionItem = ConstantHelper.MAF_STATUS_COMMISSION_TYPES.find((c) => c.value == item.Status);
          if (item.Status == MAFStatusCommissionType.Pending) {
            text = '<p><span class="' + (option && option.color) + '">' + (option && option.label) + "</span></p>";
            text += '<p>(TKKM1: ' + UtilityExHelper.formatNumbertoString(item.SuccessCount) + '/' + UtilityExHelper.formatNumbertoString(item.UserCommissionCount) + ')</p>';
          } else {
            text = '<p class="' + (option && option.color) + '">' + (option && option.label) + "</p>";
          }
          if (item.Message) {
            text += '<p class="error">' + item.Message + '</p>';
          }
          return text
        })
      },
    ];
  }

  async ngOnInit() {
    this.setPageSize(20);

    this.id = this.params && this.params["id"];
    if (this.router?.routerState?.snapshot?.root?.queryParams["id"]) {
      this.id = this.router?.routerState?.snapshot?.root?.queryParams["id"]
    }

    this.type = this.params && this.params["type"];
    if (this.router?.routerState?.snapshot?.root?.queryParams["type"]) {
      this.type = this.router?.routerState?.snapshot?.root?.queryParams["type"]
    }

    let branchName = 'Meey Land';
    if (this.id && this.type && this.type == MAFNodeType.Branch) {
      this.obj.CustomFilters = ['Month', 'RankId'];
      await this.affiliateService.lookupBranch().then((result: ResultApi) => {
        if (ResultApi.IsSuccess(result) && result.Object.length > 0) {
          let listBranch = result.Object;
          let branch = listBranch.find(c => c.Id == this.id);
          if (branch) {
            branchName = branch.Name;
          }
        }
      });
      // this.itemData.Filters = (this.itemData && this.itemData.Filters && this.itemData.Filters.filter(c => c.Name != 'BranchId')) || [];
      // this.itemData.Filters.push({
      //   Name: 'BranchId',
      //   Compare: CompareType.S_Equals,
      //   Value: this.id,
      // });
    } else if (this.id && this.type && this.type == MAFNodeType.Rank) {
      this.obj.CustomFilters = ['Month'],
        await this.affiliateService.lookupRank().then((result: ResultApi) => {
          if (ResultApi.IsSuccess(result) && result.Object.length > 0) {
            let listRank = result.Object;
            let rank = listRank.find(c => c.Id == this.id);
            if (rank) {
              branchName = rank.Name;
            }
          }
        });
    } else {
      // this.itemData.Filters = [];
    }
    this.breadcrumbs.push({ Name: 'Thống kê hoa hồng: ' + branchName })

    this.obj.Url = '/admin/MAFAffiliate/CommissionItems/' + this.id + '/?type=' + this.type;
    this.render(this.obj);
  }

  view(item) {
    let rankId = this.getFilterValue('RankId')
    let branchId = this.getFilterValue('BranchId')
    if (this.id && this.type && this.type == MAFNodeType.Branch) {
      branchId = this.id;
    } else if (this.id && this.type && this.type == MAFNodeType.Rank) {
      rankId = this.id;
    }
    this.dialogService.WapperAsync({
      cancelText: 'Đóng',
      size: ModalSizeType.ExtraLarge,
      objectExtra: {
        item: item,
        rankId: rankId,
        branchId: branchId,
      },
      title: 'Chi tiết danh sách trả hoa hồng',
      object: MAFViewBranchDetailComponent,
    });
  }
}