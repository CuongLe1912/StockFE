import { Injectable } from '@angular/core';
import { ApiUrl } from '../../../_core/helpers/api.url.helper';
import { MethodType } from '../../../_core/domains/enums/method.type';
import { AdminApiService } from '../../../_core/services/admin.api.service';

@Injectable()
export class MLCouponHmcService extends AdminApiService {
    async reOpen(id: number) {
        const api = ApiUrl.ToUrl('/admin/mlcouponhmc/reopen/' + id);
        return await this.ToResultApi(api, MethodType.Post);
    }
    async process(id: number) {
        const api = ApiUrl.ToUrl('/admin/mlcouponhmc/process/' + id);
        return await this.ToResultApi(api, MethodType.Post);
    }
}