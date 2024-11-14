import * as _ from 'lodash';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MPOProjectItemEntity } from '../../../../_core/domains/entities/meeyproject/mpo.project.entity';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { AdminDialogService } from '../../../../_core/services/admin.dialog.service';
import { AppInjector } from '../../../../app.module';
import { MPOProjectService } from '../../project.service';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { EditorComponent } from '../../../../_core/editor/editor.component';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { ResultType } from '../../../../_core/domains/enums/result.type';
import { PagingData } from '../../../../_core/domains/data/paging.data';

@Component({
  selector: 'mpo-project-image',
  templateUrl: './project.image.component.html',
  styleUrls: ['./project.image.component.scss']
})
export class MPOProjectImageComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('uploadImages') uploadImages: EditorComponent;
  @Input() params: any;

  viewer: boolean;
  isProduct: boolean;
  item: MPOProjectItemEntity = new MPOProjectItemEntity();

  PageSizes: [50, 100];
  Paging: PagingData;
  Search: string;
  messageEmpty = 'Hiện tại không có dữ liệu nào phù hợp';

  images = [];

  isRenderImages: boolean = false;
  loading: boolean = false;
  processSearch: boolean = false;
  service: MPOProjectService;
  dialog: AdminDialogService;

  constructor() {
    this.service = AppInjector.get(MPOProjectService);
    this.dialog = AppInjector.get(AdminDialogService);
  }

  ngOnInit() {
    if (this.params && this.params['viewer'] != null)
      this.viewer = this.params && this.params['viewer'];
    else this.viewer = false;
    if (this.params && this.params['isProduct'] != null)
      this.isProduct = this.params && this.params['isProduct'];
    else this.isProduct = false;
    if (this.isProduct) this.viewer = true;
    if (this.params && this.params['item']) {
      let item = this.params && this.params['item'];
      if (item) {
        let cloneItem = _.cloneDeep(item);
        this.item = EntityHelper.createEntity(MPOProjectItemEntity, cloneItem);
        this.item.Images = null;
      }
    }

    this.Paging = {
      Index: 1,
      Size: 50
    }

    this.loadItems();
  }

  async loadItems() {
    this.isRenderImages = true;
    this.loading = true;
    await this.service.getItemImages(this.item.ProjectMeeyId, this.Paging.Index, this.Paging.Size, this.Search).then((result: ResultApi) => {
      if (ResultApi.IsSuccess(result)) {
        this.images = result.Object;
        if (result?.ObjectExtra?.Paging)
          this.Paging = result.ObjectExtra.Paging;
      }
    });
    this.loading = false
    setTimeout(() => {
      this.isRenderImages = false;
    }, 300);
  }

  pageChanged(page: PagingData) {
    this.Paging = page;
    this.loadItems();
  }

  public async confirm(): Promise<boolean> {
    if (this.item) {
      let item: MPOProjectItemEntity = _.cloneDeep(this.item);
      if (this.item.Images) {
        let images = await this.uploadImages.upload();
        item.Images = images.filter(c => c.ResultUpload)
          .map(c => c.ResultUpload.images && Array.isArray(c.ResultUpload.images) ? c.ResultUpload.images[0] : c.ResultUpload)
          .map(c => {
            return {
              s3Key: c.s3Key
            }
          });
        return await this.service.uploadItemImages(this.item.ProjectMeeyId, item).then((result: ResultApi) => {
          if (ResultApi.IsSuccess(result)) {
            ToastrHelper.Success('Tải ảnh lên thành công');
            return true;
          } else {
            ToastrHelper.ErrorResult(result);
            return false;
          }
        }, () => {
          return false;
        });
      } else return true;
    }
    return false;
  }

  async removeImg(item) {
    if (item) {
      this.loading = true;
      await this.service.deleteItemImages(this.item.ProjectMeeyId, item._id).then((result: ResultApi) => {
        if (result && result.Type == ResultType.Success) {
          ToastrHelper.Success('Xóa ảnh thành công');
          // this.images = _.remove(this.images, c => c._id == item._id);
          this.loadItems();
        } else ToastrHelper.ErrorResult(result);
      });
      this.loading = false;
    }
  }

  async updateImg(item) {
    if (item) {
      this.loading = true;
      await this.service.updateItemImages(this.item.ProjectMeeyId, item).then((result: ResultApi) => {
        if (result && result.Type == ResultType.Success) {
          ToastrHelper.Success('Cập nhật ảnh thành công');
          this.loadItems();
        } else ToastrHelper.ErrorResult(result);
      });
      this.loading = false;
    }
  }

  async searchImg() {
    this.loading = true;
    this.processSearch = true;
    this.Search = this.item.SearchImage;
    if (this.Search) {
      this.messageEmpty = 'Hiện tại không có dữ liệu nào phù hợp cho từ khóa: ' + this.Search;
    } else {
      this.messageEmpty = 'Hiện tại không có dữ liệu nào phù hợp';
    }
    this.loadItems();
    setTimeout(() => {
      this.loading = false;
      this.processSearch = false;
    }, 500);
  }

  clear() {
    if (!this.item.SearchImage) {
      this.searchImg();
    }
  }

  eventKeySearch(event) {
    if (event.key === "Enter") {
      this.searchImg();
    }
  }
}
