import { Fancybox } from "@fancyapps/ui";
import { AppInjector } from "../../../../app.module";
import { Component, Input, OnInit } from '@angular/core';
import { MPOProjectService } from '../../project.service';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { ToastrHelper } from "../../../../_core/helpers/toastr.helper";
import { PagingData } from '../../../../_core/domains/data/paging.data';
import { MethodType } from "../../../../_core/domains/enums/method.type";
import { UtilityExHelper } from '../../../../_core/helpers/utility.helper';
import { VideoDetailComponent } from "../detail.video/video.detail.component";
import { ModalSizeType } from "../../../../_core/domains/enums/modal.size.type";
import { AdminAuthService } from "../../../../_core/services/admin.auth.service";
import { EditComponent } from "../../../../_core/components/edit/edit.component";
import { AdminEventService } from "../../../../_core/services/admin.event.service";
import { AdminDialogService } from "../../../../_core/services/admin.dialog.service";
import { MPOProjectVideosEntity } from '../../../../_core/domains/entities/meeyproject/mpo.project.video.entity';

@Component({
  selector: 'mpo-video-project-detail',
  templateUrl: './video.project.detail.component.html',
  styleUrls: ['./video.project.detail.component.scss']
})
export class VideoProjectDetailComponent extends EditComponent implements OnInit {
  @Input() params: any;

  item: any;
  type: string;
  viewer: boolean;
  isProduct: boolean;
  loading: boolean = false;
  videos: MPOProjectVideosEntity[];
  notNeedCheckChange: boolean = false;

  Search: string;
  Paging: PagingData;
  PageSizes: [50, 100];

  authen: AdminAuthService;
  event: AdminEventService;
  service: MPOProjectService;
  dialog: AdminDialogService;

  constructor() {
    super();
    this.authen = AppInjector.get(AdminAuthService);
    this.event = AppInjector.get(AdminEventService);
    this.service = AppInjector.get(MPOProjectService);
    this.dialog = AppInjector.get(AdminDialogService);
  }

  async ngOnInit() {
    this.Paging = {
      Index: 1,
      Size: 50
    }
    if (this.params && this.params['viewer'] != null)
      this.viewer = this.params && this.params['viewer'];
    else this.viewer = true;

    if (this.params && this.params['isProduct'] != null)
      this.isProduct = this.params && this.params['isProduct'];
    else this.isProduct = true;
    if (this.isProduct) this.viewer = true;

    if (this.params && this.params['type'] != null)
      this.type = this.params && this.params['type'];
    else this.type = 'admin';

    this.item = this.params && this.params['item'];
    if (this.item) {
      await this.loadItem();
    }

    Fancybox.bind('[data-fancybox="videos"]', {
      Thumbs: {
        Carousel: {
          fill: false,
          center: true,
        },
      },
    });
  }

  async loadItem() {
    this.loading = true;
    if (this.item.MeeyId) {
      await this.service.getItemVideosByCustomer(this.item.MeeyId, this.Paging, this.Search).then((result: ResultApi) => {
        if (ResultApi.IsSuccess(result)) {
          this.videos = EntityHelper.createEntities(MPOProjectVideosEntity, result.Object);
          if (result?.ObjectExtra?.Paging)
            this.Paging = result.ObjectExtra.Paging;
        }
      });
    } else if (this.item.ProjectMeeyId) {
      await this.service.getItemVideosByProject(this.item.ProjectMeeyId, this.Paging, this.Search, this.type).then((result: ResultApi) => {
        if (ResultApi.IsSuccess(result)) {
          this.videos = EntityHelper.createEntities(MPOProjectVideosEntity, result.Object);
          if (result?.ObjectExtra?.Paging)
            this.Paging = result.ObjectExtra.Paging;
        }
      });
    }
    setTimeout(() => {
      this.loading = false;
    }, 500);
  }

  pageChanged(page: PagingData) {
    this.Paging = page;
    this.loadItem();
  }

  getName(name) {
    return UtilityExHelper.shortcutString(name, 25);
  }

  edit(item: any) {
    this.dialogService.WapperAsync({
      title: item.title,
      cancelText: 'Đóng',
      confirmText: 'Lưu',
      object: VideoDetailComponent,
      size: ModalSizeType.ExtraLarge,
      objectExtra: { id: item._id, viewer: true },
    }, () => this.loadItem());
  }

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
        await this.service.callApi('MPOProjectVideos', 'Delete/' + item._id, data, MethodType.Delete).then((result: ResultApi) => {
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
}
