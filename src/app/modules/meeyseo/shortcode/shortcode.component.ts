import * as _ from 'lodash';
import { Component } from '@angular/core';
import { formatDate } from '@angular/common';
import { MSSeoService } from '../seo.service';
import { HttpEventType } from '@angular/common/http';
import { AppInjector } from '../../../../app/app.module';
import { AppConfig } from '../../../_core/helpers/app.config';
import { GridData } from '../../../_core/domains/data/grid.data';
import { TableData } from '../../../_core/domains/data/table.data';
import { ResultApi } from '../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../_core/helpers/toastr.helper';
import { ActionData } from '../../../_core/domains/data/action.data';
import { MethodType } from '../../../_core/domains/enums/method.type';
import { ActionType } from '../../../_core/domains/enums/action.type';
import { ExportType } from '../../../_core/domains/enums/export.type';
import { UtilityExHelper } from '../../../_core/helpers/utility.helper';
import { BaseEntity } from '../../../_core/domains/entities/base.entity';
import { ModalSizeType } from '../../../_core/domains/enums/modal.size.type';
import { GridComponent } from '../../../_core/components/grid/grid.component';
import { DataType, StringType } from '../../../_core/domains/enums/data.type';
import { AddShortCodeComponent } from './add.shortcode/add.shortcode.component';
import { AdminDialogService } from '../../../_core/services/admin.dialog.service';
import { MSShortCodeEntity } from '../../../_core/domains/entities/meeyseo/ms.shortcode.entity';
import { ModalViewProfileComponent } from '../../../_core/modal/view.profile/view.profile.component';

@Component({
  templateUrl: "../../../_core/components/grid/grid.component.html",
})
export class ShortCodeComponent extends GridComponent {
  obj: GridData = {
    Reference: MSShortCodeEntity,
    Size: ModalSizeType.Large,
    UpdatedBy: false,
    Imports: [],
    Exports: [],
    Filters: [],
    Actions: [
      //Xem chi tiết
      {
        icon: 'la la-eye',
        name: ActionType.ViewDetail,
        className: 'btn btn-warning',
        systemName: ActionType.ViewDetail,
        click: (item: any) => {
          this.view(item);
        },
      },
      //Chỉnh sửa
      {
        icon: 'la la-pencil',
        name: ActionType.Edit,
        systemName: ActionType.Edit,
        className: 'btn btn-success',
        click: (item: MSShortCodeEntity) => {
          this.edit(item);
        }
      },
      // Sao chép
      {
        icon: 'la la-copy',
        name: ActionType.Copy,
        systemName: ActionType.Copy,
        className: 'btn btn-light',
        click: (item: MSShortCodeEntity) =>
          this.copyLink(item)
      },
      //Xóa
      {
        icon: 'la la-trash',
        name: ActionType.Delete,
        systemName: ActionType.Delete,
        className: 'btn btn-danger',
        click: (item: MSShortCodeEntity) => {
          this.delete(item.Id);
        }
      },
    ],
    Features: [
      {
        name: "Xuất dữ liệu",
        icon: "la la-download",
        className: 'btn btn-success',
        systemName: ActionType.Export,
        click: () => this.export()
      },
      {
        icon: 'la la-plus',
        name: 'Thêm mới',
        click: () => this.addNew(),
        className: 'btn btn-primary',
        systemName: ActionType.AddNew,
      },
      {
        hide: true,
        name: 'Xóa',
        icon: 'la la-trash',
        toggleCheckbox: true,
        className: 'btn btn-danger',
        systemName: ActionType.Delete,
        click: () => this.deleteChecked(),
      },
      ActionData.reload(() => this.loadItems()),
    ],
    Checkable: true,
    DisableAutoLoad: true,
    SearchText: 'Nhập mã, title',
    CustomFilters: ['FilterUrlType', 'FilterDateRange', 'FilterCreatedBy'],
  }
  dialog: AdminDialogService;
  service: MSSeoService;
  constructor() {
    super()
    this.service = AppInjector.get(MSSeoService);
    this.dialog = AppInjector.get(AdminDialogService);
  }

  ngOnInit() {
    this.properties = [
      { Property: 'Code', Title: 'Mã', Type: DataType.String, DisableOrder: true, },
      {
        Property: 'Title', Title: 'Title', Type: DataType.String, DisableOrder: true,
        Format: ((item: any) => {
          let text = item.Title;
          let lengthTitle = item.Title.length
          if (lengthTitle > 50) {
            text = text.substr(0, 50) + '...';
            return text;
          }
          return text;
        })
      },
      {
        Property: 'UrlText', Title: 'URL', Type: DataType.String, DisableOrder: true,
        Click: ((item: any) => {
          let url = AppConfig.MeeyLandConfig.Url + item.Url;
          if (item.Url[0] != '/') url = AppConfig.MeeyLandConfig.Url + '/' + item.Url;
          window.open(url, "_blank");
        }),
        Format: ((item: any) => {
          let text = item.Url;
          let lengthUrl = item.Url.length
          if (lengthUrl > 15) {
            text = text.substr(0, 15) + '...';
            return text;
          }
          return text;
        })
      },
      { Property: 'UrlType', Title: 'Loại URL', Type: DataType.String, DisableOrder: true },
      {
        Property: 'ShortCodeText', Title: 'ShortCode', Type: DataType.String, DisableOrder: true,
        Format: (item: any) => {
          let text = item.ShortCode;
          let lengthShortCode = item.ShortCode.length
          if (lengthShortCode > 15) {
            text = text.substr(0, 15) + '...';
            return text;
          }
          return text;
        }
      },
      {
        Property: 'PageDisplay', Title: 'Vị trí đặt', Type: DataType.String, DisableOrder: true,
        Format: (item: any) => {
          let text = item.PageDisplay;
          let listString = text ? text.split('\n') : [];
          let value = '';
          if (listString?.length > 0) {
            value = listString.map((c, index) => {
              if (index < 3)
                return '<p>' + (c.length > 50 ? c.substr(0, 50) + '...' : c) + '</p>';
            }).filter(c => c).join('');
            if (listString?.length > 3) value += '<p>...</p>'

            // for (let i = 0; i < listString.length; i++) {
            //   let item = listString[i];
            //   if (i < 3) {
            //     if (item.length > 50) {
            //       value += '<p>' + item.substr(0, 49) + '...</p>';
            //     } else value += '<p>' + item + '</p>';
            //   } else
            //     if (i === 3) {
            //       value += '<p>...</p>'
            //     }
            // }
          } return value;
        }
      },
      { Property: 'StartDate', Title: 'Ngày tạo', Type: DataType.DateTime, DisableOrder: true },
      {
        Property: 'Email', Title: 'Người tạo', Type: DataType.String, DisableOrder: true,
        Format: ((item: any) => {
          let text = '';
          if (item.Email) {
            text += '<p><a routerLink="quickView">' + UtilityExHelper.escapeHtml(item.Email) + '</a></p>';
            return text;
          }
        })
      },
      { Property: 'Note', Title: 'Ghi chú', Type: DataType.String, DisableOrder: true },

    ]
    this.render(this.obj);
  }

  quickView(item: BaseEntity) {
    let originalItem = this.originalItems.find(c => c.Id == item.Id);
    if (originalItem?.CreatedBy) {
      this.quickViewProfile(originalItem.CreatedBy);
    }
  }
  public quickViewProfile(id: any) {
    if (id) {
      this.dialogService.WapperAsync({
        cancelText: 'Đóng',
        objectExtra: { id: id },
        size: ModalSizeType.Large,
        title: 'Thông tin tài khoản',
        object: ModalViewProfileComponent,
      });
    }
  }
  addNew() {
    this.dialogService.WapperAsync({
      cancelText: 'Quay lại',
      confirmText: 'Thêm mới',
      title: 'Thêm ShortCode',
      confirmClose: true,
      size: ModalSizeType.Large,
      object: AddShortCodeComponent,
      objectExtra: {
        viewer: false,
        isAddNew: true,
      }
    }, () => this.loadItems());
  }
  view(item: MSShortCodeEntity) {
    this.dialogService.WapperAsync({
      cancelText: '',
      title: 'Chi Tiết ShortCode',
      object: AddShortCodeComponent,
      size: ModalSizeType.Large,
      objectExtra: {
        id: item.Id,
        viewer: true,
      },
    }, () => this.loadItems());
  }

  edit(item: MSShortCodeEntity) {
    this.dialogService.WapperAsync({
      cancelText: 'Đóng',
      title: 'Sửa ShortCode',
      object: AddShortCodeComponent,
      confirmText: 'Lưu thay đổi',
      objectExtra: { id: item.Id, viewer: false },
      size: ModalSizeType.Large,
    }, () => this.loadItems());
  }

  copyLink(item: any) {
    let shortCode = item.ShortCode
    UtilityExHelper.copyString(shortCode);
    ToastrHelper.Success('Sao chép shortcode thành công');
  }
  export() {
    let obj: TableData = _.cloneDeep(this.itemData) || new TableData();
    if (obj) {
      let limit = obj.Paging.Total;
      if (limit > 1000) {
        ToastrHelper.Error('Số lượng export không được vượt quá 1000.');
        return false;
      }
      obj.Export = {
        Limit: limit,
        Type: ExportType.Excel,
      };
      obj.Paging.Index = 1;
      obj.Paging.Size = obj.Export.Limit;
    }
    return this.service.downloadFile('msshortcode', obj).toPromise().then(data => {
      switch (data.type) {
        case HttpEventType.DownloadProgress:
          break;
        case HttpEventType.Response:
          let currentDate = formatDate(new Date(), 'dd.MM.yyyy', 'en');
          let extension = 'xlsx';
          const downloadedFile = new Blob([data.body], { type: data.body.type });
          const a = document.createElement('a');
          a.setAttribute('style', 'display:none;');
          document.body.appendChild(a);
          a.download = 'danhsach_shortcode_' + currentDate + '.' + extension;
          a.href = URL.createObjectURL(downloadedFile);
          a.target = '_blank';
          a.click();
          document.body.removeChild(a);
          break;
      }
      return true;
    }, () => {
      ToastrHelper.Error('Lỗi hệ thống khi xuất dữ liệu, vui lòng thử lại sau');
      return false;
    });
  }

  async delete(id: any) {
    if (id) {
      let data = {
        'ids': [id],
        'adminUserId': this.authen.account.Id,
      };
      this.dialogService.Confirm('Có phải bạn muốn xóa dữ liệu tag này?', async () => {
        return await this.service.callApi('MSShortCode', 'DeleteShortCode', data, MethodType.Put).then(async (result: ResultApi) => {
          if (ResultApi.IsSuccess(result)) {
            ToastrHelper.Success('Xóa shortcode thành công');
            await this.loadItems();
            return true;
          }
          ToastrHelper.ErrorResult(result);
          return false;
        }, (e: any) => {
          ToastrHelper.Exception(e);
          return false;
        });
      });
    } else {
      ToastrHelper.Error('Xóa shortcode không thành công');
      return false;
    }
  }

  async deleteChecked() {
    let items = this.items.filter(c => c.Checked);
    if (items) {
      let Ids = items.map(c => c.Id);
      let data = {
        'ids': Ids,
        'adminUserId': this.authen.account.Id,
      };
      this.dialogService.Confirm('Bạn có chắc muốn xóa ' + '<b>' + items.length + '</b>' + ' shortcode khỏi danh sách?' + '<br>' + 'Thao tác này sẽ đồng thời xóa shortcode khỏi các trang đang được gắn.', async () => {
        return await this.service.callApi('MSShortCode', 'DeleteShortCode', data, MethodType.Put).then(async (result: ResultApi) => {
          if (ResultApi.IsSuccess(result)) {
            ToastrHelper.Success('Xóa shortcode thành công');
            await this.loadItems();
            return true;
          }
          ToastrHelper.ErrorResult(result);
          return false;
        }, (e: any) => {
          ToastrHelper.Exception(e);
          return false;
        });
      });
    } else {
      ToastrHelper.Error('Xóa shortcode không thành công');
      return false;
    }
  }
}
