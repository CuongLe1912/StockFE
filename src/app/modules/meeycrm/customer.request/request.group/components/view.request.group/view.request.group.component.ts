import { Component, Input, OnInit } from '@angular/core';
import { MCRMCustomerEntity } from '../../../../../../_core/domains/entities/meeycrm/mcrm.customer.entity';
import { EntityHelper } from '../../../../../../_core/helpers/entity.helper';
import { MCRMCustomerRequestEntity } from '../../../../../../_core/domains/entities/meeycrm/mcrm.customer.request.entity';
import { ActionType } from '../../../../../../_core/domains/enums/action.type';
import { validation } from '../../../../../../_core/decorators/validator';
import { AdminAuthService } from '../../../../../../_core/services/admin.auth.service';
import { MeeyCrmService } from '../../../../../../modules/meeycrm/meeycrm.service';
import { AdminDialogService } from '../../../../../../_core/services/admin.dialog.service';
import { AppInjector } from '../../../../../../app.module';
import { ResultApi } from '../../../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../../../_core/helpers/toastr.helper';
import { MCRMCustomerStatusType } from '../../../../../../_core/domains/entities/meeycrm/enums/mcrm.customer.type';

@Component({
  templateUrl: './view.request.group.component.html',
  styleUrls: ['./view.request.group.component.scss'],
})
export class ViewMCRMRequestGroupComponent implements OnInit {
  @Input() params: any;
  action: ActionType;
  items: MCRMCustomerEntity[];
  item: MCRMCustomerRequestEntity;
  viewDetail: false;

  auth: AdminAuthService;
  service: MeeyCrmService;
  dialog: AdminDialogService;

  constructor() {
    this.auth = AppInjector.get(AdminAuthService);
    this.service = AppInjector.get(MeeyCrmService);
    this.dialog = AppInjector.get(AdminDialogService);
  }

  ngOnInit() {
    const item = this.params && this.params['item'];
    if (item) {
      this.item = EntityHelper.createEntity(MCRMCustomerRequestEntity, item)
      this.items = item.Customers
      const rootUser = item.Customers.find(c => c.Id == item.RootId);
      this.item.Name = rootUser.Name;
    } else {
      let id = this.params && this.params['id'];
      this.service.getCustomerRequest(id).then((result: ResultApi) => {
        if (ResultApi.IsSuccess(result) && result.Object) {
          this.item = EntityHelper.createEntity(MCRMCustomerRequestEntity, result.Object);
          this.items = result.Object.Customers;
          const rootUser = result.Object.Customers.find(c => c.Id == this.item.RootId);
          this.item.Name = rootUser.Name;
        }
      });
    }
    this.action = ActionType.GroupCustomer;

    const viewDetail = this.params && this.params['viewDetail'];
    this.viewDetail = this.viewDetail || viewDetail;
  }

  async confirm() {
    let valid = await this.checkValidate([]);
    if (valid) {
      return await this.service.approveRequestGroup(this.item).then((result: ResultApi) => {
        if (ResultApi.IsSuccess(result)) {
          let message = 'Xác nhận gộp khách hàng [' + this.item.Code + '] thành công';
          ToastrHelper.Success(message);
          return true;
        }
        ToastrHelper.ErrorResult(result);
        return false;
      }, (e) => {
        ToastrHelper.Exception(e);
        return false;
      });
    }
    return false;
  }

  async reject() {
    let valid = await this.checkValidate();
    if (valid) {
      return await this.service.rejectRequestGroup(this.item).then((result: ResultApi) => {
        if (ResultApi.IsSuccess(result)) {
          let message = 'Từ chối gộp khách hàng [' + this.item.Code + '] thành công';
          ToastrHelper.Success(message);
          return true;
        }
        ToastrHelper.ErrorResult(result);
        return false;
      }, (e) => {
        ToastrHelper.Exception(e);
        return false;
      });
    }
    return false;
  }

  async checkValidate(columns: string[] = ['ApproveReason'], disableEmit?: boolean) {
    let valid = this.item.RootId &&
      this.items && this.items.length >= 2;
    if (valid && columns.length > 0) {
      valid = await validation(this.item, columns, disableEmit)
    }
    return valid;
  }

}
