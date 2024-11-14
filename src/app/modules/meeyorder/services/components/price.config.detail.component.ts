import { Component, Input, OnInit } from "@angular/core";
import { GridData } from "../../../../_core/domains/data/grid.data";
import { DataType } from "../../../../_core/domains/enums/data.type";
import { ModalSizeType } from "../../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../../_core/components/grid/grid.component";
import { PriceConfigEntity } from "../../../../_core/domains/entities/meeyorder/price.config.entity";
import { UtilityExHelper } from "../../../../_core/helpers/utility.helper";
import { PriceConfigDiscountType, PriceConfigStatusType } from "../../../../_core/domains/entities/meeyorder/enums/price.config.type";
import { CalculationUnitType } from "../../../../_core/domains/entities/meeyorder/enums/calculation.unit.type";

@Component({
  selector: "mo-price-config-detail-grid",
  templateUrl: "../../../../_core/components/grid/grid.component.html",
})
export class MOPriceConfigDetailComponent extends GridComponent implements OnInit {
  obj: GridData = {
    Exports: [],
    Imports: [],
    Filters: [],
    Actions: [],
    Features: [],
    IsPopup: true,
    UpdatedBy: false,
    HideSearch: true,
    Title: "Giá các dịch vụ trong combo",
    NotKeepPrevData: true,
    HideHeadActions: true,
    HideCustomFilter: true,
    Reference: PriceConfigEntity,
    Size: ModalSizeType.ExtraLarge,
    HidePaging: true,
  };

  @Input() dataTotal: {
    PriceRoot: string;
    Discount: string;
    PriceDiscount: string;
  };
  @Input() dataPrices = [];
  @Input() params: any;

  constructor() {
    super();
  }

  async ngOnInit() {
    this.properties = [
      { Property: "id", Title: "Id", Type: DataType.String, },
      { 
        Property: "Name", Title: "Tên dịch vụ", Type: DataType.String, 
        Format: (item: any) => {
          if(!item.product_combo || !item.product_combo.product) return ""
          return item.product_combo.product.name;
        },
      },
      { 
        Property: "Code", Title: "Mã dịch vụ", Type: DataType.String, 
        Format: (item: any) => {
          if(!item.product_combo || !item.product_combo.product) return ""
          return item.product_combo.product.code;
        },
      },
      { 
        Property: "Amount", Title: "Số lượng", Type: DataType.String, 
        Format: (item: any) => {
          if(!item.product_combo) return ""
          let unit = ' '
          if(item.product_combo){
            let keys = Object.keys(CalculationUnitType).find(x => CalculationUnitType[x] == item.product_combo.unit);
            if(keys){
              unit += UtilityExHelper.createLabel(keys);
            }
          }
          return item.product_combo.amount + unit;
        },
      },
      { Property: "PriceRoot", Title: "Giá gốc", Type: DataType.String,
        Format: (item: any) => {
          return item.price_root.toLocaleString("vi-VN", { maximumFractionDigits: 2 });
        },
        SumOrCount: () => {
          return this.dataTotal.PriceRoot
        }
      },
      { Property: "Discount", Title: "Khuyến mại", Type: DataType.String,
        Format: (item: any) => {
          const discountType =
            item.discountType == PriceConfigDiscountType.Percent.toString()
              ? " %"
              : " vnđ";
          return (item.discount.toLocaleString("vi-VN", { maximumFractionDigits: 2 }) + discountType
          );
        },
        SumOrCount: () => {
          return this.dataTotal.Discount
        }
      },
      {
        Property: "PriceDiscount",
        Title: "Giá sau KM",
        Type: DataType.String,
        Format: (item: any) => {
          return item.price_discount.toLocaleString("vi-VN", { maximumFractionDigits: 2 });
        },
        SumOrCount: () => {
          return this.dataTotal.PriceDiscount
        }
      },
      
    ];

    let dataPrices = (this.params && this.params["dataPrices"]) || null;
    let dataTotal = (this.params && this.params["dataTotal"]) || null;
    if (dataPrices) {
      this.dataPrices = dataPrices;
    }
    if (dataTotal) {
      this.dataTotal = dataTotal;
    }

    this.render(this.obj, this.dataPrices);
  }
}
