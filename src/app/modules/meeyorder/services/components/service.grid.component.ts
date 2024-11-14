import { Component, Input, OnInit } from "@angular/core";
import { GridData } from "../../../../_core/domains/data/grid.data";
import { DataType } from "../../../../_core/domains/enums/data.type";
import { ToastrHelper } from "../../../../_core/helpers/toastr.helper";
import { OptionItem } from "../../../../_core/domains/data/option.item";
import { ActionData } from "../../../../_core/domains/data/action.data";
import { ConstantHelper } from "../../../../_core/helpers/constant.helper";
import { GridComponent } from "../../../../_core/components/grid/grid.component";
import { MOServicesEntity } from "../../../../_core/domains/entities/meeyorder/services.entity";
import { PriceConfigDiscountType, PriceConfigStatusType } from "../../../../_core/domains/entities/meeyorder/enums/price.config.type";

@Component({
  selector: 'mo-service-grid',
  templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class MOServiceGridComponent extends GridComponent implements OnInit {
  choiceComplete: (ids?: any[]) => void;

  obj: GridData = {
    Exports: [],
    Imports: [],
    Filters: [],
    Actions: [],
    DisableAutoLoad: true,
    Features: [
      ActionData.reload(() => { this.loadItems(); }),
    ],
    IsPopup: true,
    Checkable: true,
    UpdatedBy: false,
    Reference: MOServicesEntity,
    Title: 'Chọn dịch vụ',
    SearchText: 'Nhập Tên, Mã dịch vụ',
    CustomFilters: ["ProviderId", "ParentGroupId", "GroupId"],
  };
  @Input() params: any;
  @Input() listUncheck: any;
  @Input() listCheckedForCoupon: any;

  constructor() {
    super();
  }

  async ngOnInit() {
    this.listUncheck = this.params && this.params['listUncheck'];
    this.choiceComplete = this.params && this.params['choiceComplete'];
    this.listCheckedForCoupon = this.params && this.params['listCheckedForCoupon'];
    this.properties = [
      {
        Property: 'Id', Title: 'Id', Type: DataType.String,
      },
      {
        Property: 'Name', Title: 'Tên dịch vụ', Type: DataType.String,
      },
      {
        Property: 'Code', Title: 'Mã dịch vụ', Type: DataType.String,
      },
      {
        Property: 'Group', Title: 'Nhóm dịch vụ', Type: DataType.String,
        Format: ((item: any) => {
          let ProviderName = ''
          if (item.Group?.Provider?.Name) {
            ProviderName = item.Group.Provider.Name + " >> "
          }
          if (item.Group.ParentId) {
            return ProviderName + item.Group.ParentName + " >> " + item.Group.Name;
          }
          else {
            return ProviderName + item.Group.Name
          }
        })
      },
      {
        Property: 'PriceRoot', Title: 'Giá gốc (đ)', Type: DataType.String,
        Format: ((item: any) => {
          if (item.PriceConfig && item.PriceConfig.length > 0) {
            const priceConfig = item.PriceConfig.find(c => c.Status == PriceConfigStatusType.ACTIVE)
            if (priceConfig) {
              return priceConfig.PriceRoot.toLocaleString("vi-VN", { maximumFractionDigits: 2 })
            }
          }
          return "";
        })
      },
      {
        Property: 'Discount', Title: 'Khuyến mại', Type: DataType.String,
        Format: ((item: any) => {
          if (item.PriceConfig && item.PriceConfig.length > 0) {
            const priceConfig = item.PriceConfig.find(c => c.Status == PriceConfigStatusType.ACTIVE)
            if (priceConfig) {
              const discountType = priceConfig.DiscountType == PriceConfigDiscountType.Percent.toString() ? " %" : " vnđ"
              return priceConfig.Discount + discountType
            }
          }
          return "";
        })
      },
      {
        Property: 'PriceDiscount', Title: 'Giá bán', Type: DataType.String,
        Format: ((item: any) => {
          if (item.PriceConfig && item.PriceConfig.length > 0) {
            const priceConfig = item.PriceConfig.find(c => c.Status == PriceConfigStatusType.ACTIVE)
            if (priceConfig) {
              return priceConfig.PriceDiscount.toLocaleString("vi-VN", { maximumFractionDigits: 2 })
            }
          }
          return "";
        })
      },
      {
        Property: 'Unit', Title: 'Đơn vị tính', Type: DataType.DropDown
      },
      {
        Property: 'Duration', Title: 'Giới hạn ngày sử dụng', Type: DataType.String,
        Format: ((item: any) => {
          return this.getDurationText(item)
        })
      },
    ];

    this.setPageSize(20);
    this.obj.Url = '/admin/moservices/ListServices';
    await this.render(this.obj);
  }

  public async confirm(): Promise<boolean> {
    let checkItems = this.items && this.items.filter(c => c.Checked);
    let cloneItems = this.originalItems && this.originalItems.filter(c => checkItems.map(c => c.Id).includes(c.Id));
    if (!cloneItems || cloneItems.length == 0) {
      ToastrHelper.Error('Vui lòng chọn ít nhất 1 dịch vụ');
      return;
    }
    if (this.choiceComplete)
      this.choiceComplete(cloneItems);
    return true;

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

  loadComplete() {
    if (this.listUncheck && this.listUncheck.length > 0) {
      this.items.forEach(item => {
        let lst = this.listUncheck.find(c => c.ProductId == item.Id)
        if ((lst && lst.ProductId > 0)) {
          item.Checked = true
          this.originalItems.find(c => c.Id == lst.ProductId).Checked = true
        }
      });
    } else if (this.listCheckedForCoupon && this.listCheckedForCoupon.length > 0) {
      this.items.forEach(item => {
        let lst = this.listCheckedForCoupon.find(c => c.Id == item.Id)
        if ((lst && lst.Id > 0)) {
          item.Checked = true
          this.originalItems.find(c => c.Id == lst.Id).Checked = true;
        }
      });
    }
  }

}