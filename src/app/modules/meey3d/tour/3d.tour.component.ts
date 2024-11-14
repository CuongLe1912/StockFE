import { Component, OnInit } from '@angular/core';
import { AppConfig } from '../../../_core/helpers/app.config';
import { GridData } from '../../../_core/domains/data/grid.data';
import { DataType } from '../../../_core/domains/enums/data.type';
import { ResultApi } from '../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../_core/helpers/toastr.helper';
import { ActionData } from '../../../_core/domains/data/action.data';
import { ActionType } from '../../../_core/domains/enums/action.type';
import { MethodType } from '../../../_core/domains/enums/method.type';
import { ConstantHelper } from '../../../_core/helpers/constant.helper';
import { ProjectType } from '../../../_core/domains/enums/project.type';
import { ModalSizeType } from '../../../_core/domains/enums/modal.size.type';
import { EditTourComponent } from './edit.tour.component/edit.tour.component';
import { GridComponent } from '../../../_core/components/grid/grid.component';
import { M3DTourEntity } from '../../../_core/domains/entities/meey3d/m3d.tour.entity';
import { M3DTourStatusType } from '../../../_core/domains/entities/meey3d/enums/tour.status.type';

@Component({
  templateUrl: '../../../_core/components/grid/grid.component.html'
})
export class M3dTourComponent extends GridComponent implements OnInit {
  item: any;
  obj: GridData = {
    Filters: [],
    Imports: [],
    Exports: [],
    Actions: [
      ActionData.edit((item: any) => this.edit(item)),
      {
        name: 'Xem chi tiết',
        icon: 'la la-eye',
        className: 'btn btn-warning',
        systemName: ActionType.ViewDetail,
        click: (item: any) => {
          this.view(item);
        }
      },
      {
        name: 'Hạ Tour',
        icon: 'la la-download',
        className: 'btn btn-success',
        systemName: ActionType.M3DLowtour,
        hidden: (item: any) => {
          return item.StatusType != M3DTourStatusType.Public;
        },
        click: (item: any) => {
          this.lowTour(item);
        }
      },
      {
        icon: 'la la-trash',
        name: ActionType.Delete,
        systemName: ActionType.Delete,
        className: 'btn btn-danger',
        click: (item: any) => {
          this.delete(item.Id);
        }
      },
    ],
    Features: [
      ActionData.reload(() => this.loadItems()),
    ],
    UpdatedBy: false,
    DisableAutoLoad: true,
    SearchText: 'Tìm theo tên,mô tả...',
    Reference: M3DTourEntity,
    CustomFilters: ['TourType', 'CategoryId', 'Status', 'CreatedAt', 'UpdatedAt', 'Censorship'],
  };

  constructor() {
    super()
  }

  ngOnInit() {
    this.properties = [
      { Property: 'Index', Title: 'STT', Type: DataType.Number, DisableOrder: true, Align: 'center' },
      { Property: 'Title', Title: 'Tên Tour 3D', Type: DataType.String, DisableOrder: true,
        Format:(item: any) => {
          let domain = "https://meey3d-ui-test.meey.dev/tour/"
          if(AppConfig.ProjectType == ProjectType.Staging){
            domain = "https://staging.meey3d.com/tour/"
          }else if(AppConfig.ProjectType == ProjectType.Production){
            domain = "https://meey3d.com/tour/"
          }
          domain = domain + item.Slug
          return '<a href="'+domain+'" target="_blank">' + item.Title + '</a>';
        }
      },
      { Property: 'Description', Title: 'Mô tả tour', Type: DataType.String, DisableOrder: true },
      { Property: 'Image', Title: 'Ảnh thumb', Type: DataType.Image, DisableOrder: true },
      {
        Property: 'TourType', Title: 'Loại Tour', Type: DataType.String, DisableOrder: true,
        Format: (item: any) => {
          let option = ConstantHelper.M3D_TOUR_TYPE.find(c => c.value == item.TourType);
          let text = '<p>' + (option && option.label) + '</p>';
          return text;
        }
      },
      {
        Property: 'CategoryId', Title: 'Danh mục', Type: DataType.String, DisableOrder: true,
        Format: (item: any) => {
          if (item.CategoryId != null) {
            let option = ConstantHelper.M3D_TOUR_CATEGORY_TYPE.find(c => c.value == item.CategoryId);
            let text = '<p>' + (option && option.label) + '</p>';
            return text;
          }
          return '';
        }
      },
      // {
      //   Property: 'Ground', Title: 'Mặt bằng', Type: DataType.String, DisableOrder: true,
      //   Format: (item: any) => {
      //     let option = ConstantHelper.M3D_GROUND_TOUR_TYPE.find(c => c.value == item.Ground);
      //     let text = '<p>' + (option && option.label) + '</p>';
      //     return text;
      //   }
      // },
      { Property: 'Phone', Title: 'SĐT liên hệ', Type: DataType.String, DisableOrder: true },
      {
        Property: 'LinkTour', Title: 'Link tour', Type: DataType.String, DisableOrder: true,
        Click: (item: any) => {
          let url = item.LinkTour;
          window.open(url, "_blank");
        }
      },
      {
        Property: 'Status', Title: 'Trạng thái', Type: DataType.String, DisableOrder: true,
        Format: (item: any) => {
          item['StatusType'] = item.Status;
          let option = ConstantHelper.M3D_TOUR_STATUS_TYPE.find(c => c.value == item['StatusType']);
          let text = '<p class="' + (option && option.color) + '">' + (option && option.label) + '</p>';
          return text;
        }
      },
      {
        Property: 'CensorshipString', Title: 'Trạng thái kiểm duyệt', Type: DataType.String, DisableOrder: true,
        Format: (item: any) => {
          let option = ConstantHelper.M3D_CENSORSHIP_TYPE.find(c => c.value == item['Censorship']);
          let text = '<p>' + (option && option.label) + '</p>';
          return text;
        }
      },
      { Property: 'RejectReason', Title: 'Lý do từ chối', Type: DataType.String, DisableOrder: true },
      { Property: 'CreatedAt', Title: 'Ngày tạo', Type: DataType.DateTime, DisableOrder: true },
      { Property: 'CreatedBy', Title: 'Người tạo', Type: DataType.String, DisableOrder: true },
      { Property: 'UpdatedAt', Title: 'Ngày sửa', Type: DataType.DateTime, DisableOrder: true },
      { Property: 'UpdatedBy', Title: 'Người sửa', Type: DataType.String, DisableOrder: true },
    ]
    this.render(this.obj);
  }
  async lowTour(item: any) {
    if (item) {
      // let data = {
      //   "data": {
      //     "lowerTour": true
      //   },
      // }
      this.dialogService.ConfirmAsync('Có phải bạn muốn hạ tour không?', async () => {
        this.loading = true;
        await this.service.callApi('M3DTour', 'LowTour/' + item.Id, MethodType.Get).then((result: ResultApi) => {
          this.loading = false;
          if (ResultApi.IsSuccess(result)) {
            ToastrHelper.Success('Hạ tour thành công');
            this.loadItems();
          }
          else
            ToastrHelper.ErrorResult(result);
        });
      });
    }
  }

  // view(item: any) {
  //   let obj: NavigationStateData = {
  //     id: item._Id,
  //     object: item,
  //     viewer: true,
  //     prevData: this.itemData,
  //     prevUrl: '/admin/meey3d/tour',
  //   };
  //   this.router.navigate(['/admin/meey3d/tour/view'], { state: { params: JSON.stringify(obj) } });
  // }
  // edit(item: any) {
  //   let obj: NavigationStateData = {
  //     id: item._Id,
  //     object: item,
  //     prevData: this.itemData,
  //     prevUrl: '/admin/meey3d/tour',
  //   };
  //   this.router.navigate(['/admin/meey3d/tour/edit'], { state: { params: JSON.stringify(obj) } });
  // }
  edit(item: any) {
    this.dialogService.WapperAsync({
      cancelText: 'Đóng',
      title: 'Sửa Tour',
      size: ModalSizeType.Large,
      confirmText: 'Lưu thay đổi',
      objectExtra: { id: item.Id },
      object: EditTourComponent,
    }, () => this.loadItems());
  }

  view(item: any) {
    this.dialogService.WapperAsync({
      cancelText: '',
      title: 'Chi Tiết Tour',
      object: EditTourComponent,
      size: ModalSizeType.Large,
      objectExtra: {
        id: item.Id,
        viewer: true,
      },
    }, () => this.loadItems());
  }

  async delete(id: any) {
    if (id) {
      let data = {
        "removeTourAdmin": true
      };
      this.dialogService.Confirm('Có phải bạn muốn xóa dữ liệu tag này?', async () => {
        return await this.service.callApi('m3dtour', 'delete/' + id, data, MethodType.Delete).then(async (result: ResultApi) => {
          if (ResultApi.IsSuccess(result)) {
            ToastrHelper.Success('Xóa tour thành công');
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
      ToastrHelper.Error('Xóa tour không thành công');
      return false;
    }
  }

  loadComplete(): void {
    if (this.items && this.items.length > 0) {
      let pagesize = this.itemData.Paging?.Size || 20;
      let pageindex = this.itemData.Paging?.Index || 1;
      this.items.forEach((item: any, index) => {
        item.Index = (pagesize * (pageindex - 1)) + (index + 1);
      });
    }
  }
}
 