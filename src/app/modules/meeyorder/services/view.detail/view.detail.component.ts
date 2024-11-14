import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { AppInjector } from "../../../../app.module";
import { EditComponent } from "../../../../_core/components/edit/edit.component";
import { ActionData } from "../../../../_core/domains/data/action.data";
import { NavigationStateData } from "../../../../_core/domains/data/navigation.state";
import { MOServicesEntity } from "../../../../_core/domains/entities/meeyorder/services.entity";
import { ModalSizeType } from "../../../../_core/domains/enums/modal.size.type";
import { AdminAuthService } from "../../../../_core/services/admin.auth.service";
import { AdminDialogService } from "../../../../_core/services/admin.dialog.service";
import { MOServicesService } from "../services.service";
import { ResultApi } from "../../../../_core/domains/data/result.api";
import { PriceConfigEntity } from "../../../../_core/domains/entities/meeyorder/price.config.entity";
import { EntityHelper } from "../../../../_core/helpers/entity.helper";
import { EditorComponent } from "../../../../_core/editor/editor.component";
import { PriceConfigGridComponent } from "../components/price.config.component";
import { PriceProductComboEntity } from "../../../../_core/domains/entities/meeyorder/price.product.combo.entity";
import { MOGroupServiceEntity } from "../../../../_core/domains/entities/meeyorder/groupservice.entity";
import { UtilityExHelper } from "../../../../_core/helpers/utility.helper";
import { PriceConfigDiscountType, PriceConfigStatusType } from "../../../../_core/domains/entities/meeyorder/enums/price.config.type";
import { CalculationUnitType } from "../../../../_core/domains/entities/meeyorder/enums/calculation.unit.type";
import { OptionItem } from "../../../../_core/domains/data/option.item";
import { ConstantHelper } from "../../../../_core/helpers/constant.helper";

@Component({
  templateUrl: "./view.detail.component.html",
  styleUrls: ["./view.detail.component.scss"],
})
export class MOServiceDetailComponent extends EditComponent implements OnInit
{
  @ViewChild('uploadFile') uploadFile: EditorComponent;
  @ViewChild("priceConfigGrid") priceConfigGrid: PriceConfigGridComponent;
  @Input() params: any;
  actions: ActionData[] = [];

  loading: boolean = true;
  loadingService: boolean = true;
  loadingHistory: boolean = true;
  loadingTransaction: boolean = true;

  id: number;
  router: Router;
  state: NavigationStateData;
  item: PriceConfigEntity = new PriceConfigEntity();
  itemService: MOServicesEntity = new MOServicesEntity();

  service: MOServicesService;
  authen: AdminAuthService;
  dialog: AdminDialogService;

  filterPriceConfig: {
    id: number;
    showActions: boolean;
    status: string;
  };

  discountLenght = 100;
  discountText = "%";

  groupServiceText = "";

  constructor() {
    super();
    this.router = AppInjector.get(Router);
    this.service = AppInjector.get(MOServicesService);
    this.authen = AppInjector.get(AdminAuthService);
    this.dialog = AppInjector.get(AdminDialogService);
    this.state = this.getUrlState();
  }

  async ngOnInit() {
    this.id = this.params && this.params["id"];
    if (this.state) {
      this.id = this.id || this.state.id;
      this.addBreadcrumb("Xem chi tiết");
    }
    if (this.router?.routerState?.snapshot?.root?.queryParams["id"]) {
      this.id = this.router?.routerState?.snapshot?.root?.queryParams["id"]
    }
    this.filterPriceConfig = {
      id: this.id,
      showActions: false,
      status:
        PriceConfigStatusType.ACTIVE + "," + PriceConfigStatusType.PENDING,
    };
    await this.loadItem();
    this.renderActions();
    this.loading = false;
  }

  private async loadItem() {
    if (this.id) {
      await this.service
        .item("moservices", this.id)
        .then((result: ResultApi) => {
          if (ResultApi.IsSuccess(result)) {
            this.itemService = EntityHelper.createEntity(
              MOServicesEntity,
              result.Object
            );
            this.itemService.TypeObject = result.Object.TypeObject;
            this.itemService.CreatedBy = result.Object.CreateUser;
            this.itemService.Group = result.Object.Group;
            if (this.itemService.Group) {
              if(this.itemService.Group.Provider) {
                this.groupServiceText = this.itemService.Group.Provider.Name;
                if(result.Object.Group.ParentName){
                  this.groupServiceText += " > " + result.Object.Group.ParentName + " > " + this.itemService.Group.Name
                }
                else {
                  this.groupServiceText += " > " + this.itemService.Group.Name
                }
              }
              else {
                if(result.Object.Group.ParentName){
                  this.groupServiceText += " > " + result.Object.Group.ParentName + " > " + this.itemService.Group.Name
                }
                else {
                  this.groupServiceText += " > " + this.itemService.Group.Name
                }
              }
            }
            this.item.ProductId = this.id;
            if(result.Object.ProductCombo) {
              this.item.PriceProductCombo = []
              result.Object.ProductCombo.forEach(prb => {
                let priceProduct = new PriceProductComboEntity();
                let checkPrice = false
                if(prb.price_product_combo && prb.price_product_combo.length > 0) {
                  priceProduct.PriceRoot = prb.price_product_combo[0].price_root
                  priceProduct.Discount = prb.price_product_combo[0].discount;
                  priceProduct.PriceDiscount = prb.price_product_combo[0].price_discount;
                  priceProduct["DiscountType"] = prb.price_product_combo[0].discountType;
                  checkPrice = true
                }
                if (this.itemService.TypeObject == 2) checkPrice = true
                if(prb.product) {                  
                  priceProduct.ProductComboId = prb.id;
                  priceProduct.Name = prb.product.name;
                  priceProduct.Code = prb.product.code;
                  priceProduct.Amount = prb.amount;
                  if(prb.product.price_config && prb.product.price_config.length > 0 && !checkPrice) {
                    priceProduct.PriceRoot = prb.product.price_config[0].price_root
                    priceProduct.Discount = prb.product.price_config[0].discount;
                    priceProduct.PriceDiscount = prb.product.price_config[0].price_discount;
                    priceProduct["DiscountType"] = prb.product.price_config[0].discountType;
                  }
                }
                priceProduct.Unit = prb.unit
                priceProduct['Duration'] = prb.duration
                priceProduct['UnitDuration'] = prb.unitDuration
                this.item.PriceProductCombo.push(priceProduct)
              });
            }
            if (result.Object.PriceConfig && result.Object.PriceConfig.length > 0) {
              const PriceConfig = result.Object.PriceConfig[0]
              this.item.PriceRoot = PriceConfig.PriceRoot
              this.item.Discount = PriceConfig.Discount
              this.item.PriceDiscount = PriceConfig.PriceDiscount
              this.item.DiscountType = PriceConfig.DiscountType
              if (this.item.DiscountType == PriceConfigDiscountType.Money) {
                this.discountText = "vnđ";
              } else {
                this.discountText = "%";
              }
            }
          }
        });
    }
  }

  public async confirmAndBack() {
    await this.confirm(() => {
      // this.back();
      this.priceConfigGrid.loadItems();
    });
  }

  private async renderActions() {
    let actions: ActionData[] = [
      ActionData.back(() => {
        this.back();
      }),
      ActionData.saveAddNew("Thay đổi giá", async () => {
        if (this.itemService.TypeObject == 1) {
          this.configService();
        }
        else {
          this.configCombo();
        }
      }),
    ];
    this.actions = await this.authen.actionsAllow(MOServicesEntity, actions);
  }

  public async confirm(complete: () => void): Promise<boolean> {
    if (this.item) {
      
    } else return false;
  }

  popupHistoryPrice() {
    this.dialogService.WapperAsync({
      cancelText: "Đóng",
      title: "Lịch sử giá",
      object: PriceConfigGridComponent,
      size: ModalSizeType.ExtraLarge,
      objectExtra: {
        filter: {
          id: this.id,
          showColCancel: true,
          showDetail: this.itemService.TypeObject == 2
        },
      },
    });
  }

  getUnitName(unitName) {
    let keys = Object.keys(CalculationUnitType).find(x => CalculationUnitType[x] == unitName);
    if(keys){
      return UtilityExHelper.createLabel(keys)
    } 
    return unitName;
  }

  configService() {
    let obj: NavigationStateData = {
      id: this.itemService.Id,
      prevUrl: "/admin/moservices",
    };
    this.router.navigate(["/admin/moservices/price-config-service"], {
      state: { params: JSON.stringify(obj) },
    });
  }

  configCombo() {
    let obj: NavigationStateData = {
      id: this.itemService.Id,
      prevUrl: "/admin/moservices",
    };
    this.router.navigate(["/admin/moservices/price-config-combo"], {
      state: { params: JSON.stringify(obj) },
    });
  }

  getDurationText(item: MOServicesEntity){
    if(!item.Duration) return "Không giới hạn"
    let unitDuration = 'ngày'
    if (item.UnitDuration) {
      let option: OptionItem = ConstantHelper.MO_UNIT_DURATION_TYPES.find((c) => c.value == item.UnitDuration);
      if(option){
        unitDuration = option.label
      }
    }
    return item.Duration + " " + unitDuration
  }

  getDiscountText(price: PriceConfigEntity) {
    if (price && price.DiscountType) {
      if (price.DiscountType == PriceConfigDiscountType.Money) {
        return "vnđ";
      } else {
        return "%";
      }
    }
  }
}
