import { Component, Input, OnInit } from '@angular/core';
import { validation } from '../../../../../_core/decorators/validator';
import { ResultApi } from '../../../../../_core/domains/data/result.api';
import { MPInvoiceEntity } from '../../../../../_core/domains/entities/meeypay/mp.invoice.entity';
import { EntityHelper } from '../../../../../_core/helpers/entity.helper';
import { ToastrHelper } from '../../../../../_core/helpers/toastr.helper';
import { MPInvoiceService } from '../../invoice.service';

@Component({
  templateUrl: './export.invoice.component.html',
  styleUrls: ['./export.invoice.component.scss']
})
export class MPExportInvoiceComponent implements OnInit {
  @Input() params: any;

  item: MPInvoiceEntity;

  constructor(private service: MPInvoiceService) { }

  ngOnInit() {
    let id = this.params && this.params['id'];
    this.loadItem(id);
  }

  async loadItem(id) {
    await this.service.item('MPInvoice', id).then((result: ResultApi) => {
      if (ResultApi.IsSuccess(result)) {
        this.item = EntityHelper.createEntity(MPInvoiceEntity, result.Object);
        this.item.InvoiceDate = new Date();
      }
    });
  }

  public async confirm(): Promise<boolean> {
    let validator = await validation(this.item, ["InvoiceDate", "Code"]);
    if (validator) {
      return await this.service.exportInvoice(this.item.Id, this.item).then((result: ResultApi) => {
        if (ResultApi.IsSuccess(result)) {
          ToastrHelper.Success('Xuất hóa đơn thành công');
          return true;
        } else {
          ToastrHelper.ErrorResult(result);
          return false;
        }
      });
    }

    return false;
  }

}
