import * as _ from 'lodash';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { validation } from '../../../../../_core/decorators/validator';
import { ResultApi } from '../../../../../_core/domains/data/result.api';
import { EditorComponent } from '../../../../../_core/editor/editor.component';
import { ToastrHelper } from '../../../../../_core/helpers/toastr.helper';
import { MPOProjectInvestorUnitEntity } from '../../../../../_core/domains/entities/meeyproject/mpo.project.entity';
import { MPOProjectService } from '../../../project.service';
import { SaveType } from '../../../../../_core/domains/entities/meeyproject/enums/mpo.save.type';

@Component({
  selector: 'app-project.investor.related.unit',
  templateUrl: './project.investor.related.unit.component.html',
  styleUrls: ['./project.investor.related.unit.component.scss']
})
export class MPOProjectInvestorRelatedComponentUnitComponent implements OnInit {
  @ViewChild('uploadImages') uploadImages: EditorComponent;

  @Input() params: any;
  isUnit: boolean = false;
  isMobile: boolean;

  item: MPOProjectInvestorUnitEntity = new MPOProjectInvestorUnitEntity();

  constructor(private service: MPOProjectService) { }

  ngOnInit() {
    this.isUnit = this.params && this.params['isUnit'];
    this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (this.params && this.params['saveType'] == SaveType.UPDATE) {
      this.item.Id = this.params['Id'];
      this.item.Name = this.params['Name'];
      this.item.Unit = this.params['RelatedUnitType'];
      this.item.Description = this.params['Description'];
      this.item.Active = this.params['isActive'];
      this.item.Logo = this.params['Logo'];
    }
    else {
      this.item.Active = true;
    }
  }

  public async confirm(): Promise<boolean> {
    let column = [];
    if (this.isUnit) {
      column = ['Unit', 'Name']
    } else {
      column = ['UnitName', 'Description']
    }
    if (await validation(this.item, column)) {
      let item: MPOProjectInvestorUnitEntity = _.cloneDeep(this.item);
      if (this.isUnit) {
        if (item.Logo?.length > 0) {
          let images = await this.uploadImages.upload();
          item.Logo = images.filter(c => c.ResultUpload)
            .map(c => c.ResultUpload.images && Array.isArray(c.ResultUpload.images) ? c.ResultUpload.images[0] : c.ResultUpload)
            .map(c => {
              return { s3Key: c.s3Key }
            })[0];
        }
        else {
          item.Logo = null;
        }
        if (this.params['saveType'] == SaveType.UPDATE) {
          return await this.service.updateInvestorUnit(item).then((result: ResultApi) => {
            if (ResultApi.IsSuccess(result)) {
              ToastrHelper.Success('Cập nhật Đơn vị liên quan thành công');
              return true;
            } else {
              ToastrHelper.ErrorResult(result);
              return false;
            }
          });
        }
        else {
          return await this.service.createInvestorUnit(item).then((result: ResultApi) => {
            if (ResultApi.IsSuccess(result)) {
              ToastrHelper.Success('Thêm mới Đơn vị liên quan thành công');
              return true;
            } else {
              ToastrHelper.ErrorResult(result);
              return false;
            }
          });
        }
      } else {
        return await this.service.createInvestorUnitType(item).then((result: ResultApi) => {
          if (ResultApi.IsSuccess(result)) {
            ToastrHelper.Success('Thêm mới loại đơn vị thành công');
            return true;
          } else {
            ToastrHelper.ErrorResult(result);
            return false;
          }
        });
      }
    }
    return false;
  }

}
