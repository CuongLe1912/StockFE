import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { validation } from '../../../../_core/decorators/validator';
import { EditorComponent } from '../../../../_core/editor/editor.component';
import { MPOProjectEntity, MPOProjectLocationEntity } from '../../../../_core/domains/entities/meeyproject/mpo.project.entity';
import { DialogData } from '../../../../_core/domains/data/dialog.data';
import { UtilityExHelper } from '../../../../_core/helpers/utility.helper';
import { MPOArchiveProjectImageComponent } from '../../components/archive.project.image/archive.project.image.component';
import { MPOArchiveProjectFileComponent } from '../../components/archive.project.files/archive.project.files.component';
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';

@Component({
  selector: 'mpo-project-location',
  templateUrl: './project.location.component.html',
  styleUrls: ['./project.location.component.scss'],
})
export class MPOProjectLocationComponent extends EditComponent implements OnInit {
  @ViewChild('uploadImages') uploadImages: EditorComponent;
  @Input() params: any;

  id: string;
  locationTab: string;
  viewer: boolean;
  isProduct: boolean;
  item: MPOProjectEntity = new MPOProjectEntity();
  location: MPOProjectLocationEntity = new MPOProjectLocationEntity();
  validTabs = [];
  dialogPopupImageArchive: DialogData;
  dialogPopupFileArchive: DialogData;

  constructor() {
    super();
  }

  async ngOnInit() {
    this.locationTab = this.getParam('locationTab') || 'trafficLine';
    this.viewer = this.getParam('viewer');
    this.isProduct = this.getParam('isProduct');
    this.item = this.getParam('item');

    if (this.item) {
      this.item.LocationTab = EntityHelper.createEntity(MPOProjectLocationEntity, this.item.LocationTab);
      this.location = this.item.LocationTab;
      if (this.item.ProjectMeeyId) {
        this.dialogPopupImageArchive = UtilityExHelper.createDialogDataArchive('Kho ảnh', MPOArchiveProjectImageComponent, { multiple: true, ProjectMeeyId: this.item.ProjectMeeyId });
        this.dialogPopupFileArchive = UtilityExHelper.createDialogDataArchive('Kho tài liệu', MPOArchiveProjectFileComponent, { multiple: true, ProjectMeeyId: this.item.ProjectMeeyId });
      }
    }
  }

  public async valid(): Promise<boolean> {
    this.validTabs = [];
    let valid = await validation(this.location);
    // if (!await validation(this.location, ['LocationDescription'], true)) {
    //   this.validTabs.push('location');
    // }
    // if (!await validation(this.location, ['TrafficLineDescription', 'Images'], true)) {
    //   this.validTabs.push('trafficLine');
    // }
    if (valid) {
      if (this.uploadImages) {
        this.location.Images = await this.uploadImages.upload();
      }
    } else {
      this.locationTab = this.validTabs[0];
    }
    return valid;
  }

  public async validInfo(): Promise<boolean> {
    let valid = await validation(this.location, ["Description"]);
    return valid;
  }

  selectedLocationTab(tab: string) {
    this.locationTab = tab;
  }
}