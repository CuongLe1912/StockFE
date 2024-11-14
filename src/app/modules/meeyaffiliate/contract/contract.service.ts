import { Injectable } from "@angular/core";
import { MOOrderCreateEntity } from "../../../_core/domains/entities/meeyorder/order.create.entity";
import { MethodType } from "../../../_core/domains/enums/method.type";
import { ApiUrl } from "../../../_core/helpers/api.url.helper";
import { AdminApiService } from "../../../_core/services/admin.api.service";

@Injectable()
export class MAFContractService extends AdminApiService {
    async getAllSale(meeyIds: string[]) {
        const api = ApiUrl.ToUrl('/admin/mafcontract/SaleItems');
        return await this.ToResultApi(api, MethodType.Post, meeyIds);
    }

    async approve(item: any) {
        const api = ApiUrl.ToUrl('/admin/mafcontract/Approve');
        return await this.ToResultApi(api, MethodType.Post, item);
    }

    async reject(item: any) {
        const api = ApiUrl.ToUrl('/admin/mafcontract/Reject');
        return await this.ToResultApi(api, MethodType.Post, item);
    }
}