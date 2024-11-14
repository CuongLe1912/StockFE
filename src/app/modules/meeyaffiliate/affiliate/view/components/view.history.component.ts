import * as _ from 'lodash';
import { Component, Input, OnInit } from '@angular/core';
import { GridData } from '../../../../../_core/domains/data/grid.data';
import { DataType } from '../../../../../_core/domains/enums/data.type';
import { OptionItem } from "../../../../../_core/domains/data/option.item";
import { ConstantHelper } from "../../../../../_core/helpers/constant.helper";
import { GridComponent } from '../../../../../_core/components/grid/grid.component';
import { MafAffiliateEntity } from "../../../../../_core/domains/entities/meeyaffiliate/affiliate.entity";
import { UtilityExHelper } from '../../../../../_core/helpers/utility.helper';
import { ToastrHelper } from '../../../../../_core/helpers/toastr.helper';
import { MAFActionType } from '../../../../../_core/domains/entities/meeyaffiliate/enums/affiliate.type';

@Component({
  selector: 'maf-view-history',
  styleUrls: ['./view.component.scss'],
  templateUrl: '../../../../../_core/components/grid/grid.component.html',
})
export class MAFViewHistoryComponent extends GridComponent implements OnInit {
  obj: GridData = {
    Exports: [],
    Imports: [],
    Filters: [],
    Actions: [],
    Features: [],
    IsPopup: true,
    UpdatedBy: false,
    HideSearch: true,
    NotKeepPrevData: true,
    HideCustomFilter: true,
    InlineFilters: ['Month'],
    Reference: MafAffiliateEntity,
    PageSizes: [5, 10, 20, 50, 100],
  };
  @Input() item: any;

  constructor() {
    super();
    this.properties = [
      { Property: 'Id', Title: 'Id', Type: DataType.String },
      { Property: 'DateTime', Title: 'Ngày', Type: DataType.DateTime, Align: 'center' },
      {
        Property: 'ActionTypeText', Title: 'Tác động', Type: DataType.String,
        Format: ((item: any) => {
          let option: OptionItem = ConstantHelper.MAF_ACTION_TYPES.find((c) => c.value == item.ActionType);
          let text = '<p class="' + (option && option.color) + '">' + (option && option.label) + "</p>";
          return text
        })
      },
      { Property: 'CreatedBy', Title: 'Người thực hiện', Type: DataType.String },
      { Property: 'Source', Title: 'Nơi thực hiện', Type: DataType.String },
      {
        Property: 'NoteText', Title: 'Ghi chú', Type: DataType.String,
        Format: ((item: any) => {
          if (!item.Note) return '';
          let types = [MAFActionType.AddContract, MAFActionType.SignContract, MAFActionType.UpdateContract, MAFActionType.RejectContract, MAFActionType.ApproveContract];
          if (types.indexOf(item.ActionType) >= 0)
            return '<a routerLink="quickView" type="copy" tooltip="Sao chép"><i class="la la-copy"></i> Sao chép</a>';
          return item.Note;
        })
      },
    ];
  }

  async ngOnInit() {
    this.setPageSize(20);
    this.obj.Url = '/admin/MAFAffiliate/HistoryItems/' + this.item.Id;
    this.render(this.obj);
  }

  quickView(item: any, type: string) {
    if (type === 'copy') {
      UtilityExHelper.copyString(item.Note);
      ToastrHelper.Success('Sao chép đường dẫn thành công');
    }
  }
}