import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AppInjector } from '../../../app.module';
import { HttpEventType } from '@angular/common/http';
import { MLRedirectService } from './redirect.service';
import { AppConfig } from '../../../_core/helpers/app.config';
import { GridData } from '../../../_core/domains/data/grid.data';
import { DataType } from '../../../_core/domains/enums/data.type';
import { PipeType } from '../../../_core/domains/enums/pipe.type';
import { ResultApi } from '../../../_core/domains/data/result.api';
import { TableData } from '../../../_core/domains/data/table.data';
import { ToastrHelper } from '../../..//_core/helpers/toastr.helper';
import { ActionData } from '../../../_core/domains/data/action.data';
import { ActionType } from '../../../_core/domains/enums/action.type';
import { ResultType } from '../../../_core/domains/enums/result.type';
import { AdminApiService } from '../../../_core/services/admin.api.service';
import { ImportRedirectComponent } from './import/import.redirect.component';
import { ModalSizeType } from '../../../_core/domains/enums/modal.size.type';
import { GridComponent } from '../../../_core/components/grid/grid.component';
import { AddModalMLRedirectComponent } from './add-modal/add-modal.component';
import { HistoryModalRedirectComponent } from './history-modal/history-modal.component';
import { MLRedirectEntity } from '../../../_core/domains/entities/meeyland/ml.redirect.entity';

@Component({
  templateUrl: '../../../_core/components/grid/grid.component.html',
})

export class RedirectComponent extends GridComponent implements OnInit {

  redirectService: MLRedirectService;
  service: AdminApiService

  constructor() {
    super();
    this.redirectService = AppInjector.get(MLRedirectService);
  }

  async ngOnInit() {
    this.breadcrumbs = [{ Name: 'Meey Land', Link: '' }, { Name: 'Quản lý chuyển hướng', Link: '../../../admin/mlredirect' }];
    this.properties = [
      {
        Property: "TypeColunm", Title: "Loại", Type: DataType.String,
        Format: (item: any) => {
          return item.Type;
        },
        HideCheckbox: (item: any) => {
          return !item.Active;
        },
      },
      {
        Property: "OriginUrlSearch", Title: "URL cũ", Type: DataType.String,
        Format: (item: any) => {
          return this.getUrlMeeyland(item.OriginUrl);
        },
      },
      {
        Property: "RedirectUrlSearch", Title: "URL mới", Type: DataType.String,
        Format: (item: any) => {
          return this.getUrlMeeyland(item.RedirectUrl);
        },
      },
      {
        Property: "Active", Title: "Trạng thái", Type: DataType.String, Align: 'center',
        Format: (item: any) => {
          let type = item.Active ? 'success' : !item.Active ? 'danger' : 'warning';
          let title = item.Active ? 'Hoạt động' : !item.Active ? 'Xóa' : 'Chưa xác định';
          let text = `<p class="kt-badge kt-badge--inline kt-badge--${type}">${title}</p>`;
          return text;
        },
      },
      { Property: "UpdatedAt", Title: "Ngày cập nhật", Type: DataType.DateTime, Align: 'center', PipeType: PipeType.DateTime },
      {
        Property: "Author", Title: "Người cập nhật", Type: DataType.String,
        Format: (item: any) => {
          let text = `<a style="text-decoration: none !important; color: inherit;" tooltip="${item.Author != null ? item.Author.Email : ''}" flow="right">${item.Author != null ? item.Author.Name : 'Hệ thống'}</a>`;
          return text;
        },
      },
    ]

    this.itemData.Filters = (this.itemData && this.itemData.Filters && this.itemData.Filters.filter(c => c.Name != 'BranchId')) || [];
    this.itemData.Filters.push({
      Name: 'Domain',
      Value: AppConfig.MeeyLandConfig.Url,
    });
    this.render(this.obj);
  }

  getUrlMeeyland(endpoint: any) {
    let _url = `${AppConfig.MeeyLandConfig.Url}/${endpoint}`;
    let _urlDisplay = _url;
    if (_url.length > 100) {
      _urlDisplay = _url.substring(100, 0) + '...';
    }
    return `<a href="${_url}" target="_blank">${_urlDisplay}</a>`;
  }

  obj: GridData = {
    Reference: MLRedirectEntity,
    Size: ModalSizeType.Large,
    HideSearch: true,
    Checkable: true,
    UpdatedBy: false,
    DisableAutoLoad: true,
    Filters: [],
    Imports: [],
    Exports: [],
    CustomFilters: ['TypeInsert', 'OriginUrlSearch', 'RedirectUrlSearch', 'UpdatedAt', 'UpdatedBySearch', 'ActiveSearch'],
    Features: [
      ActionData.addNew(() => { this.open() }),
      {
        toggleCheckbox: true,
        name: 'Xóa',
        className: 'btn btn-danger',
        systemName: ActionType.Delete,
        hide: true,
        click: () => {
          this.deleteItem(true, null);
        }
      },
      ActionData.importData(() => { this.importData() }),
      ActionData.exportData(() => { this.exportData() }),
      ActionData.reload(() => { this.loadItems() }),
    ],
    Actions: [
      ActionData.edit((item: any) => {
        this.open(item);
      }),
      ActionData.delete((item: any) => {
        if (item.Active.includes('Xóa')) {
          ToastrHelper.Error('Bản ghi điều hướng này đã xóa !');
        }
        else {
          this.deleteItem(false, item);
        }
      }),
      ActionData.history((item: any) => {
        this.viewDiary(item)
      })],
  };



  importData() {
    this.dialogService.WapperAsync({
      cancelText: 'Đóng',
      confirmText: 'Import',
      title: 'Import chuyển hướng',
      size: ModalSizeType.Large,
      object: ImportRedirectComponent,
    });
  }

  viewDiary(item: any) {
    this.dialogService.WapperAsync({
      cancelText: 'Đóng',
      title: 'Lịch sử tác động',
      size: ModalSizeType.ExtraLarge,
      className: 'modal-body-project',
      objectExtra: item,
      object: HistoryModalRedirectComponent,
    }, async () => {
      await this.loadItems();
    });
  }

  deleteItem(deleteMany: boolean, item: any) {
    let req = {};
    let ids = [];
    if (deleteMany) {
      let listChecked = this.items?.filter(x => x.Checked == true);
      if (!listChecked?.length) {
        ToastrHelper.Error('Bạn phải tích chọn bản ghi cần xóa !');
        return false;
      }
      ids = listChecked.map(x => x.Id);
    }
    else {
      ids.push(item.Id);
    }
    if (ids.length > 0) {
      req = {
        ids: ids, author: {
          id: this.authen.account.Id.toString(),
          email: this.authen.account.Email,
          name: this.authen.account.FullName
        },
      };
    }
    this.dialogService.Confirm('Bạn có chắc muốn xóa bản ghi điều hướng này', () => {
      this.redirectService.delete(req).then((result: ResultApi) => {
        if (result && result.Type == ResultType.Success) {
          ToastrHelper.Success(`Xóa thành công ${ids.length} bản ghi`);
          this.loadItems();
        } else ToastrHelper.ErrorResult(result);
      });
    }, null, 'Xóa điều hướng');
  }

  open(item: any = null) {
    let _title = item?.Id ? 'Chỉnh sửa' : 'Thêm mới';
    this.dialogService.WapperAsync({
      cancelText: 'Đóng',
      confirmText: 'Xác nhận',
      title: `${_title}` + ' chuyển hướng',
      size: ModalSizeType.Medium,
      className: 'modal-body-project',
      objectExtra: item,
      object: AddModalMLRedirectComponent,
    }, async () => {
      await this.loadItems();
    });
  }


  loadComplete(): void {
    if (this.items && this.items.length > 0) {
      let pagesize = this.itemData.Paging?.Size || 30;
      let pageindex = this.itemData.Paging?.Index || 1;
      this.items.forEach((item: any, index) => {
        item.index = (pagesize * (pageindex - 1)) + (index + 1);
      });
    }
  }

  exportData() {
    let urlExport = '/admin/MLRedirect/ExportAllRedirect';
    let objData: TableData = this.itemData;
    let currentDate = formatDate(new Date(), 'dd.MM.yyyy', 'en');
    objData.Name = `danhsachdieuhuong ${currentDate}`;
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
          a.download = objData.Name + '.' + extension;
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
}
