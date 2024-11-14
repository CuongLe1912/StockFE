import { Component, OnInit } from '@angular/core';
import { ResultApi } from '../../../_core/domains/data/result.api';
import { AppInjector } from '../../../app.module';
import { EditComponent } from '../../../_core/components/edit/edit.component';
import { ActionData } from '../../../_core/domains/data/action.data';
import { MAFPolicyService } from './policy.service';
import { OptionItem } from '../../../_core/domains/data/option.item';
import { ConstantHelper } from '../../../_core/helpers/constant.helper';
import { MAFContractType } from '../../../_core/domains/entities/meeyaffiliate/enums/contract.type';

@Component({
  templateUrl: './policy.component.html',
  styleUrls: ['./policy.component.scss']
})
export class MAFPolicyComponent extends EditComponent implements OnInit {
  actions: ActionData[] = [];
  policyTab: string = 'customer';

  item: any;
  service: MAFPolicyService;
  loading = false;

  constructor() {
    super();
    this.service = AppInjector.get(MAFPolicyService);
  }

  async ngOnInit() {
    await this.loadItem();
  }

  async selectedPolicyTab(tab: string) {
    this.policyTab = tab;
    let type = MAFContractType.Individual;
    if (tab == 'customer') {
      type = MAFContractType.Individual;
    } else if (tab == 'publisher') {
      type = MAFContractType.Businesses;
    }
    await this.loadItem(type);
  }

  async loadItem(type = MAFContractType.Individual) {
    this.loading = true;
    await this.service.ActiveItem(type).then((result: ResultApi) => {
      if (ResultApi.IsSuccess(result)) {
        this.item = result.Object;
      }
    });
    this.loading = false;
  }

  getPaymentType() {
    if (!this.item?.PaymentType) return '';
    let option: OptionItem = ConstantHelper.MAF_PAYMENT_TYPES.find((c) => c.value == this.item.PaymentType);
    let text = '<p class="' + (option && option.color) + '">' + (option && option.label) + "</p>";
    return text
  }

  getPaymentCycleType() {
    if (!this.item?.PaymentCycleType) return '';
    let option: OptionItem = ConstantHelper.MAF_PAYMENT_CYCLE_TYPES.find((c) => c.value == this.item.PaymentCycleType);
    let text = '<p class="' + (option && option.color) + '">' + (option && option.label) + "</p>";
    return text
  }

}
