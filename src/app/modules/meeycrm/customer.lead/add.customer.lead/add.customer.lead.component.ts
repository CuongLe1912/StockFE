import * as _ from 'lodash';
import { Router } from '@angular/router';
import { AppInjector } from '../../../../app.module';
import { MeeyCrmService } from '../../meeycrm.service';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { ActionData } from '../../../../_core/domains/data/action.data';
import { GenderType } from '../../../../_core/domains/enums/gender.type';
import { EditorComponent } from '../../../../_core/editor/editor.component';
import { AdminAuthService } from '../../../../_core/services/admin.auth.service';
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { NavigationStateData } from '../../../../_core/domains/data/navigation.state';
import { MCRMCustomerLeadEntity } from '../../../../_core/domains/entities/meeycrm/mcrm.customer.lead.entity';
import { MCRMCustomerActivityType, MCRMCustomerPotentialType, MCRMCustomerType } from '../../../../_core/domains/entities/meeycrm/enums/mcrm.customer.type';

@Component({
  templateUrl: './add.customer.lead.component.html',
  styleUrls: ['./add.customer.lead.component.scss']
})
export class MCRMAddCustomerLeadComponent extends EditComponent {
  @ViewChild('uploadFile') uploadFile: EditorComponent;
  @ViewChild('uploadAvatar') uploadAvatar: EditorComponent;
  @Input() params: any;
  actions: ActionData[] = [];
  loading: boolean = true;

  item: MCRMCustomerLeadEntity = new MCRMCustomerLeadEntity();
  id: number;
  router: Router;
  viewer: boolean = false;
  popup: boolean;
  state: NavigationStateData;

  service: MeeyCrmService;
  authen: AdminAuthService;


  constructor() {
    super();
    this.router = AppInjector.get(Router);
    this.service = AppInjector.get(MeeyCrmService);
    this.authen = AppInjector.get(AdminAuthService);
    this.state = this.getUrlState();
  }

  async ngOnInit() {
    this.id = this.params && this.params['id'];
    this.popup = this.params && this.params['popup'];
    if (this.state) {
      this.id = this.id || this.state.id;
      this.addBreadcrumb(this.id ? 'Sửa khách hàng Lead ID' : 'Thêm mới khách hàng Lead ID');
    }
    this.renderActions();
    await this.loadItem();
    this.loading = false;
  }
  private async renderActions() {
    let actions: ActionData[] = [
      ActionData.back(() => { this.back() }),
      ActionData.saveAddNew('Tạo KH LeadID', async () => { await this.confirmAndBack() })
    ];
    this.actions = await this.authen.actionsAllow(MCRMCustomerLeadEntity, actions);
  }

  private async loadItem() {
    this.item.CustomerType = MCRMCustomerType.Owner;
    this.item.Gender = GenderType.Unknow;
    this.item.CustomerPotentialType = MCRMCustomerPotentialType.Potential1;
    this.item.CustomerActivityType = MCRMCustomerActivityType.Individuals;
  }
  public addBreadcrumb(name: string) {
    this.breadcrumbs.push({ Name: name });
  }
  public async confirmAndBack() {
    await this.confirm(() => {
      this.back();
    });
  }


  public async confirm(complete: () => void): Promise<boolean> {
    if (this.item) {
        this.processing = true;
        if (await validation(this.item, ['Phone','Email'])) {
          return await this.createItem(complete);
        } else this.processing = false;
    }
    return false;
}
  public getUrlState(): NavigationStateData {
    let stateKey = 'params',
      controller = this.getController(),
      navigation = this.router.getCurrentNavigation(),
      sessionKey = 'session_' + stateKey + '_' + controller,
      valueJson = navigation && navigation.extras && navigation.extras.state
        ? navigation.extras.state[stateKey]
        : sessionStorage.getItem(sessionKey);
    if (valueJson) sessionStorage.setItem(sessionKey, valueJson.toString());
    return JSON.parse(valueJson) as NavigationStateData;
  }
  private async createItem(complete: () => void, note?: boolean): Promise<boolean> {
    // upload
    let images = await this.uploadAvatar.image.upload();

    // update user
    let obj: MCRMCustomerLeadEntity = _.cloneDeep(this.item);
    obj.Avatar = images && images.length > 0 ? images[0].Path : '';
    return await this.service.addOrUpdateCustomerLeadId(obj).then((result: ResultApi) => {
        this.processing = false;
        if (ResultApi.IsSuccess(result)) {
            if (this.id) ToastrHelper.Success('Lưu thông tin khách hàng thành công');
            else {
                // let message = '<p>Tạo tài khoản thành công</p>';
                // this.dialogService.Alert('Thông báo', message);
                ToastrHelper.Success('Tạo tài khoản thành công');
            }
            if (complete) complete();
            return true;
        } else {
            ToastrHelper.ErrorResult(result);
            return false;
        }
    }, (e: any) => {
        ToastrHelper.Exception(e);
        return false;
    });
}
}
