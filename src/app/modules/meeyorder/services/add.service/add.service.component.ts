import * as _ from "lodash";
import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { AppInjector } from "../../../../app.module";
import { EditComponent } from "../../../../_core/components/edit/edit.component";
import { validation } from "../../../../_core/decorators/validator";
import { ActionData } from "../../../../_core/domains/data/action.data";
import { NavigationStateData } from "../../../../_core/domains/data/navigation.state";
import { ResultApi } from "../../../../_core/domains/data/result.api";
import { MOServicesEntity } from "../../../../_core/domains/entities/meeyorder/services.entity";
import { ToastrHelper } from "../../../../_core/helpers/toastr.helper";
import { AdminAuthService } from "../../../../_core/services/admin.auth.service";
import { AdminDialogService } from "../../../../_core/services/admin.dialog.service";
import { MOServicesService } from "../services.service";
import { UseTimeType } from "../../../../_core/domains/entities/meeyorder/enums/usetime.type";
import { UnitDurationType } from "../../../../_core/domains/entities/meeyorder/enums/unit.duration.type";
import { OptionItem } from "../../../../_core/domains/data/option.item";
import { ActionType } from "../../../../_core/domains/enums/action.type";

@Component({
  templateUrl: "./add.service.component.html",
  styleUrls: ["./add.service.component.scss"],
})
export class AddServiceComponent extends EditComponent implements OnInit {
  @Input() params: any;
  actions: ActionData[] = [];

  loading: boolean = true;
  loadingService: boolean = true;
  loadingHistory: boolean = true;
  loadingTransaction: boolean = true;

  id: number;
  router: Router;
  state: NavigationStateData;
  item: MOServicesEntity = new MOServicesEntity();

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
      this.addBreadcrumb(this.id ? "Sửa dịch vụ" : "Thêm mới dịch vụ");
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
      let validator = false;
      let columns = ["ProviderId", "ParentGroupId", "Name", "NameShow", "Code", "Unit", "Duration", "CustomUseTime", "UnitDuration"]
      if (this.item.Duration == UseTimeType.CustomUseTime) {
        columns = ["ProviderId", "ParentGroupId", "Name", "NameShow", "Code", "Unit", "Duration", "CustomUseTime", "UnitDuration"]
        if (this.showGroup) columns.push('GroupId')
        validator = await validation(this.item, columns)
      }
      else if (this.item.Duration == UseTimeType.Unlimited) {
        columns = ["ProviderId", "ParentGroupId", "Name", "NameShow", "Code", "Unit"]
        if (this.showGroup) columns.push('GroupId')
        validator = await validation(this.item, columns)
      }
      else {
        columns = ["ProviderId", "ParentGroupId", "Name", "NameShow", "Code", "Unit", "Duration"]
        if (this.showGroup) columns.push('GroupId')
        validator = await validation(this.item, columns)
      }
      if (validator) {
        this.processing = true;
        if (this.item.Duration != UseTimeType.CustomUseTime) {
          if (this.item.Duration == UseTimeType.Month6) {
            this.item.UnitDuration = UnitDurationType.Month
          } else if (this.item.Duration == UseTimeType.Year1) {
            this.item.UnitDuration = UnitDurationType.Year
          } else if (this.item.Duration == UseTimeType.Unlimited) {
            this.item.UnitDuration = UnitDurationType.Unlimited
          } else {
            this.item.UnitDuration = UnitDurationType.Day
          }
        }
        if (!this.item.GroupId) {
          this.item.GroupId = this.item.ParentGroupId
        }
        this.service.addOrUpdateService(this.item).then((result: ResultApi) => {
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
        systemName: ActionType.AddNewSerive,
        click: async () => {
          await this.confirmAndBack();
        }
      }
    ];
    this.actions = await this.authen.actionsAllow(MOServicesEntity, actions);
  }

  groupLoaded(items: OptionItem[]) {
    this.showGroup = items && items.length > 0;
  }
  
}
