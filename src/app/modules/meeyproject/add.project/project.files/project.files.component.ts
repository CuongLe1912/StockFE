import * as _ from 'lodash';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AdminDialogService } from '../../../../_core/services/admin.dialog.service';
import { MPOProjectItemEntity } from '../../../../_core/domains/entities/meeyproject/mpo.project.entity';
import { MPOProjectService } from '../../project.service';
import { AppInjector } from '../../../../app.module';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { EditorComponent } from '../../../../_core/editor/editor.component';

@Component({
  selector: 'mpo-project-files',
  templateUrl: './project.files.component.html',
  styleUrls: ['./project.files.component.scss']
})
export class MPOProjectFilesComponent implements OnInit {
  @ViewChild('uploadFiles') uploadFiles: EditorComponent;
  @Input() params: any;

  viewer: boolean;
  isProduct: boolean;
  item: MPOProjectItemEntity = new MPOProjectItemEntity();
  files = [];

  loading: boolean = false;
  service: MPOProjectService;
  dialog: AdminDialogService;

  constructor() {
    this.service = AppInjector.get(MPOProjectService);
    this.dialog = AppInjector.get(AdminDialogService);
  }

  ngOnInit() {
    if (this.params && this.params['viewer'] != null)
      this.viewer = this.params && this.params['viewer'];
    else this.viewer = false;
    if (this.params && this.params['isProduct'] != null)
      this.isProduct = this.params && this.params['isProduct'];
    else this.isProduct = false;
    if (this.isProduct) this.viewer = true;
    if (this.params && this.params['item']) {
      let item = this.params && this.params['item'];
      if (item) {
        let cloneItem = _.cloneDeep(item);
        this.item = EntityHelper.createEntity(MPOProjectItemEntity, cloneItem);
        this.item.Files = null;
      }
    }
  }

  public async confirm(): Promise<boolean> {
    if (this.item) {
      let item: MPOProjectItemEntity = _.cloneDeep(this.item);
      if (this.item.Files) {
        let files = await this.uploadFiles.upload();
        item.Files = files.filter(c => c.ResultUpload)
          .map(c => c.ResultUpload.files && Array.isArray(c.ResultUpload.files) ? c.ResultUpload.files[0] : c.ResultUpload)
          .map(c => {
            return {
              s3Key: c.s3Key
            }
          });
        return await this.service.uploadItemFiles(this.item.ProjectMeeyId, item).then((result: ResultApi) => {
          if (ResultApi.IsSuccess(result)) {
            ToastrHelper.Success('Tải tài liệu lên thành công');
            return true;
          } else {
            ToastrHelper.ErrorResult(result);
            return false;
          }
        }, () => {
          return false;
        });
      } else return true;
    }
    return false;
  }

}
