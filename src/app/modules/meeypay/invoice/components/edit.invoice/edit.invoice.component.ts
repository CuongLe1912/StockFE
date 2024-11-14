import * as _ from 'lodash';
import { Component, Input, OnInit } from '@angular/core';
import { AppInjector } from '../../../../../app.module';
import { EditComponent } from '../../../../../_core/components/edit/edit.component';
import { clearValidation, validation, validations } from '../../../../../_core/decorators/validator';
import { ActionData } from '../../../../../_core/domains/data/action.data';
import { MPInvoiceEntity } from '../../../../../_core/domains/entities/meeypay/mp.invoice.entity';
import { ActionType } from '../../../../../_core/domains/enums/action.type';
import { EntityHelper } from '../../../../../_core/helpers/entity.helper';
import { MPInvoiceService } from '../../invoice.service';
import { ToastrHelper } from '../../../../../_core/helpers/toastr.helper';
import { ResultApi } from '../../../../../_core/domains/data/result.api';
import { MPInvoiceStatusType } from '../../../../../_core/domains/entities/meeypay/enums/mp.invoice.status.type';
import { NavigationStateData } from '../../../../../_core/domains/data/navigation.state';

@Component({
  selector: 'app-edit.invoice',
  templateUrl: './edit.invoice.component.html',
  styleUrls: ['./edit.invoice.component.scss']
})
export class MPEditInvoiceComponent extends EditComponent implements OnInit {
  @Input() params: any;

  actions: ActionData[] = [];
  loading: boolean = false;

  id: any;
  items: MPInvoiceEntity[];
  item: MPInvoiceEntity;

  showChildrens = false;
  addInvoice = false;
  splitInvoice = false;

  columnValidators = ["RevenueCode", "Amount", "VATMoney", "Payment", "PaymentMethod", "CustomerName", "TaxCode", "CustomerAddress", "CustomerEmail", "Content", "PaymentDate"];

  service: MPInvoiceService;
  constructor() {
    super();
    this.service = AppInjector.get(MPInvoiceService);
  }

  async ngOnInit() {
    this.id = this.getParam("id");

    await this.loadItem();
    this.renderActions();
    this.addBreadcrumb("Đơn hàng")
    this.addBreadcrumb("Quản lý hóa đơn")
    this.addBreadcrumb("Thông tin xuất hóa đơn");
  }

  private async renderActions() {
    let actions: ActionData[] = [
      ActionData.back(() => {
        this.back();
      }),
      {
        name: 'Lưu lại',
        processButton: true,
        icon: 'la la-save',
        className: 'btn btn-primary',
        systemName: ActionType.Edit,
        click: async () => await this.confirmAndBack()
      },
    ];

    actions.push({
      name: 'Tách hóa đơn',
      icon: 'la la-expand',
      className: 'btn btn-success',
      systemName: ActionType.SplitInvoice,
      hidden: () => {
        return !((!this.items || this.items.length == 0) && this.addInvoice);
      },
      click: async () => {
        this.loading = true;
        this.items = [];
        this.addInvoice = true;
        this.showChildrens = false;
        this.splitInvoice = true;
        clearValidation(this.item);
        this.createNewInvoice();
        this.createNewInvoice();
        setTimeout(() => {
          this.showChildrens = true;
          this.loading = false;
        }, 200);
      }
    })

    this.actions = await this.authen.actionsAllow(MPInvoiceEntity, actions);
  }

  async loadItem() {
    await this.service.item('MPInvoice', this.id).then((result: ResultApi) => {
      if (ResultApi.IsSuccess(result)) {
        this.item = EntityHelper.createEntity(MPInvoiceEntity, result.Object);
        this.items = EntityHelper.createEntities(MPInvoiceEntity, this.item.Childrens);
        if (this.items.length > 0) {
          this.splitInvoice = false;
          this.addInvoice = false;
        } else {
          if (!this.item.RevenueCode.includes('Tach Hoa Don'))
            this.addInvoice = true;
        }
      }
    });
  }

  public async confirmAndBack() {
    await this.confirm(() => {
      this.view();
    });
  }

  view() {
    let obj: NavigationStateData = {
      id: this.item.Id,
      prevUrl: "/admin/mpinvoice",
    };
    this.router.navigate(["/admin/mpinvoice/view"], {
      state: { params: JSON.stringify(obj) },
    });
  }

  public async confirm(complete: () => void): Promise<boolean> {
    this.processing = true;
    if (this.splitInvoice) {
      let validatorChildrens = await validations(this.items, this.columnValidators);
      if (validatorChildrens) {
        let sumAmount = this.items.reduce((a, obj) => {
          return a + obj.Amount;
        }, 0);
        if (this.item.Amount != sumAmount) {
          ToastrHelper.Error('Tổng doanh thu trước thuế phải bằng doanh thu gốc');
          this.processing = false;
          return false;
        }

        let sumVATMoney = this.items.reduce((a, obj) => {
          return a + obj.VATMoney;
        }, 0);
        if (this.item.VATMoney != sumVATMoney) {
          ToastrHelper.Error('Tổng thuế GTGT phải bằng thuế GTGT gốc');
          this.processing = false;
          return false;
        }

        let sumPayment = this.items.reduce((a, obj) => {
          return a + obj.Payment;
        }, 0);
        if (this.item.Payment != sumPayment) {
          ToastrHelper.Error('Tổng tiền thanh toán phải bằng tiền thanh toán gốc');
          this.processing = false;
          return false;
        }

        await this.service.addList(this.items, this.item.Id).then((result: ResultApi) => {
          if (ResultApi.IsSuccess(result)) {
            ToastrHelper.Success('Tạo yêu cầu tách hóa đơn thành công');
            if (complete) complete();
            return true;
          } else {
            ToastrHelper.ErrorResult(result);
            return false;
          }
        });
      }
    } else {
      if (!this.addInvoice)
        this.item.Childrens = this.items;
      let validator = await validation(this.item, this.columnValidators);
      if (validator) {
        await this.service.save('MPInvoice', this.item).then((result: ResultApi) => {
          if (ResultApi.IsSuccess(result)) {
            ToastrHelper.Success('Sửa yêu cầu xuất hóa đơn thành công');
            if (complete) complete();
            return true;
          } else {
            ToastrHelper.ErrorResult(result);
            return false;
          }
        });
      }
    }
    this.processing = false;
    return false;
  }

  amountChange(item: MPInvoiceEntity) {
    if (item.Amount) {
      if (!this.item.VATPercent) {
        this.item.VATPercent = 0;
      }
      item.VATMoney = (item.Amount / 100) * this.item.VATPercent;
      item.Payment = item.VATMoney + item.Amount;
    }
  }

  async addNewInvoice() {
    let validator = await validations(this.items, this.columnValidators);
    if (validator)
      this.createNewInvoice();
  }

  createNewInvoice() {
    let item = new MPInvoiceEntity();
    if (this.item) {
      item.PaymentMethod = this.item.PaymentMethod;
      item.CustomerName = this.item.CustomerName;
      item.CustomerPhone = this.item.CustomerPhone;
      item.CustomerEmail = this.item.CustomerEmail;
      item.CustomerAddress = this.item.CustomerAddress;
      item.TaxCode = this.item.TaxCode;
      item.Content = this.item.Content;
      item.PaymentDate = this.item.PaymentDate;
      item.BankName = this.item.BankName;
      item.Note = this.item.Note;
      item.VATMoney = this.item.VATMoney;
      item.VATPercent = this.item.VATPercent;

      if (this.items.length > 0) {
        let sumVATMoney = this.items.reduce((a, obj) => {
          return a + obj.VATMoney;
        }, 0);
        let VATMoney = this.item.VATMoney - sumVATMoney;
        item.VATMoney = 0;
        if (VATMoney > 0) {
          item.VATMoney = VATMoney;
        }
      }
    }
    item.Id = 0;
    item.Amount = null;
    item.Payment = null;
    item.RevenueCode = 'Tach Hoa Don - ' + this.item.RevenueCode;
    item.Status = MPInvoiceStatusType.New;
    this.items.push(item);
  }

  groupInvoice() {
    let sumAmount = this.items.reduce((a, obj) => {
      return a + obj.Amount;
    }, 0);

    this.item.Amount = sumAmount;
    if (this.item.VATPercent) {
      this.item.VATMoney = (this.item.Amount / 100) * this.item.VATPercent;
      this.item.Payment = this.item.Amount + this.item.VATMoney;
    } else {
      this.item.Payment = this.item.Amount
    }
  }

  removeInvoice(index) {
    this.items.splice(index, 1);
    if (!this.addInvoice) {
      this.groupInvoice();
      this.showChildrens = false;
    }
    if (this.items.length < 2) {
      this.loading = true;
      this.splitInvoice = false;
      if (!this.addInvoice) {
        this.item = this.items[0];
        if (!this.item.VATMoney) {
          this.item.VATMoney = 0;
        }
        if (!this.item.VATPercent) {
          this.item.VATPercent = 0;
        }
        this.addInvoice = true;
      }
      this.items = [];
    }
    setTimeout(() => {
      this.showChildrens = true;
      this.loading = false;
    }, 200);
  }

}
