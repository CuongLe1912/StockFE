import { Router } from "@angular/router";
import { AppInjector } from "../../../../../app.module";
import { Component, Input, OnInit } from "@angular/core";
import { TableData } from "../../../../../_core/domains/data/table.data";
import { FilterData } from "../../../../../_core/domains/data/filter.data";
import { CompareType } from "../../../../../_core/domains/enums/compare.type";
import { AdminEventService } from "../../../../../_core/services/admin.event.service";
import { MPInvoiceStatusType } from "../../../../../_core/domains/entities/meeypay/enums/mp.invoice.status.type";
import { NavigationStateData } from "../../../../../_core/domains/data/navigation.state";
import { Location } from '@angular/common';
import { AdminAuthService } from "../../../../../_core/services/admin.auth.service";
import { ActionType } from "../../../../../_core/domains/enums/action.type";

@Component({
  templateUrl: "./nav.menu.component.html",
  styleUrls: ["./nav.menu.component.scss"]
})
export class MAFNavMenuComponent implements OnInit {

  router: Router;
  loading: boolean;
  chartOptions: any;
  @Input() params: any;
  activeIndex: number = 0;

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
  }

  async ngOnInit() {
    this.activeIndex = 1;
    let url = this.location.path();
    let currentButtons = this.buttons.filter(c => c.link.includes(url));
    if (currentButtons) {
      this.activeIndex = currentButtons[0].id;
    }

  }

  filter(item: any) {
    this.activeIndex = item.id;
    let obj: NavigationStateData = {
      object: { itemLink: item },
      prevUrl: this.router.url,
    };
    this.router.navigateByUrl(item.link, {
      state: { params: JSON.stringify(obj) },
    });
  }

}
