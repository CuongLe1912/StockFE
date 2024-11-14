import { Injectable } from '@angular/core';
import { ApiUrl } from '../../../_core/helpers/api.url.helper';
import { MethodType } from '../../../_core/domains/enums/method.type';
import { AdminApiService } from '../../../_core/services/admin.api.service';

@Injectable()
export class MBankRecruitmentService extends AdminApiService {
    // async addOrUpdate(obj: any) {
    //     const api = ApiUrl.ToUrl('/admin/MBankRecruitment/AddOrUpdate');
    //     return await this.ToResultApi(api, MethodType.Put, obj);
    // }
    async getItem(id: number) {
        const api = ApiUrl.ToUrl('/admin/MBankRecruitment/GetItem/'+ id);
        return await this.ToResultApi(api, MethodType.Get);
    }
    async publish(obj: any) {
        const api = ApiUrl.ToUrl('/admin/MBankRecruitment/Publish');
        return await this.ToResultApi(api, MethodType.Put, obj);
    }
    async pause(obj: any) {
        const api = ApiUrl.ToUrl('/admin/MBankRecruitment/Pause');
        return await this.ToResultApi(api, MethodType.Put, obj);
    }
    async repost(obj: any) {
        const api = ApiUrl.ToUrl('/admin/MBankRecruitment/Repost');
        return await this.ToResultApi(api, MethodType.Put, obj);
    }
    async deleteRecruitment(id: number) {
        const api = ApiUrl.ToUrl('/admin/MBankRecruitment/DeleteRecruitment/'+ id);
        return await this.ToResultApi(api, MethodType.Delete);
    }
}