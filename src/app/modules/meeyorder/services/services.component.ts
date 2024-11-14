import { Component } from "@angular/core";
import { GridData } from "../../../_core/domains/data/grid.data";
import { ActionData } from "../../../_core/domains/data/action.data";
import { ModalSizeType } from "../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../_core/components/grid/grid.component";
import { MOServicesService } from "./services.service";
import { MOServicesEntity } from "../../../_core/domains/entities/meeyorder/services.entity";
import { ActionType } from "../../../_core/domains/enums/action.type";
import { NavigationStateData } from "../../../_core/domains/data/navigation.state";
import { BaseEntity } from "../../../_core/domains/entities/base.entity";
import { DataType } from "../../../_core/domains/enums/data.type";
import { PriceConfigDiscountType, PriceConfigStatusType } from "../../../_core/domains/entities/meeyorder/enums/price.config.type";
import { OptionItem } from "../../../_core/domains/data/option.item";
import { ConstantHelper } from "../../../_core/helpers/constant.helper";

@Component({
  templateUrl: "../../../_core/components/grid/grid.component.html",
})
export class MOServicesComponent extends GridComponent {
  allowViewDetail: boolean = true;
  obj: GridData = {
    Reference: MOServicesEntity,
    Size: ModalSizeType.Large,
    UpdatedBy: false,
    Imports: [],
    Exports: [],
    Filters: [],
    SearchText: 'Nhập Tên, Mã dịch vụ',
    Features: [
      ActionData.reload(() => {
        this.loadItems();
      }),
    ],
    MoreFeatures: {
      Name: "Thêm",
      Icon: "la la-plus",
      Actions: [
        {
          icon: "la la-plus",
          name: 'Thêm mới dịch vụ',
          click: () => this.addNewService(),
          systemName: this.ActionType.AddNewSerive,
        },
        {
          icon: "la la-plus",
          name: 'Thêm mới combo',
          click: () => this.addNewCombo(),
          systemName: this.ActionType.AddNewCombo,
        },
      ],
    },
    Actions: [
      {
        icon: 'la la-eye',
        name: ActionType.View,
        className: 'btn btn-warning',
        systemName: ActionType.ViewDetail,
        click: (item: any) => this.view(item)
      },
    ],
    MoreActions: [
      {
        icon: 'la la-pencil',
        name: ActionType.Edit,
        systemName: ActionType.Edit,
        className: 'btn btn-primary',
        click: (item: any) => this.edit(item),
        hidden: (item: any) => {
          return item.TypeObject != 1;
        },
      },
      {
        icon: 'la la-usd',
        name: 'Thay đổi giá',
        systemName: ActionType.EditPrice,
        click: ((item: any) => {
          if (item.TypeObject == 1) {
            this.configService(item);
          }
          else {
            this.configCombo(item);
          }
        })
      },
      {
        icon: 'la la-file-text-o',
        name: 'Chính sách',
        systemName: ActionType.EditPrice,
        hidden: (item: any) => {
          let hidden = true;
          if (!item.PriceConfig || item.PriceConfig.length < 1) return true;
          if (item.PriceConfig[0].UrlPolicy) hidden = false;
          return hidden
        },
        click: ((item: any) => {
          if (item.PriceConfig && item.PriceConfig.length > 0) {
            if (item.PriceConfig[0].UrlPolicy) {
              window.open(item.PriceConfig[0].UrlPolicy, '_blank')
            }
            else {
              this.dialogService.Alert('Thông báo', "Chưa có File chính sách cho bảng giá này!");
            }
          }
          else {
            this.dialogService.Alert('Thông báo', "Chưa có cấu hình bảng giá!");
          }
        })
      },
    ],
    DisableAutoLoad: true,
  };

  constructor(public apiService: MOServicesService) {
    super();
  }
  async ngOnInit() {
    this.properties = [
      {
        Property: 'Id', Title: 'Id', Type: DataType.String,
        HideCheckbox: (item: any) => {
          return item.TypeObject == 2;
        },
      },
      {
        Property: 'Name', Title: 'Tên định danh', Type: DataType.String,
        Format: ((item: any) => {
          return '<a routerLink="view">' + item.Name + '</a>';
        })
      },
      {
        Property: 'NameShow', Title: 'Tên hiển thị', Type: DataType.String,
      },
      {
        Property: 'Code', Title: 'Mã dịch vụ', Type: DataType.String,
        Format: ((item: any) => {
          return item.Code;
        })
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
              return priceConfig.Discount.toLocaleString("vi-VN", { maximumFractionDigits: 2 }) + discountType
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
          if (item.TypeObject == 2) return ""
          return this.getDurationText(item)
        })
      },
    ]

    let allowUpdatePrice = await this.authen.permissionAllow('moservices', ActionType.EditPrice);
    if (allowUpdatePrice) {
      this.obj.Checkable = true;
      this.obj.Features.unshift({
        hide: true,
        icon: 'la la-usd',
        name: 'Thay đổi giá',
        toggleCheckbox: true,
        className: 'btn btn-primary',
        systemName: ActionType.EditPrice,
        click: ((item) => {
          let cloneItems = this.items && this.items.filter(c => c.Checked);
          if (!cloneItems || cloneItems.length == 0) {
            this.dialogService.Alert('Thông báo', 'Vui lòng chọn tối thiểu 1 bản ghi để thay đổi giá');
            return;
          }
          if (cloneItems.length > 1) {
            let obj: NavigationStateData = {
              object: { id: cloneItems.map(c => c.Id).join(",") },
              prevData: this.itemData,
              prevUrl: "/admin/moservices",
            };
            this.router.navigate(["/admin/moservices/price-config-service-list"], {
              state: { params: JSON.stringify(obj) },
            });
          }
          else {
            this.configService(cloneItems[0])
          }
        })
      });
    }

    this.render(this.obj);
  }

  addNewService() {
    let obj: NavigationStateData = {
      prevData: this.itemData,
      prevUrl: "/admin/moservices",
    };
    this.router.navigate(["/admin/moservices/add"], {
      state: { params: JSON.stringify(obj) },
    });
  }

  addNewCombo() {
    let obj: NavigationStateData = {
      prevData: this.itemData,
      prevUrl: "/admin/moservices",
    };
    this.router.navigate(["/admin/moservices/add-combo"], {
      state: { params: JSON.stringify(obj) },
    });
  }

  edit(item: BaseEntity) {
    let obj: NavigationStateData = {
      id: item.Id,
      prevData: this.itemData,
      prevUrl: "/admin/moservices",
    };
    this.router.navigate(["/admin/moservices/edit"], {
      state: { params: JSON.stringify(obj) },
    });
  }

  configService(item: BaseEntity) {
    let obj: NavigationStateData = {
      id: item.Id,
      prevData: this.itemData,
      prevUrl: "/admin/moservices",
    };
    this.router.navigate(["/admin/moservices/price-config-service"], {
      state: { params: JSON.stringify(obj) },
    });
  }

  configCombo(item: BaseEntity) {
    let obj: NavigationStateData = {
      id: item.Id,
      prevData: this.itemData,
      prevUrl: "/admin/moservices",
    };
    this.router.navigate(["/admin/moservices/price-config-combo"], {
      state: { params: JSON.stringify(obj) },
    });
  }

  view(item: BaseEntity) {
    let obj: NavigationStateData = {
      id: item.Id,
      prevData: this.itemData,
      prevUrl: "/admin/moservices",
    };
    this.router.navigate(["/admin/moservices/view-detail"], {
      state: { params: JSON.stringify(obj) },
    });
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
}
