import { Injectable } from "@angular/core";
import { AdminApiService } from "../../../_core/services/admin.api.service";
import { MethodType } from "../../../_core/domains/enums/method.type";
import { ApiUrl } from "../../../_core/helpers/api.url.helper";
import { MAFContractType } from "../../../_core/domains/entities/meeyaffiliate/enums/contract.type";

@Injectable()
export class MAFPolicyService extends AdminApiService {
    async ActiveItem(type = MAFContractType.Individual) {
        const api = ApiUrl.ToUrl('/admin/mafpolicy/ActiveItem/' + type);
        return await this.ToResultApi(api, MethodType.Get);
    }
}