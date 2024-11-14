import { Component, Input, OnInit } from '@angular/core';
import { AppInjector } from '../../../../../../app.module';
import { validation } from '../../../../../../_core/decorators/validator';
import { ResultApi } from '../../../../../../_core/domains/data/result.api';
import { DecoratorHelper } from '../../../../../../_core/helpers/decorator.helper';
import { AdminEventService } from '../../../../../../_core/services/admin.event.service';
import { MafAffiliateTreeAddEntity } from '../../../../../../_core/domains/entities/meeyaffiliate/affiliate.tree.add.entity';
import { MAFAffiliateService } from '../../../affiliate.service';
import { ToastrHelper } from '../../../../../../_core/helpers/toastr.helper';

@Component({
  templateUrl: "./add.tree.component.html",
  styleUrls: ["./add.tree.component.scss"],
})
export class MAFAddTreeComponent implements OnInit {
  @Input() params: any;

  item: MafAffiliateTreeAddEntity = new MafAffiliateTreeAddEntity();
  addType: string;
  user: any;
  errorMesssage: string;

  disabled: boolean = true;
  processSearch = false;

  service: MAFAffiliateService;
  eventService: AdminEventService;

  constructor() {
    this.eventService = AppInjector.get(AdminEventService);
    this.service = AppInjector.get(MAFAffiliateService);
  }

  ngOnInit() {
    let addType = this.params && this.params["addType"];
    this.addType = this.addType || addType;
  }

  async searchMeeyId() {
    this.processSearch = true;
    this.clearMeeyId()
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

  clearMeeyId() {
    this.user = null;
    this.errorMesssage = null;
    this.disabledSave();
  }

  public async confirm(): Promise<boolean> {
    if (this.addType == 'addBranch') {
      let valid = await validation(this.item, ['BranchName']);
      if (valid) {
        return await this.service.addBranch(this.item).then((result: ResultApi) => {
          if (ResultApi.IsSuccess(result)) {
            ToastrHelper.Success('Tạo Nhánh thành công!');
            return true;
          } else {
            ToastrHelper.ErrorResult(result);
            return false;
          }
        });
      }
    } else if (this.addType == 'addRank') {
      let valid = await validation(this.item, ['BranchId', 'RankName', 'Search']);
      if (valid) {
        if (this.user) {
          this.item.MeeyId = this.user?.MeeyId;
          return await this.service.addRank(this.item).then((result: ResultApi) => {
            if (ResultApi.IsSuccess(result)) {
              ToastrHelper.Success('Tạo Trung tâm thành công!');
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
    }
    return false;
  }

  async disabledSave() {
    let valid = false;
    if (this.addType == 'addBranch') {
      valid = await validation(this.item, ['BranchName'], true);
      this.disabled = !valid;
    } else if (this.addType == 'addRank') {
      valid = await validation(this.item, ['BranchId', 'RankName', 'Search'], true);
      this.disabled = !(valid && this.user);
    }
  }
}
