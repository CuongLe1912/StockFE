import { Injectable } from '@angular/core';
import { ApiUrl } from '../../../_core/helpers/api.url.helper';
import { MethodType } from '../../../_core/domains/enums/method.type';
import { AdminApiService } from '../../../_core/services/admin.api.service';

@Injectable()
export class PositionService extends AdminApiService {
    async addUsers(positionId: number, userIds: number[]) {
        const api = ApiUrl.ToUrl('/admin/position/addusers/' + positionId);
        return await this.ToResultApi(api, MethodType.Put, userIds);
    }
    async updateUsers(positionId: number, userIds: number[]) {
        const api = ApiUrl.ToUrl('/admin/position/updateusers/' + positionId);
        return await this.ToResultApi(api, MethodType.Put, userIds);
    }
}