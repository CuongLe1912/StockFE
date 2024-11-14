declare var $;
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { AppInjector } from '../../../../app.module';
import { MeeyCrmService } from '../../meeycrm.service';
import { Component, Input, ViewChild } from '@angular/core';
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { ActionData } from '../../../../_core/domains/data/action.data';
import { UtilityExHelper } from '../../../../_core/helpers/utility.helper';
import { EditorComponent } from '../../../../_core/editor/editor.component';
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { AdminAuthService } from '../../../../_core/services/admin.auth.service';
import { NavigationStateData } from '../../../../_core/domains/data/navigation.state';
import { MLUserType } from '../../../../_core/domains/entities/meeyland/enums/ml.user.type';
import { MCRMCustomerLeadEntity } from '../../../../_core/domains/entities/meeycrm/mcrm.customer.lead.entity';
import { MCRMCustomerActivityType } from '../../../../_core/domains/entities/meeycrm/enums/mcrm.customer.type';
import { MCRMCustomerLeadStatusType } from '../../../../_core/domains/entities/meeycrm/enums/mcrm.customer.status.type';

@Component({
    templateUrl: './edit.customer.lead.component.html',
    styleUrls: ['./edit.customer.lead.component.scss'],
})
export class MCRMEditCustomerLeadComponent extends EditComponent {
    @Input() params: any;
    disabled: boolean;
    loading: boolean = true;
    firstLoad: boolean = true;
    actions: ActionData[] = [];
    loadingService: boolean = true;
    loadingHistory: boolean = true;
    loadingTransaction: boolean = true;
    CustomerActivityType = MCRMCustomerActivityType;

    id: number;
    router: Router;
    MLUserType = MLUserType;
    state: NavigationStateData;
    item: MCRMCustomerLeadEntity = new MCRMCustomerLeadEntity();

    service: MeeyCrmService;
    authen: AdminAuthService;

    @ViewChild('uploadAvatar') uploadAvatar: EditorComponent;

    constructor() {
        super();
        this.router = AppInjector.get(Router);
        this.service = AppInjector.get(MeeyCrmService);
        this.authen = AppInjector.get(AdminAuthService);
        this.state = this.getUrlState();
    }

    async ngOnInit() {
        this.id = this.getParam('id');
        this.addBreadcrumb(this.id ? 'Sửa khách hàng Lead ID' : 'Thêm mới khách hàng Lead ID');
        await this.loadItem();
        this.renderActions();
        this.loading = false;
        setTimeout(() => {
            this.firstLoad = false;
        }, 1000);
    }

    activityTypeChange() {
        if (!this.firstLoad) {
            this.item.InvoiceName = '';
        }
    }

    public async confirmAndBack() {
        await this.confirm(() => {
            this.router.navigate(['/admin/meeycrm/customerlead']);
        });
    }
    public async confirmAndReset() {
        await this.confirm(() => {
            this.state.id = null;
            this.item = new MCRMCustomerLeadEntity();
            this.router.navigate(['/admin/meeycrm/customerlead/edit'], { state: { params: JSON.stringify(this.state) } });
        });
    }
    public async confirm(complete: () => void): Promise<boolean> {
        if (this.item) {
            this.processing = true;
            if (await validation(this.item, ['Name', 'CustomerType'])) {
                return await this.createItem(complete);
            } else this.processing = false;
        }
        return false;
    }

    private async loadItem() {
        if (this.id) {
            await this.service.getCustomerLead(this.id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(MCRMCustomerLeadEntity, result.Object);
                    this.item.Id = this.id;

                    let phone = this.item.Phone || '';
                    while (phone.indexOf('/') >= 0) phone = phone.replace('/', ',');
                    while (phone.indexOf(';') >= 0) phone = phone.replace(';', ',');
                    phone = phone.split(',').map(c => c.trim()).filter((v, i, a) => a.indexOf(v) === i).join(', ');
                    phone = UtilityExHelper.trimChars(phone, [' ', ',']);
                    this.item.Phone = phone;
                    
                }else {
                    ToastrHelper.ErrorResult(result);
                    this.router.navigate(['/admin/error/403']);
                }
            });
        }
    }
    private async renderActions() {
        let actions: ActionData[] = [
            ActionData.back(() => { this.router.navigate(['/admin/meeycrm/customerlead'])  }),
        ];
        if (this.item.CustomerStatusType == MCRMCustomerLeadStatusType.BeingExploited)
            actions.push(ActionData.saveAddNew('Cập nhật thông tin', async () => { await this.confirmAndBack() }));
        this.actions = await this.authen.actionsAllow(MCRMCustomerLeadEntity, actions);
    }
    private async createItem(complete: () => void): Promise<boolean> {
        // upload
        let images = await this.uploadAvatar.image.upload();

        // update user
        let obj: MCRMCustomerLeadEntity = _.cloneDeep(this.item);
        obj.Avatar = images && images.length > 0 ? images[0].Path : '';
        return await this.service.addOrUpdateCustomerLeadId(obj).then((result: ResultApi) => {
            this.processing = false;
            if (ResultApi.IsSuccess(result)) {
                ToastrHelper.Success('Lưu thông tin khách hàng thành công');
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