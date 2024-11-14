import * as _ from 'lodash';
import { Component, Input, OnInit } from '@angular/core';
import { GridComponent } from '../../../../../_core/components/grid/grid.component';
import { MPOProjectService } from '../../../../../modules/meeyproject/project.service';
import { AppInjector } from '../../../../../app.module';
import { BaseEntity } from '../../../../../_core/domains/entities/base.entity';
import { ActionData } from '../../../../../_core/domains/data/action.data';
import { ActionType } from '../../../../../_core/domains/enums/action.type';
import { GridData } from '../../../../../_core/domains/data/grid.data';
import { MPOProjectItemEntity } from '../../../../../_core/domains/entities/meeyproject/mpo.project.entity';
import { EntityHelper } from '../../../../../_core/helpers/entity.helper';
import { DataType } from '../../../../../_core/domains/enums/data.type';
import { ResultApi } from '../../../../../_core/domains/data/result.api';
import { ResultType } from '../../../../../_core/domains/enums/result.type';
import { ToastrHelper } from '../../../../../_core/helpers/toastr.helper';
import { ModalSizeType } from '../../../../../_core/domains/enums/modal.size.type';
import { MPOEditTitleProjectFilesComponent } from './edit.title.project.files/edit.title.project.files.component';

@Component({
  selector: 'mpo-project-files-grid',
  templateUrl: '../../../../../_core/components/grid/grid.component.html',
})
export class MPOProjectFilesGridComponent extends GridComponent implements OnInit {
  @Input() params: any;

  obj: GridData = {
    Filters: [],
    Imports: [],
    Exports: [],
    Actions: [
      {
        icon: 'la la-eye',
        name: ActionType.ViewDetail,
        className: 'btn btn-warning',
        systemName: ActionType.ViewDetail,
        click: (item: any) => {
          this.view(item);
        },
      },
    ],
    Features: [],
    UpdatedBy: false,
    DisableAutoLoad: true,
    Reference: BaseEntity,
    SearchText: 'Tìm kiếm nhanh tên tài liệu...',
    HideCustomFilter: true,
    IsPopup: true,
  };
  service: MPOProjectService;
  viewer: boolean;
  item: MPOProjectItemEntity = new MPOProjectItemEntity();

  constructor() {
    super();
    this.service = AppInjector.get(MPOProjectService);
  }

  ngOnInit() {
    this.properties = [
      { Property: '_id', Title: 'Id', Type: DataType.String, DisableOrder: true, ColumnWidth: 70 },
      {
        Property: 'titleText', Title: 'Tên tài liệu', Type: DataType.String, DisableOrder: true,
        Format: (item) => {
          if (!item.title) return '';
          return '<a href=' + item.url + ' target="_blank">' + item.title + '</a>'
        }
      },
      {
        Property: 'type', Title: 'Định dạng file', Type: DataType.String, DisableOrder: true,
        Format: (item) => {
          if (!item.name) return item.mimeType;
          return item.name.split('.').pop().toUpperCase();
        }
      },
      {
        Property: 'createdBy', Title: 'Người tạo', Type: DataType.String, DisableOrder: true,
        Format: (item) => {
          if (!item.createdBy?.data?.fullname) return '';
          return item.createdBy?.data?.fullname
        }
      },
      { Property: 'createdAt', Title: 'Ngày tạo', Type: DataType.DateTime },
    ]

    if (this.params && this.params['viewer'] != null)
      this.viewer = this.params && this.params['viewer'];
    else this.viewer = false;
    if (this.params && this.params['item']) {
      let item = this.params && this.params['item'];
      if (item) {
        let cloneItem = _.cloneDeep(item);
        this.item = EntityHelper.createEntity(MPOProjectItemEntity, cloneItem);
      }
    }

    if (!this.viewer) {
      this.obj.Actions.push(ActionData.edit((item) => this.edit(item)));
      this.obj.Actions.push(ActionData.delete((item) => this.delete(item)));
    }

    this.obj.Url = '/admin/mpoproject/Files/' + this.item.ProjectMeeyId;
    this.render(this.obj);
  }

  view(item) {
    if (item?.url) {
      window.open(item.url, "_blank");
    }
  }

  edit(item) {
    this.dialogService.WapperAsync({
      cancelText: 'Đóng',
      confirmText: 'Xác nhận',
      size: ModalSizeType.Medium,
      title: 'Đổi tên tài liệu',
      objectExtra: {
        item: item,
        projectMeeyId: this.item.ProjectMeeyId,
      },
      object: MPOEditTitleProjectFilesComponent,
    }, () => this.loadItems());
  }

  delete(item) {
    if (item?._id) {
      if (this.obj && this.obj.Reference) {
        this.dialogService.Confirm('Bạn có chắc chắn muốn xóa tài liệu dự án?', () => {
          this.service.deleteItemFile(this.item.ProjectMeeyId, item._id).then((result: ResultApi) => {
            if (result && result.Type == ResultType.Success) {
              ToastrHelper.Success('Xóa dữ liệu thành công');
              this.loadItems();
            } else ToastrHelper.ErrorResult(result);
          });
        });
      }
    }
  }

}
