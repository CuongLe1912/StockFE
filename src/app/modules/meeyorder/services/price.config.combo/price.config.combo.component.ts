import * as _ from 'lodash';
import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { ToastrHelper } from "../../../../_core/helpers/toastr.helper";
import { AppInjector } from "../../../../app.module";
import { EditComponent } from "../../../../_core/components/edit/edit.component";
import { validation, validations } from "../../../../_core/decorators/validator";
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
import { UtilityExHelper } from "../../../../_core/helpers/utility.helper";
import { PriceConfigDiscountType, PriceConfigStatusType } from "../../../../_core/domains/entities/meeyorder/enums/price.config.type";
import { CalculationUnitType } from "../../../../_core/domains/entities/meeyorder/enums/calculation.unit.type";
import { ActionType } from "../../../../_core/domains/enums/action.type";

@Component({
  templateUrl: "./price.config.combo.component.html",
  styleUrls: ["./price.config.combo.component.scss"],
})
export class PriceConfigComboComponent extends EditComponent implements OnInit
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

  minCurent = new Date();
  maxValue: number;
  discountText = "%";
  renderDiscount: boolean = true;
  discountPercent: boolean = true;
  disableDiscountType: boolean = false;
  renderDiscountType: boolean = true;

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
      this.addBreadcrumb("Cấu hình giá combo");
    }
    this.filterPriceConfig = {
      id: this.id,
      showActions: true,
      status:
        PriceConfigStatusType.ACTIVE + "," + PriceConfigStatusType.PENDING,
    };
    await this.loadItem();
    this.renderActions();
    this.loading = false;
  }

  private async loadItem() {
    this.discountPercent = true;
    this.item.DiscountType = PriceConfigDiscountType.Percent;
    this.item.Discount = 0;
    this.maxValue = 100;
    if (this.id) {
      await this.service
        .item("moservices", this.id)
        .then((result: ResultApi) => {
          if (ResultApi.IsSuccess(result)) {
            this.itemService = EntityHelper.createEntity(
              MOServicesEntity,
              result.Object
            );
            this.item.ProductId = this.id;
            this.renderDiscountType = false;
            this.disableDiscountType = false;
            if(result.Object) {
              if (result.Object?.Group?.Provider?.Code == 'meeyland') {
                this.disableDiscountType = true;
              }
            }
            setTimeout(() => this.renderDiscountType = true);
            if(result.Object.ProductCombo) {
              this.item.PriceProductCombo = []
              let PriceRoot = 0
              result.Object.ProductCombo.forEach(prb => {
                let priceProduct = new PriceProductComboEntity();
                let checkPrice = false
                if(prb.price_product_combo && prb.price_product_combo.length > 0) {
                  priceProduct.PriceRoot = prb.price_product_combo[0].price_root                  
                  PriceRoot += priceProduct.PriceRoot
                  checkPrice = true
                }
                if(prb.product) {                  
                  priceProduct.ProductComboId = prb.id;
                  priceProduct.Name = prb.product.name;
                  priceProduct.Code = prb.product.code;
                  priceProduct.Amount = prb.amount;
                  if(prb.product.price_config && prb.product.price_config.length > 0 && !checkPrice) {
                    priceProduct.PriceRoot = UtilityExHelper.formatNumbertoString(prb.product.price_config[0].price_root)
                    PriceRoot += priceProduct.PriceRoot
                  }
                }
                priceProduct.Unit = prb.unit
                this.item.PriceProductCombo.push(priceProduct)
                this.item.PriceRoot = PriceRoot
                this.item.PriceDiscount = PriceRoot
              });
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
      {
        name: 'Lưu giá mới',
        processButton: true,
        icon: 'la la-plus-circle',
        className: 'btn btn-primary',
        systemName: ActionType.EditPrice,
        click: async () => await this.confirmAndBack()
      }
    ];
    this.actions = await this.authen.actionsAllow(MOServicesEntity, actions);
  }

  public async confirm(complete: () => void): Promise<boolean> {
    if (this.item) {
      this.processing = true;
      // valid common
      let validator = await validation(this.item, ["DiscountType", "StartDate", "UrlPolicy"]) &&
        await validations(this.item.PriceProductCombo, ["PriceRoot", "PriceDiscount"]);
      if (validator) {
        if(!this.item.Discount) this.item.Discount = 0
        this.processing = true;
        const contentDialog = '<p><h4 style="text-align: center;">Bạn muốn tạo "Cấu hình giá" mới?</h4></p>'
                            + '<p><em>Lưu ý: Giá mới sẽ có hiệu lực đến ngày áp dụng. Nếu chưa đến ngày áp dụng thì sẽ ở trạng thái "Chờ áp dụng"</em></p>'
        this.dialogService.ConfirmAsync(contentDialog, async () => {
          let files = await this.uploadFile.upload();
          let item = _.cloneDeep(this.item);
          item.UrlPolicy = files && files.length > 0 ? files[0].Path : '';
          item.PriceProductCombo.forEach((product) => {
            product.PriceRoot = UtilityExHelper.formatStringtoNumber(product.PriceRoot)
            product.PriceDiscount = UtilityExHelper.formatStringtoNumber(product.PriceDiscount)
            product.Discount = UtilityExHelper.formatStringtoNumber(product.Discount)
          });
          await this.service.addPriceConfigCombo(item).then((result: ResultApi) => {
            this.processing = false;
            if (ResultApi.IsSuccess(result)) {
              ToastrHelper.Success('Tạo cấu hình giá thành công');
              if (complete) complete();
              return true;
            } else {
                ToastrHelper.ErrorResult(result);
                return false;
            }
          });
        }, () => {
          this.processing = false;
        });        
      } else this.processing = false;
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
          showDetail: true
        },
      },
    });
  }

  priceDiscountChange() {
    if (this.item) {      
      if (this.item.DiscountType) {
        this.renderDiscount = false;
        if (this.item.DiscountType == PriceConfigDiscountType.Money) {
          this.maxValue = 99999999999999999999;
          this.discountText = "vnđ";
          this.item.Discount = 0;
          this.discountPercent = false;
          this.item.PriceProductCombo.map(c => { c.Discount = 0; return c;})
        } else {
          this.maxValue = 100;
          this.discountText = "%";
          this.item.Discount = 0;
          this.discountPercent = true;
          this.item.PriceProductCombo.map(c => { c.Discount = 0; return c;})
        }
        setTimeout(() => this.renderDiscount = true);
      }
      this.updatePriceDiscountTotal(true);
    }
  }

  async priceItemDiscountChange(priceProductCombo : PriceProductComboEntity) {
    let validator = await validation(this.item, ["DiscountType"]);
    if (validator) {
      if(!priceProductCombo.Discount) priceProductCombo.Discount = 0
      if(priceProductCombo.PriceRoot)
      {
        const priceRoot = UtilityExHelper.formatStringtoNumber(priceProductCombo.PriceRoot);
        const discount = UtilityExHelper.formatStringtoNumber(priceProductCombo.Discount);
        priceProductCombo.PriceDiscount = this.parsePriceDiscount(this.item.DiscountType, priceRoot, discount)

        this.updatePriceDiscountTotal()
      }
    }
  }

  updatePriceDiscountItem(priceProductCombo : PriceProductComboEntity){
    if(!priceProductCombo.Discount) priceProductCombo.Discount = 0
    if(priceProductCombo.PriceRoot)
    {
      const priceRoot = UtilityExHelper.formatStringtoNumber(priceProductCombo.PriceRoot);
        const discount = UtilityExHelper.formatStringtoNumber(priceProductCombo.Discount);
        priceProductCombo.PriceDiscount = this.parsePriceDiscount(this.item.DiscountType, priceRoot, discount)
    }
  }

  updatePriceDiscountTotal(updateItem = false) {
    this.item.PriceRoot = this.item.PriceDiscount = this.item.Discount = 0;
    if(this.item && this.item.PriceProductCombo) {
      let PriceRoot = 0, Discount = 0, PriceDiscount = 0
      this.item.PriceProductCombo.forEach((prb: any) => {
        if(updateItem){
          this.updatePriceDiscountItem(prb)
        }
        if(prb.PriceRoot){
          PriceRoot += UtilityExHelper.formatStringtoNumber(prb.PriceRoot)
        }
        if(prb.PriceDiscount){
          PriceDiscount += UtilityExHelper.formatStringtoNumber(prb.PriceDiscount)
        }
      })
      if(PriceRoot >= 0) {
        this.item.PriceRoot = PriceRoot
      }      
      if(PriceDiscount >= 0) {
        this.item.PriceDiscount = PriceDiscount
      }
      if(PriceRoot >= 0 && PriceDiscount >= 0) {
        if (this.item.DiscountType == PriceConfigDiscountType.Money) {
          this.item.Discount = PriceRoot - PriceDiscount
        }
        else{
          if(!isNaN(Math.round((PriceRoot - PriceDiscount) / PriceRoot * 100))) {
            this.item.Discount = Math.round((PriceRoot - PriceDiscount) / PriceRoot * 100)
          } else {
            this.item.Discount = 0
          }          
        }        
      }
    }
  }

  getUnitName(unitName) {
    let keys = Object.keys(CalculationUnitType).find(x => CalculationUnitType[x] == unitName);
    if(keys){
      return UtilityExHelper.createLabel(keys)
    } 
    return unitName;
  }

  parsePriceDiscount(discountType: PriceConfigDiscountType, priceRoot, discount) {
    if(typeof priceRoot == 'bigint') {
      const discountPer = priceRoot * BigInt(discount) / BigInt(100)
      return discountType == PriceConfigDiscountType.Money
      ? UtilityExHelper.formatNumbertoString(priceRoot - BigInt(discount))
      : UtilityExHelper.formatNumbertoString(priceRoot - discountPer);
    }
    else {
      return discountType == PriceConfigDiscountType.Money
      ? UtilityExHelper.formatNumbertoString(priceRoot - discount)
      : UtilityExHelper.formatNumbertoString(priceRoot - Math.round((priceRoot * discount) / 100));
    }    
  }
}
