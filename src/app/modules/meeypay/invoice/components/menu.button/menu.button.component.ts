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
  templateUrl: "./menu.button.component.html",
  styleUrls: ["./menu.button.component.scss"]
})
export class MPMenuButtonComponent implements OnInit {

  router: Router;
  loading: boolean;
  chartOptions: any;
  @Input() params: any;
  activeIndex: number = 0;

  authen: AdminAuthService;
  event: AdminEventService;
  location: Location;
  buttons: any[] = [
    { id: 1, link: '/admin/mptransactions', name: 'Giao dịch Meey Pay' },
    { id: 2, link: '', name: 'Giao dịch Meey Ads' },
  ]

  constructor() {
    this.event = AppInjector.get(AdminEventService);
    this.authen = AppInjector.get(AdminAuthService);
    this.router = AppInjector.get(Router);
    this.location = AppInjector.get(Location);
  }

  async ngOnInit() {
    let allowViewInvoice = await this.authen.permissionAllow("MPInvoice", ActionType.View);
    if (allowViewInvoice) {
      this.buttons.push({ id: 3, link: '/admin/mpinvoice?s=0', name: 'GD chưa xuất hóa đơn', setFilter: true, property: 'Status', value: MPInvoiceStatusType.New });
      this.buttons.push({ id: 4, link: '/admin/mpinvoice?s=1', name: 'GD đã xuất hóa đơn', setFilter: true, property: 'Status', value: MPInvoiceStatusType.Exported });
    }

    this.activeIndex = 3;
    let url = this.location.path();
    let currentButtons = this.buttons.filter(c => c.link.includes(url));
    if (currentButtons) {
      if (currentButtons.length > 1) {
        let checkItem = this.buttons.find(c => c.link == this.location.path());
        if (checkItem) {
          this.activeIndex = checkItem.id;          
        } else {
          let tableData: TableData = this.params && this.params['TableData'];
          if (tableData && tableData.Filters) {
            let filterStatus = tableData.Filters.find(c => c.Name == 'Status');
            if (filterStatus) {
              this.activeIndex = this.buttons.find(c => c.value == filterStatus.Value)?.id;
            }
          }
        }
      } else {
        this.activeIndex = currentButtons[0].id;
      }
    }   

  }

  filter(item: any) {
    this.activeIndex = item.id;
    if (this.router.url.includes('/admin/mpinvoice')) {
      this.location.replaceState("/admin/mpinvoice");
    }
    if (item.setFilter) {
      // filter
      let filter: FilterData = {
        Name: item.property,
        Value: item.value,
        Compare: CompareType.N_Equals
      };
      let obj: TableData = { Filters: [filter] };
      this.event.RefreshGrids.emit(obj);
    } else {
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

}
