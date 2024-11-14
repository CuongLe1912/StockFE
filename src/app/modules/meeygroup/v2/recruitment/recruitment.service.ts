import { Injectable } from '@angular/core';
import { ApiUrl } from '../../../../_core/helpers/api.url.helper';
import { MethodType } from '../../../../_core/domains/enums/method.type';
import { AdminApiService } from '../../../../_core/services/admin.api.service';

@Injectable()
export class RecruitmentService extends AdminApiService {
    async addOrUpdate(obj: any) {
        const api = ApiUrl.ToUrl('/admin/MGRecruitment/AddOrUpdate');
        return await this.ToResultApi(api, MethodType.Put, obj);
    }
    async getItem(id: number) {
        const api = ApiUrl.ToUrl('/admin/MGRecruitment/GetItem/'+ id);
        return await this.ToResultApi(api, MethodType.Get);
    }
    async publish(id: number) {
        const api = ApiUrl.ToUrl('/admin/MGRecruitment/Publish/'+ id);
        return await this.ToResultApi(api, MethodType.Post);
    }
    async pause(id: number) {
        const api = ApiUrl.ToUrl('/admin/MGRecruitment/Pause/'+ id);
        return await this.ToResultApi(api, MethodType.Post);
    }
    async repost(id: number) {
        const api = ApiUrl.ToUrl('/admin/MGRecruitment/Repost/'+ id);
        return await this.ToResultApi(api, MethodType.Post);
    }
    async deleteRecruitment(id: number) {
        const api = ApiUrl.ToUrl('/admin/MGRecruitment/DeleteRecruitment/'+ id);
        return await this.ToResultApi(api, MethodType.Delete);
    }
}