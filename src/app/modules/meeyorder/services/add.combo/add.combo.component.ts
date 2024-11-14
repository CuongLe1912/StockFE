import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { AppInjector } from '../../../../app.module';
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { validation } from '../../../../_core/decorators/validator';
import { ActionData } from '../../../../_core/domains/data/action.data';
import { NavigationStateData } from '../../../../_core/domains/data/navigation.state';
import { ComboEntity } from '../../../../_core/domains/entities/meeyorder/combo.entity';
import { ProductEntity } from '../../../../_core/domains/entities/meeyorder/product.entity';
import { MOServicesEntity } from '../../../../_core/domains/entities/meeyorder/services.entity';
import { ModalSizeType } from '../../../../_core/domains/enums/modal.size.type';
import { AdminAuthService } from '../../../../_core/services/admin.auth.service';
import { AdminDialogService } from '../../../../_core/services/admin.dialog.service';
import { MOServiceGridComponent } from '../components/service.grid.component';
import { MOServicesService } from '../services.service';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { UseTimeType } from '../../../../_core/domains/entities/meeyorder/enums/usetime.type';
import { UnitDurationType } from '../../../../_core/domains/entities/meeyorder/enums/unit.duration.type';
import { CalculationUnitType } from '../../../../_core/domains/entities/meeyorder/enums/calculation.unit.type';
import { UtilityExHelper } from '../../../../_core/helpers/utility.helper';
import { OptionItem } from '../../../../_core/domains/data/option.item';
import { ActionType } from '../../../../_core/domains/enums/action.type';

@Component({
  templateUrl: "./add.combo.component.html",
  styleUrls: ["./add.combo.component.scss"],
})
export class AddComboComponent extends EditComponent implements OnInit {
  @ViewChild('serviceGrid') serviceGridComponent: MOServiceGridComponent;
  @Input() params: any;
  actions: ActionData[] = [];

  loading: boolean = true;
  loadingService: boolean = true;
  loadingHistory: boolean = true;
  loadingTransaction: boolean = true;

  id: number;
  router: Router;
  state: NavigationStateData;
  item: ComboEntity = new ComboEntity();

  service: MOServicesService;
  authen: AdminAuthService;
  dialog: AdminDialogService;
  showGroup = false;

  constructor() { 
    super();
    this.router = AppInjector.get(Router);
    this.service = AppInjector.get(MOServicesService);
    this.authen = AppInjector.get(AdminAuthService);
    this.dialog = AppInjector.get(AdminDialogService);
    this.state = this.getUrlState();
  }

  ngOnInit() {
    this.id = this.params && this.params["id"];
    if (this.state) {
      this.id = this.id || this.state.id;
      this.addBreadcrumb(this.id ? "Sửa combo" : "Khai báo combo");
    }
    this.renderActions();
    this.loading = false;
  }

  public async confirmAndBack() {
    await this.confirm(() => {
      this.back();
    });
  }

  public async confirm(complete: () => void): Promise<boolean> {
    if (this.item) {
      this.processing = true;
      let columns = ["ProviderId", "ParentGroupId", "Name", "NameShow", "Code"]
      if(this.showGroup) columns.push('GroupId')
      if (await validation(this.item, columns)) {
        if (this.item.ProductCombo && this.item.ProductCombo.length > 0) {
          let validationProduct = true;
          for(let i = 0; i < this.item.ProductCombo.length; i++) {
            const product = this.item.ProductCombo[i]
            let validator = false;
            if(product.Duration == UseTimeType.CustomUseTime) {
              validator = await validation(product, ["Amount", "Unit", "Duration", "CustomUseTime", "UnitDuration"])
            }
            else if (product.Duration == UseTimeType.Unlimited) {
              validator = await validation(product, ["Amount", "Unit"])
            }
            else {
              validator = await validation(product, ["Amount", "Unit", "Duration"])
            }
            if(validationProduct) validationProduct = validator

            if(validator){
              if(product.Duration != UseTimeType.CustomUseTime) {
                if (product.Duration == UseTimeType.Month6) {
                  product.UnitDuration = UnitDurationType.Month
                } else if (product.Duration == UseTimeType.Year1){
                  product.UnitDuration = UnitDurationType.Year
                } else if (product.Duration == UseTimeType.Unlimited){
                  product.UnitDuration = UnitDurationType.Unlimited
                } else {
                  product.UnitDuration = UnitDurationType.Day
                }
              }
            }            
          }
          if (validationProduct) {
            if (!this.item.GroupId) {
              this.item.GroupId = this.item.ParentGroupId
            }
            this.service.AddOrUpdateCombo(this.item).then((result: ResultApi) => {
                this.processing = false;
                if (ResultApi.IsSuccess(result)) {
                  ToastrHelper.Success('Tạo dịch vụ thành công');
                  if (complete) complete();
                  return true;
              } else {
                  ToastrHelper.ErrorResult(result);
                  return false;
              }
            });
          }
          else this.processing = false;          
          
        } else {
          ToastrHelper.Error("Chọn ít nhất 1 dịch vụ để khai báo combo");
          this.processing = false;
          return false;
        }
        
      } else this.processing = false;
    } else return false;
  }

  private async renderActions() {
    let actions: ActionData[] = [
      ActionData.back(() => {
        this.back();
      }),
      {
        name: "Lưu lại",
        processButton: true,
        icon: 'la la-plus-circle',
        className: 'btn btn-primary',
        systemName: ActionType.AddNewCombo,
        click: async () => {
          await this.confirmAndBack();
        }
      }
    ];
    this.actions = await this.authen.actionsAllow(MOServicesEntity, actions);
  }

  getUnitName(unitName) {
    let keys = Object.keys(CalculationUnitType).find(x => CalculationUnitType[x] == unitName);
    if(keys){
      return UtilityExHelper.createLabel(keys)
    } 
    return unitName;
  }

  popupChoiceService(){
    this.dialogService.WapperAsync({
      cancelText: 'Đóng',
      title: 'Thêm dịch vụ',
      object: MOServiceGridComponent,
      confirmText: 'Chọn dịch vụ',
      size: ModalSizeType.ExtraLarge,
      objectExtra: {
        listUncheck: this.item.ProductCombo,
        choiceComplete: ((items: any[]) => {
          this.changeProductComboList(items)
      }),
      }  
    });
  }

  changeProductComboList(items: MOServicesEntity[]){
    // if(!this.item.ProductCombo) {
      this.item.ProductCombo = []
    // }
    items.forEach(ser => {
      let product = this.item.ProductCombo.find(c => c.ProductId === ser.Id)
      if(product == null) {
        let productCombo = new ProductEntity()
        productCombo.ProductId = ser.Id
        productCombo.Name = ser.Name
        productCombo.Code = ser.Code
        productCombo.Unit = ser.Unit
        productCombo.Amount = 1
        if(ser.Duration) {
          productCombo.UnitDuration = ser.UnitDuration
          if (Object.values(UseTimeType).includes(ser.Duration)) {                    
            productCombo.Duration = ser.Duration
          }
          else {
            productCombo.CustomUseTime = ser.Duration                    
            productCombo.Duration = UseTimeType.CustomUseTime
          }
          if (productCombo.Duration == UseTimeType.Month6 && productCombo.UnitDuration != UnitDurationType.Month) {
            productCombo.CustomUseTime = ser.Duration                    
            productCombo.Duration = UseTimeType.CustomUseTime
          }
          if (productCombo.Duration == UseTimeType.Year1 && productCombo.UnitDuration != UnitDurationType.Year) {
            productCombo.CustomUseTime = ser.Duration                    
            productCombo.Duration = UseTimeType.CustomUseTime
          }
        }
        else {
          productCombo.Duration = UseTimeType.Unlimited
        }
        
        this.item.ProductCombo.push(productCombo)
      }
    })
  }
  
  groupLoaded(items: OptionItem[]) {    
    this.showGroup = items && items.length > 0;
  }

}
