import * as _ from 'lodash';
import { MLRedirectService } from '../redirect.service';
import { Component, Input, OnInit } from '@angular/core';
import { AppConfig } from '../../../../_core/helpers/app.config';
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { AdminAuthService } from '../../../../_core/services/admin.auth.service';
import { MLRedirectEntity } from '../../../../_core/domains/entities/meeyland/ml.redirect.entity';

@Component({
  selector: 'redirect-add-modal',
  templateUrl: './add-modal.component.html',
  styleUrls: ['./add-modal.component.scss'],
})

export class AddModalMLRedirectComponent implements OnInit {

  @Input() params: any;

  item: MLRedirectEntity = new MLRedirectEntity();
  urlItem = `${AppConfig.MeeyLandConfig.Url}`;
  isValidUrl: any = true;

  urlInvalid = {
    HOME: this.urlItem,
    CATEGORY: [
      'mua-ban-nha-dat',
      'cho-thue-nha-dat',
      'sang-nhuong-nha-dat',
      'can-mua'
    ],
    FILTER: '?p=',
    PANIGATION: 'page',
    PARAM: '?id'
  };

  constructor(
    private redirectService: MLRedirectService,
    private authen: AdminAuthService,
  ) { }

  ngOnInit(): void {
    if (this.params.Id) {
      this.item.Id = this.params.Id;
      this.item.OriginUrl = this.params.OriginUrl;
      this.item.RedirectUrl = this.params.RedirectUrl;
      this.item.TypeInsert = this.params.Type;
      this.item.Author = this.params.Author;
      this.item.Note = this.params.Note
    }
    else {
      this.item.TypeInsert = 301;
    }
  }

  public async confirm(): Promise<boolean> {
    let column = [];
    column = ['TypeInsert', 'OriginUrl', 'RedirectUrl'];
    if (await validation(this.item, column)) {
      this.isValidUrl = true;
      if ((this.checkValid(this.item.RedirectUrl) == false) || (this.checkValid(this.item.OriginUrl) == false)) {
        return false;
      };
      if (this.item.OriginUrl.toString().toLowerCase().trim() === this.item.RedirectUrl.toString().toLowerCase().trim()) {
        ToastrHelper.Error('Bạn không được nhập URL cũ trùng mới URL mới');
        return false;
      }

      if (this.isValidUrl) {
        let item: MLRedirectEntity = _.cloneDeep(this.item);
        let messageSuccess = item?.Id ? 'Cập nhật' : 'Thêm mới';
        let req = {
          _id: this.item.Id,
          originUrl: this.item.OriginUrl,
          redirectUrl: this.item.RedirectUrl,
          type: this.item.TypeInsert,
          author: {
            id: this.authen.account.Id.toString(),
            email: this.authen.account.Email,
            name: this.authen.account.FullName
          },
          note: this.item.Note ?? undefined
        }
        return await this.redirectService.save(req).then((result: ResultApi) => {
          if (ResultApi.IsSuccess(result)) {
            ToastrHelper.Success(`${messageSuccess} chuyển hướng thành công`);
            return true;
          } else {
            ToastrHelper.ErrorResult(result);
            return false;
          }
        });
      }
    }

    return false;
  }

  checkValid(itemUrl: any) {
    let _url = itemUrl.toString().toLowerCase().trim();
    if (
      (_url === this.urlItem) ||
      (this.urlInvalid.CATEGORY.filter(x => (_url.includes(x))).length) ||
      (_url.includes(this.urlInvalid.FILTER)) ||
      (_url.includes(this.urlInvalid.PANIGATION)) ||
      (_url.includes(this.urlInvalid.PARAM))
    ) {
      this.isValidUrl = false;
      ToastrHelper.Error(`URL không hợp lệ. URL không được là URL trang chủ, danh mục, filter, phân trang, có "?id="`);
      return false;
    }
  }
}
