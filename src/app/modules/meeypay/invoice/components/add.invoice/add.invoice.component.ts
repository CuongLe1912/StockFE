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
import { MLUserService } from '../../../../../modules/meeyuser/user.service';

@Component({
  selector: 'app-add.invoice',
  templateUrl: './add.invoice.component.html',
  styleUrls: ['./add.invoice.component.scss']
})
export class MPAddInvoiceComponent extends EditComponent implements OnInit {
  @Input() params: any;

  actions: ActionData[] = [];
  loading: boolean = false;

  transactions: any[];
  items: MPInvoiceEntity[];
  item: MPInvoiceEntity;
  listUser = [];

  showChildrens = false;
  addInvoice = false;
  splitInvoice = false;
  columnValidators = ["RevenueCode", "Amount", "VATMoney", "Payment", "PaymentMethod", "CustomerName", "TaxCode", "CustomerAddress", "CustomerEmail", "Content", "PaymentDate"];

  service: MPInvoiceService;
  userService: MLUserService;
  constructor() {
    super();
    this.service = AppInjector.get(MPInvoiceService);
    this.userService = AppInjector.get(MLUserService);
  }

  async ngOnInit() {
    this.loading = true;
    this.transactions = this.params && this.params["transactions"];
    if (this.state) {
      this.transactions = this.transactions || this.state.object.transactions;
    }
    if (this.transactions) {
      this.items = [];
      let meeyIds = this.transactions.map(c => c.MeeyId);
      await this.userService.getListByMeeyIds(meeyIds).then((result: ResultApi) => {
        if (ResultApi.IsSuccess(result)) {
          this.listUser = result.Object;
        }
      });
      this.transactions.forEach((item) => {
        if (this.listUser.length > 0) {
          let user = this.listUser.find(c => c._id == item.MeeyId);
          if (user) {
            if (user?.address) {
              item.CustomerAddress = user.address;
            } else if (user?.detailAddress) {
              let address = "";
              if (user?.detailAddress?.ward && user?.detailAddress?.ward?.name) {
                address += user?.detailAddress?.ward?.name + " ";
              }
              if (user?.detailAddress?.district && user?.detailAddress?.district?.name) {
                address += user?.detailAddress?.district?.name + " ";
              }
              if (user?.detailAddress?.city && user?.detailAddress?.city?.name) {
                address += user?.detailAddress?.city?.name + " ";
              }
              if (address)
                item.CustomerAddress = address.trim();
            }
          }
        }
        this.items.push(this.convertInvoice(item));
      });
      this.item = _.cloneDeep(this.items[0]);
      if (!this.item.VATMoney) {
        this.item.VATMoney = 0;
      }
      if (!this.item.VATPercent) {
        this.item.VATPercent = 0;
      }
      if (this.items.length > 1) {
        this.showChildrens = true;
        this.addInvoice = false;
        this.groupInvoice();
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
      } else {
        this.addInvoice = true;
        this.items = [];
      }
      this.loading = false;
    }

    this.addBreadcrumb("Đơn hàng")
    this.addBreadcrumb("Quản lý hóa đơn")
    this.addBreadcrumb("Thông tin xuất hóa đơn");
    this.renderActions();
  }

  private async renderActions() {
    let actions: ActionData[] = [
      ActionData.back(() => {
        this.back();
      }),
      {
        name: 'Tạo giao dịch',
        processButton: true,
        icon: 'la la-plus-circle',
        className: 'btn btn-primary',
        systemName: ActionType.AddNew,
        click: async () => await this.confirmAndBack()
      }
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

  public async confirmAndBack() {
    await this.confirm(() => {
      //this.back();
      this.state.object.transactions = null;
      this.item = new MPInvoiceEntity();
      this.router.navigate(['/admin/mpinvoice'], { state: { params: JSON.stringify(this.state) } });
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

        await this.service.addList(this.items).then((result: ResultApi) => {
          if (ResultApi.IsSuccess(result)) {
            ToastrHelper.Success('Tạo yêu cầu xuất hóa đơn thành công');
            if (complete) complete();
            return true;
          } else {
            ToastrHelper.ErrorResult(result);
            return false;
          }
        });
      }
    } else {
      let validator = await validation(this.item, this.columnValidators);
      if (validator) {
        this.item.Childrens = this.items;
        this.item.Status = MPInvoiceStatusType.New;
        await this.service.save('MPInvoice', this.item).then((result: ResultApi) => {
          if (ResultApi.IsSuccess(result)) {
            ToastrHelper.Success('Tạo yêu cầu xuất hóa đơn thành công');
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
      item.TransactionCode = this.item.TransactionCode;

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

  async addNewInvoice() {
    let validator = await validations(this.items, this.columnValidators);
    if (validator)
      this.createNewInvoice();
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

  async removeInvoice(index) {
    this.items.splice(index, 1);
    if (!this.addInvoice) {
      this.groupInvoice();
      this.showChildrens = false;
    }
    if (this.items.length < 2) {
      if (this.addInvoice) {
        this.loading = true;
        this.splitInvoice = false;
      }
      else {
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

  convertInvoice(entity): MPInvoiceEntity {
    let item = EntityHelper.createEntity(MPInvoiceEntity, entity);
    item.Id = 0;
    item.Code = null;
    if (!item.Content) {
      item.Content = entity.Content;
    }
    if (!item.Note) {
      item.Note = entity.Description;
    }
    if (!item.VATMoney) {
      item.VATMoney = 0;
    }
    if (!item.VATPercent) {
      item.VATPercent = 0;
    }
    if (item.VATPercent) {
      item.VATMoney = (item.Amount / 100) * item.VATPercent;
      item.Payment = item.Amount + item.VATMoney;
    } else {
      item.Payment = item.Amount
    }
    if (entity.Code)
      item.TransactionCode = entity.Code;
    if (entity.ProviderTransactionId)
      item.RevenueCode = entity.ProviderTransactionId;
    if (entity.CreatedDate)
      item.PaymentDate = item.CreatedDate;
    return item;
  }

}
