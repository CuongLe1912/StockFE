import { Component, Input, OnInit } from "@angular/core";
import { GridData } from "../../../../_core/domains/data/grid.data";
import { ModalSizeType } from "../../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../../_core/components/grid/grid.component";
import { PriceConfigEntity } from "../../../../_core/domains/entities/meeyorder/price.config.entity";
import { MOServicesService } from "../services.service";
import { DataType } from "../../../../_core/domains/enums/data.type";
import { NavigationStateData } from "../../../../_core/domains/data/navigation.state";

@Component({
  selector: "mo-result-price-config-grid",
  templateUrl: "../../../../_core/components/grid/grid.component.html",
})
export class ResultPriceConfigGridComponent extends GridComponent implements OnInit {
  obj: GridData = {
    Exports: [],
    Imports: [],
    Filters: [],
    Actions: [],
    Features: [],
    IsPopup: true,
    UpdatedBy: false,
    HideSearch: true,
    Title: "Thông báo",
    NotKeepPrevData: true,
    HideHeadActions: true,
    HideCustomFilter: true,
    Reference: PriceConfigEntity,
    Size: ModalSizeType.ExtraLarge,
    HidePaging: true,
  };

  @Input() results: any;
  @Input() params: any;

  serviceService: MOServicesService;

  constructor() {
    super();
  }

  async ngOnInit() {
    let results = (this.params && this.params["results"]) || null;

    this.properties = [
      {
        Property: "Name", Title: "Tên dịch vụ", Type: DataType.String,
        Format: (item: any) => {
          if (!item.infoProduct) return "";  
          return item.infoProduct.name;
        },
      },
      {
        Property: "Code", Title: "Mã dịch vụ", Type: DataType.String,
        Format: (item: any) => {
          if (!item.infoProduct) return "";  
          return item.infoProduct.code;
        },
      },
      {
        Property: "StatusText", Title: "Trạng thái", Type: DataType.String,
        Format: (item: any) => {
          if(item.status && item.status == 1){
            return '<p class="kt-badge kt-badge--inline kt-badge--success">Thành công</p>';
          }
          else {
            return '<p class="kt-badge kt-badge--inline kt-badge--danger">Thất bại</p>';
          }
        },
      },
      {
        Property: "MessageText", Title: "Lý do", Type: DataType.String,
        Format: (item: any) => {
          if(!item.status || item.status != 1){
            const link = ' <a routerLink="quickView">Xem chi tiết</a>'
            return item.message + link
          }
          else return ''
        },
      },
    ]

    this.render(this.obj, results);
  }

  quickView(item: any, type: string) {
    const id = item?.infoProduct?.id
    if(id) {
      window.open("/admin/moservices/view-detail?id=" + id, '_blank');
    }
  }
}
