import { Component, Input, OnInit } from '@angular/core';
import { AppConfig } from '../../../../_core/helpers/app.config';
import { GridData } from '../../../../_core/domains/data/grid.data';
import { DataType } from '../../../../_core/domains/enums/data.type';
import { PipeType } from '../../../../_core/domains/enums/pipe.type';
import { GridComponent } from '../../../../_core/components/grid/grid.component';
import { MLRedirectHistoryEntity } from '../../../../_core/domains/entities/meeyland/ml.redirect.entity';

@Component({
  templateUrl: '../../../../_core/components/grid/grid.component.html',
})

export class HistoryModalRedirectComponent extends GridComponent implements OnInit {

  @Input() params: any;

  ngOnInit(): void {
    this.properties = [
      { Property: 'index', Title: 'STT', Type: this.DataType.Number, Align: 'center', ColumnWidth: 80, DisableOrder: true },
      { Property: "UpdatedAt", Title: "Ngày thực hiện", Type: DataType.DateTime, Align: 'center', PipeType: PipeType.Date },
      {
        Property: "Author", Title: "Người thực hiện", Type: DataType.String,
        Format: (item: any) => {
          let text = `<a style="text-decoration: none !important; color: inherit;" tooltip="${item.Author != null ? item.Author.Email : ''}" flow="right">${item.Author != null ? item.Author.Name : 'Hệ thống'}</a>`;
          return text;
        }
      },
      {
        Property: "ActionText", Title: "Hành động", Type: DataType.String,
        Format: (item: any) => {
          let text = item.Action == 'create' ? 'Thêm mới' : 'update' ? 'Cập nhật' : 'delete' ? 'Xóa' : '';
          return text;
        }
      },
      {
        Property: "Note", Title: "Ghi chú", Type: DataType.String,
        Format: (item: any) => {
          let text = '';
          switch (item.Action) {
            case 'create':
              text = 'Tạo mới';
              break;
            case 'delete':
              text = 'Xóa'
              break;
            case 'update':
              if ((!item.NewValue) ||
                ((item.OldValue.OriginUrl == item.NewValue.OriginUrl) && (item.OldValue.RedirectUrl == item.NewValue.RedirectUrl))
              ) {
                text = 'Cập nhật';
                break;
              }
              else {
                if (item.OldValue.OriginUrl != item.NewValue.OriginUrl) {
                  text = `Sửa URL cũ từ ${this.getUrlMeeyland(item.OldValue.OriginUrl)} thành ${this.getUrlMeeyland(item.NewValue.OriginUrl)}<br>`;
                }
                if (item.OldValue.RedirectUrl != item.NewValue.RedirectUrl) {
                  text += `Sửa URL mới từ ${this.getUrlMeeyland(item.OldValue.RedirectUrl)} thành ${this.getUrlMeeyland(item.NewValue.RedirectUrl)}`;
                }
              }
              break;
            default:
          }
          return text;
        }
      }
    ]
    this.obj.Url = `admin/MLRedirect/GetAllHistoryAsync/${this.params.Id}`;
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
    Reference: MLRedirectHistoryEntity,
    HideSearch: true,
    Checkable: false,
    UpdatedBy: false,
    Filters: [],
    InlineFilters: [],
    CustomFilters: [''],
    Imports: [],
    Exports: [],
    Actions: [],
    Features: [],
  };

  loadComplete(): void {
    if (this.items && this.items.length > 0) {
      let pagesize = this.itemData.Paging?.Size || 30;
      let pageindex = this.itemData.Paging?.Index || 1;
      this.items.forEach((item: any, index) => {
        item.index = (pagesize * (pageindex - 1)) + (index + 1);
      });
    }
  }
}