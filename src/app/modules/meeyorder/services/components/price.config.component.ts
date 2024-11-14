import { Component, Input, OnInit } from "@angular/core";
import { GridData } from "../../../../_core/domains/data/grid.data";
import { DataType } from "../../../../_core/domains/enums/data.type";
import { CompareType } from "../../../../_core/domains/enums/compare.type";
import { ModalSizeType } from "../../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../../_core/components/grid/grid.component";
import { PriceConfigEntity } from "../../../../_core/domains/entities/meeyorder/price.config.entity";
import { OptionItem } from "../../../../_core/domains/data/option.item";
import { ConstantHelper } from "../../../../_core/helpers/constant.helper";
import { UtilityExHelper } from "../../../../_core/helpers/utility.helper";
import { ToastrHelper } from "../../../../_core/helpers/toastr.helper";
import { MOServicesService } from "../services.service";
import { ResultApi } from "../../../../_core/domains/data/result.api";
import { AppInjector } from "../../../../app.module";
import { PriceConfigDiscountType, PriceConfigStatusType } from "../../../../_core/domains/entities/meeyorder/enums/price.config.type";
import { ActionType } from "../../../../_core/domains/enums/action.type";
import { MOPriceConfigDetailComponent } from "./price.config.detail.component";

@Component({
  selector: "mo-price-config-grid",
  templateUrl: "../../../../_core/components/grid/grid.component.html",
})
export class PriceConfigGridComponent extends GridComponent implements OnInit {
  obj: GridData = {
    Exports: [],
    Imports: [],
    Filters: [],
    Actions: [],
    Features: [],
    IsPopup: true,
    UpdatedBy: false,
    HideSearch: true,
    Title: "Lịch sử giá",
    NotKeepPrevData: true,
    HideHeadActions: true,
    HideCustomFilter: true,
    Reference: PriceConfigEntity,
    Size: ModalSizeType.ExtraLarge,
    HidePaging: true,
  };

  @Input() filter: { id: number; status: string; showActions: boolean; showColCancel: boolean; showDetail: boolean };
  @Input() params: any;

  serviceService: MOServicesService;

  constructor() {
    super();
    this.serviceService = AppInjector.get(MOServicesService);
  }

  async ngOnInit() {
    this.properties = [
      {
        Property: "Id",
        Title: "Id",
        Type: DataType.String,
      },
      {
        Property: "PriceRoot",
        Title: "Giá gốc",
        Type: DataType.String,
        Format: (item: any) => {
          return item.PriceRoot.toLocaleString("vi-VN", {
            maximumFractionDigits: 2,
          });
        },
      },
      {
        Property: "Discount",
        Title: "Khuyến mại",
        Type: DataType.String,
        Format: (item: any) => {
          const discountType =
            item.DiscountType == PriceConfigDiscountType.Percent.toString()
              ? " %"
              : " vnđ";
          return (
            item.Discount.toLocaleString("vi-VN", {
              maximumFractionDigits: 2,
            }) + discountType
          );
        },
      },
      {
        Property: "PriceDiscount",
        Title: "Giá sau KM",
        Type: DataType.String,
        Format: (item: any) => {
          return item.PriceDiscount.toLocaleString("vi-VN", {
            maximumFractionDigits: 2,
          });
        },
      },
      {
        Property: "StartDate",
        Title: "Bắt đầu áp dụng",
        Type: DataType.DateTime,
      },
      {
        Property: "EndDate",
        Title: "Kết thúc áp dụng",
        Type: DataType.DateTime,
      },
      {
        Property: "StatusText",
        Title: "Trạng thái",
        Type: DataType.String,
        Format: (item: any) => {
          if (!item.Status) return "";
          let option: OptionItem =
            ConstantHelper.MO_PRICE_CONFIG_STATUS_TYPES.find(
              (c) => c.value == item.Status
            );
          let text =
            '<p class="' +
            (option && option.color) +
            '">' +
            (option && option.label) +
            "</p>";
          return text;
        },
      },
      {
        Property: "CreateUser",
        Title: "Tạo",
        Type: DataType.String,
        Format: (item: any) => {
          let text = "";
          if (item.CreateUser)
            text += '<p class="text-muted">' + item.CreateUser + "</p>";
          if (item.CreatedDate)
            text += '<p class="text-muted">' + UtilityExHelper.dateTimeString(item.CreatedDate) + "</p>";
          return text;
        },
      },
      {
        Property: "UrlPolicy",
        Title: "Chính sách",
        Type: DataType.String,
        Format: (item: any) => {
          if (!item.UrlPolicy) return "";
          return (
            '<a href="' + item.UrlPolicy + '" target="_blank">' + item.UrlPolicy.replace(/^.*[\\\/]/, '') + "</a>"
          );
        },
      },
    ];

    let filter = (this.params && this.params["filter"]) || null;
    if (filter != null && this.filter == null) {
      this.filter = filter;
    }
    if (this.filter != null) {
      let filters = [];
      if (this.filter.id) {
        filters.push({
          Name: "ProductId",
          Value: this.filter.id,
          Compare: CompareType.S_Equals,
        });
      }
      if (this.filter.status && this.filter.status.length > 0) {
        filters.push({
          Name: "Status",
          Value: this.filter.status,
          Compare: CompareType.S_Contains,
        });
      }
      this.itemData.Filters = filters;

      if (this.filter.showActions) {
        this.obj.Actions.push(
          {
            icon: "la la-remove",
            name: ActionType.Cancel,
            systemName: ActionType.Cancel,
            className: "btn btn-sm btn-danger",
            hidden: (item: any) => {
              return item.Status != PriceConfigStatusType.PENDING;
            },
            click: (item: any) => {
              this.cancelPriceConfig(item);
            },
          },
        );
      }
      if (this.filter.showColCancel) {
        this.properties.push({
          Property: "UpdatedUser",
          Title: "Hủy",
          Type: DataType.String,
          Format: (item: any) => {
            let text = "";
            if(item.Status == PriceConfigStatusType.CANCEL){
              if (item.UpdatedUser)
                text += '<p class="text-muted">' + item.UpdatedUser + "</p>";
              if (item.CreatedDate)
                text += '<p class="text-muted">' + UtilityExHelper.dateTimeString(item.UpdatedDate) + "</p>";
            }            
            return text;
          },
        })
      }
      if (this.filter.showDetail) {
        this.obj.Actions.push(
          {
            icon: 'la la-eye',
            name: ActionType.View,
            systemName: ActionType.View,
            className: 'btn btn-warning',
            hidden: (item: any) => {
              return item.ProductCombo == null || item.ProductCombo.length < 1;
            },
            click: (item: any) => {
              this.showDetailPriceConfig(item);
            },
          },
        );
      }
    }

    this.obj.Url = "/admin/moservices/ListPriceConfig";
    this.render(this.obj);
  }

  cancelPriceConfig(item: any) {
    if (item && item.Id) {
      const contentDialog =
        '<p><h4 style="text-align: center;">Bạn muốn hủy "Cấu hình giá" này?</h4></p>' +
        '<p><em>Lưu ý: sau khi hủy, Giá có trạng thái "Hiệu lực" sẽ tiếp tục được áp dụng (Không còn Ngày kết thúc áp dụng)</em></p>';
      this.dialogService.ConfirmAsync(contentDialog, async () => {
        await this.serviceService
          .PriceConfigCancel(item.Id)
          .then((result: ResultApi) => {
            if (ResultApi.IsSuccess(result)) {
              ToastrHelper.Success("Hủy thành công cấu hình giá");
              this.loadItems()
            } else {
              ToastrHelper.ErrorResult(result);
              return false;
            }
          });
      });
    } else {
      ToastrHelper.Error("Không lấy được thông tin giá, vui lòng tải lại!");
    }
  }

  showDetailPriceConfig(item: any){
    if(item.ProductCombo){
      this.dialogService.WapperAsync({
        cancelText: "Đóng",
        title: "Giá các dịch vụ trong combo",
        object: MOPriceConfigDetailComponent,
        size: ModalSizeType.ExtraLarge,
        objectExtra: {
          dataTotal: {
            PriceRoot: item.PriceRoot,
            Discount: item.Discount,
            PriceDiscount: item.PriceDiscount
          },
          dataPrices: item.ProductCombo
        },
      });
    }
  }
}
