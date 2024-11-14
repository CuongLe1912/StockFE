import * as _ from 'lodash';
import { Component, Input, OnInit } from '@angular/core';
import { AppInjector } from '../../../../../app.module';
import { EditComponent } from '../../../../../_core/components/edit/edit.component';
import { ActionData } from '../../../../../_core/domains/data/action.data';
import { MPInvoiceEntity } from '../../../../../_core/domains/entities/meeypay/mp.invoice.entity';
import { ActionType } from '../../../../../_core/domains/enums/action.type';
import { EntityHelper } from '../../../../../_core/helpers/entity.helper';
import { MPInvoiceService } from '../../invoice.service';
import { ResultApi } from '../../../../../_core/domains/data/result.api';
import { validation } from '../../../../../_core/decorators/validator';
import { ToastrHelper } from '../../../../../_core/helpers/toastr.helper';
import { MPInvoiceStatusType } from '../../../../../_core/domains/entities/meeypay/enums/mp.invoice.status.type';

@Component({
  templateUrl: './group.invoice.component.html',
  styleUrls: ['./group.invoice.component.scss']
})
export class MPGroupInvoiceComponent extends EditComponent implements OnInit {
  @Input() params: any;

  actions: ActionData[] = [];
  loading: boolean = false;

  transactions: any[];
  items: MPInvoiceEntity[];
  item: MPInvoiceEntity;

  columnValidators = ["RevenueCode", "Amount", "VATMoney", "Payment", "PaymentMethod", "CustomerName", "TaxCode", "CustomerAddress", "CustomerEmail", "Content", "PaymentDate"];
  showChildrens = false;
  addInvoice = false;

  service: MPInvoiceService;
  constructor() {
    super();
    this.service = AppInjector.get(MPInvoiceService);
  }

  async ngOnInit() {
    this.transactions = this.params && this.params["transactions"];
    if (this.state) {
      this.transactions = this.transactions || this.state.object.transactions;
    }
    if (this.transactions && this.transactions.length > 0) {
      this.items = [];
      this.transactions.forEach(item => {
        if (item.Childrens && item.Childrens.length > 0) {
          this.items.push(...item.Childrens)
        } else {
          if (!item.RevenueCode) item.RevenueCode = item.RevenueCodeField;
          this.items.push(item);
        }
      });
      this.items = EntityHelper.createEntities(MPInvoiceEntity, this.items);
      this.item = _.cloneDeep(this.items[0]);
      this.item.ParentId = null;
      this.showChildrens = true;
      this.groupInvoice();
      this.item.Id = 0;
      this.item.RevenueCode = 'HĐ Xuất gộp';
      this.item.PaymentMethod = '';
      this.item.CustomerName = '';
      this.item.CustomerEmail = '';
      this.item.CustomerAddress = '';
      this.item.TaxCode = '';
      this.item.BankName = '';
      this.item.Content = '';
      this.item.Note = '';
      this.item.PaymentDate = new Date();
    }
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
    this.actions = await this.authen.actionsAllow(MPInvoiceEntity, actions);
  }

  public async confirmAndBack() {
    await this.confirm(() => {
      this.back();
    });
  }

  public async confirm(complete: () => void): Promise<boolean> {
    this.processing = true;
    let validator = await validation(this.item, this.columnValidators);
    if (validator) {
      this.items.forEach(obj => {
        delete obj.IsActive;
        delete obj.IsDelete;
        delete obj.CreatedBy;
        delete obj.UpdatedBy;
        delete obj.CreatedDate;
        delete obj.UpdatedDate;
      })
      this.item.Childrens = this.items;
      this.item.Status = MPInvoiceStatusType.New;
      delete this.item.IsActive;
      delete this.item.IsDelete;
      delete this.item.CreatedBy;
      delete this.item.UpdatedBy;
      delete this.item.CreatedDate;
      delete this.item.UpdatedDate;
      await this.service.groupInvoices(this.item).then((result: ResultApi) => {
        if (ResultApi.IsSuccess(result)) {
          ToastrHelper.Success('Gộp yêu cầu xuất hóa đơn thành công');
          if (complete) complete();
          return true;
        } else {
          ToastrHelper.ErrorResult(result);
          return false;
        }
      });
    }
    this.processing = false;
    return false;
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

  amountChange(item: MPInvoiceEntity) {
    if (item.Amount) {
      if (!this.item.VATPercent) {
        this.item.VATPercent = 0;
      }
      item.VATMoney = (item.Amount / 100) * this.item.VATPercent;
      item.Payment = item.VATMoney + item.Amount;
    }
  }

}
