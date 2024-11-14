import { Injectable } from '@angular/core';
import { ApiUrl } from '../../../_core/helpers/api.url.helper';
import { MethodType } from '../../../_core/domains/enums/method.type';
import { AdminApiService } from '../../../_core/services/admin.api.service';

@Injectable()
export class RoleService extends AdminApiService {
    async addOrUpdate(obj: any) {
        const api = ApiUrl.ToUrl('/admin/role');
        return await this.ToResultApi(api, MethodType.Put, obj);
    }
    async addUsers(roleId: number, userIds: number[]) {
        const api = ApiUrl.ToUrl('/admin/role/addusers/' + roleId);
        return await this.ToResultApi(api, MethodType.Put, userIds);
    }
    async updateUsers(roleId: number, userIds: number[]) {
        const api = ApiUrl.ToUrl('/admin/role/updateusers/' + roleId);
        return await this.ToResultApi(api, MethodType.Put, userIds);
    }
    async updatePermissions(roleId: number, permissions: any[]) {
        const api = ApiUrl.ToUrl('/admin/role/updatepermissions/' + roleId);
        return await this.ToResultApi(api, MethodType.Put, permissions);
    }
    async allPermissions(roleId: number, organizationId?: number) {
        let api = ApiUrl.ToUrl('/admin/permission/allpermissionbyrole/' + (roleId || 0));
        if (organizationId)
            api += '?organizationId=' + organizationId;
        return await this.ToResultApi(api, MethodType.Get);
    }
}