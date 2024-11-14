import { Router } from "@angular/router";
import { AppInjector } from "../../../../../app.module";
import { Component, Input, OnInit } from "@angular/core";
import { TableData } from "../../../../../_core/domains/data/table.data";
import { AdminEventService } from "../../../../../_core/services/admin.event.service";
import { MPInvoiceStatusType } from "../../../../../_core/domains/entities/meeypay/enums/mp.invoice.status.type";
import { NavigationStateData } from "../../../../../_core/domains/data/navigation.state";
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
  buttons: any[] = [
    { id: 1, link: '/admin/mptransactions', name: 'Giao dịch Meey Pay' },
    { id: 2, link: '', name: 'Giao dịch Meey Ads' },
  ]

  constructor() {
    this.event = AppInjector.get(AdminEventService);
    this.authen = AppInjector.get(AdminAuthService);
    this.router = AppInjector.get(Router);
  }

  async ngOnInit() {
    let allowViewInvoice = await this.authen.permissionAllow("MPInvoice", ActionType.View);
    if (allowViewInvoice) {
      this.buttons.push({ id: 3, link: '/admin/mpinvoice?s=0', name: 'GD chưa xuất hóa đơn', setFilter: true, property: 'Status', value: MPInvoiceStatusType.New });
      this.buttons.push({ id: 4, link: '/admin/mpinvoice?s=1', name: 'GD đã xuất hóa đơn', setFilter: true, property: 'Status', value: MPInvoiceStatusType.Exported });
    }
    
    let currentButtons = this.buttons.filter(c => this.router.url == c.link);
    if (currentButtons) {
      if (currentButtons.length > 1) {
        let tableData: TableData = this.params && this.params['TableData'];
        if (tableData && tableData.Filters) {
          let filterStatus = tableData.Filters.find(c => c.Name == 'Status');
          if (filterStatus) {
            this.activeIndex = this.buttons.find(c => c.value == filterStatus.Value)?.id;
          }
        }
      } else
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
