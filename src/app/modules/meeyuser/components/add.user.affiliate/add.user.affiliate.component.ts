import { Component, OnInit } from '@angular/core';
import { AppInjector } from '../../../../app.module';
import { MAFAffiliateService } from '../../../../modules/meeyaffiliate/affiliate/affiliate.service';
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { MLUserEntity } from '../../../../_core/domains/entities/meeyland/ml.user.entity';
import { DecoratorHelper } from '../../../../_core/helpers/decorator.helper';
import { AdminApiService } from '../../../../_core/services/admin.api.service';
import { AdminAuthService } from '../../../../_core/services/admin.auth.service';
import { AdminEventService } from '../../../../_core/services/admin.event.service';

@Component({
  selector: 'app-add.user.affiliate',
  templateUrl: './add.user.affiliate.component.html',
  styleUrls: ['./add.user.affiliate.component.scss']
})
export class MLAddUserAffiliateComponent implements OnInit {
  item: MLUserEntity = new MLUserEntity();
  user: any;

  processSearch = false;

  eventService: AdminEventService;
  affiliateService: MAFAffiliateService;
  authen: AdminAuthService;
  adminService: AdminApiService;

  constructor() {
    this.eventService = AppInjector.get(AdminEventService);
    this.affiliateService = AppInjector.get(MAFAffiliateService);
    this.authen = AppInjector.get(AdminAuthService);
    this.adminService = AppInjector.get(AdminApiService);
  }

  ngOnInit() {

  }

  async confirm(): Promise<boolean> {
    if (!this.user || !this.user.refCode) {
      let properties = DecoratorHelper.decoratorProperties(MLUserEntity, false);
      if (properties && properties.length > 0) {
        let property = properties.find(c => c.property == 'SearchUser');
        if (property) {
          property.error = 'Vui lòng kiểm tra tài khoản!';
          this.eventService.Validate.emit(property);
        }
      }
    }
    else {
      this.authen.account.RefCode = this.user.refCode
      let checkUpdate = false;
      await this.affiliateService.updateRefCodeUser({ RefCode: this.user.refCode, MeeyId: this.user._id }).then(async (result: ResultApi) => {
        if (ResultApi.IsSuccess(result)) {
          checkUpdate = true;
        }
      })
      return checkUpdate;
    }
    return false;
  }

  async searchUser() {
    this.processSearch = true;
    this.clearUser()
    let valid = await validation(this.item, ['SearchUser']);
    if (valid) {
      this.item.SearchUser = this.item.SearchUser.trim().replace(/ /g, '')
      await this.affiliateService.findRefCodeUser(this.item.SearchUser).then(async (result: ResultApi) => {
        if (ResultApi.IsSuccess(result)) {
          let obj = result.Object;
          if (obj) {
            this.user = obj;
          }
        } else {
          let properties = DecoratorHelper.decoratorProperties(MLUserEntity, false);
          if (properties && properties.length > 0) {
            let property = properties.find(c => c.property == 'SearchUser');
            if (property) {
              property.error = result && result.Description;
              this.eventService.Validate.emit(property);
            }
          }
        }
      });
    }
    if (this.user && this.user?._id) {
      await this.adminService.profileByMeeyId(this.user._id).then(async (result: ResultApi) => {
        if (ResultApi.IsSuccess(result)) {
          let obj = result.Object;
          if (obj) {
            this.clearUser();
            let properties = DecoratorHelper.decoratorProperties(MLUserEntity, false);
            if (properties && properties.length > 0) {
              let property = properties.find(c => c.property == 'SearchUser');
              if (property) {
                property.error = 'Tài khoản đã gán với nhân viên ' + obj.Email;
                this.eventService.Validate.emit(property);
              }
            }
          }
        }
      });
    }
    this.processSearch = false;
  }

  clearUser() {
    this.user = null;
  }

}
