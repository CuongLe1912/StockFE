import * as _ from 'lodash';
import { AppInjector } from '../../../../app.module';
import { MPOProjectService } from '../../project.service';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FileData } from '../../../../_core/domains/data/file.data';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { OptionItem } from '../../../../_core/domains/data/option.item';
import { EditorComponent } from '../../../../_core/editor/editor.component';
import { ModalSizeType } from '../../../../_core/domains/enums/modal.size.type';
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { clearValidation, validation, validations } from '../../../../_core/decorators/validator';
import { EditProjectInvestorComponent } from '../../project.investor/edit/edit.project.investor.component';
import { MPOProjectInvestorRelatedComponentUnitComponent } from './project.investor.related.unit/project.investor.related.unit.component';
import { MPOProjectEntity, MPOProjectInvestorAffiliateUnitlEntity, MPOProjectInvestorRelatedEntity } from '../../../../_core/domains/entities/meeyproject/mpo.project.entity';

@Component({
  selector: 'mpo-project-investor-related',
  templateUrl: './project.investor.related.component.html',
  styleUrls: ['./project.investor.related.component.scss'],
})
export class MPOProjectInvestorRelatedComponent extends EditComponent implements OnInit {
  @ViewChild('uploadLogo') uploadLogo: EditorComponent;

  @Input() params: any;

  id: string;
  viewer: boolean;
  isProduct: boolean;
  reloadUnit: boolean = false;
  item: MPOProjectEntity = new MPOProjectEntity();
  investor: MPOProjectInvestorRelatedEntity = new MPOProjectInvestorRelatedEntity();
  itemInvestor: OptionItem;
  service: MPOProjectService;

  constructor() {
    super();
    this.service = AppInjector.get(MPOProjectService);
  }

  async ngOnInit() {
    this.viewer = this.getParam('viewer');
    this.item = this.getParam('item');
    this.isProduct = this.getParam('isProduct');
    if (this.isProduct) this.viewer = true;

    if (this.item) {
      this.item.InvestorRelated = EntityHelper.createEntity(MPOProjectInvestorRelatedEntity, this.item.InvestorRelated);
      if (this.item.InvestorRelated?.InvestorId)
        this.itemInvestor = {
          label: this.item.InvestorRelated?.Name,
          value: this.item.InvestorRelated?.InvestorId
        }
      if (!this.item.InvestorRelated.AffiliateUnit) this.item.InvestorRelated.AffiliateUnit = [];
      else
        this.item.InvestorRelated.AffiliateUnit = EntityHelper.createEntities(MPOProjectInvestorAffiliateUnitlEntity, this.item.InvestorRelated.AffiliateUnit);

      this.investor = this.item.InvestorRelated;
    }
  }

  public async valid(): Promise<boolean> {
    let valid = true;
    if (this.investor.AffiliateUnit.length) {
      valid = await validations(this.investor.AffiliateUnit, ['Unit', 'Name']);
    }
    if (this.item.IsPublished) {
      valid = await validation(this.investor, ['InvestorId', 'Description']);
    }
    if (valid) {
      // upload
      if (this.uploadLogo) {
        let images = await this.uploadLogo.upload();
        this.investor.Logo = images.filter(c => c.ResultUpload)
          .map(c => c.ResultUpload.images && Array.isArray(c.ResultUpload.images) ? c.ResultUpload.images[0] : c.ResultUpload)[0];
      }
    }
    return valid;
  }

  async investorChange() {
    if (this.investor.InvestorId) {
      await this.service.getProjectInvestor(this.investor.InvestorId).then((result: ResultApi) => {
        if (ResultApi.IsSuccess(result)) {
          let item = EntityHelper.createEntity(MPOProjectInvestorRelatedEntity, result.Object);
          if (result.Object?.Logo?.url) {
            item.Logo = this.renderImage(result.Object?.Logo);
          }
          this.investor.Id = item.Id;
          this.investor.Name = item.Name;
          this.investor.Logo = item.Logo;
          this.investor.Description = item.Description;
          if (this.investor.Description) {
            clearValidation(this.investor, null, 'Description');
          }
        } else {
          ToastrHelper.ErrorResult(result);
        }
      });
    } else {
      this.investor.Id = null;
      this.investor.Name = null;
      this.investor.Logo = null;
      this.investor.Description = null;
    }
  }

  addNew() {
    this.dialogService.WapperAsync({
      cancelText: 'Đóng',
      confirmText: 'Xác nhận',
      size: ModalSizeType.Medium,
      title: 'Thêm mới Chủ đầu tư',
      className: 'modal-body-project',
      object: EditProjectInvestorComponent,
    }, async (item: any) => {

    });
  }

  async addRow() {
    this.investor.AffiliateUnit.push(new MPOProjectInvestorAffiliateUnitlEntity());
  }

  remove(index) {
    this.investor.AffiliateUnit.splice(index, 1);
    this.reloadUnit = true;
    setTimeout(() => {
      this.reloadUnit = false;
    }, 0);
  }

  addUnit() {
    this.dialogService.WapperAsync({
      cancelText: 'Đóng',
      confirmText: 'Xác nhận',
      size: ModalSizeType.Medium,
      title: 'Thêm mới Đơn vị liên quan',
      objectExtra: {
        isUnit: true
      },
      object: MPOProjectInvestorRelatedComponentUnitComponent,
    });
  }

  addUnitType() {
    this.dialogService.WapperAsync({
      cancelText: 'Đóng',
      confirmText: 'Xác nhận',
      size: ModalSizeType.Medium,
      title: 'Thêm mới loại đơn vị',
      object: MPOProjectInvestorRelatedComponentUnitComponent,
    });
  }

  unitChange(option: OptionItem, index) {
    const item = option.originalItem;
    this.investor.AffiliateUnit[index].RelatedType = 'RelatedUnit';
    if (item?.type == 'bank') {
      this.investor.AffiliateUnit[index].RelatedType = 'Bank';
    }
  }

  relatedUnitChange(option: OptionItem, index: number) {
    const item = option.originalItem;
    if (!this.investor.AffiliateUnit[index].Description)
      this.investor.AffiliateUnit[index].Description = item?.description;
    if (!this.investor.AffiliateUnit[index].Logo && item?.logo)
      this.investor.AffiliateUnit[index].Logo = this.renderImage(item?.logo);
    else this.investor.AffiliateUnit[index].Logo = null;
  }

  private renderImage(image: any): FileData {
    let itemImage: FileData = new FileData();
    if (image) {
      itemImage = {
        Path: image.url,
        Name: image.name,
        ResultUpload: {
          _id: image._id,
          uri: image.uri,
          url: image.url,
          name: image.name,
          size: image.size,
          s3Key: image.s3Key,
          width: image.width,
          height: image.height,
          mimeType: image.mimeType,
        }
      }
    }
    return itemImage;
  }
}