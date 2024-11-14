import { Component } from '@angular/core';
import { GridData } from '../../../_core/domains/data/grid.data';
import { ActionData } from '../../../_core/domains/data/action.data';
import { ModalSizeType } from '../../../_core/domains/enums/modal.size.type';
import { GridComponent } from '../../../_core/components/grid/grid.component';
import { ActionType } from '../../../_core/domains/enums/action.type';
import { MPInvoiceEntity } from '../../../_core/domains/entities/meeypay/mp.invoice.entity';
import { DataType } from '../../../_core/domains/enums/data.type';
import { UtilityExHelper } from '../../../_core/helpers/utility.helper';
import { BaseEntity } from '../../../_core/domains/entities/base.entity';
import { NavigationStateData } from '../../../_core/domains/data/navigation.state';
import { MPInvoiceStatusType } from '../../../_core/domains/entities/meeypay/enums/mp.invoice.status.type';
import { MPMenuButtonComponent } from './components/menu.button/menu.button.component';
import { TableData } from '../../../_core/domains/data/table.data';
import { FilterData } from '../../../_core/domains/data/filter.data';
import { CompareType } from '../../../_core/domains/enums/compare.type';
import { MPExportInvoiceComponent } from './components/export.invoice/export.invoice.component';

@Component({
  templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class MPInvoiceComponent extends GridComponent {
  obj: GridData = {
    NotKeepPrevData: true,
    Reference: MPInvoiceEntity,
    Size: ModalSizeType.Large,
    UpdatedBy: false,
    Imports: [],
    Exports: [],
    Filters: [],
    Features: [
      ActionData.reload(() => {
        this.loadItems();
      }),
    ],
    Actions: [
      {
        icon: 'la la-eye',
        name: ActionType.View,
        className: 'btn btn-warning',
        systemName: ActionType.ViewDetail,
        hidden: ((item) => {
          return !(item.Status == MPInvoiceStatusType.New);
        }),
        click: (item: any) => this.view(item)
      },
      {
        icon: 'la la-eye',
        name: ActionType.View,
        className: 'btn btn-warning',
        systemName: ActionType.ViewDetailInvoiceExported,
        hidden: ((item) => {
          return !(item.Status != MPInvoiceStatusType.New);
        }),
        click: (item: any) => this.view(item)
      },
      {
        icon: 'la la-pencil',
        name: ActionType.Edit,
        className: 'btn btn-primary',
        systemName: ActionType.Edit,
        hidden: ((item) => {
          return !(item.Status == MPInvoiceStatusType.New);
        }),
        click: (item: any) => this.edit(item)
      },
      {
        icon: 'fa fa-upload',
        name: 'Xuất hóa đơn',
        className: 'btn btn-success',
        systemName: ActionType.Export,
        hidden: ((item) => {
          return !(item.Status == MPInvoiceStatusType.New);
        }),
        click: (item: any) => {
          this.dialogService.WapperAsync({
            cancelText: 'Hủy',
            confirmText: 'Xác nhận',
            size: ModalSizeType.Large,
            objectExtra: {
              id: item.Id,
            },
            title: 'Xuất hóa đơn',
            object: MPExportInvoiceComponent,
          }, () => this.loadItems());
        }
      },
      {
        icon: 'la la-trash',
        name: ActionType.Delete,
        className: 'btn btn-danger',
        systemName: ActionType.Delete,
        hidden: ((item) => {
          return !(item.Status == MPInvoiceStatusType.New);
        }),
        click: (item: any) => this.delete(item)
      },
    ],
    CustomFilters: ["RevenueCode", "TaxCode", "CustomerEmail", "Payment", "PaymentDate"],
    EmbedComponent: MPMenuButtonComponent,
    DisableAutoLoad: true,
  };

  constructor() {
    super();
  }

  async ngOnInit() {
    this.breadcrumbs.push({ Name: "Đơn hàng" })
    this.breadcrumbs.push({ Name: "Quản lý giao dịch" })
    this.breadcrumbs.push({ Name: "Danh sách giao dịch" })
    this.renderProperties(null);
    let allowAddInvoice = await this.authen.permissionAllow('MPInvoice', ActionType.GroupInvoice);
    if (allowAddInvoice) {
      this.obj.Checkable = true;
      this.obj.Features.unshift({
        hide: true,
        icon: 'la la-share',
        toggleCheckbox: true,
        name: 'Gộp hóa đơn',
        className: 'btn btn-primary',
        systemName: ActionType.Empty,
        click: ((item) => {
          let cloneItems = this.items && this.items.filter(c => c.Checked);
          if (!cloneItems || cloneItems.length < 2) {
            this.dialogService.Alert('Thông báo', 'Vui lòng chọn tối thiểu 2 bản ghi');
            return;
          }
          if (cloneItems.length > 1) {
            let obj: NavigationStateData = {
              object: { transactions: cloneItems },
              prevData: this.itemData,
              prevUrl: "/admin/mpinvoice",
            };
            this.router.navigate(["/admin/mpinvoice/group"], {
              state: { params: JSON.stringify(obj) },
            });
          }
        })
      });
    }

    await this.render(this.obj);

    if (this.router?.routerState?.snapshot?.root?.queryParams["s"]) {
      let status = this.router?.routerState?.snapshot?.root?.queryParams["s"];
      // filter
      let filter: FilterData = {
        Name: "Status",
        Value: status,
        Compare: CompareType.N_Equals
      };
      this.setFilter([filter])
      await this.updateGridPage(status);
    }

    // refresh
    if (!this.subscribeRefreshGrids) {
      this.subscribeRefreshGrids = this.event.RefreshGrids.subscribe(async (obj: TableData) => {
        this.originalItems = [];
        if (!this.itemData.Filters)
          this.itemData.Filters = [];
        this.itemData.Filters = [];
        if (obj) {
          if (obj.Filters && obj.Filters.length > 0) {
            obj.Filters.forEach((item: FilterData) => {
              this.itemData.Filters.push(item);
            });
          }
        }

        let status = this.itemData.Filters.find(c => c.Name == 'Status');
        if (status?.Value != null) {
          await this.updateGridPage(status?.Value);
        }
      });
    }

    let status = this.itemData.Filters.find(c => c.Name == 'Status');
    if (status?.Value != null) {
      await this.updateGridPage(status?.Value);
    } else {
      this.obj.CustomFilters = ["RevenueCode", "TaxCode", "CustomerEmail", "Payment", "PaymentDate"]
      this.renderCustomFilter();
    }
  }

  ngOnDestroy() {
    if (this.subscribeRefreshGrids) {
      this.subscribeRefreshGrids.unsubscribe();
      this.subscribeRefreshGrids = null;
    }
  }

  view(item: BaseEntity) {
    let status = 0;
    let filterStatus = this.itemData.Filters.find(c => c.Name == 'Status');
    if (filterStatus?.Value != null) {
      status = filterStatus.Value;
    }
    let obj: NavigationStateData = {
      id: item.Id,
      prevData: this.itemData,
      prevUrl: "/admin/mpinvoice?s=" + status,
    };
    this.router.navigate(["/admin/mpinvoice/view"], {
      state: { params: JSON.stringify(obj) },
    });

    // let obj: NavigationStateData = {
    //   prevUrl: '/admin/mpinvoice',
    // };
    // let url = AppConfig.getProtocol() + '//' + AppConfig.getDomain() + '/admin/mpinvoice/view?id=' + item.Id;
    // this.setUrlState(obj, 'view_invoice');
    // window.open(url, "_blank");
  }

  edit(item: BaseEntity) {
    let obj: NavigationStateData = {
      id: item.Id,
      prevData: this.itemData,
      prevUrl: "/admin/mpinvoice",
    };
    this.router.navigate(["/admin/mpinvoice/edit"], {
      state: { params: JSON.stringify(obj) },
    });
  }

  setUrlState(state: NavigationStateData, controller: string = null) {
    if (!controller) controller = this.getController();
    let stateKey = 'params',
      navigation = this.router.getCurrentNavigation(),
      sessionKey = 'session_' + stateKey + '_' + controller;
    if (state) sessionStorage.setItem(sessionKey, JSON.stringify(state));
  }

  async updateGridPage(status) {
    if (status == 0) {
      this.obj.CustomFilters = ["RevenueCode", "TaxCode", "CustomerEmail", "Payment", "PaymentDate"]
      let allowAddInvoice = await this.authen.permissionAllow('MPInvoice', ActionType.GroupInvoice);
      this.obj.Checkable = allowAddInvoice;
    } else if (status == 1) {
      this.obj.CustomFilters = ["RevenueCode", "TaxCode", "CustomerEmail", "Payment", "PaymentDate", "Code", "InvoiceDateSearch"]
      this.obj.Checkable = false;
    }
    this.renderProperties(status);
    this.renderCustomFilter();
    await this.loadItems();
  }

  renderProperties(status) {
    this.properties = [
      {
        Property: 'RevenueCodeField', Title: 'Mã tiền thu', Type: DataType.String, Active: true,
        HideCheckbox: (item: any) => {
          return item.RevenueCodeField.includes('Tach Hoa Don');
        },
      },
      {
        Property: 'AmountText', Title: 'Doanh thu trước thuế', Type: DataType.String, Align: 'right', Active: true,
        Format: ((item: any) => {
          if (!item.Amount) return ''
          return item.Amount.toLocaleString("vi-VN", { maximumFractionDigits: 2 });
        })
      },
      {
        Property: 'VATMoneyText', Title: 'Thuế GTGT', Type: DataType.String, Align: 'right', Active: true,
        Format: ((item: any) => {
          if (!item.VATMoney) return ''
          return item.VATMoney.toLocaleString("vi-VN", { maximumFractionDigits: 2 });
        })
      },
      {
        Property: 'PaymentText', Title: 'Tổng tiền thanh toán', Type: DataType.String, Align: 'right', Active: true,
        Format: ((item: any) => {
          if (!item.Payment) return ''
          return item.Payment.toLocaleString("vi-VN", { maximumFractionDigits: 2 });
        })
      },
      { Property: 'PaymentMethod', Title: 'Hình thức thanh toán', Type: DataType.String, Active: true, },
      { Property: 'CustomerName', Title: 'Khách hàng', Type: DataType.String, Active: true, },
      { Property: 'TaxCode', Title: 'Mã số thuế', Type: DataType.String, Active: true, },
      { Property: 'CustomerAddress', Title: 'Địa chỉ', Type: DataType.String, Active: true, },
      { Property: 'CustomerEmail', Title: 'Email nhận hóa đơn', Type: DataType.String, Active: true, },
      { Property: 'Content', Title: 'Nội dung', Type: DataType.String, Active: true, },
      {
        Property: 'PaymentDateText', Title: 'Ngày thanh toán', Type: DataType.String, Active: true,
        Format: ((item: any) => {
          if (!item.PaymentDate) return ''
          return UtilityExHelper.dateString(item.PaymentDate);
        })
      },
      { Property: 'BankName', Title: 'Ngân hàng', Type: DataType.String, Active: true, },
      { Property: 'Note', Title: 'Ghi chú', Type: DataType.String, Active: true, },
    ]

    if (status == 1) {
      this.properties.push({
        Property: 'InvoiceDate', Title: 'Ngày xuất hóa đơn', Type: DataType.String, Active: true,
        Format: ((item: any) => {
          if (!item.InvoiceDate) return ''
          return UtilityExHelper.dateString(item.InvoiceDate);
        })
      })
      this.properties.push({ Property: 'Code', Title: 'Số hóa đơn', Type: DataType.String, Active: true, })
    }

    this.choiceColumnChange();
  }
}