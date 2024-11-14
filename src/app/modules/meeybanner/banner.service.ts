import { Injectable } from '@angular/core';
import { ApiUrl } from '../../_core/helpers/api.url.helper';
import { MethodType } from '../../_core/domains/enums/method.type';
import { AdminApiService } from '../../_core/services/admin.api.service';
import { MBStatusType } from '../../_core/domains/entities/meeybanner/enums/mb.status.type';
import { MBBannerEntity, MBBannerUpdateStatusEntity } from '../../_core/domains/entities/meeybanner/mb.banner.entitty';

@Injectable()
export class MBBannerService extends AdminApiService {
    async updateStatus(id: number, status: MBStatusType) {
        const api = ApiUrl.ToUrl('/admin/MBBanner/UpdateStatus');
        return await this.ToResultApi(api, MethodType.Put, {
            Id: id,
            Status: status,
        });
    }

    async updateStatus2(obj: MBBannerUpdateStatusEntity) {
        const api = ApiUrl.ToUrl('/admin/MBBanner/UpdateStatus');
        return await this.ToResultApi(api, MethodType.Put, {
            Id: obj.Id,
            Status: obj.Status,
            EndDate: obj.EndDate,
            StartDate: obj.StartDate,
            DisplayTime: obj.DisplayTime,
        });
    }

    async addOrUpdate(obj: MBBannerEntity) {
        const api = ApiUrl.ToUrl('/admin/MBBanner/AddOrUpdate');
        return await this.ToResultApi(api, MethodType.Put, obj);
    }
}