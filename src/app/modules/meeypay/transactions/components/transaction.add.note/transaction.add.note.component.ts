import { Component, Input, OnInit } from '@angular/core';
import { AppInjector } from '../../../../../app.module';
import { validation } from '../../../../../_core/decorators/validator';
import { ResultApi } from '../../../../../_core/domains/data/result.api';
import { MPTransactionsEntity } from '../../../../../_core/domains/entities/meeypay/mp.transactions.entity';
import { EntityHelper } from '../../../../../_core/helpers/entity.helper';
import { ToastrHelper } from '../../../../../_core/helpers/toastr.helper';
import { MPTransactionService } from '../../transactions.service';

@Component({
  templateUrl: './transaction.add.note.component.html',
  styleUrls: ['./transaction.add.note.component.scss']
})
export class MPTransactionAddNoteComponent implements OnInit {
  @Input() params: any;
  service: MPTransactionService;

  item: MPTransactionsEntity = new MPTransactionsEntity();

  constructor() {
    this.service = AppInjector.get(MPTransactionService);
  }

  ngOnInit() {
    let item = this.params && this.params["item"];
    if (item) {
      this.item = EntityHelper.createEntity(MPTransactionsEntity, item);
    }
  }

  public async confirm(): Promise<boolean> {
    let valid = await validation(this.item, ["Note"]);
    if (valid) {
      let obj: any = {
        Id: this.item.Transaction.Id,
        Description: this.item.Note
      }      
      return await this.service.AddNote(obj).then((result: ResultApi) => {
        if (ResultApi.IsSuccess(result)) {
          ToastrHelper.Success("Thêm ghi chú thành công");
          return true;
        } else
          ToastrHelper.Error(result.Description);
        return false;
      }, (e) => {
        ToastrHelper.Exception(e);
        return false;
      });
    }
    return false;
  }

}
