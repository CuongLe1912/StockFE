import { Injectable } from '@angular/core';
import { ApiUrl } from '../../../_core/helpers/api.url.helper';
import { MethodType } from '../../../_core/domains/enums/method.type';
import { AdminApiService } from '../../../_core/services/admin.api.service';

@Injectable()
export class CityService extends AdminApiService {
    async sync() {
        const api = ApiUrl.ToUrl('/admin/city/sync/');
        return await this.ToResultApi(api, MethodType.Post);
    }
}