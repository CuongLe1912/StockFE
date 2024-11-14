import { Component, Input, OnInit } from "@angular/core";
import { GridComponent } from "../../../../_core/components/grid/grid.component";
import { GridData } from "../../../../_core/domains/data/grid.data";
import { DataType } from "../../../../_core/domains/enums/data.type";
import { ModalSizeType } from "../../../../_core/domains/enums/modal.size.type";
import { MOOrdersEntity } from "../../../../_core/domains/entities/meeyorder/order.entity";
import { MOOrdersService } from "../orders.service";
import { AppInjector } from "../../../../app.module";
import { UtilityExHelper } from "../../../../_core/helpers/utility.helper";
import { OptionItem } from "../../../../_core/domains/data/option.item";
import { ConstantHelper } from "../../../../_core/helpers/constant.helper";

@Component({
    selector: 'mo-order-history-grid',
    templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class MOOrderHistoryGridComponent extends GridComponent implements OnInit {
    obj: GridData = {
      Exports: [],
      Imports: [],
      Filters: [],
      Actions: [],
      Features: [],
      IsPopup: true,
      UpdatedBy: false,
      HideSearch: true,
      Title: "Lịch sử đơn hàng",
      NotKeepPrevData: true,
      HideHeadActions: true,
      HideCustomFilter: true,
      Reference: MOOrdersEntity,
      Size: ModalSizeType.ExtraLarge,
      HidePaging: true,
    };
    historyData: any = [];
    @Input() params: any;
    @Input() orderId: number;

    service: MOOrdersService;

    constructor() {
        super();
        this.service = AppInjector.get(MOOrdersService);
    }
    
    async ngOnInit() {
      let orderId = (this.params && this.params["orderId"]) || null;
      this.properties = [
        {
          Property: 'id', Title: 'ID', Type: DataType.String,
        },
        {
          Property: 'createdAt', Title: 'Thời gian', Type: DataType.DateTime,
        },
        {
          Property: 'action', Title: 'Tác động', Type: DataType.String,
          Format: ((item: any) => {
            if (item.action == null) return ""
            let option: OptionItem = ConstantHelper.MO_ORDER_ACTION_STATUS_TYPES.find((c) => c.value == item.action);
            let text = '<p class="' + (option && option.color) + '">' + (option && option.label) + "</p>";
            return text;
          })
        },
        {
          Property: 'StatusBefore', Title: 'Trạng thái trước', Type: DataType.String,
          Format: ((item: any) => {
            if (item.status_before == null) return ""
            let option: OptionItem = ConstantHelper.MO_ORDER_STATUS_TYPES.find((c) => c.value == item.status_before);
            let text = '<p class="' + (option && option.color) + '">' + (option && option.label) + "</p>";
            return text;
          })
        },
        {
          Property: 'StatusAfter', Title: 'Trạng thái sau', Type: DataType.String,
          Format: ((item: any) => {
            if (item.status_after == null) return ""
            let option: OptionItem = ConstantHelper.MO_ORDER_STATUS_TYPES.find((c) => c.value == item.status_after);
            let text = '<p class="' + (option && option.color) + '">' + (option && option.label) + "</p>";
            return text;
          })
        },
        {
          Property: 'author', Title: 'Người thực hiện', Type: DataType.String,
          Format: ((item: any) => {
            if (item.author == null) return ""
            if(item.author.includes('@')) return item.author
            let option: OptionItem = ConstantHelper.MO_ORDER_AUTHOR_STATUS_TYPES.find((c) => c.value == item.author);
            let text = '<p class="' + (option && option.color) + '">' + (option && option.label) + "</p>";
            return text;
          })
        },
        {
          Property: 'client', Title: 'Nơi thực hiện', Type: DataType.String
        },
        {
          Property: 'note', Title: 'Ghi chú', Type: DataType.String
        },
      ]
      if(orderId) {
        this.orderId = orderId
      }
      
      this.obj.Url = '/admin/moorders/OrderHistory/' + orderId;
      this.render(this.obj);
    }

}