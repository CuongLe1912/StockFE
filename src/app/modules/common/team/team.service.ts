import { Injectable } from '@angular/core';
import { ApiUrl } from '../../../_core/helpers/api.url.helper';
import { MethodType } from '../../../_core/domains/enums/method.type';
import { AdminApiService } from '../../../_core/services/admin.api.service';

@Injectable()
export class TeamService extends AdminApiService {
    async addOrUpdate(obj: any) {
        const api = ApiUrl.ToUrl('/admin/team/addorupdate');
        return await this.ToResultApi(api, MethodType.Put, obj);
    }
    async addUsers(teamId: number, userIds: number[]) {
        const api = ApiUrl.ToUrl('/admin/team/addusers/' + teamId);
        return await this.ToResultApi(api, MethodType.Put, userIds);
    }
    async updateUsers(teamId: number, userIds: number[]) {
        const api = ApiUrl.ToUrl('/admin/team/updateusers/' + teamId);
        return await this.ToResultApi(api, MethodType.Put, userIds);
    }
    async allPermissions(teamId: number, organizationId?: number) {
        let api = ApiUrl.ToUrl('/admin/permission/allpermissionbyteam/' + (teamId || 0));
        if (organizationId)
            api += '?organizationId=' + organizationId;
        return await this.ToResultApi(api, MethodType.Get);
    }
}