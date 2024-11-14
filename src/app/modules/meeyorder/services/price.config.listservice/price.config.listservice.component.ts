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
import { ResultPriceConfigGridComponent } from "../components/result.price.config.list.component";
import { PriceConfigDiscountType } from "../../../../_core/domains/entities/meeyorder/enums/price.config.type";
import { UtilityExHelper } from "../../../../_core/helpers/utility.helper";
import { ActionType } from "../../../../_core/domains/enums/action.type";

@Component({
  templateUrl: "./price.config.listservice.component.html",
  styleUrls: ["./price.config.listservice.component.scss"],
})
export class PriceConfigListServiceComponent
  extends EditComponent
  implements OnInit {
  @ViewChild("uploadFile") uploadFile: EditorComponent;
  @Input() params: any;
  actions: ActionData[] = [];

  loading: boolean = true;
  loadingService: boolean = true;
  loadingHistory: boolean = true;
  loadingTransaction: boolean = true;

  ids: string;
  router: Router;
  state: NavigationStateData;
  item: PriceConfigEntity = new PriceConfigEntity();
  listItem: PriceConfigEntity[] = [];
  listService: MOServicesEntity[] = [];

  service: MOServicesService;
  authen: AdminAuthService;
  dialog: AdminDialogService;

  minCurent = new Date();
  maxValue: number;
  discountText = "%";
  renderDiscount: boolean = false;
  disableDiscountType: boolean = false;
  renderDiscountType: boolean = true;
  discountPercent: boolean = true;

  constructor() {
    super();
    this.router = AppInjector.get(Router);
    this.service = AppInjector.get(MOServicesService);
    this.authen = AppInjector.get(AdminAuthService);
    this.dialog = AppInjector.get(AdminDialogService);
    this.state = this.getUrlState();
  }

  async ngOnInit() {
    this.ids = this.params && this.params["ids"];
    if (this.state) {
      this.ids = this.ids || this.state.object.id;
    }
    this.addBreadcrumb("Cấu hình giá");
    await this.loadItem();
    this.renderActions();
    this.loading = false;
  }

  private async loadItem() {
    this.item.DiscountType = PriceConfigDiscountType.Percent;
    this.item.Discount = null;
    this.maxValue = 100;

    if (this.ids) {
      await this.service.ServiceByIds(this.ids).then((result: ResultApi) => {
        if (ResultApi.IsSuccess(result)) {
          this.listService = [];
          this.listItem = [];
          this.renderDiscountType = false;
          this.disableDiscountType = false;
          result.Object.forEach((s) => {
            let service: MOServicesEntity = EntityHelper.createEntity(
              MOServicesEntity,
              s
            );
            if (s?.Group?.Provider?.Code == 'meeyland') {
              this.disableDiscountType = true;
            }
            let price = new PriceConfigEntity();
            price.ProductId = service.Id;
            if (s.PriceConfig && s.PriceConfig.length > 0) {
              service.PriceConfig = EntityHelper.createEntity(
                PriceConfigEntity,
                s.PriceConfig[0]
              );
              price.PriceRoot = UtilityExHelper.formatNumbertoString(service.PriceConfig.PriceRoot);
            }
            this.listService.push(service);
            this.listItem.push(price);
          });
          setTimeout(() => this.renderDiscountType = true);
        }
      });
    }
  }

  public async confirmAndBack() {
    await this.confirm(() => {
      // this.back();
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
    this.actions = await this.authen.actionsAllow(PriceConfigEntity, actions);
  }

  public async confirm(complete: () => void): Promise<boolean> {
    if (this.item) {
      this.processing = true;

      // valid common
      let validator = await validation(this.item, ["DiscountType", "StartDate", "UrlPolicy"]) &&
        await validations(this.listItem, ["PriceRoot", "PriceDiscount"]);

      // save
      if (validator) {
        const contentDialog = '<p><h4 style="text-align: center;">Bạn muốn tạo "Cấu hình giá" mới?</h4></p>' +
          '<p><em>Lưu ý: Giá mới sẽ có hiệu lực đến ngày áp dụng. Nếu chưa đến ngày áp dụng thì sẽ ở trạng thái "Chờ áp dụng"</em></p>';

        // set Discount
        this.listItem.forEach((item: PriceConfigEntity) => {
          if (!item.Discount) item.Discount = 0;
        });

        // save
        this.dialogService.ConfirmAsync(contentDialog, async () => {
          let files = await this.uploadFile.upload();
          this.item.UrlPolicy = files && files.length > 0 ? files[0].Path : "";

          let listItem = _.cloneDeep(this.listItem);
          listItem.forEach((product) => {
            product.PriceRoot = UtilityExHelper.formatStringtoNumber(product.PriceRoot)
            product.PriceDiscount = UtilityExHelper.formatStringtoNumber(product.PriceDiscount)
            product.Discount = UtilityExHelper.formatStringtoNumber(product.Discount)
            product.DiscountType = this.item.DiscountType;
            product.StartDate = this.item.StartDate;
            product.UrlPolicy = this.item.UrlPolicy;
          });

          await this.service.AddPriceListService({ PriceConfig: listItem }).then((result: ResultApi) => {
            this.processing = false;
            if (ResultApi.IsSuccess(result)) {
              this.alertResult(result.Object);
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

  priceDiscountChange() {
    if (this.item) {
      if (this.item.DiscountType) {
        this.renderDiscount = false;
        if (this.item.DiscountType == PriceConfigDiscountType.Money) {
          this.maxValue = 99999999999999999999;
          this.discountText = "vnđ";
          this.discountPercent = false;
          this.listItem.map(c => { c.Discount = 0; return c; })
        } else {
          this.maxValue = 100;
          this.discountText = "%";
          this.discountPercent = true;
          this.listItem.map(c => { c.Discount = 0; return c; })
        }
        setTimeout(() => this.renderDiscount = true);
        this.changePriceList()
      }
    }
  }

  changePriceList() {
    this.listItem.forEach(async price => {
      await this.priceItemDiscountChange(price)
    })
  }

  async priceItemDiscountChange(priceProductCombo: PriceConfigEntity) {
    let validator = await validation(this.item, ["DiscountType"]);
    if (validator) {
      if (!priceProductCombo.Discount) priceProductCombo.Discount = 0
      if (priceProductCombo.PriceRoot) {
        const priceRoot = UtilityExHelper.formatStringtoNumber(priceProductCombo.PriceRoot);
        const discount = UtilityExHelper.formatStringtoNumber(priceProductCombo.Discount);
        priceProductCombo.PriceDiscount = this.parsePriceDiscount(this.item.DiscountType, priceRoot, discount)
      }
    }
  }

  updatePriceDiscountItem(priceProductCombo: PriceConfigEntity) {
    if (!priceProductCombo.Discount) priceProductCombo.Discount = 0
    if (priceProductCombo.PriceRoot) {
      const priceRoot = UtilityExHelper.formatStringtoNumber(priceProductCombo.PriceRoot);
      const discount = UtilityExHelper.formatStringtoNumber(priceProductCombo.Discount);
      priceProductCombo.PriceDiscount = this.parsePriceDiscount(this.item.DiscountType, priceRoot, discount)
    }
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

  alertResult(results) {
    if (results) {
      let success = 0
      results.forEach(r => {
        if (r.status == 1) {
          success++;
        }
      })

      this.dialogService.WapperAsync({
        cancelText: "Đóng",
        title: "Thực hiện tạo giá mới thành công: " + success + "/" + results.length + " dịch vụ",
        object: ResultPriceConfigGridComponent,
        size: ModalSizeType.ExtraLarge,
        objectExtra: {
          results: results,
        },
      });
    }
  }

  parsePriceDiscount(discountType: PriceConfigDiscountType, priceRoot, discount) {
    if (typeof priceRoot == 'bigint') {
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
