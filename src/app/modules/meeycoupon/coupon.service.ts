import { Injectable } from '@angular/core';
import { ApiUrl } from '../../_core/helpers/api.url.helper';
import { MethodType } from '../../_core/domains/enums/method.type';
import { AdminApiService } from '../../_core/services/admin.api.service';
import { MCCouponEntity } from '../../_core/domains/entities/meeycoupon/mc.coupon.entity';
import { MCCouponUpdateStatusEntity } from '../../_core/domains/entities/meeycoupon/mc.coupon.entity';

@Injectable()
export class MeeyCouponService extends AdminApiService {
    async addOrUpdateCounpon(item: MCCouponEntity, id: string) {
        const api = id
            ? ApiUrl.ToUrl('/admin/MCCoupon/AddOrUpdate/' + id)
            : ApiUrl.ToUrl('/admin/MCCoupon/AddOrUpdate');
        const method = id ? MethodType.Put : MethodType.Post;
        return await this.ToResultApi(api, method, item);
    }
    async updateStatus(obj: MCCouponUpdateStatusEntity) {
        const api = ApiUrl.ToUrl('/admin/MCCoupon/UpdateStatus');
        return await this.ToResultApi(api, MethodType.Put, {
            Id: obj.Id,
            Status: obj.Status,
        });
    }
    async ListServiceByIds(ids: string) {
        const api = ApiUrl.ToUrl('/admin/MCCoupon/ListServicesByIds?ids=' + ids);
        return await this.ToResultApi(api, MethodType.Get);
    }
}