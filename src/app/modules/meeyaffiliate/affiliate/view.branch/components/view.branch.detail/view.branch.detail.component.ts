import { HttpEventType } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ResultApi } from '../../../../../../_core/domains/data/result.api';
import { TableData } from '../../../../../../_core/domains/data/table.data';
import { ActionType } from '../../../../../../_core/domains/enums/action.type';
import { ExportType } from '../../../../../../_core/domains/enums/export.type';
import { AdminAuthService } from '../../../../../../_core/services/admin.auth.service';
import { MAFAffiliateService } from '../../../affiliate.service';

@Component({
  selector: 'maf-view-branch-detail',
  templateUrl: './view.branch.detail.component.html',
  styleUrls: ['./view.branch.detail.component.scss']
})
export class MAFViewBranchDetailComponent implements OnInit {
  @Input() params: any;
  item: any;

  rankId: number;
  branchId: number;
  branchName: string;
  typeBranch: string;
  urlGetList: string;

  processExport = false;
  allowExport = false;

  constructor(private service: MAFAffiliateService, private authen: AdminAuthService) { }

  async ngOnInit() {
    let item = this.params && this.params["item"];
    this.item = this.item || item;

    let rankId = this.params && this.params["rankId"];
    this.rankId = this.rankId || rankId;

    let branchId = this.params && this.params["branchId"];
    this.branchId = this.branchId || branchId;

    this.branchName = 'Meey Land';
    this.typeBranch = 'Toàn bộ';
    if (rankId && rankId > 0) {
      await this.service.lookupRank().then((result: ResultApi) => {
        if (ResultApi.IsSuccess(result) && result.Object.length > 0) {
          let listRank = result.Object;
          let rank = listRank.find(c => c.Id == rankId);
          if (rank) {
            this.branchName = rank.Name;
            this.typeBranch = 'Trung tâm';
          }
        }
      });
    } else if (branchId && branchId > 0) {
      await this.service.lookupBranch().then((result: ResultApi) => {
        if (ResultApi.IsSuccess(result) && result.Object.length > 0) {
          let listBranch = result.Object;
          let branch = listBranch.find(c => c.Id == branchId);
          if (branch) {
            this.branchName = branch.Name;
            this.typeBranch = 'Nhánh';
          }
        }
      });
    }

    this.urlGetList = '/admin/MAFAffiliate/CommissionDetails?month=' + this.item.Month;
    if (rankId) {
      this.urlGetList += '&rankId=' + rankId;
    }
    if (branchId) {
      this.urlGetList += '&branchId=' + branchId;
    }

    this.allowExport = await this.authen.permissionAllow("MAFAffiliate", ActionType.Export);
  }

  ExportExcel() {
    this.processExport = true
    let urlExport = '/admin/MAFAffiliate/ExportCommissionDetails?month=' + this.item.Month;
    if (this.rankId) {
      urlExport += '&rankId=' + this.rankId;
    }
    if (this.branchId) {
      urlExport += '&branchId=' + this.branchId;
    }
    let objData: TableData = {
      Paging: {
        Index: 1,
        Size: 50000
      },
      Search: this.item.F1Amount + "|" + this.item.PayAmount
    }
    objData.Export = {
      Type: ExportType.Excel,
    }
    objData.Name = "Danh sách hoa hồng"
    let fileName = "Danh sách hoa hồng_" + new Date().getTime();
    return this.service.downloadFileByUrl(urlExport, objData).toPromise().then(data => {
      this.processExport = false
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
      this.processExport = false
    });
  }

}
