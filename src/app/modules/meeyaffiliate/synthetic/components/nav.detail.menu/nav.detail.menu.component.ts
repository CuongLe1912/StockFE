import { Router } from "@angular/router";
import { AppInjector } from "../../../../../app.module";
import { Component, Input, OnInit } from "@angular/core";
import { AdminEventService } from "../../../../../_core/services/admin.event.service";
import { NavigationStateData } from "../../../../../_core/domains/data/navigation.state";
import { Location } from '@angular/common';
import { AdminAuthService } from "../../../../../_core/services/admin.auth.service";
import { MAFAffiliateService } from "../../../affiliate/affiliate.service";
import { MethodType } from "../../../../../_core/domains/enums/method.type";
import { ResultApi } from "../../../../../_core/domains/data/result.api";
import { MAFContractType } from "../../../../../_core/domains/entities/meeyaffiliate/enums/contract.type";
import { TableData } from "../../../../../_core/domains/data/table.data";

@Component({
  templateUrl: "./nav.detail.menu.component.html",
  styleUrls: ["./nav.detail.menu.component.scss"]
})
export class MAFNavDetailMenuComponent implements OnInit {

  router: Router;
  loading: boolean;
  chartOptions: any;
  @Input() params: any;
  activeIndex: number = 0;

  item: any;
  itemData: TableData;

  service: MAFAffiliateService
  authen: AdminAuthService;
  event: AdminEventService;
  location: Location;
  buttons: any[] = [
    { id: 1, link: '/admin/mafsynthetic', name: 'Tổng hợp' },
    { id: 2, link: '/admin/mafsynthetic/individual', name: 'Danh sách hoa hồng Cá nhân' },
    { id: 3, link: '/admin/mafsynthetic/businesses', name: 'Danh sách hoa hồng Doanh nghiệp' },
  ]

  constructor() {
    this.event = AppInjector.get(AdminEventService);
    this.authen = AppInjector.get(AdminAuthService);
    this.router = AppInjector.get(Router);
    this.location = AppInjector.get(Location);
    this.service = AppInjector.get(MAFAffiliateService);
  }

  async ngOnInit() {
    this.activeIndex = 1;
    let url = this.location.path();
    let lst = url.split('?');
    if (lst && lst.length > 0) {
      url = lst[0];
    }
    let currentButtons = this.buttons.find(c => c.link.includes(url));
    if (currentButtons) {
      this.activeIndex = currentButtons.id;
    }

    this.itemData = this.params && this.params['TableData'];

    this.loadItem(this.activeIndex);
  }

  async loadItem(idActive) {
    let action = "CommissionCollected";
    if (idActive == 2) {
      action += "?type=" + MAFContractType.Individual
    } else if (idActive == 3) {
      action += "?type=" + MAFContractType.Businesses
    }

    if (!this.itemData) this.itemData = new TableData();
    await this.service.callApi("MAFAffiliateSynthetic", action, this.itemData, MethodType.Post).then((result: ResultApi) => {
      if (ResultApi.IsSuccess(result)) {
        this.item = result.Object
      }
    });
  }

  filter(item: any) {
    let link = item.link;
    if (window.location.search) {
      if (item.id == 1) {
        link = '/admin/mafsynthetic/view'
      }
      link += window.location.search;
    }
    this.activeIndex = item.id;
    let obj: NavigationStateData = {
      object: { itemLink: item },
      prevUrl: this.router.url,
    };
    this.router.navigateByUrl(link, {
      state: { params: JSON.stringify(obj) },
    });
  }

}
