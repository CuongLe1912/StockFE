import { Injectable } from '@angular/core';
import { ApiUrl } from '../../../_core/helpers/api.url.helper';
import { MethodType } from '../../../_core/domains/enums/method.type';
import { AdminApiService } from '../../../_core/services/admin.api.service';

@Injectable()
export class ProductService extends AdminApiService {
    async addOrUpdate(obj: any) {
        const api = ApiUrl.ToUrl('/admin/product/addorupdate');
        return await this.ToResultApi(api, MethodType.Put, obj);
    }
    async addUsers(productId: number, userIds: number[]) {
        const api = ApiUrl.ToUrl('/admin/product/addusers/' + productId);
        return await this.ToResultApi(api, MethodType.Put, userIds);
    }
    async updateUsers(productId: number, userIds: number[]) {
        const api = ApiUrl.ToUrl('/admin/product/updateusers/' + productId);
        return await this.ToResultApi(api, MethodType.Put, userIds);
    }
    async allPermissions(productId: number, organizationId?: number) {
        let api = ApiUrl.ToUrl('/admin/permission/allpermissionbyproduct/' + (productId || 0));
        if (organizationId)
            api += '?organizationId=' + organizationId;
        return await this.ToResultApi(api, MethodType.Get);
    }
}