import { Component, OnInit, ViewChild } from '@angular/core';
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { validation } from '../../../../_core/decorators/validator';
import { MPOProjectEntity } from '../../../../_core/domains/entities/meeyproject/mpo.project.entity';
import { EditorComponent } from '../../../../_core/editor/editor.component';
import { AppConfig } from '../../../../_core/helpers/app.config';

@Component({
  selector: 'app-import.project',
  templateUrl: './import.project.component.html',
  styleUrls: ['./import.project.component.scss']
})
export class MPOImportProjectComponent extends EditComponent implements OnInit {
  file: string;
  @ViewChild('uploadFile') uploadFile: EditorComponent;
  item: MPOProjectEntity = new MPOProjectEntity();

  disabled: boolean = true;

  constructor() {
    super();
    this.file = AppConfig.ApiUrl.replace('/api', '/Reports/FileProject.xlsx');
  }

  async ngOnInit(): Promise<void> {

  }

  public async confirm(complete: () => void): Promise<boolean> {
    this.processing = true;
    if (await validation(this.item, ['File'])) {
      this.processing = false;
      let files = await this.uploadFile.upload();
      let resultUpload: any = files.filter(c => c.ResultUpload).map(c => c.ResultUpload)[0];
      if (resultUpload) {
        let totalAccess = resultUpload.success;
        let totalError = resultUpload.error;
        let content = '';
        if (totalAccess > 0)
          content = '<p><h3 class="text-center p-2"><i class="fa fa-check-circle text-success" aria-hidden="true"></i> Tải dữ liệu thành công</h3></p>';
        else
          content = '<p><h3 class="text-center p-2"><i class="fa fa-exclamation-triangle text-warning" aria-hidden="true"></i> Tải dữ liệu không thành công</h3></p>';
        content += '<p>Số lượng bản ghi thành công: <b class="text-success">' + totalAccess + '</b></p>';
        content += '<p>Số lượng bản ghi lỗi: <b class="text-danger">' + totalError + '</b></p>';
        this.dialogService.Alert("Kết quả Import", content)
        if (complete) complete();
        return true;
      }
    }
    return false;
  }

  async toggleDisableButton() {
    this.disabled = await validation(this.item, ['File'], true) ? false : true;
  }

}
