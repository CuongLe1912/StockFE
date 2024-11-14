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
import { MCRMCompanyEntity } from '../../../../_core/domains/entities/meeycrm/mcrm.company.entity';
import { MCRMCustomerEntity } from '../../../../_core/domains/entities/meeycrm/mcrm.customer.entity';
import { MCRMCustomerActivityType } from '../../../../_core/domains/entities/meeycrm/enums/mcrm.customer.type';

@Component({
    templateUrl: './edit.customer.component.html',
    styleUrls: ['./edit.customer.component.scss'],
})
export class MCRMEditCustomerComponent extends EditComponent {
    @Input() params: any;
    actions: ActionData[] = [];

    loading: boolean = true;
    firstLoad: boolean = true;
    loadingService: boolean = true;
    loadingHistory: boolean = true;
    loadingTransaction: boolean = true;
    CustomerActivityType = MCRMCustomerActivityType;

    id: number;
    router: Router;
    MLUserType = MLUserType;
    state: NavigationStateData;
    item: MCRMCustomerEntity = new MCRMCustomerEntity();

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
        //this.id = this.params && this.params['id'];
        this.addBreadcrumb(this.id ? 'Sửa khách hàng CRM' : 'Thêm mới khách hàng CRM');

        this.renderActions();
        await this.loadItem();
        this.loading = false;
        setTimeout(() => {
            this.firstLoad = false;
        }, 1000);
    }

    companyChange() {
        if (!this.firstLoad) {
            this.item.InvoiceName = '';
            this.item.InvoiceAddress = '';
            this.item.InvoiceTaxCode = '';
            if (this.item.CompanyId) {
                this.service.item('mcrmcompany', this.item.CompanyId).then((result: ResultApi) => {
                    if (ResultApi.IsSuccess(result)) {
                        let item: MCRMCompanyEntity = result.Object;
                        if (item) {
                            this.item.InvoiceName = item.Name;
                            this.item.InvoiceTaxCode = item.TaxCode;
                            this.item.InvoiceAddress = item.Address;
                        }
                    }
                })
            }
        }
    }

    activityTypeChange() {
        if (!this.firstLoad) {
            this.item.InvoiceName = '';
            this.item.InvoiceAddress = '';
            this.item.InvoiceTaxCode = '';
        }
    }

    public async confirmAndBack() {
        await this.confirm(() => {
            this.back();
        });
    }
    public async confirmAndReset() {
        await this.confirm(() => {
            this.state.id = null;
            this.item = new MCRMCustomerEntity();
            this.router.navigate(['/admin/meeycrm/customer/add'], { state: { params: JSON.stringify(this.state) } });
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
            await this.service.getCustomer(this.id,'edit').then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(MCRMCustomerEntity, result.Object);
                    this.item.Id = this.id;

                    let phone = this.item.Phone || '';
                    while (phone.indexOf('/') >= 0) phone = phone.replace('/', ',');
                    while (phone.indexOf(';') >= 0) phone = phone.replace(';', ',');
                    phone = phone.split(',').map(c => c.trim()).filter((v, i, a) => a.indexOf(v) === i).join(', ');
                    phone = UtilityExHelper.trimChars(phone, [' ', ',']);
                    this.item.Phone = phone;
                } else {
                    ToastrHelper.ErrorResult(result);
                    this.router.navigate(['/admin/error/403']); 
                }
            });
        }
    }
    private async renderActions() {
        let actions: ActionData[] = [
            ActionData.back(() => { this.back() }),
            ActionData.saveAddNew('Lưu thay đổi', async () => { await this.confirmAndBack() })
        ];
        this.actions = await this.authen.actionsAllow(MCRMCustomerEntity, actions);
    }
    private async createItem(complete: () => void, note?: boolean): Promise<boolean> {
        // upload
        let images = await this.uploadAvatar.image.upload();

        // update user
        let obj: MCRMCustomerEntity = _.cloneDeep(this.item);
        obj.Avatar = images && images.length > 0 ? images[0].Path : '';
        return await this.service.updateCrm(obj).then((result: ResultApi) => {
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