import { formatDate } from '@angular/common';
import { HttpEventType } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ResultApi } from '../../../../../_core/domains/data/result.api';
import { TableData } from '../../../../../_core/domains/data/table.data';
import { MLRedirectEntity } from '../../../../../_core/domains/entities/meeyland/ml.redirect.entity';
import { ExportType } from '../../../../../_core/domains/enums/export.type';
import { ToastrHelper } from '../../../../../_core/helpers/toastr.helper';
import { AdminApiService } from '../../../../../_core/services/admin.api.service';
import { MLRedirectService } from '../../redirect.service';

@Component({
  selector: 'meeyland-confirm-redirect-import',
  templateUrl: './confirm.import.redirect.component.html',
})

export class ConfirmImportRedirectComponent implements OnInit {

  @Input() params: any;
  item: MLRedirectEntity = new MLRedirectEntity();
  listImport: any;
  countFail: any;
  countSuccess: any;

  constructor(
    private redirectService: MLRedirectService,
    private service: AdminApiService,
  ) { }

  ngOnInit(): void {
    if (this.params) {
      this.item = this.params.item;
      this.listImport = this.params.listImport;
      this.countFail = this.listImport?.filter(x => x.status == false)?.length ?? 0;
      this.countSuccess = this.listImport?.filter(x => x.status == true)?.length ?? 0;
    }
  }

  public async confirm() {
    let urlExport = '/admin/MLRedirect/Export';
    let objData: TableData = this.listImport;
    objData.Export = {
      Type: ExportType.Excel,
    }
    objData.Name = "Ket_qua_import_";
    let currentDate = formatDate(new Date(), 'dd.MM.yyyy', 'en');
    let fileName = "Ket_qua_import_" + `${currentDate}`;
    return this.service.downloadFileByUrl(urlExport, objData).toPromise().then(data => {
      switch (data.type) {
        case HttpEventType.DownloadProgress:
          break;
        case HttpEventType.Response:
          let extension = 'xlsx';
          const downloadedFile = new Blob([data.body], { type: data.body.type });
          const a = document.createElement('a');
          a.setAttribute('style', 'display:none;');
          document.body.appendChild(a);
          a.download = fileName + '.' + extension;
          a.href = URL.createObjectURL(downloadedFile);
          a.target = '_blank';
          a.click();
          document.body.removeChild(a);
          break;
      }
      return true;
    }).catch(ex => {
      ToastrHelper.Error(ex);
    });
  }

  subStringUrl(url: any) {
    if (typeof (url) === 'string' && url.length > 100) {
      return url.substring(100, 0) + '...';
    }
    else {
      return url;
    }
  }
}
