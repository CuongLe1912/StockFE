import * as _ from 'lodash';
import { AppInjector } from '../../../../app.module';
import { MeeyCrmService } from '../../meeycrm.service';
import { Component, Input, OnInit } from '@angular/core';
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { ActionType } from '../../../../_core/domains/enums/action.type';
import { AssignType } from '../../../../_core/domains/enums/assign.type';
import { AdminApiService } from '../../../../_core/services/admin.api.service';
import { AdminAuthService } from '../../../../_core/services/admin.auth.service';
import { AdminEventService } from '../../../../_core/services/admin.event.service';
import { AdminDialogService } from '../../../../_core/services/admin.dialog.service';
import { CustomerTransferType } from '../../../../_core/domains/entities/meeycrm/enums/mcrm.customer.type';
import { MCRMCustomerAssignDto, MCRMCustomerEntity } from '../../../../_core/domains/entities/meeycrm/mcrm.customer.entity';

@Component({
    templateUrl: './assign.customer.component.html',
    styleUrls: ['./assign.customer.component.scss'],
})
export class AssignCustomerComponent implements OnInit  {
    id: number;
    type: AssignType;
    currentNode: any;
    user: any[];
    saleEmail: string; 
    action: ActionType;
    ids: number[] = [];
    @Input() params: any;
    errorMesssage: string;
    processSearch = false;
    auth: AdminAuthService;
    errorAffililate: string;
    service: MeeyCrmService;
    AssignType = AssignType;
    disabled: boolean = true;
    dialog: AdminDialogService;
    items: MCRMCustomerEntity[];
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
        this.item.Tab = this.params && this.params['tab'];
        this.item.TransferType = CustomerTransferType.TransferSale;

        switch (this.type) {
            case AssignType.Sale: {
                this.action = ActionType.AssignSale;
                this.ids = this.items && this.items.filter(c => c[ActionType.AssignSale] == true).map(c => { return c.Id });
            } break;
            case AssignType.Support: {
                this.action = ActionType.AssignSupport;
                this.ids = this.items && this.items.filter(c => c[ActionType.AssignSupport] == true).map(c => { return c.Id });
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
            if(this.item.TransferType == CustomerTransferType.TransferSale){
                let valid = await validation(this.item, ['DepartmentId', 'UserId', 'Note']);
                if(valid){
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
                                return await this.service.assignSale(this.item).then((result: ResultApi) => {
                                    if (ResultApi.IsSuccess(result)) {
                                        let message = 'Điều chuyển ' + this.ids.length + ' khách hàng thành công cho sale';
                                        this.dialog.HideAllDialog();
                                        ToastrHelper.Success(message);
                                        this.eventService.RefreshGrids.emit();
                                        return true;
                                    }
                                    this.dialog.HideAllDialog();
                                    ToastrHelper.ErrorResult(result);
                                    return false;
                                }, (e) => {
                                    this.dialog.HideAllDialog();
                                    ToastrHelper.Exception(e);
                                    return false;
                                });
                            });
                            
                        }
                        break;
                        case AssignType.Support: {
                            return await this.service.assignSupport(this.item).then((result: ResultApi) => {
                                if (ResultApi.IsSuccess(result)) {
                                    let message = 'Điều chuyển ' + this.ids.length + ' khách hàng thành công cho CSKH';
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
                }
                
            } else if(this.item.TransferType == CustomerTransferType.TransferAffiliate){
                this.item.CustomerRefMeeyId = this.user[0]['MeeyId'];
                let affname = this.user[0]['Name'] ? this.user[0]['Name'] + ' - ' + this.user[0]['Phone'] : this.user[0]['Phone'];
                this.dialog.ConfirmAsync('Bạn có chắc muốn điều chuyển '+this.ids.length + ' khách hàng sang cây hoa hồng của ' + affname + ' không?', async () => {
                    return await this.service.assignAffiliate(this.item).then((result: ResultApi) => {
                        if (ResultApi.IsSuccess(result)) {
                            this.dialog.HideAllDialog();
                            let message = 'Điều chuyển ' + this.ids.length + ' khách hàng thành công cho Affiliate';
                            ToastrHelper.Success(message);
                            this.eventService.RefreshGrids.emit();
                            return true;
                        }
                        this.dialog.HideAllDialog();
                        ToastrHelper.ErrorResult(result);
                        return false;
                    }, (e) => {
                        this.dialog.HideAllDialog();
                        ToastrHelper.Exception(e);
                        return false;
                    });
                });
                
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
                        // await this.service.getCustomerbyMeeyId(result.Object.MeeyId).then((result: ResultApi) => {
                        //     if (ResultApi.IsSuccess(result)) {
                        //         this.CustomerStatusType = result.Object?.CustomerStatusType;
                        //     }
                        // }, (e) => {
                        //     ToastrHelper.Exception(e);
                        // })
                        let obj = {
                            Id: result.Object.Id,
                            Code: result.Object.Code,
                            Name: result.Object.Name,
                            Phone: result.Object.Phone,
                            Email: result.Object.Email,
                            Parent: result.Object.Parent,
                            Branch: result.Object.Branch,
                            MeeyId: result.Object.MeeyId,
                            Sale: result.Object.SaleEmail,
                            Support: result.Object.SupportEmail,
                            CustomerStatusType: result.Object.CustomerStatusType,
                          };
                        this.user = [obj];
                    }else{
                        this.errorAffililate = result.Description == '' ? "Không tìm thấy dữ liệu khách hàng" : result.Description;
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