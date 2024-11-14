import { Component, Input, OnInit } from "@angular/core";
import { AppInjector } from "../../../../../app.module";
import { validation } from "../../../../../_core/decorators/validator";
import { ResultApi } from "../../../../../_core/domains/data/result.api";
import { MOOrdersEntity } from "../../../../../_core/domains/entities/meeyorder/order.entity";
import { ToastrHelper } from "../../../../../_core/helpers/toastr.helper";
import { AdminDialogService } from "../../../../../_core/services/admin.dialog.service";
import { MOOrdersService } from "../../orders.service";

@Component({
  templateUrl: "./order.approve.component.html",
})
export class MOOrderApproveRejectComponent implements OnInit {
  active: boolean;
  errorMessage: string;
  @Input() params: any;
  disabled: boolean = true;
  service: MOOrdersService;
  dialogService: AdminDialogService;

  item: MOOrdersEntity = new MOOrdersEntity();

  labelNote: string;
  action: string;
  paymentProviderId: number
  constructor() {
    this.service = AppInjector.get(MOOrdersService);
    this.dialogService = AppInjector.get(AdminDialogService);
  }

  valueChange() {
    if (this.action == "reject") {
      this.disabled = this.item.Note ? false : true;
    }
  }

  ngOnInit() {
    let action = this.params && this.params["action"];
    this.paymentProviderId = this.params && this.params["paymentProviderId"];
    this.action = action;
    if (action == "reject") {
      this.labelNote = "Lý do";
    } else if (action == "approve") {
      this.labelNote = "Ghi chú";
      this.disabled = false;
    } else {
      this.labelNote = null;
    }
  }

  public async confirm(): Promise<boolean> {
    this.errorMessage = null;
    let valid = true;
    if (this.action == "reject") {
      valid = await validation(this.item, ["Note"]);
    }
    if (valid) {
      let id = this.params && this.params["id"];
      let meeyId = this.params && this.params["meeyId"];
      if (id && meeyId) {
        let obj = {
          meeyId: meeyId,
          orderId: id,
          adminEmail: "",
          note: this.item.Note,
          action: this.action,
          paymentProviderId: this.paymentProviderId
        };
        if (this.action) {
          let message = "";
          if (this.action == "reject") {
            message = "Từ chối thành công";
          } else if (this.action == "approve") {
            message = "Duyệt đơn hàng thành công";
          }
          if (message) {
            return await this.service.ApproveOrRejectOrder(obj).then((result: ResultApi) => {
              if (ResultApi.IsSuccess(result)) {
                ToastrHelper.Success(message);
                return true;
              }
              this.errorMessage = result && result.Description;
              return false;
            }, (e) => {
                ToastrHelper.Exception(e);
                return false;
            });
          }
        }
      }
    }
    return false;
  }
}
