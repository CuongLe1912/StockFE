import { Subscription } from 'rxjs';
import { Fancybox } from "@fancyapps/ui";
import { AppInjector } from "../../../app.module";
import { MPOProjectService } from "../project.service";
import { Component, Input, OnInit } from "@angular/core";
import { AlertVideoComponent } from "./alert/alert.component";
import { ResultApi } from "../../../_core/domains/data/result.api";
import { EntityHelper } from "../../../_core/helpers/entity.helper";
import { ToastrHelper } from "../../../_core/helpers/toastr.helper";
import { ActionData } from "../../../_core/domains/data/action.data";
import { PagingData } from "../../../_core/domains/data/paging.data";
import { FilterData } from "../../../_core/domains/data/filter.data";
import { ActionType } from "../../../_core/domains/enums/action.type";
import { ResultType } from "../../../_core/domains/enums/result.type";
import { MethodType } from "../../../_core/domains/enums/method.type";
import { UtilityExHelper } from "../../../_core/helpers/utility.helper";
import { VideoDetailComponent } from "./detail.video/video.detail.component";
import { ModalSizeType } from "../../../_core/domains/enums/modal.size.type";
import { AdminAuthService } from "../../../_core/services/admin.auth.service";
import { EditComponent } from "../../../_core/components/edit/edit.component";
import { EditProjectVideoComponent } from "./edit/edit.project.video.component";
import { AdminEventService } from '../../../_core/services/admin.event.service';
import { AdminDialogService } from "../../../_core/services/admin.dialog.service";
import { MPOProjectVideosEntity } from "../../../_core/domains/entities/meeyproject/mpo.project.video.entity";

@Component({
  selector: "app-project.videos",
  templateUrl: "./project.video.component.html",
  styleUrls: ["./project.video.component.scss"],
})
export default class MPOProjectVideosComponent extends EditComponent implements OnInit {
  @Input() params: any;

  loading: boolean = false;
  event: AdminEventService;
  actions: ActionData[] = [];
  allowStop: boolean = false;
  allowDelete: boolean = false;
  processSearch: boolean = false;
  notNeedCheckChange: boolean = false;
  subscribeVideosManager: Subscription;

  Search: string;
  Paging: PagingData;
  PageSizes: [50, 100];
  IsLive: boolean = null;
  checkAll: boolean = false;
  filters: FilterData[] = [];
  windowWidth = window.innerWidth;

  messageEmpty = 'Hiện tại không có dữ liệu nào phù hợp';

  videos: MPOProjectVideosEntity[];
  item: MPOProjectVideosEntity = new MPOProjectVideosEntity();
  objFilter: MPOProjectVideosEntity = new MPOProjectVideosEntity();
  objFilter2: MPOProjectVideosEntity = new MPOProjectVideosEntity();

  authen: AdminAuthService;
  service: MPOProjectService;
  dialog: AdminDialogService;

  constructor() {
    super();
    this.authen = AppInjector.get(AdminAuthService);
    this.service = AppInjector.get(MPOProjectService);
    this.dialog = AppInjector.get(AdminDialogService);
    this.event = AppInjector.get(AdminEventService);
  }

  ngOnDestroy() {
    if (this.subscribeVideosManager) {
      this.subscribeVideosManager.unsubscribe();
      this.subscribeVideosManager = null;
    }
  }

  async ngOnInit() {
    this.Paging = {
      Index: 1,
      Size: 30,
    };

    this.allowStop = await this.authen.permissionAllow('MPOProjectVideos', ActionType.Stop);
    this.allowDelete = await this.authen.permissionAllow('MPOProjectVideos', ActionType.Delete);

    // subscribe refreshItems
    // if (!this.subscribeVideosManager)
    //   this.subscribeVideosManager = this.event.RefreshVideosManager.subscribe(obj => {
    //     if (obj.reload) {
    //       this.loadItem();
    //     }
    //   });

    await this.loadItem();
  }

  async loadItem() {
    this.loading = true;
    this.checkAll = false;
    await this.service.getAllProjectVideos2(this.Paging, this.filters).then((result: ResultApi) => {
      if (ResultApi.IsSuccess(result)) {
        if (result.Object) {
          this.videos = EntityHelper.createEntities(MPOProjectVideosEntity, result.Object);
          if (result?.ObjectExtra?.Paging)
            this.Paging = result.ObjectExtra.Paging;
        } else {
          //ToastrHelper.ErrorResult(result);
          this.videos = [];
          this.Paging = new PagingData();
        }
      }
    });
    setTimeout(() => {
      this.loading = false;
    }, 500);
  }

  pageChanged(page: PagingData) {
    this.Paging = page;
    this.loadItem();
  }

  async search() {
    this.loading = true;
    this.processSearch = true;
    if (this.item) {
      this.filters = [];
      if (this.item.Name) this.filters.push({ Name: "search", Value: this.item.Name });
      if (this.item.Censored) this.filters.push({ Name: "censored", Value: this.item.Censored });
      if (this.item.TypeUpload) this.filters.push({ Name: "typeUpload", Value: this.item.TypeUpload });
      if (this.item.CensoredType) this.filters.push({ Name: "censoredType", Value: this.item.CensoredType });
      if (this.item.FilterCreatedBy) this.filters.push({ Name: "createdById", Value: this.item.FilterCreatedBy });
      if (this.item.FilterDateRange) this.filters.push({ Name: "endDate", Value: this.item.FilterDateRange[1] });
      if (this.item.FilterDateRange) this.filters.push({ Name: "startDate", Value: this.item.FilterDateRange[0] });
      if (this.item.FilterVideoProjectId) this.filters.push({ Name: "project", Value: this.item.FilterVideoProjectId });
    }
    if (this.Search) {
      this.messageEmpty =
        "Hiện tại không có dữ liệu nào phù hợp cho từ khóa: " + this.Search;
    } else {
      this.messageEmpty = "Hiện tại không có dữ liệu nào phù hợp";
    }
    setTimeout(() => {
      this.loadItem();
      this.loading = false;
      this.processSearch = false;
    });
  }

  // clear() {
  //   if (!this.item.SearchVideo) {
  //     this.search();
  //   }
  // }

  // clearStatus() {
  //   if (this.item.IsLive == null) {
  //     this.search();
  //   }
  // }

  async remove(item) {
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
      this.loading = true;
      await this.dialog.ConfirmAsync('Có phải bạn muốn xóa video này?', async () => {
        await this.service.callApi('MPOProjectVideos', 'Delete/' + item._id, data, MethodType.Post).then((result: ResultApi) => {
          if (ResultApi.IsSuccess(result)) {
            ToastrHelper.Success('Xóa video thành công');
            this.loadItem();
          } else
            ToastrHelper.ErrorResult(result);
        });
      });

      this.loading = false;
    }
  }

  async stop(item) {
    if (item) {
      this.loading = true;
      await this.dialog.ConfirmAsync('Có phải bạn muốn dừng livestream video này?', async () => {
        await this.service.stopVideo(item._id).then((result: ResultApi) => {
          if (result && result.Type == ResultType.Success) {
            ToastrHelper.Success('Dừng livestream  thành công');
            this.loadItem();
          } else ToastrHelper.ErrorResult(result);
        });
      });

      this.loading = false;
    }
  }

  getName(name) {
    return UtilityExHelper.shortcutString(name, 25);
  }

  clearCustomFilter() {
    this.filters = [];
    let filters = ['Name', 'FilterDateRange', 'Censored', 'CensoredType', 'FilterVideoProjectId', 'TypeUpload', 'FilterCreatedBy']
    filters.forEach(filter => {
      if (this.item[filter]) this.item[filter] = null;
    });
    this.search()
  }

  addNewVideo() {
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
        this.loadItem();
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
    }, () => this.loadItem());
  }

  async publish(isPublished: boolean, item: any) {
    let published = !isPublished;
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
      this.dialog.ConfirmAsync('Có phải bạn muốn Công khai video: <b>' + item.title + '</b>', async () => {
        await this.service.callApi('MPOProjectVideos', 'Publish', data, MethodType.Post).then((result: ResultApi) => {
          if (ResultApi.IsSuccess(result)) {
            setTimeout(() => {
              this.dialog.Success('Công khai video thành công', 'Công khai');
            }, 500);
          } else {
            this.notNeedCheckChange = true;
            ToastrHelper.ErrorResult(result);
            item.isPublished = published;
            setTimeout(() => this.notNeedCheckChange = false, 1000);
          }
        });
      }, () => {
        this.notNeedCheckChange = true;
        item.isPublished = published;
        setTimeout(() => this.notNeedCheckChange = false, 1000);
      }, 'Công khai', 'Xác nhận');
    } else {
      this.notNeedCheckChange = true;
      item.isPublished = published;
      setTimeout(() => this.notNeedCheckChange = false, 1000);
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
      this.dialog.ConfirmAsync('Bạn có chắc chắn muốn bỏ trạng thái công khai của video: <b>' + item.title + '</b>', async () => {
        await this.service.callApi('MPOProjectVideos', 'Unpublish/' + id, data, MethodType.Post).then((result: ResultApi) => {
          if (ResultApi.IsSuccess(result)) {
            setTimeout(() => {
              this.dialog.Success('Bỏ công khai video thành công', 'Thông báo');
            }, 500);
          } else {
            this.notNeedCheckChange = true;
            ToastrHelper.ErrorResult(result);
            item.isPublished = published;
            setTimeout(() => this.notNeedCheckChange = false, 1000);
          }
        });
      }, () => {
        this.notNeedCheckChange = true;
        item.isPublished = published;
        setTimeout(() => this.notNeedCheckChange = false, 1000);
      }, 'Bỏ công khai', 'Xác nhận');
    } else {
      this.notNeedCheckChange = true;
      item.isPublished = published;
      setTimeout(() => this.notNeedCheckChange = false, 1000);
    }
  }

  publishChecked() {
    let items = this.videos.filter(c => c.Checked).map(c => c._id);
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
      this.dialog.ConfirmAsync('Có phải bạn muốn công khai ' + items.length + ' video.', async () => {
        await this.service.callApi('MPOProjectVideos', 'Publish', data, MethodType.Post).then((result: ResultApi) => {
          if (ResultApi.IsSuccess(result)) {
            this.loadItem();
            setTimeout(() => {
              this.dialog.Success('Công khai video thành công', 'Công khai');
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

  checkAllChange() {
    if (this.videos && this.videos.length > 0) {
      this.videos.forEach((item: any) => {
        if (item.censoredType == 0 && item.project.isPublished && !item.isPublished)
          item.Checked = this.checkAll;
      });
    }
  }
}
