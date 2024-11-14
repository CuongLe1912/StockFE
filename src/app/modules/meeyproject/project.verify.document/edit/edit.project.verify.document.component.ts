import { Component, Input, OnInit } from '@angular/core';
import { MPOProjectDocumentEntity } from '../../../../_core/domains/entities/meeyproject/project.verify.document.entity';
import { AppInjector } from '../../../../app.module';
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { MPOProjectService } from '../../project.service';
import { AdminDialogService } from '../../../../_core/services/admin.dialog.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.project.verify.document.component.html',
  styleUrls: ['./edit.project.verify.document.component.scss']
})
export class EditProjectVerifyDocumentComponent implements OnInit {
  @Input() params: any;

  id: string;
  viewer: boolean;
  loading: boolean = true;
  disabled: boolean = true;
  checkDisabled: boolean = false;

  service: MPOProjectService;
  dialog: AdminDialogService;

  item: MPOProjectDocumentEntity = new MPOProjectDocumentEntity();

  constructor() {
    this.service = AppInjector.get(MPOProjectService);
    this.dialog = AppInjector.get(AdminDialogService);
  }

  async ngOnInit() {
    this.viewer = this.params && this.params['viewer'];
    this.id = this.params && this.params['id'];
    await this.loadItem();
    setTimeout(() => {
      this.checkDisabled = true;
    }, 1000);
  }

  private async loadItem() {
    this.item = new MPOProjectDocumentEntity();
    this.item.Active = true;
    if (this.id) {
      await this.service.item('MPOProjectDocument', this.id).then((result: ResultApi) => {
        if (ResultApi.IsSuccess(result)) {
          let violation = result.Object;
          this.item.Id = violation._id;
          this.item.Active = violation.isActive;
          let translation = violation.translation;
          let name = translation.find(c => c.languageCode == 'vi');
          this.item.Name = name ? name.name : '';
          let nameEn = translation.find(c => c.languageCode == 'en');
          this.item.NameEn = nameEn ? nameEn.name : '';
        } else {
          ToastrHelper.ErrorResult(result, 'Thông báo');
        }
      });
    }
    this.loading = false;
  }

  public async confirm(): Promise<boolean> {
    if (this.item) {
      if (await validation(this.item)) {
        return await this.service.addOrUpdateVerifyDocument(this.item).then((result: ResultApi) => {
          if (ResultApi.IsSuccess(result)) {
            if (this.item.Id) {
              let message = 'Cập nhật giấy tờ thành công';
              ToastrHelper.Success(message);
            }
            return true;
          } else {
            this.dialog.ErrorResult(result, 'Thông báo');
            return false;
          }
        }, () => {
          return false;
        });
      }
    }
    return false;
  }

  async toggleDisableButton() {
    if (this.checkDisabled)
      this.disabled = await validation(this.item, null, true) ? false : true;
  }
}
