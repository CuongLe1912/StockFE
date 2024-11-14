import { Subscription } from 'rxjs';
import { Component, Input, OnInit } from "@angular/core";
import { AlertVideoComponent } from "./alert/alert.component";
import { GridData } from '../../../_core/domains/data/grid.data';
import { DataType } from "../../../_core/domains/enums/data.type";
import { ResultApi } from "../../../_core/domains/data/result.api";
import { ToastrHelper } from "../../../_core/helpers/toastr.helper";
import { ActionData } from "../../../_core/domains/data/action.data";
import { MethodType } from "../../../_core/domains/enums/method.type";
import { VideoDetailComponent } from "./detail.video/video.detail.component";
import { ModalSizeType } from "../../../_core/domains/enums/modal.size.type";
import { GridComponent } from '../../../_core/components/grid/grid.component';
import { EditProjectVideoComponent } from "./edit/edit.project.video.component";
import { NavigationStateData } from "../../../_core/domains/data/navigation.state";
import MPOProjectVideoItemComponent from "./components/project.video.item.component";
import { ActionType, ControllerType } from "../../../_core/domains/enums/action.type";
import { MPOProjectVideosEntity } from "../../../_core/domains/entities/meeyproject/mpo.project.video.entity";

@Component({
  selector: 'mpo-video-project-grid',
  styleUrls: ["./project.video.component.scss"],
  templateUrl: '../../../_core/components/grid/grid.component.html',
})
export default class MPOProjectVideosGridComponent extends GridComponent implements OnInit {
  @Input() params: any;
  notNeedCheckChange: boolean;
  isSlide: boolean = false;
  productName: string = '';
  subscribeVideosManager: Subscription;
  obj: GridData = {
    Filters: [],
    Imports: [],
    Exports: [],
    Actions: [
      ActionData.edit((item: any) => this.edit(item)),
      {
        name: 'Công khai',
        icon: 'la la-upload',
        className: 'btn btn-warning',
        systemName: ActionType.Edit,
        controllerName: ControllerType.MPOProjectVideos,
        hidden: (item: any) => {
          //return !((item.censoredType == 2 && !item.isPublished) || (!item.isCensored && !item.isPublished));
          return !((!item.isCensored || (item.isCensored && item.censoredType == 0)) && !item.isPublished);
        },
        click: (item: any) => {
          this.publish(item);
        }
      },
      {
        name: 'Bỏ công khai',
        icon: 'la la-download',
        className: 'btn btn-warning',
        systemName: ActionType.Edit,
        controllerName: ControllerType.MPOProjectVideos,
        hidden: (item: any) => {
          return !(item.isPublished);
        },
        click: (item: any) => {
          this.unpublish(item);
        }
      },
      ActionData.delete((item: any) => this.delete(item)),
    ],
    Features: [
      {
        icon: 'la la-plus',
        name: 'Tải lên video',
        className: 'btn btn-primary',
        systemName: ActionType.AddNew,
        controllerName: ControllerType.MPOProjectVideos,
        click: () => {
          this.addNew();
        }
      },
      {
        hide: true,
        icon: 'la la-upload',
        toggleCheckbox: true,
        name: 'Công khai Video',
        className: 'btn btn-warning',
        systemName: ActionType.Edit,
        controllerName: ControllerType.MPOProjectVideos,
        click: () => {
          this.publishChecked();
        }
      },
      ActionData.reload(() => this.loadItems()),
    ],
    Checkable: true,
    UpdatedBy: false,
    DisableAutoLoad: true,
    NotKeepPrevData: true,
    Reference: MPOProjectVideosEntity,
    PageSizes: [10, 20, 30, 50, 100],
    ClassName: 'mpo-project-grid-video',
    SearchText: 'Tìm kiếm tên video...',
    ItemComponent: MPOProjectVideoItemComponent,
    CustomFilters: ['Name', 'Censored', 'TypeUpload', 'CensoredType', 'FilterCreatedBy', 'FilterDateRange', 'FilterVideoProjectId']
  };

  constructor() {
    super();
  }

  async ngOnInit() {
    // params
    const isSlide = this.router?.routerState?.snapshot?.root?.queryParams['slide'];
    if (isSlide) this.isSlide = isSlide;
    let ids = this.getParam('ids');
    let item = this.params && this.params['item'],
      type = (this.params && this.params['type']) || 'admin';
    this.properties = [
      {
        Property: 'name', Title: 'Tên', Type: DataType.String,
        HideCheckbox: (item: any) => {
          return !(item.censoredType == 0 && item.project?.isPublished && !item.isPublished);
        },
      }
    ];
    this.setPageSize(30);
    if (!this.subscribeVideosManager)
      this.subscribeVideosManager = this.event.RefreshVideosManager.subscribe(obj => {
        if (obj.reload) {
          this.loadItems();
        }
      });

    if (this.isSlide) {
      this.breadcrumbs.push({
        Name: 'Cấu hình hiển thị slide video',
        Link: '/admin/mpoproject/slide'
      });
      this.breadcrumbs.push({
        Name: 'Tìm kiếm video'
      });
      if (ids.length > 0) {
        this.obj.FilterData = [
          { Name: 'isPublished', Value: true },
          { Name: 'CensoredType', Value: 0 },
          { Name: 'excludeIds', Value: ids },
        ];
      } else {
        this.obj.FilterData = [
          { Name: 'isPublished', Value: true },
          { Name: 'CensoredType', Value: 0 },
        ]
      }
      this.obj.Features = [
        {
          icon: 'la la-plus',
          toggleCheckbox: true,
          name: 'Đưa vào danh sách',
          className: 'btn btn-success',
          systemName: ActionType.AddNew,
          controllerName: ControllerType.MPOProjectVideos,
          click: () => {
            this.getItem();
          }
        },
      ];
      this.obj.Actions = [
        ActionData.view((item: any) => this.view(item)),
      ];
      this.setPageSize(30);
      this.obj.CustomFilters = ['Name', 'FilterDateRange', 'FilterVideoProjectId', 'TypeUpload', 'FilterCreatedBy'];
      this.obj.Url = '/admin/MPOProjectVideos/Items'
      this.properties = [
        {
          Property: 'name', Title: 'Tên', Type: DataType.String,
        }
      ];
    }

    console.log(item);
    if (item) {
      this.obj.IsPopup = true;
      this.obj.Checkable = false;
      this.obj.HideHeadActions = true;
      this.obj.NotKeepPrevData = true;
      this.obj.HideCustomFilter = true;
      if (item.MeeyId) {
        this.obj.Url = '/admin/MPOCustomer/VideoItems/' + item.MeeyId;
      } else if (item.ProjectMeeyId) {
        this.obj.Url = '/admin/MPOProject/VideoItems/' + item.ProjectMeeyId + '?type=' + type;
      } else {
        this.obj.Url = '/admin/MPOProject/VideoItems/0?type=' + type;
      }
    } else {
      this.obj.Url = '/admin/MPOProjectVideos/Items';
    }
    await this.render(this.obj);
  }

  addNew() {
    this.dialogService.WapperAsync({
      cancelText: 'Đóng',
      confirmText: 'Tải lên',
      size: ModalSizeType.Large,
      title: 'Thêm mới Video dự án',
      className: 'modal-body-project',
      object: EditProjectVideoComponent,
    }, async (item: any) => {
      if (item && typeof (item) == 'string') {
        let url = item;
        setTimeout(() => {
          this.dialogService.WapperAsync({
            cancelText: '',
            confirmText: 'OK',
            title: 'Thành công',
            objectExtra: {
              url: url
            },
            size: ModalSizeType.Medium,
            object: AlertVideoComponent,
          });
        });
        this.loadItems();
      }
    });
  }

  edit(item: any) {
    this.dialogService.WapperAsync({
      title: item.title,
      cancelText: 'Đóng',
      confirmText: 'Lưu',
      object: VideoDetailComponent,
      size: ModalSizeType.ExtraLarge,
      objectExtra: { id: item._id },
    }, () => this.loadItems());
  }

  view(item: any) {
    this.dialogService.WapperAsync({
      title: item.title,
      cancelText: 'Đóng',
      object: VideoDetailComponent,
      size: ModalSizeType.ExtraLarge,
      objectExtra: {
        id: item._id,
        readonly: true,
      },
    });
  }

  publishChecked() {
    let items = this.items.filter(c => c.Checked).map((c: any) => c._id);
    if (items.length > 0) {
      let data = {
        "videoPublished": items,
        "updatedBy": {
          "data": {
            "_id": this.authen.account.Id,
            "fullname": this.authen.account.FullName
          },
          "source": 'admin'
        }
      };
      this.dialogService.ConfirmAsync('Có phải bạn muốn công khai ' + items.length + ' video.', async () => {
        await this.service.callApi('MPOProjectVideos', 'Publish', data, MethodType.Post).then((result: ResultApi) => {
          if (ResultApi.IsSuccess(result)) {
            this.loadItems();
            setTimeout(() => {
              this.dialogService.Success('Công khai video thành công', 'Công khai');
            }, 500);
          } else {
            ToastrHelper.ErrorResult(result);
          }
        });
      }, null, 'Công khai', 'Xác nhận');
    } else {
      ToastrHelper.Error('Chưa có video nào được chọn');
    }
  }

  unpublish(item: any) {
    let published = !item.isPublished;
    let id = item._id;
    if (id) {
      let data = {
        "updatedBy": {
          "data": {
            "_id": this.authen.account.Id,
            "fullname": this.authen.account.FullName
          },
          "source": 'admin'
        }
      };
      this.dialogService.ConfirmAsync('Bạn có chắc chắn muốn bỏ trạng thái công khai của video: <b>' + item.title + '</b>', async () => {
        await this.service.callApi('MPOProjectVideos', 'Unpublish/' + id, data, MethodType.Post).then((result: ResultApi) => {
          if (ResultApi.IsSuccess(result)) {
            this.loadItems();
            setTimeout(() => {
              this.dialogService.Success('Bỏ công khai video thành công', 'Thông báo');
            }, 500);
          } else {
            this.notNeedCheckChange = true;
            ToastrHelper.ErrorResult(result);
            item.isPublished = true;
            setTimeout(() => this.notNeedCheckChange = false, 1000);
          }
        });
      }, () => {
        this.notNeedCheckChange = true;
        item.isPublished = true;
        setTimeout(() => this.notNeedCheckChange = false, 1000);
      }, 'Bỏ công khai', 'Xác nhận');
    } else {
      this.notNeedCheckChange = true;
      item.isPublished = true;
      setTimeout(() => this.notNeedCheckChange = false, 1000);
    }
  }

  async delete(item: any) {
    if (item) {
      let data = {
        "deletedBy": {
          "data": {
            "_id": this.authen.account.Id,
            "fullname": this.authen.account.FullName
          },
          "source": 'admin'
        }
      }
      this.dialogService.ConfirmAsync('Có phải bạn muốn xóa video này?', async () => {
        this.loading = true;
        await this.service.callApi('MPOProjectVideos', 'Delete/' + item._id, data, MethodType.Post).then((result: ResultApi) => {
          this.loading = false;
          if (ResultApi.IsSuccess(result)) {
            ToastrHelper.Success('Xóa video thành công');
            this.loadItems();
          }
          else
            ToastrHelper.ErrorResult(result);
        });
      });
    }
  }

  async publish(item: any) {
    let id = item._id;
    if (id) {
      let data = {
        "videoPublished": [id],
        "updatedBy": {
          "data": {
            "_id": this.authen.account.Id,
            "fullname": this.authen.account.FullName
          },
          "source": 'admin'
        }
      };
      this.dialogService.ConfirmAsync('Có phải bạn muốn Công khai video: <b>' + item.title + '</b>', async () => {
        if (!item?.project?.isPublished) {
          this.notNeedCheckChange = true;
          ToastrHelper.Error('Không thể công khai video khi dự án chưa công khai');
          setTimeout(() => this.notNeedCheckChange = false, 1000);
          item.isPublished = false;
        } else
          await this.service.callApi('MPOProjectVideos', 'Publish', data, MethodType.Post).then((result: ResultApi) => {
            if (ResultApi.IsSuccess(result)) {
              this.loadItems();
              setTimeout(() => {
                this.dialogService.Success('Công khai video thành công', 'Công khai');
              }, 500);
            } else {
              this.notNeedCheckChange = true;
              ToastrHelper.ErrorResult(result);
              setTimeout(() => this.notNeedCheckChange = false, 1000);
              item.isPublished = false;
            }
          });
      }, () => {
        this.notNeedCheckChange = true;
        setTimeout(() => this.notNeedCheckChange = false, 1000);
        item.isPublished = false;
      }, 'Công khai', 'Xác nhận');
    } else {
      this.notNeedCheckChange = true;
      setTimeout(() => this.notNeedCheckChange = false, 1000);
      item.isPublished = false;
    }
  }
  async getItem() {
    //let addItem = this.videos.filter(c => c.Checked == true);
    let addItem = this.items.filter(c => c.Checked)
    if (addItem.length) {
      let obj: NavigationStateData = {
        object: {
          listItem: addItem
        },
      };
      this.router.navigate(['/admin/mpoproject/slide'], { state: { params: JSON.stringify(obj) } });

    } else
      ToastrHelper.Error('Bạn chưa chọn video nào');
  }
}
