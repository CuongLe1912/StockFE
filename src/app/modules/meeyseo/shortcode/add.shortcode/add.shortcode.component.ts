import { MSSeoService } from '../../seo.service';
import { Component, Input, OnInit } from '@angular/core';
import { AppInjector } from '../../../../../app/app.module';
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { MethodType } from '../../../../_core/domains/enums/method.type';
import { UtilityExHelper } from '../../../../_core/helpers/utility.helper';
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { AdminDialogService } from '../../../../_core/services/admin.dialog.service';
import { MSShortCodeEntity } from '../../../../_core/domains/entities/meeyseo/ms.shortcode.entity';

@Component({
  templateUrl: './add.shortcode.component.html',
  styleUrls: ['./add.shortcode.component.scss']
})
export class AddShortCodeComponent extends EditComponent implements OnInit {
  loading: boolean;
  processing: boolean;
  @Input() params: any;
  service: MSSeoService;
  dialog: AdminDialogService;
  item: MSShortCodeEntity = new MSShortCodeEntity();
  viewer: boolean;
  isAddNew: boolean;

  constructor() {
    super();
    this.service = AppInjector.get(MSSeoService);
    this.dialog = AppInjector.get(AdminDialogService);
  }

  async ngOnInit() {
    await this.loadItem();
    this.loading = false;
  }
  
  private async loadItem() {
    this.loading = true;
    let id = this.getParam("id");
    this.viewer = this.getParam("viewer");
    this.isAddNew = this.getParam("isAddNew");
    if (id) {
      await this.service.item('msshortcode/items', id).then((result: ResultApi) => {
        if (ResultApi.IsSuccess(result)) {
          this.item = EntityHelper.createEntity(MSShortCodeEntity, result.Object);
        } else ToastrHelper.ErrorResult(result);
      })
    }
    this.loading = false;
  }

  async confirm() {
    let valid = await validation(this.item, ['Code', 'Title','Url','UrlType','TextButton', 'TotalShow']);
    if (valid) {
      let data = {
        "type": this.item.UrlType,
        "url": this.item.Url,
        "title": this.item.Title,
        "code": this.item.Code,
        "totalShow": this.item.TotalShow,
        "pageDisplay": this.item.PageDisplay ? this.item.PageDisplay : "",
        "textButton": this.item.TextButton,
        "note": this.item.Note ? this.item.Note : "",
        "adminUserId": this.authen.account.Id,
      };
      if (!this.item.Id) {
        return await this.service.callApi('MSShortCode', 'AddShortCode', data, MethodType.Post).then((result: ResultApi) => {
          if (ResultApi.IsSuccess(result)) {
            ToastrHelper.Success('Thêm mới shortcode thành công');
            this.item = EntityHelper.createEntity(MSShortCodeEntity);
            return true;
          } else ToastrHelper.ErrorResult(result);
        }, (e: any) => {
          this.processing = false;
          ToastrHelper.Exception(e);
        });
      } else {
        return await this.service.callApi('MSShortCode', 'UpdateShortCode/' + this.item.Id, data, MethodType.Put).then((result: ResultApi) => {
          if (ResultApi.IsSuccess(result)) {
            ToastrHelper.Success('Cập nhật shortcode thành công');
            return true;
          } else ToastrHelper.ErrorResult(result);
        }, (e: any) => {
          this.processing = false;
          ToastrHelper.Exception(e);
        })
      }
    }
    this.processing = false;
    return false;
  }
  copyLink(item: any) {
    let shortCode = item.ShortCode
    UtilityExHelper.copyString(shortCode);
    ToastrHelper.Success('Sao chép shortcode thành công');
  }
  reject() {
    this.dialog.Confirm('Bạn chưa lưu các thông tin này, bạn có chắc muốn hủy?', () => {
      this.dialog.HideAllDialog();
      return true;
    }, null, 'Xác nhận thay đổi');
    return false;
  }
}
