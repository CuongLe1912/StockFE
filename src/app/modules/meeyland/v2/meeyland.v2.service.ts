import { Injectable } from '@angular/core';
import { ApiUrl } from '../../../_core/helpers/api.url.helper';
import { MethodType } from '../../../_core/domains/enums/method.type';
import { AdminApiService } from '../../../_core/services/admin.api.service';

@Injectable()
export class MeeylandV2Service extends AdminApiService {
    async getRootId(id: number) {
        const api = ApiUrl.ToUrl('/admin/v2/MLCustomer/GetRoot/' + id);
        return await this.ToResultApi(api, MethodType.Get);
    }
    async updateStatus(id: number) {
        const api = ApiUrl.ToUrl('/admin/v2/MLCustomer/UpdateStatus/' + id);
        return await this.ToResultApi(api, MethodType.Put);
    }
}