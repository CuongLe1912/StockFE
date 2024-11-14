import { Component, OnInit } from '@angular/core';
import { AppConfig } from '../../../_core/helpers/app.config';
import { GridData } from '../../../_core/domains/data/grid.data';
import { MRVProject_Statistic, MeeyReviewProjectEntity } from '../../../_core/domains/entities/meeyreview/mrv.project.entity';
import { DataType } from '../../../_core/domains/enums/data.type';
import { ActionData } from '../../../_core/domains/data/action.data';
import { ActionType } from '../../../_core/domains/enums/action.type';
import { ModalSizeType } from '../../../_core/domains/enums/modal.size.type';
import { ViewProjectComponent } from './view.project/view.project.component';
import { GridComponent } from '../../../_core/components/grid/grid.component';
import { NavigationStateData } from '../../../_core/domains/data/navigation.state';

import { SeedingComponent } from '../seeding/seeding.component';
import { ExportStatisticMRVProjectComponent } from './export.statistic/export.statistic.component';
@Component({
  templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class MRVProjectComponent extends GridComponent implements OnInit {
  obj: GridData = {
    Imports: [],
    Exports: [],
    Filters: [],
    Actions: [
      {
        icon: 'la la-comment',
        name: ActionType.MRVSeeding,
        className: 'btn btn-success',
        systemName: ActionType.MRVSeeding,
        click: (item: any) => {
          this.fastSeeding(item);
        }
      },
      ActionData.view((item: any) => this.view(item))
    ],
    Features: [
      {
        name: "Xuất dữ liệu",
        icon: "la la-download",
        className: 'btn btn-success',
        systemName: ActionType.Export,
        click: () => {
          // if (this.itemData?.Paging?.Total > 10000) {
          //   this.dialogService.Alert('Thông báo', 'File export tối đa 10 nghìn dòng!');
          // } 
          // else
          this.export()
        },
      },
      ActionData.reload(() => { this.loadItems(); }),
    ],
    Reference: MeeyReviewProjectEntity,
    CustomFilters: ['IdStr', 'Title', 'FilterDateRange', 'StatusType', 'FilterVoteScore', 'CityId', 'DistrictId', 'WardId', 'FilterNumberQuestion', 'FilterTotalReview'],
    HideSearch: true,
    DisableAutoLoad: true,
    UpdatedBy: false
  };
  constructor() {
    super();
  }

  ngOnInit() {
    this.properties = [
      { Property: 'Index', Title: 'STT', Type: DataType.Number, DisableOrder: true },
      { Property: 'IdStr', Title: 'ID', Type: DataType.String, DisableOrder: true },
      { Property: 'Title', Title: 'Tên dự án', Type: DataType.String, DisableOrder: true },
      {
        Property: 'Location', Title: 'Địa chỉ', Type: DataType.String,
        Format: ((item: any) => {
          let text: string = '';
          if (item.CityId) text += item.City;
          if (item.DistrictId) text = item.District + ' - ' + text;
          if (item.WardId) text = item.Ward + ' - ' + text;
          return text;

        })
      },
      { Property: 'StatusType', Title: 'Trạng thái', Type: DataType.String },
      {
        Property: 'VoteScore', Title: 'Điểm đánh giá', Type: DataType.String,
        Format: ((item: any) => {
          let text = '';
          let originItem = <MeeyReviewProjectEntity>this.originalItems.find(c => c.Id == item.Id);
          if (originItem) {
            text = ((Math.round(originItem.VoteScore * 10)) / 10).toString();
          }
          return text;
        })
      },
      { Property: 'TotalReview', Title: 'Số lượng review',
        Format:((item: any) => {
          let text = '';
          let totalReview : MRVProject_Statistic = item.TotalReview
          if(totalReview){
            text += '<p>'+ totalReview.Published + ' đã đăng</p>'
            text += '<p>'+ totalReview.Wait + ' chờ đăng</p>'
          }
          return text;
        })
      },
      { Property: 'TotalQuestion', Title: 'Số lượng câu hỏi',
        Format:((item: any) => {
          let text = '';
          let totalReview : MRVProject_Statistic = item.TotalQuestion
          if(totalReview){
            text += '<p>'+ totalReview.Published + ' đã đăng</p>'
            text += '<p>'+ totalReview.Wait + ' chờ đăng</p>'
          }
          return text;
        })
      },
      { Property: 'TotalReply', Title: 'Số lượng phản hồi',
        Format:((item: any) => {
          let text = '';
          let totalReview : MRVProject_Statistic = item.TotalReply
          if(totalReview){
            text += '<p>'+ totalReview.Published + ' đã đăng</p>'
            text += '<p>'+ totalReview.Wait + ' chờ đăng</p>'
          }
          return text;
        })
      },
      { Property: 'CreateDate', Title: 'Ngày tạo', Type: DataType.String, DisableOrder: true },
    ];
    this.render(this.obj);
  }

  view(item: any) {
    this.dialogService.WapperAsync({
      cancelText: 'Đóng',
      title: 'Chi Tiết',
      object: ViewProjectComponent,
      size: ModalSizeType.Large,
      objectExtra: {
        id: item.Id,
        viewer: true,
      },
    }, () => this.loadItems());
  }
  fastSeeding(item: any) {
    item.projectId = item.Id;
    let obj: NavigationStateData = {
      object: item,
      prevData: this.itemData,
      prevUrl: '/admin/meeyreview/project',
    };
    let url = AppConfig.getProtocol() + '//' + AppConfig.getDomain() + '/admin/meeyreview/add';
    this.setUrlState(obj, 'meeyreview');
    window.open(url, "_blank");
  }

  loadComplete(): void {
    if (this.items && this.items.length > 0) {
      let pagesize = this.itemData.Paging?.Size || 20;
      let pageindex = this.itemData.Paging?.Index || 1;
      this.items.forEach((item: any, index) => {
        item.Index = (pagesize * (pageindex - 1)) + (index + 1);
      });
    }
    console.log(this.items)
  }
  private setUrlState(state: NavigationStateData, controller: string = null) {
    if (!controller) controller = this.getController();
    let stateKey = 'params',
      sessionKey = 'session_' + stateKey + '_' + controller;
    if (state) sessionStorage.setItem(sessionKey, JSON.stringify(state));
  }
  export() {
    this.dialogService.WapperAsync({
      cancelText: 'Đóng',
      size: ModalSizeType.Small,
      title: 'Xuất dữ liệu thô',
      confirmText: 'Xuất dữ liệu',
      object: ExportStatisticMRVProjectComponent,
    });
  }
}
