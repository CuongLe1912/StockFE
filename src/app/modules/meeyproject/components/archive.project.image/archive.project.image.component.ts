declare var $;
import * as _ from 'lodash';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Fancybox } from "@fancyapps/ui";
import { UtilityExHelper } from '../../../../_core/helpers/utility.helper';
import { MPOProjectItemEntity } from '../../../../_core/domains/entities/meeyproject/mpo.project.entity';
import { AdminDialogService } from '../../../../_core/services/admin.dialog.service';
import { MPOProjectService } from '../../project.service';
import { PagingData } from '../../../../_core/domains/data/paging.data';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { EditorComponent } from '../../../../_core/editor/editor.component';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';


@Component({
  selector: 'mpo-archive-project-image',
  templateUrl: './archive.project.image.component.html',
  styleUrls: ['./archive.project.image.component.scss']
})
export class MPOArchiveProjectImageComponent implements OnInit {
  @ViewChild('uploadImages') uploadImages: EditorComponent;

  @Input() params: any;
  @Input() loading: boolean = false;

  processSearch: boolean = false;
  viewer: boolean;
  multiple: boolean;
  images: any[];
  selectedFile: any[] = [];
  projectMeeyId: any;
  item: MPOProjectItemEntity = new MPOProjectItemEntity();

  messageEmpty = 'Hiện tại không có dữ liệu nào phù hợp';
  currentTitle: string = '';
  Paging: PagingData;
  PageSizes: [50, 100];
  Search: string;
  activeUpload: boolean = false;

  constructor(private dialog: AdminDialogService, private service: MPOProjectService) { }

  async ngOnInit() {
    this.Paging = {
      Index: 1,
      Size: 50
    }
    if (this.params && this.params['viewer'] != null)
      this.viewer = this.params && this.params['viewer'];
    else this.viewer = true;

    if (this.params && this.params['multiple'] != null)
      this.multiple = this.params && this.params['multiple'];
    else this.multiple = false;

    this.projectMeeyId = this.params && this.params['ProjectMeeyId'];
    if (this.projectMeeyId) {
      await this.loadItem();
    }
    Fancybox.bind('[data-fancybox="archive"]', {
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
    this.processSearch = true;
    await this.service.getItemImages(this.projectMeeyId, this.Paging.Index, this.Paging.Size, this.Search).then((result: ResultApi) => {
      if (ResultApi.IsSuccess(result)) {
        this.images = result.Object;
        if (result?.ObjectExtra?.Paging)
          this.Paging = result.ObjectExtra.Paging;
      }
    });
    setTimeout(() => {
      this.loading = false;
      this.processSearch = false;
    }, 500);
  }

  selectFile(item) {
    if (item) {
      item.active = !item.active;
      if (this.multiple) {
        if (item.active) {
          this.selectedFile.push(item);
        } else {
          _.remove(this.selectedFile, function (c) {
            return c._id === item._id;
          });
        }
      } else {
        this.images.map(c => c.active = false);
        item.active = !item.active;
        this.selectedFile = [];
        if (item.active) {
          this.selectedFile.push(item);
        }
      }
    }
  }

  public async confirm(): Promise<any> {
    if (this.selectedFile && this.selectedFile.length > 0) {
      setTimeout(() => {
        this.dialog.HideAllDialog();
      }, 500);
      return this.selectedFile.map(c => { c.name = c.title; return c; });
    }
    return null;
  }

  pageChanged(page: PagingData) {
    this.Paging = page;
    this.loadItem();
  }

  async searchImg() {
    if (this.Search) {
      this.messageEmpty = 'Hiện tại không có dữ liệu nào phù hợp cho từ khóa: ' + this.Search;
    } else {
      this.messageEmpty = 'Hiện tại không có dữ liệu nào phù hợp';
    }
    this.loadItem();
  }

  clearSeach() {
    this.Search = null;
    this.searchImg();
  }

  removeImg(item) {

  }

  updateImg(item) {

  }

  changeName(item) {
    item.edit = !item?.edit;
    if (item.edit) {
      this.currentTitle = _.cloneDeep(item.title);
      setTimeout(() => {
        let id = '#' + item._id;
        let img = $(id) as HTMLElement;
        img.focus();
      }, 300);
    } else {
      item.title = item.title.trim().replace(/\s\s+/g, ' ');
      if (this.currentTitle != item.title) {
        this.updateImg(item);
      }
    }
  }

  eventListener(event, item) {
    if (event.key === "Enter") {
      this.changeName(item);
    }
  }

  validInput(event) {
    let valid = /[\\/:*?"<>|]/i.test(event.key);
    return !valid;
  }

  getName(name) {
    return UtilityExHelper.shortcutString(name, 18);
  }

  toggleActiveUpload() {
    this.activeUpload = !this.activeUpload;
  }

  async uploadFiles() {
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
        await this.service.uploadItemImages(this.projectMeeyId, item).then((result: ResultApi) => {
          if (ResultApi.IsSuccess(result)) {
            ToastrHelper.Success('Tải ảnh lên thành công');
            this.item.Images = null;
            this.loadItem();
            this.activeUpload = false;
          } else {
            ToastrHelper.ErrorResult(result);
          }
        })
      }
    }
  }

}
