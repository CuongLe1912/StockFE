import { Component, Input, OnInit } from '@angular/core';
import { MAFAffiliateRequestEntity } from '../../../../../_core/domains/entities/meeyaffiliate/affiliate.request.entity';
import { OptionItem } from '../../../../../_core/domains/data/option.item';
import { ResultApi } from '../../../../../_core/domains/data/result.api';
import { ConstantHelper } from '../../../../../_core/helpers/constant.helper';
import { MAFAffiliateService } from '../../affiliate.service';
import { validation } from '../../../../../_core/decorators/validator';
import { ToastrHelper } from '../../../../../_core/helpers/toastr.helper';
import { NavigationStateData } from '../../../../../_core/domains/data/navigation.state';
import { AppConfig } from '../../../../../_core/helpers/app.config';

@Component({
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class MAFViewRequestComponent implements OnInit {
  @Input() params: any;

  request: MAFAffiliateRequestEntity = new MAFAffiliateRequestEntity();
  item: any;
  currentNode: any;
  approve: boolean = false;

  constructor(private service: MAFAffiliateService) { }

  ngOnInit() {
    let id = this.params && this.params["id"];
    this.approve = this.params && this.params["approve"];
    this.loadItem(id);
  }

  async loadItem(id) {
    if (id) {
      let currentPhone = '';
      await this.service.item("MAFAffiliateRequest", id).then((result: ResultApi) => {
        if (ResultApi.IsSuccess(result)) {
          this.item = result.Object
        }
      });

      if (this.approve) {
        await this.service.item("MAFAffiliate", this.item.Phone).then((result: ResultApi) => {
          if (ResultApi.IsSuccess(result)) {
            this.currentNode = result.Object;
          }
        });
      }
    }
  }

  public async confirm(): Promise<boolean> {
    this.item.Note = this.request.Note;
    this.item.Action = 'approve';
    return await this.service.approveRequestNode(this.item).then((result: ResultApi) => {
      if (ResultApi.IsSuccess(result)) {
        ToastrHelper.Success('Kiểm duyệt thành công!');
        return true;
      } else {
        ToastrHelper.ErrorResult(result);
        return false;
      }
    });
  }

  public async reject(): Promise<boolean> {
    let valid = await validation(this.request, ["Note"]);
    if (valid) {
      this.item.Note = this.request.Note;
      this.item.Action = 'reject';
      return await this.service.approveRequestNode(this.item).then((result: ResultApi) => {
        if (ResultApi.IsSuccess(result)) {
          ToastrHelper.Success('Từ chối thành công!');
          return true;
        } else {
          ToastrHelper.ErrorResult(result);
          return false;
        }
      });
    }
    return false;
  }

  getStatus() {
    if (!this.item.Status) return ''
    let option: OptionItem = ConstantHelper.MAF_REQUEST_STATUS_TYPES.find((c) => c.value == this.item.Status);
    let text = '<p class="' + (option && option.color) + '">' + (option && option.label) + "</p>";
    return text;
  }

  viewUser(meeyId: string) {
    let obj: NavigationStateData = {
      prevUrl: '/admin/mluser',
    };
    let url = AppConfig.getProtocol() + '//' + AppConfig.getDomain() + '/admin/mluser/view?meeyId=' + meeyId;
    window.open(url, "_blank");
  }

}
