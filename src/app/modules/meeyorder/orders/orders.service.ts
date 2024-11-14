import { Injectable } from "@angular/core";
import { TableData } from "../../../_core/domains/data/table.data";
import { MOOrderCreateEntity } from "../../../_core/domains/entities/meeyorder/order.create.entity";
import { MethodType } from "../../../_core/domains/enums/method.type";
import { ApiUrl } from "../../../_core/helpers/api.url.helper";
import { AdminApiService } from "../../../_core/services/admin.api.service";

@Injectable()
export class MOOrdersService extends AdminApiService {
    async ReportDaily() {
        const api = ApiUrl.ToUrl('/admin/moorders/ReportDaily');
        return await this.ToResultApi(api, MethodType.Get);
    }

    async TransByIds(ids: string[]) {
        const api = ApiUrl.ToUrl('/admin/moorders/TransByIds');
        return await this.ToResultApi(api, MethodType.Post, { ids: ids });
    }

    async TransMeeyIdByIds(meeyId: string, ids: string[]) {
        const api = ApiUrl.ToUrl('/admin/moorders/TransMeeyIdByIds');
        return await this.ToResultApi(api, MethodType.Post, { MeeyId: meeyId, ids: ids });
    }

    async PaymentHistory(orderId: number) {
        const api = ApiUrl.ToUrl('/admin/moorders/PaymentHistory/' + orderId);
        return await this.ToResultApi(api, MethodType.Get);
    }

    async getClient() {
        const api = ApiUrl.ToUrl('/admin/MOClient/lookup');
        return await this.ToResultApi(api, MethodType.Get);
    }

    async ProcessStatus(orderId: number) {
        const api = ApiUrl.ToUrl('/admin/moorders/ProcessStatus/' + orderId);
        return await this.ToResultApi(api, MethodType.Get);
    }

    async OrderInProcessStatus(orderId: number) {
        const api = ApiUrl.ToUrl('/admin/MMLookupHistory/OrderProcessing/' + orderId);
        return await this.ToResultApi(api, MethodType.Get);
    }
    async statistical() {
        const api = ApiUrl.ToUrl('/admin/moorders/Statistical');
        return await this.ToResultApi(api, MethodType.Get);
    }

    async AddOrder(item: MOOrderCreateEntity) {
        const api = ApiUrl.ToUrl('/admin/moorders/AddOrder');
        return await this.ToResultApi(api, MethodType.Post, item);
    }

    async ApproveOrRejectOrder(item) {
        const api = ApiUrl.ToUrl('/admin/moorders/ApproveOrRejectOrder');
        return await this.ToResultApi(api, MethodType.Post, item);
    }

    async ServiceForAdmin() {
        const api = ApiUrl.ToUrl('/admin/moservices/ServiceForAdmin');
        return await this.ToResultApi(api, MethodType.Get);
    }

    async ServiceForAddTurnAuditing() {
        let itemData: TableData = new TableData();
        itemData.Filters = (itemData && itemData.Filters) || [];
        itemData.Filters.push({
            Name: 'ProviderId',
            Value: 2,
        });
        itemData.Filters.push({
            Name: 'ParentGroupId',
            Value: 10,
        });
        const api = ApiUrl.ToUrl('/admin/moservices/items');
        return await this.ToResultApi(api, MethodType.Post, itemData);
    }
    async GetSaleAndSupport(meeyId:string) {
        const api = ApiUrl.ToUrl('/MCRMCustomer/GetSaleAndSupport/' + meeyId);
        return await this.ToResultApi(api, MethodType.Get);
    }
    
    async GetGroupService(providerId){
        const api = ApiUrl.ToUrl('admin/MOGroupService/Lookup/' + providerId);
        return await this.ToResultApi(api, MethodType.Get);
    }
}