import { Injectable } from '@angular/core';
import { ApiUrl } from '../../_core/helpers/api.url.helper';
import { MethodType } from '../../_core/domains/enums/method.type';
import { AdminApiService } from '../../_core/services/admin.api.service';
import { MLUserEntity } from '../../_core/domains/entities/meeyland/ml.user.entity';
import { AssignSaleConfig } from '../../_core/domains/entities/meeycrm/mcrm.assignsaleconfig.entity';
import { MCRMCustomerLeadEntity } from '../../_core/domains/entities/meeycrm/mcrm.customer.lead.entity';
import { MCRMCustomerRequestDto, MCRMCustomerRequestEntity } from '../../_core/domains/entities/meeycrm/mcrm.customer.request.entity';
import { MCRMCustomerContactDto, MCRMCustomerContactEntity } from '../../_core/domains/entities/meeycrm/mcrm.customer.contact.entity';
import { MCRMCustomerAssignDto, MCRMCustomerEntity, MCRMCustomerLeadStatusDto, MCRMCustomerNoteCallDto, MCRMCustomerNoteDto, MCRMCustomerNoteEmailDto, MCRMCustomerReceiveDto, MCRMCustomerStatusDto } from '../../_core/domains/entities/meeycrm/mcrm.customer.entity';

@Injectable()
export class MeeyCrmService extends AdminApiService {
    async addOrUpdateAssignSale(item: AssignSaleConfig) {
        const api = ApiUrl.ToUrl('/admin/MCRMAssignSaleConfig/AddOrUpdate');
        return await this.ToResultApi(api, MethodType.Put, item);
    }
    async addOrUpdate(item: MLUserEntity) {
        const api = ApiUrl.ToUrl('/admin/MCRMCustomer/AddOrUpdate');
        return await this.ToResultApi(api, MethodType.Put, item);
    }
    async syncCrm(phone:string) {
        let item = {
            phone : phone
        }
        const api = ApiUrl.ToUrl('/admin/MCRMCustomer/SyncCrm');
        return await this.ToResultApi(api, MethodType.Post, item);
    }
    
    async updateCrm(item: MCRMCustomerEntity) {
        const api = ApiUrl.ToUrl('/admin/MCRMCustomer/UpdateCrm');
        return await this.ToResultApi(api, MethodType.Put, item);
    }
    async findCustomer(obj: MCRMCustomerContactDto) {
        const api = ApiUrl.ToUrl('/admin/MCRMCustomer/FindCustomer/');
        return await this.ToResultApi(api, MethodType.Post, obj);
    }
    async checkCustomerIsActive(obj: MCRMCustomerContactDto) {
        const api = ApiUrl.ToUrl('/admin/MCRMCustomer/CheckCustomerIsActive/');
        return await this.ToResultApi(api, MethodType.Post, obj);
    }
    async getByPhoneOrEmail(keyword: string) {
        const api = ApiUrl.ToUrl('/admin/MLUser/GetByPhoneOrEmail/' + keyword);
        return await this.ToResultApi(api, MethodType.Get);
    }
    async getCallLogByCallId(callId: string) {
        const api = ApiUrl.ToUrl('/admin/MCRMCallLog/ItemByCallId/' + callId);
        return await this.ToResultApi(api, MethodType.Get);
    }
    async deleteContact(id: number) {
        const api = ApiUrl.ToUrl('/admin/MCRMCustomerContact/deleteItem/' + id);
        return await this.ToResultApi(api, MethodType.Delete);
    }
    async addOrUpdateContact(item: MCRMCustomerContactEntity) {
        const api = ApiUrl.ToUrl('/admin/MCRMCustomerContact/AddOrUpdate');
        return await this.ToResultApi(api, MethodType.Put, item);
    }
    async getCustomer(id: any, action: string) {
        const api = ApiUrl.ToUrl('/admin/MCRMCustomer/Item/' + id + '/' + action);
        return await this.ToResultApi(api, MethodType.Get);
    }
    async getCustomerbyMeeyId(id: string) {
        const api = ApiUrl.ToUrl('/admin/MCRMCustomer/ItemByMeeyId/' + id);
        return await this.ToResultApi(api, MethodType.Get);
    }
    async getPermissionCustomer(id: number) {
        const api = ApiUrl.ToUrl('/admin/MCRMCustomer/Permission/' + id);
        return await this.ToResultApi(api, MethodType.Get);
    }
    async lookupCustomer(id: number) {
        const api = ApiUrl.ToUrl('/admin/MCRMCustomer/LookupItem/' + id);
        return await this.ToResultApi(api, MethodType.Get);
    }
    async getAmountCustomer(userId: number) {
        const api = ApiUrl.ToUrl('/admin/User/getAmountCustomer/' + userId);
        return await this.ToResultApi(api, MethodType.Get);
    }
    async getCustomerIds(userId: number) {
        const api = ApiUrl.ToUrl('/admin/User/getCustomerIds/' + userId);
        return await this.ToResultApi(api, MethodType.Get);
    }
    async makeCall(obj: MCRMCustomerNoteCallDto, lead: boolean = false) {
        const api = lead
            ? ApiUrl.ToUrl('/admin/MCRMCustomerLead/MakeCall')
            : ApiUrl.ToUrl('/admin/MCRMCustomer/MakeCall');
        return await this.ToResultApi(api, MethodType.Post, {
            Prefix: obj.PrefixNumber,
            Phone: obj.PhoneText || obj.Phone,
            CustomerId: obj.CustomerId || obj.CustomerLeadId,
        });
    }
    async updateSuccess(obj: MCRMCustomerStatusDto) {
        const api = ApiUrl.ToUrl('/admin/MCRMCustomer/UpdateSuccess');
        return await this.ToResultApi(api, MethodType.Post, obj);
    }
    async updateStatus(obj: MCRMCustomerStatusDto) {
        const api = ApiUrl.ToUrl('/admin/MCRMCustomer/UpdateStatus');
        return await this.ToResultApi(api, MethodType.Post, obj);
    }
    async updateStatusLead(obj: MCRMCustomerLeadStatusDto) {
        const api = ApiUrl.ToUrl('/admin/MCRMCustomerLead/cancel');
        return await this.ToResultApi(api, MethodType.Post, obj);
    }
    async addOrUpdateNote(obj: MCRMCustomerNoteDto, lead: boolean = false) {
        const api = lead
            ? ApiUrl.ToUrl('/admin/MCRMCustomerLead/AddOrUpdateNote')
            : ApiUrl.ToUrl('/admin/MCRMCustomer/AddOrUpdateNote');
        return await this.ToResultApi(api, MethodType.Post, obj);
    }
    async addNoteCall(obj: MCRMCustomerNoteCallDto, lead: boolean = false) {
        const api = lead
            ? ApiUrl.ToUrl('/admin/MCRMCustomerLead/addNoteCall')
            : ApiUrl.ToUrl('/admin/MCRMCustomer/addNoteCall');
        return await this.ToResultApi(api, MethodType.Post, obj);
    }
    async addNoteEmail(obj: MCRMCustomerNoteEmailDto, lead: boolean = false) {
        const api = lead
            ? ApiUrl.ToUrl('/admin/MCRMCustomerLead/addNoteEmail')
            : ApiUrl.ToUrl('/admin/MCRMCustomer/addNoteEmail');
        return await this.ToResultApi(api, MethodType.Post, obj);
    }
    async addRequestGroup(obj: MCRMCustomerRequestDto) {
        const api = ApiUrl.ToUrl('/admin/MCRMCustomer/addRequestGroup');
        return await this.ToResultApi(api, MethodType.Post, obj);
    }

    async assignSale(obj: MCRMCustomerAssignDto) {
        const api = ApiUrl.ToUrl('/admin/MCRMCustomer/assignSale');
        return await this.ToResultApi(api, MethodType.Post, obj);
    }
    async assignSupport(obj: MCRMCustomerAssignDto) {
        const api = ApiUrl.ToUrl('/admin/MCRMCustomer/assignSupport');
        return await this.ToResultApi(api, MethodType.Post, obj);
    }
    async assignSaleFromAffiliate(obj: MCRMCustomerAssignDto) {
        const api = ApiUrl.ToUrl('/admin/MCRMCustomer/assignSaleFromAffiliate');
        return await this.ToResultApi(api, MethodType.Post, obj);
    }
    async assignAffiliate(obj: MCRMCustomerAssignDto) {
        const api = ApiUrl.ToUrl('/admin/MCRMCustomer/assignAffiliate');
        return await this.ToResultApi(api, MethodType.Post, obj);
    }
    async findAffiliate(meeyId: string) {
        const api = ApiUrl.ToUrl('/admin/MCRMCustomer/searchAffiliate/' + meeyId);
        return await this.ToResultApi(api, MethodType.Get);
    }
    async receiveCustomer(obj: MCRMCustomerReceiveDto) {
        const api = ApiUrl.ToUrl('/admin/MCRMCustomer/receiveCustomer');
        return await this.ToResultApi(api, MethodType.Post, obj);
    }

    async getCustomerRequest(id: number) {
        const api = ApiUrl.ToUrl('/admin/MCRMCustomerRequest/GetAsync/' + id);
        return await this.ToResultApi(api, MethodType.Get);
    }
    async approveRequestGroup(obj: MCRMCustomerRequestEntity) {
        const api = ApiUrl.ToUrl('/admin/MCRMCustomerRequest/Approve');
        return await this.ToResultApi(api, MethodType.Post, obj);
    }
    async rejectRequestGroup(obj: MCRMCustomerRequestEntity) {
        const api = ApiUrl.ToUrl('/admin/MCRMCustomerRequest/Reject');
        return await this.ToResultApi(api, MethodType.Post, obj);
    }

    async splitRequestGroup() {
        const api = ApiUrl.ToUrl('/admin/MCRMCustomerRequest/Split');
        return await this.ToResultApi(api, MethodType.Post);
    }

    async splitRequestGroupById(id: number) {
        const api = ApiUrl.ToUrl('/admin/MCRMCustomerRequest/Split/' + id);
        return await this.ToResultApi(api, MethodType.Post);
    }

    async getCallLogById(id: number) {
        const api = ApiUrl.ToUrl('/admin/MCRMCallLog/Item/' + id);
        return await this.ToResultApi(api, MethodType.Get);
    }

    async statistical(lead: boolean = false) {
        const api = lead
            ? ApiUrl.ToUrl('/admin/MCRMCustomerLead/Statistical')
            : ApiUrl.ToUrl('/admin/MCRMCustomer/Statistical');
        return await this.ToResultApi(api, MethodType.Get);
    }

    async getLastNoteItems(ids: string, lead: boolean = false) {
        const api = lead
            ? ApiUrl.ToUrl('/admin/MCRMCustomerLead/LastNoteItems?ids=' + ids)
            : ApiUrl.ToUrl('/admin/MCRMCustomer/LastNoteItems?ids=' + ids);
        return await this.ToResultApi(api, MethodType.Get);
    }
    async addOrUpdateCustomerLeadId(obj: MCRMCustomerLeadEntity) {
        const api = ApiUrl.ToUrl('/admin/MCRMCustomerLead/AddOrUpdate');
        return await this.ToResultApi(api, MethodType.Put, obj);
    }
    async getCustomerLead(id: number) {
        const api = ApiUrl.ToUrl('/admin/MCRMCustomerLead/Item/' + id);
        return await this.ToResultApi(api, MethodType.Get);
    }
}