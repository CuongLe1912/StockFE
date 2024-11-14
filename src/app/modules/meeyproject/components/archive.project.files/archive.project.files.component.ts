declare var $;
import * as _ from 'lodash';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { UtilityExHelper } from '../../../../_core/helpers/utility.helper';
import { MPOProjectItemEntity } from '../../../../_core/domains/entities/meeyproject/mpo.project.entity';
import { AdminDialogService } from '../../../../_core/services/admin.dialog.service';
import { MPOProjectService } from '../../project.service';
import { PagingData } from '../../../../_core/domains/data/paging.data';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { EditorComponent } from '../../../../_core/editor/editor.component';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { MethodType } from '../../../../_core/domains/enums/method.type';
import { TableData } from '../../../../_core/domains/data/table.data';


@Component({
  selector: 'mpo-archive-project-files',
  templateUrl: './archive.project.files.component.html',
  styleUrls: ['./archive.project.files.component.scss']
})
export class MPOArchiveProjectFileComponent implements OnInit {
  @ViewChild('uploadFiles') uploadFiles: EditorComponent;

  @Input() params: any;
  @Input() loading: boolean = false;

  processSearch: boolean = false;
  viewer: boolean;
  multiple: boolean;
  files: any[];
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
  }

  async loadItem() {
    this.loading = true;
    this.processSearch = true;
    let itemData: TableData = new TableData();
    itemData.Paging = this.Paging;
    itemData.Search = this.Search;
    await this.service.callApi('mpoproject', 'Files/' + this.projectMeeyId, itemData, MethodType.Post).then((result: ResultApi) => {
      if (ResultApi.IsSuccess(result)) {
        this.files = result.Object;
        if (this.files && this.files.length > 0) this.files.map(c => c.extension = c.name.split('.').pop());
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
        this.files.map(c => c.active = false);
        item.active = !item.active;
        this.selectedFile = [];
        if (item.active) {
          this.selectedFile.push(item);
        }
      }

      item.showAction = false;
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

  async searchFile() {
    if (this.Search) {
      this.messageEmpty = 'Hiện tại không có dữ liệu nào phù hợp cho từ khóa: ' + this.Search;
    } else {
      this.messageEmpty = 'Hiện tại không có dữ liệu nào phù hợp';
    }
    this.loadItem();
  }

  clearSeach() {
    this.Search = null;
    this.searchFile();
  }

  getName(name) {
    return UtilityExHelper.shortcutString(name, 18);
  }

  toggleActiveUpload() {
    this.activeUpload = !this.activeUpload;
  }

  copyLink(item) {
    UtilityExHelper.copyString(item.url);
    ToastrHelper.Success('Sao chép đường dẫn thành công');
    item.showAction = false;
  }

  downloadFile(item) {
    let link = document.createElement("a");
    link.href = item.url;
    link.target = '_blank';
    link.download = item.name;
    document.body.appendChild(link);

    link.click();
    document.body.removeChild(link);
    item.showAction = false;
  }

  async upload() {
    if (this.item) {
      let item: MPOProjectItemEntity = _.cloneDeep(this.item);
      if (this.item.Files) {
        let files = await this.uploadFiles.upload();
        item.Files = files.filter(c => c.ResultUpload)
          .map(c => c.ResultUpload.files && Array.isArray(c.ResultUpload.files) ? c.ResultUpload.files[0] : c.ResultUpload)
          .map(c => {
            return {
              s3Key: c.s3Key
            }
          });
        return await this.service.uploadItemFiles(this.projectMeeyId, item).then((result: ResultApi) => {
          if (ResultApi.IsSuccess(result)) {
            ToastrHelper.Success('Tải tài liệu lên thành công');
            this.item.Files = null;
            this.loadItem();
            this.activeUpload = false;
          } else {
            ToastrHelper.ErrorResult(result);
          }
        });
      }
    }
  }

}
