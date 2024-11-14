import * as _ from 'lodash';
import { AppInjector } from '../../../../app.module';
import { MeeyCrmService } from '../../meeycrm.service';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { ActionType } from '../../../../_core/domains/enums/action.type';
import { AssignType } from '../../../../_core/domains/enums/assign.type';
import { AdminAuthService } from '../../../../_core/services/admin.auth.service';
import { AdminDialogService } from '../../../../_core/services/admin.dialog.service';
import { MCRMCustomerEntity } from '../../../../_core/domains/entities/meeycrm/mcrm.customer.entity';
import { MCRMCustomerRequestDto } from '../../../../_core/domains/entities/meeycrm/mcrm.customer.request.entity';
import { MCRMCustomerListComponent } from '../components/customer.list.component';
import { OptionItem } from '../../../../_core/domains/data/option.item';

@Component({
    templateUrl: './group.customer.component.html',
    styleUrls: ['./group.customer.component.scss'],
})
export class GroupCustomerOldComponent implements OnInit {
    @ViewChild('customerList') customerList: MCRMCustomerListComponent;
    step: number = 1;
    type: AssignType;
    action: ActionType;
    processing: boolean;
    confirmText: string;
    @Input() params: any;
    auth: AdminAuthService;
    service: MeeyCrmService;
    AssignType = AssignType;
    disabled: boolean = true;
    disabledReject: boolean = true;
    dialog: AdminDialogService;
    items: MCRMCustomerEntity[];
    item: MCRMCustomerRequestDto = new MCRMCustomerRequestDto();

    SaleOption: OptionItem[];
    SupportOption: OptionItem[];

    SaleId: number;
    SupportId: number;

    constructor() {
        this.auth = AppInjector.get(AdminAuthService);
        this.service = AppInjector.get(MeeyCrmService);
        this.dialog = AppInjector.get(AdminDialogService);
    }

    ngOnInit() {
        this.items = this.params && this.params['items'];
        this.type = this.params && this.params['type'];
        this.action = ActionType.GroupCustomer;
        if (this.items && this.items.length > 0) {
            this.item.RootId = this.items[0].Id;
            this.item.Name = this.items[0].Name;
            this.item.CustomerStatusType = this.items[0].CustomerStatusType;
            this.selectOptionSaleSupport();
        }
    }

    async customerChange() {
        if (this.item.CustomerId && !this.processing) {
            let customer = this.items.find(c => c.Id == this.item.CustomerId);
            if (!customer) {
                this.processing = true;
                await this.service.lookupCustomer(this.item.CustomerId).then((result: ResultApi) => {
                    if (ResultApi.IsSuccess(result) && result.Object) {
                        customer = this.items.find(c => c.Id == this.item.CustomerId);
                        if (!customer) {
                            this.items.push(result.Object);
                            // this.selectedCustomer(result.Object)
                            this.selectPhoneEmail();
                            this.selectOptionSaleSupport();
                        }
                    }
                });
                this.processing = false;
                this.customerList.reloadItems(_.cloneDeep(this.items));
            }
        }
        this.toggleDisableButton();
    }

    selectedCustomer(item: MCRMCustomerEntity) {
        this.item.Name = item.Name;
        this.item.RootId = item.Id;
        this.item.CustomerStatusType = item.CustomerStatusType;
        if (item.SaleId) this.item.SaleId = item.SaleId;
        if (item.SupportId) this.item.SupportId = item.SupportId;
        this.selectPhoneEmail();
    }

    selectPhoneEmail() {
        let phones = this.items && this.items.map(c => c.Phone);
        if (phones && phones.length > 0)
            this.item.Phone = phones.filter(function (el) {
                if (el) return el.trim();
            }).join(', ');
        let emails = this.items && this.items.map(c => c.Email);
        if (emails && emails.length > 0)
            this.item.Email = emails.filter(function (el) {
                if (el) return el.trim();
            }).join(', ');
    }

    selectOptionSaleSupport() {
        let saleOption = this.items && this.items.map(c => { return { value: c.SaleId, label: c['Sale'] } }).filter(c => c.value);
        this.SaleOption = saleOption.filter((value, index, self) => self.findIndex(t => (t.value === value.value)) === index)

        let supportOption = this.items && this.items.map(c => { return { value: c.SupportId, label: c['Support'] } }).filter(c => c.value);
        this.SupportOption = supportOption.filter((value, index, self) => self.findIndex(t => (t.value === value.value)) === index)
    }

    async confirm() {
        let valid = await this.checkValidate();
        if (valid) {
            this.item.Ids = this.items && this.items.map(c => c.Id);
            if (this.step == 1) {
                this.SaleId = this.item.SaleId
                this.SupportId = this.item.SupportId
                this.confirmText = 'Xác nhận';
                this.step += 1;
                this.disabledReject = false;
                return false;
            } else {
                let item: MCRMCustomerRequestDto = _.cloneDeep(this.item);
                item.SaleId = this.SaleId;
                item.SupportId = this.SupportId;
                return await this.service.addRequestGroup(item).then((result: ResultApi) => {
                    if (ResultApi.IsSuccess(result)) {
                        let message = 'Tạo yêu cầu gộp cho ' + this.item.Ids.length + ' khách hàng thành công';
                        ToastrHelper.Success(message);
                        return true;
                    }
                    ToastrHelper.ErrorResult(result);
                    return false;
                }, (e) => {
                    ToastrHelper.Exception(e);
                    return false;
                });
            }
        }
        return false;
    }

    async gotoStep(step: number) {
        if (step == 2) {
            let valid = await this.checkValidate();
            if (valid) {
                this.step = step;
                this.confirmText = 'Xác nhận';
                this.disabledReject = false;
            }
        } else {
            this.item.SaleId = this.SaleId
            this.item.SupportId = this.SupportId
            this.step = step;
            this.confirmText = 'Tiếp tục';
            this.disabledReject = true;
        }
    }

    async toggleDisableButton() {
        let valid = await this.checkValidate(true);
        this.disabled = !valid;
    }

    async checkValidate(disableEmit?: boolean) {
        let columns = ['Reason', 'SaleId']
        //     existsSale = this.items && this.items.findIndex(c => c.SaleId) >= 0,
        //     existsSupport = this.items && this.items.findIndex(c => c.SupportId) >= 0;
        // if (existsSale) columns.push('SaleId');
        // if (existsSupport) columns.push('SupportId');
        let valid = this.item.RootId &&
            this.items && this.items.length >= 2 &&
            await validation(this.item, columns, disableEmit);
        return valid;
    }

    removedItems(items: MCRMCustomerEntity[]) {
        this.processing = true;
        setTimeout(() => {
            this.processing = false;
            let ids = items.map(c => { return c.Id });
            this.items = this.items.filter(c => ids.indexOf(c.Id) >= 0);
            this.selectOptionSaleSupport();
        }, 300);
    }
}