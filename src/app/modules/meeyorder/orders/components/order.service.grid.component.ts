import { MOOrdersService } from "../orders.service";
import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { GridData } from "../../../../_core/domains/data/grid.data";
import { DataType } from "../../../../_core/domains/enums/data.type";
import { ResultApi } from "../../../../_core/domains/data/result.api";
import { OptionItem } from "../../../../_core/domains/data/option.item";
import { ActionType } from "../../../../_core/domains/enums/action.type";
import { ConstantHelper } from "../../../../_core/helpers/constant.helper";
import { ModalSizeType } from "../../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../../_core/components/grid/grid.component";
import { MOServicesEntity } from "../../../../_core/domains/entities/meeyorder/services.entity";
import { OrderProcessingDetailComponent } from "./order.processing.detail/order.processing.detail.component";
import { PriceConfigDiscountType } from "../../../../_core/domains/entities/meeyorder/enums/price.config.type";
import { MOOrdersEntity } from "../../../../_core/domains/entities/meeyorder/order.entity";
import { CalculationUnitType } from "../../../../_core/domains/entities/meeyorder/enums/calculation.unit.type";

@Component({
  selector: 'mo-order-service-grid',
  templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class MOOrderServiceGridComponent extends GridComponent implements OnInit, OnDestroy {
  obj: GridData = {
    Exports: [],
    Imports: [],
    Filters: [],
    Actions: [
      {
        icon: 'la la-eye',
        name: ActionType.View,
        className: 'btn btn-warning',
        systemName: ActionType.ViewDetail,
        click: (item: any) => {
          this.view(item);
        }
      }
    ],
    Features: [],
    IsPopup: true,
    UpdatedBy: false,
    HideSearch: true,
    Title: "Thông báo",
    NotKeepPrevData: true,
    HideHeadActions: true,
    HideCustomFilter: true,
    Reference: MOOrdersEntity,
    Size: ModalSizeType.ExtraLarge,
    HidePaging: true,
    AsynLoad: () => {
      if (!this.isOrderAdmin) {
        this.asynLoad();
        this.itAsynLoad = setInterval(() => {
          this.items.map(c => { c['StatusUse'] = '<div class="kt-spinner kt-spinner--v2 kt-spinner--primary"></div>'; return c });
          this.asynLoad();
        }, 30000);
      }
    },
  };
  @Input() params: any;
  @Input() dataGrids: any;
  @Input() orderId: any;
  @Input() providerId: number;
  @Input() isOrderAdmin: boolean;

  itAsynLoad: any;

  constructor(public apiService: MOOrdersService) {
    super();
  }

  ngOnDestroy() {
    if (this.itAsynLoad) {
      clearInterval(this.itAsynLoad);
    }
  }

  async ngOnInit() {
    let dataGrids = (this.params && this.params["dataGrids"]) || null;
    let orderId = (this.params && this.params["orderId"]) || null;
    this.orderId = this.orderId | orderId
    let providerId = (this.params && this.params["providerId"]) || null;
    if (!this.providerId) this.providerId = providerId

    if ((this.params && this.params["isOrderAdmin"])) {
      this.isOrderAdmin = (this.params && this.params["isOrderAdmin"]) || false;
    }

    if (this.isOrderAdmin) this.obj.Actions = []

    this.properties = [
      {
        Property: 'Index', Title: 'STT', Type: DataType.String, DisableOrder: true,
      },
      {
        Property: 'Name', Title: 'Tên dịch vụ', Type: DataType.String, DisableOrder: true,
      },
      {
        Property: 'Code', Title: 'Mã dịch vụ', Type: DataType.String, DisableOrder: true,
      },
      {
        Property: 'Amount', Title: 'Số lượng', Type: DataType.String, DisableOrder: true,
      },
      {
        Property: 'Unit', Title: 'Đơn vị tính', Type: DataType.DropDown, DisableOrder: true,
        Format: ((item: any) => {
          if (ConstantHelper.LABELS[CalculationUnitType[item.Unit]]) {
            return ConstantHelper.LABELS[CalculationUnitType[item.Unit]];
          }
          return '';
        })
      },
      {
        Property: 'PriceRoot', Title: 'Đơn giá (vnđ)', Type: DataType.String, DisableOrder: true,
        Format: ((item: any) => {
          if (this.isOrderAdmin) return ""
          if (item.PriceConfig && (item.PriceConfig.PriceRoot || item.PriceConfig.PriceDiscount)) {
            if(item.PriceConfig.PriceRoot){
              return item.PriceConfig.PriceRoot.toLocaleString("vi-VN", { maximumFractionDigits: 2 })
            }
            return item.PriceConfig.PriceDiscount.toLocaleString("vi-VN", { maximumFractionDigits: 2 })
          }
          return "";
        })
      },
      {
        Property: 'Discount', Title: 'Khuyến mại', Type: DataType.String, DisableOrder: true,
        Format: ((item: any) => {
          if (item.PriceConfig && item.PriceConfig.Discount) {
            const discountType = item.PriceConfig.DiscountType == PriceConfigDiscountType.Percent.toString() ? " %" : " vnđ"
            return item.PriceConfig.Discount.toLocaleString("vi-VN", { maximumFractionDigits: 2 }) + discountType
          }
          return "";
        })
      },
      {
        Property: 'PriceDiscount', Title: 'Thành tiền (vnđ)', Type: DataType.String, DisableOrder: true,
        Format: ((item: any) => {
          if (item.PriceConfig && item.PriceConfig.PriceDiscount) {
            return item.PriceConfig.PriceDiscount.toLocaleString("vi-VN", { maximumFractionDigits: 2 })
          }
          return 0;
        })
      },
      {
        Property: 'Duration', Title: 'Thời hạn sử dụng', Type: DataType.String, DisableOrder: true,
        Format: ((item: any) => {
          return this.getDurationText(item)
        })
      },
      {
        Property: 'StatusUse', Title: 'Tình trạng sử dụng', Type: DataType.String, DisableOrder: true,
        Format: (item: any) => {
          if (this.isOrderAdmin) return '';
          return '<div class="kt-spinner kt-spinner--v2 kt-spinner--primary"></div>';
        },
      },
    ]
    if (dataGrids) {
      this.dataGrids = this.dataGrids | dataGrids
    }
    this.dataGrids.forEach((item, i) => {
      item.Index = i + 1;
    });
    this.render(this.obj, this.dataGrids);
  }

  getDurationText(item: MOServicesEntity) {
    if (!item.Duration) return "Không giới hạn"
    let unitDuration = 'ngày'
    if (item.UnitDuration) {
      let option: OptionItem = ConstantHelper.MO_UNIT_DURATION_TYPES.find((c) => c.value == item.UnitDuration);
      if (option) {
        unitDuration = option.label
      }
    }

    return item.Duration + " " + unitDuration
  }

  view(item: any) {
    if (item) {
      this.dialogService.WapperAsync({
        cancelText: "Đóng",
        title: "Chi tiết sử dụng dịch vụ",
        object: OrderProcessingDetailComponent,
        size: ModalSizeType.ExtraLarge,
        objectExtra: {
          orderId: this.orderId,
          orderItem: item,
          providerId: this.providerId
        },
      });
    }
  }
 
  asynLoad() {
    this.apiService.ProcessStatus(this.orderId).then((result: ResultApi) => {
      if (ResultApi.IsSuccess(result) && result.Object) {
        this.items.forEach((item: any) => {
          let status = result.Object.find(c => c.id == item.Id)
          if (status && status.use_status) {
            let option: OptionItem = ConstantHelper.MO_ORDER_PROCESSING_STATUS_TYPES.find((c) => c.value == status.use_status);
            let text = '<p class="' + (option && option.color) + '">' + (option && option.label) + "</p>";
            if (status.use_process) text += " " + status.use_process + " " + item.Unit
            item['StatusUse'] = text;
          } else {
            item['StatusUse'] = '';
          }
        })
      } else {
        this.items.map(c => { c['StatusUse'] = ""; return c });
      }
    });
  }
}