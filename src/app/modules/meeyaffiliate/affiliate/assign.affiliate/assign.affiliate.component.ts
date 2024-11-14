import * as _ from 'lodash';
import { AppInjector } from '../../../../app.module';
import { Component, Input, OnInit } from '@angular/core';
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { ActionType } from '../../../../_core/domains/enums/action.type';
import { AssignType } from '../../../../_core/domains/enums/assign.type';
import { AdminAuthService } from '../../../../_core/services/admin.auth.service';
import { AdminDialogService } from '../../../../_core/services/admin.dialog.service';
import { MCRMCustomerAssignDto, MCRMCustomerEntity } from '../../../../_core/domains/entities/meeycrm/mcrm.customer.entity';
import { CustomerTransferType } from '../../../../_core/domains/entities/meeycrm/enums/mcrm.customer.type';
import { AdminEventService } from '../../../../_core/services/admin.event.service';
import { MeeyCrmService } from '../../../../modules/meeycrm/meeycrm.service';
import { MafAffiliateEntity } from '../../../../_core/domains/entities/meeyaffiliate/affiliate.entity';
import { AdminApiService } from '../../../../_core/services/admin.api.service';

@Component({
    templateUrl: './assign.affiliate.component.html',
    styleUrls: ['./assign.affiliate.component.scss'],
})
export class MAFAssignAffiliateComponent implements OnInit {
    id: number;
    phone: string;
    type: AssignType;
    currentNode: any;
    user: any[] = [];
    saleEmail: string;
    action: ActionType;
    ids: number[] = [];
    @Input() params: any;
    errorMesssage: string;
    processSearch = false;
    meeyids: string[] = [];
    auth: AdminAuthService;
    errorAffililate: string;
    service: MeeyCrmService;
    AssignType = AssignType;
    disabled: boolean = true;
    dialog: AdminDialogService;
    items: MafAffiliateEntity[];
    adminService : AdminApiService;

    CustomerTransferType = CustomerTransferType;
    item: MCRMCustomerAssignDto = new MCRMCustomerAssignDto();

    constructor(private eventService: AdminEventService) {
        this.auth = AppInjector.get(AdminAuthService);
        this.service = AppInjector.get(MeeyCrmService);
        this.dialog = AppInjector.get(AdminDialogService);
        this.adminService = AppInjector.get(AdminApiService);
    }

    ngOnInit() {
        this.type = this.params && this.params['type'];
        this.items = this.params && this.params['items'];
        this.item.TransferType = CustomerTransferType.TransferSale;
        switch (this.type) {
            case AssignType.Sale: {
                this.action = ActionType.AssignSale;
                this.ids = this.items && this.items.filter(c => c[ActionType.AssignSale] == true).map(c => { return c.Id });
                this.phone = this.items && this.items.filter(c => c[ActionType.AssignSale] == true).map(c => { return c.Phone })[0];
                this.meeyids = this.items && this.items.filter(c => c[ActionType.AssignSale] == true).map(c => { return c.MeeyId });
            } break;
        }
    }

    closePopup() {
        this.dialog.HideAllDialog();
    }

    userChange() {
        if (this.item.UserId) {
            this.service.getAmountCustomer(this.item.UserId).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result))
                    this.item.Amount = result.Object || '0';
            })
        }
        else {
            this.item.Amount = null;
        }
        this.toggleDisableButton();
    }

    async confirm() {
        if (this.item && this.ids && this.ids.length > 0) {
            this.item.Ids = this.ids;
            this.item.Phone = this.phone;
            this.item.MeeyIds = this.meeyids;
            this.item.Search
            let valid = await validation(this.item, ['DepartmentId', 'UserId', 'Amount', 'Note']);
            if (valid) {
                switch (this.type) {
                    case AssignType.Sale: {
                        await this.adminService.profile(this.item.UserId).then((result: ResultApi) => {
                            if (ResultApi.IsSuccess(result)) {
                                this.saleEmail = result.Object?.FullName ? result.Object?.FullName +' - ' + result.Object?.Email : result.Object?.Email;
                            }
                            }, (e) => {
                                ToastrHelper.Exception(e);
                            });
                        this.dialog.ConfirmAsync('Bạn có chắc muốn điều chuyển '+this.ids.length + ' khách hàng sang sale ' + this.saleEmail + ' không?', async () => {
                            return await this.service.assignSaleFromAffiliate(this.item).then((result: ResultApi) => {
                                if (ResultApi.IsSuccess(result)) {
                                    let message = 'Điều chuyển ' + this.ids.length + ' khách hàng thành công cho sale';
                                    ToastrHelper.Success(message);
                                    this.dialog.HideAllDialog();
                                    this.eventService.RefreshGrids.emit();
                                    return true;
                                }
                                ToastrHelper.ErrorResult(result);
                                this.dialog.HideAllDialog();
                                return false;
                            }, (e) => {
                                ToastrHelper.Exception(e);
                                this.dialog.HideAllDialog();
                                return false;
                            });
                        })
                    }

                }
            }


        }
        return false;
    }

    async toggleDisableButton() {
        if (!this.item.DepartmentId)
            this.item.Amount = null;
        let valid = await validation(this.item, ['DepartmentId', 'UserId'], true);
        this.disabled = !(valid && this.ids && this.ids.length > 0);
    }

    removedItems(items: MCRMCustomerEntity[]) {
        this.ids = this.items && items.map(c => { return c.Id });
    }
    async searchUser() {
        this.processSearch = true;
        this.errorAffililate = null;
        this.clearUser()
        let valid = await validation(this.item, ['Search']);
        if (valid) {
            this.item.Search = this.item.Search.trim().replace(/ /g, '')
            await this.service.findAffiliate(this.item.Search).then(async (result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    if (result.Object) {
                        this.user = result.Object;
                    }
                } else {
                    this.errorAffililate = result.Description;
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