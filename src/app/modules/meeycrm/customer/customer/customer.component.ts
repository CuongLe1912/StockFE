import { Component, Input, OnInit } from '@angular/core';
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { ActionData } from '../../../../_core/domains/data/action.data';

@Component({
  templateUrl: 'customer.component.html',
  styleUrls: ['customer.component.scss']
})
export class MCRMCustomerComponent extends EditComponent implements OnInit {
  @Input() params: any;
  actions: ActionData[] = [];
  loading: boolean = false;

  tab: string = 'customer';

  constructor() {
    super();
  }

  ngOnInit() {
    this.breadcrumbs = [];
    this.breadcrumbs.push({
      Name: 'CRM Nội bộ'
    });
    this.breadcrumbs.push({
      Name: 'CRM Khách hàng'
    });

    this.tab = this.getParam('tab') || 'customer';
  }

  selectedTab(tab) {
    this.tab = tab;   
  }

}
