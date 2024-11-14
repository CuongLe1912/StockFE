import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { EntityHelper } from '../../../../../_core/helpers/entity.helper';
import { MAFContractEntity } from '../../../../../_core/domains/entities/meeyaffiliate/contract.entity';
import { EditorComponent } from '../../../../../_core/editor/editor.component';
import { validation } from '../../../../../_core/decorators/validator';

@Component({
  selector: 'app-approve.individual',
  templateUrl: './approve.individual.component.html',
  styleUrls: ['./approve.individual.component.scss']
})
export class MAFApproveIndividualComponent implements OnInit {
  @ViewChild('uploadFileContract') uploadFileContract: EditorComponent;
  @Input() params: any;

  item: MAFContractEntity;

  constructor() { }

  ngOnInit() {
    let item = this.params && this.params["item"];
    if (item) {
      this.item = EntityHelper.createEntity(MAFContractEntity, item);
    }
  }

  public async confirm(): Promise<boolean | string> {
    let fileContract = await this.uploadFileContract.upload();
    this.item.File = fileContract && fileContract.length > 0 ? fileContract[0].Path : '';
    return this.item.File;
  }
}
