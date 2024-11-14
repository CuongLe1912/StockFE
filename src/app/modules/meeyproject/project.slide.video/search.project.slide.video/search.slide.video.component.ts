import { Component, Input, OnInit } from '@angular/core';
import { AppInjector } from '../../../../app.module';
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { PagingData } from '../../../../_core/domains/data/paging.data';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { AdminAuthService } from '../../../../_core/services/admin.auth.service';
import { AdminDialogService } from '../../../../_core/services/admin.dialog.service';
import { MPOProjectService } from '../../project.service';
import { UtilityExHelper } from '../../../../_core/helpers/utility.helper';
import { MPOProjectVideosEntity } from '../../../../_core/domains/entities/meeyproject/mpo.project.video.entity';
import { FilterData } from '../../../../_core/domains/data/filter.data';
import { ActionData } from '../../../../_core/domains/data/action.data';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { NavigationStateData } from '../../../../_core/domains/data/navigation.state';
import { VideoDetailComponent } from '../../project.video/detail.video/video.detail.component';
import { ModalSizeType } from '../../../../_core/domains/enums/modal.size.type';

@Component({
  selector: 'app-add.project.slide.video',
  templateUrl: './search.slide.video.component.html',
  styleUrls: ['./search.slide.video.component.scss']
})
export class SearchSlideVideoComponent extends EditComponent implements OnInit {
  @Input() listVideo: any;

  actions: ActionData[] = [];
  loading: boolean = false;
  processSearch: boolean = false;
  ids: string;

  Paging: PagingData;
  PageSizes: [50, 100];
  Search: string;
  IsLive: boolean = null;
  filters: FilterData[] = [];
  listCheckBox: any = [];

  messageEmpty = 'Hiện tại không có dữ liệu nào phù hợp';
  item: MPOProjectVideosEntity = new MPOProjectVideosEntity();
  videos: any[];

  service: MPOProjectService;
  dialog: AdminDialogService;
  authen: AdminAuthService;

  constructor() {
    super();
    this.service = AppInjector.get(MPOProjectService);
    this.dialog = AppInjector.get(AdminDialogService);
    this.authen = AppInjector.get(AdminAuthService);
  }

  async ngOnInit() {
    // this.ids = this.getParam('ids');
    this.breadcrumbs = [];
    this.breadcrumbs.push({
      Name: 'Tìm kiếm video'
    });
    this.Paging = {
      Index: 1,
      Size: 50,
    };
    await this.loadItem();
  }

  async loadItem() {
    this.loading = true;
    this.filters.push({ Name: "censoredType", Value: 0 });
    // if (this.ids) this.filters.push({ Name: "excludeIds", Value: this.ids });
    // await this.service.videoFeature().then((result: ResultApi) => {
    //   if (ResultApi.IsSuccess(result)) {
    //     const videos = result.Object;
    //     if (videos.length > 0) {
    //       this.filters.push({ Name: "excludeIds", Value: videos.map(c => { return c._id })});
    //     }
    //   }
    // });
    await this.service.getAllProjectVideos2(this.Paging, this.filters).then((result: ResultApi) => {
      if (ResultApi.IsSuccess(result)) {
        if (result.Object) {
          this.videos = result.Object;
          if (result?.ObjectExtra?.Paging)
            this.Paging = result.ObjectExtra.Paging;
        } else {
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
    this.filters.push({ Name: "censoredType", Value: 0 });
    if (this.item) {
      this.filters = [];
      if (this.item.Name) this.filters.push({ Name: "search", Value: this.item.Name });
      if (this.item.TypeUpload) this.filters.push({ Name: "typeUpload", Value: this.item.TypeUpload });
      if (this.item.FilterVideoProjectId) this.filters.push({ Name: "project", Value: this.item.FilterVideoProjectId });
      if (this.item.FilterCreatedBy) this.filters.push({ Name: "createdById", Value: this.item.FilterCreatedBy });
      if (this.item.FilterDateRange) this.filters.push({ Name: "endDate", Value: this.item.FilterDateRange[1] });
      if (this.item.FilterDateRange) this.filters.push({ Name: "startDate", Value: this.item.FilterDateRange[0] });
    }
    if (this.Search) {
      this.messageEmpty =
        "Hiện tại không có dữ liệu nào phù hợp cho từ khóa: " + this.Search;
    } else {
      this.messageEmpty = "Hiện tại không có dữ liệu nào phù hợp";
    }
    this.loadItem();
    this.loading = false;
    this.processSearch = false;
  }

  getName(name) {
    return UtilityExHelper.shortcutString(name, 25);
  }

  clearCustomFilter() {
    let filters = ['Name', 'FilterDateRange', 'FilterVideoProjectId', 'TypeUpload', 'FilterCreatedBy']
    filters.forEach(filter => {
      if (this.item[filter]) this.item[filter] = null;
    });
    this.search()
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
    }, () => this.loadItem());
  }

  getItem() {
    let addItem = this.videos.filter(c => c.Checked == true);
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
