import { AppInjector } from '../../../../app.module';
import { Component, Input, OnInit } from '@angular/core';
import { MPOProjectService } from '../../project.service';
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { OptionItem } from '../../../../_core/domains/data/option.item';
import { MethodType } from '../../../../_core/domains/enums/method.type';
import { ConstantHelper } from '../../../../_core/helpers/constant.helper';
import { UtilityExHelper } from '../../../../_core/helpers/utility.helper';
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { AdminAuthService } from '../../../../_core/services/admin.auth.service';
import { AdminEventService } from '../../../../_core/services/admin.event.service';
import { AdminDialogService } from '../../../../_core/services/admin.dialog.service';
import { MPOProjectVideosEntity } from '../../../../_core/domains/entities/meeyproject/mpo.project.video.entity';

@Component({
  selector: 'mpo-video-detail',
  templateUrl: './video.detail.component.html',
  styleUrls: ['./video.detail.component.scss']
})
export class VideoDetailComponent extends EditComponent implements OnInit {
  @Input() params: any;

  source: string = '';
  viewer: boolean = false;
  itemProject: OptionItem;
  loading: boolean = false;
  authen: AdminAuthService;
  event: AdminEventService;
  isToggle: boolean = false;
  readonly: boolean = false;
  service: MPOProjectService;
  dialog: AdminDialogService;
  item: MPOProjectVideosEntity;
  notNeedCheckChange: boolean = false;

  constructor() {
    super();
    this.authen = AppInjector.get(AdminAuthService);
    this.event = AppInjector.get(AdminEventService);
    this.service = AppInjector.get(MPOProjectService);
    this.dialog = AppInjector.get(AdminDialogService);
  }

  async ngOnInit() {
    await this.loadItem();
  }

  async loadItem() {
    this.loading = true;
    let id = this.params && this.params['id'];
    this.viewer = this.params && this.params['viewer'];
    this.readonly = this.params && this.params['readonly'];
    if (id) {
      this.loading = true;
      await this.service.item('MPOProjectVideos/Item', id).then((result: ResultApi) => {
        if (ResultApi.IsSuccess(result)) {
          this.item = EntityHelper.createEntity(MPOProjectVideosEntity, result.Object);
          if (result.Object?.project?._id) {
            this.item.VideoProjectId = result.Object.project._id;
            this.itemProject = {
              label: result.Object?.project?.tradeName,
              value: this.item.VideoProjectId
            }
          }
          if (result.Object?.description) this.item.Description = result.Object.description;
          if(!result.Object?.isCensored || (result.Object?.isCensored && result.Object?.censoredType == 0)) this.isToggle = true;
        } else {
          ToastrHelper.ErrorResult(result);
        }
      });
      this.loading = false;
    }
  }

  async confirm() {
    let valid = await validation(this.item, ['VideoProjectId', 'Description']);
    if (valid) {
      // call api
      let data = {
        "updatedBy": {
          "data": {
            "_id": this.authen.account.Id,
            "fullname": this.authen.account.FullName
          },
          "source": 'admin'
        },
        "project": this.item.VideoProjectId,
        "description": this.item.Description,
      };
      if (this.item.Description) data["descriptionFormat"] = UtilityExHelper.innerTextHtml(this.item.Description);
      return await this.service.callApi('MPOProjectVideos', 'Update/' + this.item._id, data, MethodType.Post).then((result: ResultApi) => {
        if (ResultApi.IsSuccess(result)) {
          ToastrHelper.Success('Cập nhật thành công');
          this.dialog.HideAllDialog();
          this.event.RefreshVideosManager.emit({ reload: true });
          return true;
        }
        ToastrHelper.ErrorResult(result);
        return false;
      }, (e: any) => {
        ToastrHelper.Exception(e);
        return false;
      });
    };
  }

  censorshipChange() {
    let data = {
      'censoredType': this.item.Censorship,
      "updatedBy": {
        "data": {
          "_id": this.authen.account.Id,
          "fullname": this.authen.account.FullName
        },
        "source": 'admin'
      }
    }
    var helper = ConstantHelper.MPO_CENSORSHIP_CONFIRM_TYPES.find(c => c.value == this.item.Censorship);
    this.dialog.ConfirmAsync('Bạn có chắc chắn <span class="' + helper.color + '">' + helper.confirm + '</span> video này?', async () => {
      await this.service.callApi('MPOProjectVideos', 'Update/' + this.item._id, data, MethodType.Post).then((result: ResultApi) => {
        if (ResultApi.IsSuccess(result)) {
          ToastrHelper.Success('Kiểm duyệt video thành công');
          //this.loadItem();
          this.dialog.HideAllDialog();
          this.event.RefreshVideosManager.emit({ reload: true });
        } else
          ToastrHelper.ErrorResult(result);
      });
    }, null, 'Cảnh báo', 'Đồng ý');
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
        if (!item?.project?.isPublished) {
          this.notNeedCheckChange = true;
          ToastrHelper.Error('Không thể công khai video khi dự án chưa công khai');
          setTimeout(() => this.notNeedCheckChange = false, 1000);
          item.isPublished = false;
        } else {
          await this.service.callApi('MPOProjectVideos', 'Publish', data, MethodType.Post).then((result: ResultApi) => {
            if (ResultApi.IsSuccess(result)) {
              setTimeout(() => {
                this.dialog.Success('Công khai video thành công', 'Công khai');
                this.dialog.HideAllDialog();
                this.event.RefreshVideosManager.emit({ reload: true });
              }, 500);
            } else {
              this.notNeedCheckChange = true;
              ToastrHelper.ErrorResult(result);
              item.isPublished = published;
              setTimeout(() => this.notNeedCheckChange = false, 1000);
            }
          });
        }
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
              this.dialog.HideAllDialog();
              this.event.RefreshVideosManager.emit({ reload: true });
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
