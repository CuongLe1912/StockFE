import { Component, Input, OnInit } from '@angular/core';
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { ActionData } from '../../../../_core/domains/data/action.data';
import { OptionItem } from '../../../../_core/domains/data/option.item';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ActionType } from '../../../../_core/domains/enums/action.type';
import { ConstantHelper } from '../../../../_core/helpers/constant.helper';
import { MAFPolicyService } from '../policy.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class MAFViewPolicyComponent extends EditComponent implements OnInit {
  @Input() params: any;

  loading: boolean = true;
  items: any;
  id: any;
  
  constructor(public service: MAFPolicyService) {
    super();
    this.state = this.getUrlState();
  }

  async ngOnInit() {
    this.loading = true;
    this.id = this.params && this.params["id"];
    if (this.router?.routerState?.snapshot?.root?.queryParams["id"]) {
      this.id = this.router?.routerState?.snapshot?.root?.queryParams["id"]
    }
    await this.loadItem();

    this.addBreadcrumb("Lịch sử thay đổi");
    if (this.state) {
      this.id = this.id || this.state.id;
    }
    this.renderActions();
    this.loading = false
  }

  async loadItem() {    
    await this.service.ActiveItem().then((result: ResultApi) => {
      if (ResultApi.IsSuccess(result)) {
        this.items = [result.Object];
      }
    });
  }

  async renderActions() {
    let actions: ActionData[] = [
      ActionData.back(() => { this.back() }),
    ];
    this.actions = actions;
  }

  getPaymentType(item) {
    if (!item?.PaymentType) return '';
    let option: OptionItem = ConstantHelper.MAF_PAYMENT_TYPES.find((c) => c.value == item.PaymentType);
    let text = '<p class="' + (option && option.color) + '">' + (option && option.label) + "</p>";
    return text
  }

  getPaymentCycleType(item) {
    if (!item?.PaymentCycleType) return '';
    let option: OptionItem = ConstantHelper.MAF_PAYMENT_CYCLE_TYPES.find((c) => c.value == item.PaymentCycleType);
    let text = '<p class="' + (option && option.color) + '">' + (option && option.label) + "</p>";
    return text
  }

  ShowPolicy(item) {
    item.ShowPolicy = !item.ShowPolicy;
  }

}
