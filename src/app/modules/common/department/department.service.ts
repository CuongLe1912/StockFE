import { Injectable } from '@angular/core';
import { ApiUrl } from '../../../_core/helpers/api.url.helper';
import { MethodType } from '../../../_core/domains/enums/method.type';
import { AdminApiService } from '../../../_core/services/admin.api.service';

@Injectable()
export class DepartmentService extends AdminApiService {
    async addOrUpdate(obj: any) {
        const api = ApiUrl.ToUrl('/admin/department/addorupdate');
        return await this.ToResultApi(api, MethodType.Put, obj);
    }
    async addUsers(departmentId: number, userIds: number[]) {
        const api = ApiUrl.ToUrl('/admin/department/addusers/' + departmentId);
        return await this.ToResultApi(api, MethodType.Put, userIds);
    }
    async updateUsers(departmentId: number, userIds: number[]) {
        const api = ApiUrl.ToUrl('/admin/department/updateusers/' + departmentId);
        return await this.ToResultApi(api, MethodType.Put, userIds);
    }
}