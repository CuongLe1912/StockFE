import { Component, OnInit, ViewChild } from '@angular/core';
import { AppConfig } from '../../../../_core/helpers/app.config';
import { validation } from '../../../../_core/decorators/validator';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { EditorComponent } from '../../../../_core/editor/editor.component';
import { ModalSizeType } from '../../../../_core/domains/enums/modal.size.type';
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { AdminAuthService } from '../../../../_core/services/admin.auth.service';
import { AdminDialogService } from '../../../../_core/services/admin.dialog.service';
import { MLRedirectEntity } from '../../../../_core/domains/entities/meeyland/ml.redirect.entity';
import { ConfirmImportRedirectComponent } from './confirm-import/confirm.import.redirect.component';

@Component({
  selector: 'meeyland-redirect-import',
  templateUrl: './import.redirect.component.html',
  styleUrls: ['./import.redirect.component.scss'],
})
export class ImportRedirectComponent extends EditComponent implements OnInit {

  file: string;
  isUpload: any;
  fileName: any = '';
  listImport: any = [];
  dialogService: AdminDialogService;
  item: MLRedirectEntity = new MLRedirectEntity();
  @ViewChild('fileImport') fileImport: EditorComponent;

  constructor(
    public authen: AdminAuthService,
  ) {
    super();
    this.file = AppConfig.ApiUrl.replace('/api', '/Reports/Import Chuyển hướng 301, 302 .xlsx')
  }

  ngOnInit(): void {
    this.loading = false;
    this.isUpload = true;
  }

  public async uploadFileImport(): Promise<boolean> {
    let column = [];
    column = ['FileImport'];
    if (await validation(this.item, column)) {
      let files = await this.fileImport.upload();
      let resultUpload = files.filter(c => c.ResultUpload).map(c => c.ResultUpload);
      if (resultUpload && resultUpload.length > 0) {
        this.listImport = resultUpload[0].data.slice(0, 1000);
        this.fileName = this.item.FileImport[0].Name;
        ToastrHelper.Success('Tải tệp: ' + this.fileName + ' thành công');
        this.processing = false;
        this.isUpload = false;
        return false;
      }
    }
  }

  public async confirm(): Promise<boolean> {
    if (this.isUpload) {
      ToastrHelper.Error('Bạn phải tải tệp hợp lệ mới có thể import');
    }
    if (!(this.listImport.length > 0) && !this.isUpload) {
      ToastrHelper.Error('Import tệp: ' + this.fileName + ' không thành công');
    }
    else {
      this.processing = true;
      let url = AppConfig.MeeyLandV3Config.Url + '/admin/v3/redirect/import-xlsx';
      let files = await this.fileImport.upload([{
        key: 'author', value: JSON.stringify({
          id: this.authen.account.Id.toString(),
          email: this.authen.account.Email,
          name: this.authen.account.FullName
        })
      }], url);
      let resultUpload = files.filter(c => c.ResultUpload).map(c => c.ResultUpload);
      if (resultUpload && resultUpload.length > 0) {
        this.dialogService.HideAllDialog();
        setTimeout(() => {
          this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            objectExtra: {
              item: this.item,
              listImport: resultUpload[0].data,
            },
            confirmText: 'Export',
            title: 'Thông báo Import',
            size: ModalSizeType.ExtraLarge,
            object: ConfirmImportRedirectComponent,
          });
        }, 300);
      }
      else {
        ToastrHelper.Error('Import tệp: ' + this.fileName + ' không thành công');
      }
    }
    return false;
  }

  subStringUrl(url: any) {
    if (typeof (url) === 'string' && url.length > 20) {
      return url.substring(20, 0) + '...';
    }
    else {
      return url;
    }
  }
}
