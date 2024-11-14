import { Component, Input, OnInit } from '@angular/core';
import { validation } from '../../../../_core/decorators/validator';
import { MPOProjectInvestorUnitTypeEntity } from '../../../../_core/domains/entities/meeyproject/mpo.investor.type.entity';
import * as _ from 'lodash';
import { InvestorTypeService } from '../mpo.investor.type.service';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { SaveType } from '../../../../_core/domains/entities/meeyproject/enums/mpo.save.type';

@Component({
  selector: 'meey-add-modal',
  templateUrl: './add-modal.component.html',
  styleUrls: ['./add-modal.component.scss'],
})

export class AddModalInvestorTypeComponent implements OnInit {

  @Input() params: any;
  isUpdate: boolean;

  item: MPOProjectInvestorUnitTypeEntity = new MPOProjectInvestorUnitTypeEntity();
  viewer: boolean = true;

  constructor(
    private typeService: InvestorTypeService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.viewer = this.params.viewer;
    if (this.params?.item) {
      const item = this.params.item;
      if (item) {
        this.item.Id = item.Id;
        this.item.Name = item.Name;
        this.item.Description = item.Description;
        this.item.Active = item.isActive;
      }      
    }
    else {
      this.item.Active = true;
    }
  }

  public async confirm(): Promise<boolean> {
    if (!this.viewer) {
      let column = [];
      column = ['Name', 'Description'];
      if (await validation(this.item, column)) {
        let item: MPOProjectInvestorUnitTypeEntity = _.cloneDeep(this.item);
        let _type = item.Id ? SaveType.UPDATE : SaveType.ADD;
        let messageSuccess = (_type == SaveType.ADD) ? 'Thêm mới' : 'Cập nhật';

        return await this.typeService.save(item, _type).then((result: ResultApi) => {
          if (ResultApi.IsSuccess(result)) {
            ToastrHelper.Success(messageSuccess + ' loại đơn vị thành công');
            return true;
          } else {
            ToastrHelper.ErrorResult(result);
            return false;
          }
        });
      }
    } else {
      ToastrHelper.Error('Bạn không có quyền sử dụng chức năng này!');
    }
    return false;
  }
}
