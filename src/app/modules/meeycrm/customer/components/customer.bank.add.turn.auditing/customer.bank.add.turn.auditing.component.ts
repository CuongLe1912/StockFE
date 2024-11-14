import { Component, Input, OnInit } from '@angular/core';
import { AppInjector } from '../../../../../app.module';
import { MOOrdersService } from '../../../../../modules/meeyorder/orders/orders.service';
import { validation } from '../../../../../_core/decorators/validator';
import { OptionItem } from '../../../../../_core/domains/data/option.item';
import { ResultApi } from '../../../../../_core/domains/data/result.api';
import { MLCompanyEntity } from '../../../../../_core/domains/entities/meeyland/ml.company.entity';
import { MOOrderCreateEntity } from '../../../../../_core/domains/entities/meeyorder/order.create.entity';
import { MPPaymentMethodType } from '../../../../../_core/domains/entities/meeypay/enums/mp.transaction.status.type';
import { EntityHelper } from '../../../../../_core/helpers/entity.helper';
import { ToastrHelper } from '../../../../../_core/helpers/toastr.helper';
import { AdminAuthService } from '../../../../../_core/services/admin.auth.service';
import { AdminDialogService } from '../../../../../_core/services/admin.dialog.service';

@Component({
  selector: 'app-customer.bank.add.turn.auditing',
  templateUrl: './customer.bank.add.turn.auditing.component.html',
  styleUrls: ['./customer.bank.add.turn.auditing.component.scss']
})
export class MCRMCustomerBankAddTurnAuditingComponent implements OnInit {
  @Input() params: any
  company: MLCompanyEntity;
  item: MOOrderCreateEntity = new MOOrderCreateEntity();
  listService: any;
  serviceOption: OptionItem[];

  service: MOOrdersService;
  authen: AdminAuthService;
  dialog: AdminDialogService;
  constructor() { 
    this.service = AppInjector.get(MOOrdersService);
    this.authen = AppInjector.get(AdminAuthService);
    this.dialog = AppInjector.get(AdminDialogService);
  }

  ngOnInit() {
    this.company = this.params && this.params['item'];
    if (this.company) {
      this.company = EntityHelper.createEntity(MLCompanyEntity, this.company);
    }
    this.loadItems();    
  }

  loadItems() {
    this.service.ServiceForAddTurnAuditing().then((result: ResultApi) => {
      if (ResultApi.IsSuccess(result)) {
        this.listService = result.Object;
        this.serviceOption = [];
        this.listService.forEach(service => {
          let option: OptionItem = {
            label: service.Name,
            value: service.Id,
            icon: null,
          };
          this.serviceOption.push(option)
        });
      }
    })
  }

  public async confirm(): Promise<boolean> {
    let validator = await validation(this.item, ["ServiceId", "Note"])
    if (validator) {
      this.item.PaymentMethod = MPPaymentMethodType.MeeyPayAccount;
      this.item.UserMeeyId = this.company.UserMeeyId;
      this.item.Price = 0;
      return this.service.AddOrder(this.item).then((result: ResultApi) => {
        if (ResultApi.IsSuccess(result)) {
          ToastrHelper.Success('Cấp phát lượt tra cứu thành công!');
          return true;
        } else {
          ToastrHelper.ErrorResult(result);
          return false;
        }
      });
    }    
    return false;
  }

}
