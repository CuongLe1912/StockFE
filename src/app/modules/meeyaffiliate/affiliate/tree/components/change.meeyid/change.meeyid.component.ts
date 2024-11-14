import { Component, Input, OnInit } from '@angular/core';
import { validation } from '../../../../../../_core/decorators/validator';
import { DecoratorHelper } from '../../../../../../_core/helpers/decorator.helper';
import { NavigationStateData } from '../../../../../../_core/domains/data/navigation.state';
import { ResultApi } from '../../../../../../_core/domains/data/result.api';
import { MafAffiliateTreeAddEntity } from '../../../../../../_core/domains/entities/meeyaffiliate/affiliate.tree.add.entity';
import { AppConfig } from '../../../../../../_core/helpers/app.config';
import { MAFAffiliateService } from '../../../affiliate.service';
import { AdminEventService } from '../../../../../../_core/services/admin.event.service';
import { ToastrHelper } from '../../../../../../_core/helpers/toastr.helper';

@Component({
  selector: 'app-change.meeyid',
  templateUrl: './change.meeyid.component.html',
  styleUrls: ['./change.meeyid.component.scss']
})
export class MAFChangeMeeyIdComponent implements OnInit {
  @Input() params: any;

  currentNode: any;
  item: MafAffiliateTreeAddEntity = new MafAffiliateTreeAddEntity();
  id: number;

  disabled: boolean = true;
  user: any;
  errorMesssage: string;
  processSearch = false;

  constructor(private service: MAFAffiliateService, private eventService: AdminEventService) { }

  ngOnInit() {
    this.id = this.params && this.params["id"];
    this.loadItem();
  }

  async loadItem() {
    if (this.id) {
      await this.service.item("MAFAffiliate", this.id).then((result: ResultApi) => {
        if (ResultApi.IsSuccess(result)) {
          this.currentNode = result.Object
        }
      });
    }
  }

  public async confirm(): Promise<boolean> {
    let valid = await validation(this.item, ['Search']);
    if (valid) {
      if (this.user) {
        this.item.Id = this.currentNode.RankId;        
        return await this.service.changeRank(this.item).then((result: ResultApi) => {
          if (ResultApi.IsSuccess(result)) {
            ToastrHelper.Success('Thay đổi đại diện TTKD thành công!');
            return true;
          } else {
            ToastrHelper.ErrorResult(result);
            return false;
          }
        });
      } else {
        let properties = DecoratorHelper.decoratorProperties(MafAffiliateTreeAddEntity, false);
        if (properties && properties.length > 0) {
          let property = properties.find(c => c.property == 'Search');
          if (property) {
            property.error = 'Kiểm tra MeeyId trước khi thực hiện tiếp';
            this.eventService.Validate.emit(property);
          }
        }
      }
    }
    return false;
  }

  viewUser(meeyId: string) {
    let obj: NavigationStateData = {
      prevUrl: '/admin/mluser',
    };
    let url = AppConfig.getProtocol() + '//' + AppConfig.getDomain() + '/admin/mluser/view?meeyId=' + meeyId;
    window.open(url, "_blank");
  }

  async searchUser() {
    this.processSearch = true;
    this.clearUser()
    let valid = await validation(this.item, ['Search']);
    if (valid) {
      this.item.Search = this.item.Search.trim().replace(/ /g, '')
      await this.service.checkMeeyId(this.item.Search).then(async (result: ResultApi) => {
        if (ResultApi.IsSuccess(result)) {
          let obj = result.Object;
          if (obj) {
            this.user = {
              ParentId: obj.Id,
              MeeyId: obj.MeeyId,
              Name: obj.Name,
              Email: obj.Email,
              Phone: obj.Phone
            }
          }
        } else {
          let properties = DecoratorHelper.decoratorProperties(MafAffiliateTreeAddEntity, false);
          if (properties && properties.length > 0) {
            let property = properties.find(c => c.property == 'Search');
            if (property) {
              property.error = result && result.Description;
              this.eventService.Validate.emit(property);
            }
          }
        }
      });
      this.disabledSave();
      this.processSearch = false;
    }
  }

  clearUser() {
    this.user = null;
    this.errorMesssage = null;
    this.disabledSave();
  }

  async disabledSave() {
    let valid = await validation(this.item, ['Search'], true);
    this.disabled = !(valid && this.user);
  }

}
