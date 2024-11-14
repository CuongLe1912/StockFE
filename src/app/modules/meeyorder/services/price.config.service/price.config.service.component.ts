import * as _ from 'lodash';
import { Router } from "@angular/router";
import { AppInjector } from "../../../../app.module";
import { MOServicesService } from "../services.service";
import { validation } from "../../../../_core/decorators/validator";
import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { ResultApi } from "../../../../_core/domains/data/result.api";
import { EntityHelper } from "../../../../_core/helpers/entity.helper";
import { ToastrHelper } from "../../../../_core/helpers/toastr.helper";
import { ActionData } from "../../../../_core/domains/data/action.data";
import { EditorComponent } from "../../../../_core/editor/editor.component";
import { ModalSizeType } from "../../../../_core/domains/enums/modal.size.type";
import { PriceConfigGridComponent } from "../components/price.config.component";
import { AdminAuthService } from "../../../../_core/services/admin.auth.service";
import { EditComponent } from "../../../../_core/components/edit/edit.component";
import { AdminDialogService } from "../../../../_core/services/admin.dialog.service";
import { NavigationStateData } from "../../../../_core/domains/data/navigation.state";
import { MOServicesEntity } from "../../../../_core/domains/entities/meeyorder/services.entity";
import { PriceConfigEntity } from "../../../../_core/domains/entities/meeyorder/price.config.entity";
import { PriceConfigDiscountType, PriceConfigStatusType } from "../../../../_core/domains/entities/meeyorder/enums/price.config.type";
import { UtilityExHelper } from "../../../../_core/helpers/utility.helper";

@Component({
  templateUrl: "./price.config.service.component.html",
  styleUrls: ["./price.config.service.component.scss"],
})
export class PriceConfigServiceComponent extends EditComponent implements OnInit {
  @Input() params: any;
  authen: AdminAuthService;
  dialog: AdminDialogService;
  service: MOServicesService;

  id: number;
  router: Router;
  maxValue: number;
  disableDiscountType: boolean = false;
  discountText = "%";
  discountPercent: boolean = true;
  minCurent = new Date();
  loading: boolean = true;
  state: NavigationStateData;
  actions: ActionData[] = [];
  renderDiscount: boolean = true;
  renderDiscountType: boolean = true;
  item: PriceConfigEntity = new PriceConfigEntity();
  itemService: MOServicesEntity = new MOServicesEntity();
  filterPriceConfig: { id: number, status: string, showActions: boolean };

  @ViewChild('uploadFile') uploadFile: EditorComponent;
  @ViewChild("priceConfigGrid") priceConfigGrid: PriceConfigGridComponent;


  constructor() {
    super();
    this.dialog = AppInjector.get(AdminDialogService);
    this.service = AppInjector.get(MOServicesService);
    this.authen = AppInjector.get(AdminAuthService);
    this.router = AppInjector.get(Router);
    this.state = this.getUrlState();
  }

  async ngOnInit() {
    this.id = this.params && this.params["id"];
    if (this.state) {
      this.id = this.id || this.state.id;
      this.addBreadcrumb("Cấu hình giá dịch vụ");
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
        },
      },
    });
  }

  private async loadItem() {
    // init discount
    this.item.DiscountType = PriceConfigDiscountType.Percent;
    this.item.Discount = null;
    this.maxValue = 100;

    // load data
    if (this.id) {
      await this.service.item("moservices", this.id).then((result: ResultApi) => {
        if (ResultApi.IsSuccess(result)) {
          this.itemService = EntityHelper.createEntity(MOServicesEntity, result.Object);
          this.item.ProductId = this.id;
          this.renderDiscountType = false;
          this.disableDiscountType = false;
          if (result.Object) {
            if (result.Object?.Group?.Provider?.Code == 'meeyland') {
              this.disableDiscountType = true;
            }
          }
          setTimeout(() => {
            this.renderDiscountType = true
          }, 300);
        }
      });
      await this.service.PriceConfigActive(this.id).then((result: ResultApi) => {
        if (ResultApi.IsSuccess(result)) {
          if (result.Object) {
            const priceCofig = EntityHelper.createEntity(PriceConfigEntity, result.Object);
            this.item.PriceRoot = UtilityExHelper.formatNumbertoString(priceCofig.PriceRoot);
          }
        }
      });
    }
  }

  async priceDiscountChange() {
    if (this.item) {
      if (this.item.DiscountType) {
        this.renderDiscount = false;
        if (this.item.DiscountType == PriceConfigDiscountType.Money) {
          this.maxValue = 99999999999999999999;
          this.discountText = "vnđ";
          this.item.Discount = null;
          this.discountPercent = false;
        } else {
          this.maxValue = 100;
          this.discountText = "%";
          this.item.Discount = null;
          this.discountPercent = true;
        }
        setTimeout(() => this.renderDiscount = true);
      }
    }
    await this.updatePriceDiscount();
  }

  async updatePriceDiscount() {
    let validator = await validation(this.item, ["PriceRoot", "DiscountType"], true);
    if (validator) {
      if (!this.item.Discount) this.item.Discount = 0
      const priceRoot = UtilityExHelper.formatStringtoNumber(this.item.PriceRoot);
      const discount = UtilityExHelper.formatStringtoNumber(this.item.Discount);
      this.item.PriceDiscount = this.parsePriceDiscount(this.item.DiscountType, priceRoot, discount)
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
      ActionData.saveAddNew("Lưu giá mới", async () => {
        await this.confirmAndBack();
      }),
    ];
    this.actions = await this.authen.actionsAllow(PriceConfigEntity, actions);
  }

  public async confirm(complete: () => void): Promise<boolean> {
    if (this.item) {
      this.processing = true;
      let columnValid = ["PriceRoot", "PriceDiscount", "DiscountType", "StartDate", "UrlPolicy"]
      let validator = await validation(this.item, columnValid);
      if (validator) {
        if (!this.item.Discount) this.item.Discount = 0
        this.processing = true;
        const contentDialog = '<p><h4 style="text-align: center;">Bạn muốn tạo "Cấu hình giá" mới?</h4></p>'
          + '<p><em>Lưu ý: Giá mới sẽ có hiệu lực đến ngày áp dụng. Nếu chưa đến ngày áp dụng thì sẽ ở trạng thái "Chờ áp dụng"</em></p>'

        this.dialogService.ConfirmAsync(contentDialog, async () => {
          let files = await this.uploadFile.upload();
          this.item.UrlPolicy = files && files.length > 0 ? files[0].Path : '';
          let item = _.cloneDeep(this.item);
          item.PriceRoot = UtilityExHelper.formatStringtoNumber(item.PriceRoot)
          item.PriceDiscount = UtilityExHelper.formatStringtoNumber(item.PriceDiscount)
          item.Discount = UtilityExHelper.formatStringtoNumber(item.Discount)
          await this.service.addPriceConfigService(item).then((result: ResultApi) => {
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
