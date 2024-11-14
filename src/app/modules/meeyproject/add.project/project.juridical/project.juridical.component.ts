import * as _ from 'lodash';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { validation, validations } from '../../../../_core/decorators/validator';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { EditorComponent } from '../../../../_core/editor/editor.component';
import { MPOProjectEntity, MPOProjectJuridicalDetailEntity, MPOProjectJuridicalEntity } from '../../../../_core/domains/entities/meeyproject/mpo.project.entity';
import { DialogData } from '../../../../_core/domains/data/dialog.data';
import { MPOArchiveProjectImageComponent } from '../../components/archive.project.image/archive.project.image.component';
import { MPOArchiveProjectFileComponent } from '../../components/archive.project.files/archive.project.files.component';
import { UtilityExHelper } from '../../../../_core/helpers/utility.helper';
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { FileData } from '../../../../_core/domains/data/file.data';

@Component({
  selector: 'mpo-project-juridical',
  templateUrl: './project.juridical.component.html',
  styleUrls: ['./project.juridical.component.scss'],
})
export class MPOProjectJuridicalComponent extends EditComponent implements OnInit {
  @ViewChild('uploadFiles') uploadFiles: EditorComponent;
  @ViewChild('uploadImageFiles') uploadImageFiles: EditorComponent;

  @Input() params: any;

  id: string;
  viewer: boolean;
  isProduct: boolean;
  item: MPOProjectEntity = new MPOProjectEntity();
  juridical: MPOProjectJuridicalEntity = new MPOProjectJuridicalEntity();

  dialogPopupImageArchive: DialogData;
  dialogPopupFileArchive: DialogData;

  constructor() {
    super();
  }

  async ngOnInit() {
    this.viewer = this.getParam('viewer');
    this.isProduct = this.getParam('isProduct');
    this.item = this.getParam('item');

    if (this.item) {
      this.item.Juridical = EntityHelper.createEntity(MPOProjectJuridicalEntity, this.item.Juridical);
      this.item.Juridical.Details = this.item.Juridical?.Details ? EntityHelper.createEntities(MPOProjectJuridicalDetailEntity, this.item.Juridical.Details) : [];
      this.juridical = this.item.Juridical;
      if (this.item.ProjectMeeyId) {
        this.dialogPopupImageArchive = UtilityExHelper.createDialogDataArchive('Kho ảnh', MPOArchiveProjectImageComponent, { multiple: true, ProjectMeeyId: this.item.ProjectMeeyId });
        this.dialogPopupFileArchive = UtilityExHelper.createDialogDataArchive('Kho tài liệu', MPOArchiveProjectFileComponent, { multiple: true, ProjectMeeyId: this.item.ProjectMeeyId });
      }
    }
  }

  public async valid(): Promise<boolean> {
    if (this.juridical) {
      let valid = true;
      if (this.item.IsPublished) {
        valid = await validation(this.juridical, ['Description', 'Files', 'ImageFiles']);
      }
      if (valid) {

        if (this.uploadFiles) {
          valid = await validations(this.juridical.Details, ['Description', 'Type']);
          if (valid) {
            let files = await this.uploadFiles.upload();
            this.juridical.Details.forEach(item => {
              let UrlS3Key = files.filter(c => c.ResultUpload && c.Code == item.Code)
                .map(c => c.ResultUpload.files && Array.isArray(c.ResultUpload.files) ? c.ResultUpload.files[0] : c.ResultUpload)
                .map(c => {
                  return c._id
                    ? { _id: c._id }
                    : { s3Key: c.s3Key }
                })[0];
              if (UrlS3Key) {
                item.UrlS3Key = UrlS3Key;
                item.TypeFile = 'File';
              }
            })
          }
        }
        if (this.uploadImageFiles) {
          valid = await validations(this.juridical.Details, ['Description', 'Type']);
          if (valid) {
            let image = await this.uploadImageFiles.upload();
            this.juridical.Details.forEach(item => {
              let UrlS3Key = image.filter(c => c.ResultUpload && c.Code == item.Code)
                .map(c => c.ResultUpload.images && Array.isArray(c.ResultUpload.images) ? c.ResultUpload.images[0] : c.ResultUpload)
                .map(c => {
                  return c._id
                    ? { _id: c._id }
                    : { s3Key: c.s3Key }
                })[0];
              if (UrlS3Key) {
                item.UrlS3Key = UrlS3Key;
                item.TypeFile = 'Image';
              }
            })
          }
        }
      }
      return valid;
    }
    return false;
  }

  public async validInfo(): Promise<boolean> {
    if (this.juridical) {
      let valid = true;
      if (this.item.IsPublished) {
        valid = await validation(this.juridical, ['Description']);
      }
      return valid;
    }
    return false;
  }

  selectedFiles(typeFile = 'file') {
    let cloneDetails = [];
    if (this.juridical.Details) cloneDetails = _.cloneDeep(this.juridical.Details);
    let listFile = [...this.juridical.Files, ...this.juridical.ImageFiles];
    this.juridical.Details = [];
    listFile.forEach((file: FileData) => {
      if (!this.juridical.Details.find(c => c.Code == file.Code)) {
        const clone = cloneDetails.find(c => c.Code == file.Code);
        let detail = EntityHelper.createEntity(MPOProjectJuridicalDetailEntity, {
          Name: file.Name,
          Code: file.Code,
          Url: file.Data || file.Path,
          TypeFile: typeFile,
        });
        if (clone) {
          detail.Type = clone.Type;
          detail.TypeFile = clone.TypeFile;
          detail.Description = clone.Description;
          if (!detail.Url) detail.Url = clone.Url;
        }
        this.juridical.Details.push(detail);
      }
    })
  }

  downloadFile(item) {
    let file = this.juridical.Files.find(c => c.Code == item.Code);
    if (item.TypeFile == 'image')
      file = this.juridical.ImageFiles.find(c => c.Code == item.Code);
    if (file.Path) {
      const a = document.createElement('a');
      a.setAttribute('style', 'display:none;');
      document.body.appendChild(a);
      a.download = file.Name;
      a.href = file.Path;
      a.target = '_blank';
      a.click();
      document.body.removeChild(a);
    } else {
      const downloadedFile = new Blob([file.Url], { type: file.NativeData.type });
      const a = document.createElement('a');
      a.setAttribute('style', 'display:none;');
      document.body.appendChild(a);
      a.download = file.Name;
      a.href = URL.createObjectURL(downloadedFile);
      a.target = '_blank';
      a.click();
      document.body.removeChild(a);
    }

  }
}