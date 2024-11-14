import { Component, OnInit } from '@angular/core';
import { GridData } from '../../../_core/domains/data/grid.data';
import { DataType } from '../../../_core/domains/enums/data.type';
import { AddUserComponent } from './add.user/add.user.component';
import { ResultApi } from '../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../_core/helpers/toastr.helper';
import { ActionData } from '../../../_core/domains/data/action.data';
import { MethodType } from '../../../_core/domains/enums/method.type';
import { UtilityExHelper } from '../../../_core/helpers/utility.helper';
import { ModalSizeType } from '../../../_core/domains/enums/modal.size.type';
import { GridComponent } from '../../../_core/components/grid/grid.component';
import { MeeyReviewUserEntity } from '../../../_core/domains/entities/meeyreview/mrv.user.entity';

@Component({
  styleUrls: ['./mrvuser.component.scss'],
  templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class MRVUserComponent extends GridComponent implements OnInit {
  item: any;
  allowVerify: boolean;
  obj: GridData = {
    Imports: [],
    Exports: [],
    Filters: [],
    Actions: [
      ActionData.view((item: any) => this.view(item)),
    ],
    Features: [
      ActionData.reload(() => { this.loadItems(); }),
    ],
    Reference: MeeyReviewUserEntity,
    CustomFilters: ['FilterName', 'UserType', 'FilterDateRange'],
    ClassName: 'meeyreview-user-grid',
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
      {
        Property: 'Name', Title: 'Tài khoản/Device ID', Type: DataType.String, DisableOrder: true,
        Format: ((item: any) => {
          let text = '';
          let textLink;
          if (item.Name) {
            textLink = '<a routerLink="view" tooltip="' + item.Name + '">' + UtilityExHelper.escapeHtml(item.Name) + '</a>'
          }
          if (item.DeviceId) {
            textLink = '<a routerLink="view" tooltip="' + item.DeviceId + '">' + UtilityExHelper.escapeHtml(item.DeviceId) + '</a>'
          }
          text += '<div class="title-article">';
          text += item.Avatar ? '<div class="thumbnail-img"><img src="' + item.Avatar + '" /></div>'
            : '<div class="thumbnail-img"><img src="../../../../assets/media/users/default.jpg" /></div>';
          text += '<div class="d-flex align-items-center" style="width: 100%;">';
          if (item.Name) return text += textLink;
          return textLink
        })
      },
      {
        Property: 'NickNames', Title: 'Biệt danh', Type: DataType.String, DisableOrder: true,
        Format: ((item: any) => {
          let text = ''
          let listNickNames = [item.NickNames].toString();
          if (listNickNames.length > 100) {
            listNickNames = listNickNames.substring(0, 100) + '...';
          }
          text = '<a routerLink="view" tooltip="' + [item.NickNames].toString() + '">' + UtilityExHelper.escapeHtml(listNickNames) + '</a>';
          return text;
        })
      },
      { Property: 'CreateDate', Title: 'Ngày tạo', Type: DataType.String, DisableOrder: true },
      { Property: 'UserType', Title: 'Loại tài khoản', Type: DataType.String, DisableOrder: true },
      { Property: 'TotalInteract', Title: 'Số dự án tương tác', Type: DataType.Number },
      { Property: 'TotalReview', Title: 'Số lượt review', Type: DataType.Number },
      { Property: 'TotalQuestion', Title: 'Số lượt câu hỏi', Type: DataType.Number },
      { Property: 'TotalReply', Title: 'Số lượt phản hồi', Type: DataType.Number },
      {
        Property: 'StatusType', Title: 'Trạng thái', Type: DataType.String, DisableOrder: true,

      },

    ];
    this.render(this.obj);
  }

  view(item: any) {
    this.dialogService.WapperAsync({
      cancelText: 'Đóng',
      title: 'Chi Tiết',
      object: AddUserComponent,
      size: ModalSizeType.Large,
      objectExtra: {
        id: item.Id,
        viewer: true,
      },
    }, () => this.loadItems());
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

  quickView(item: any, type: string): void {
    console.log('xx');
    if (this.allowVerify) {
      if (type && type == 'verified') {
        let origialItem: any = this.originalItems.find(c => c['_id'] == item['_id']);
        if (origialItem.status == 1) origialItem.status = 2;
        else origialItem.status = 1;
        let data = {
          'status': origialItem.status,
          'adminUserId': this.authen.account.Id,
        };
        this.service.callApi('MSHighlight', 'UpdateStatusProperty/' + item._id, data, MethodType.Post).then(async (result) => {
          if (ResultApi.IsSuccess(result)) {
            this.loadItems();
            return;
          } ToastrHelper.ErrorResult(result);
        }, (e: any) => {
          ToastrHelper.Exception(e);
        });
      }
    }
  }
}
