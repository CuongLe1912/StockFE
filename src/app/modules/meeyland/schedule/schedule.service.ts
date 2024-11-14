import { Injectable } from '@angular/core';
import { ApiUrl } from '../../../_core/helpers/api.url.helper';
import { MethodType } from '../../../_core/domains/enums/method.type';
import { AdminApiService } from '../../../_core/services/admin.api.service';
import { CoordinateData } from '../../../_core/domains/data/coordinate.data';
import { MLScheduleEntity } from '../../../_core/domains/entities/meeyland/ml.schedule.entity';
import { MLScheduleCancelType, MLScheduleRejectType } from '../../../_core/domains/entities/meeyland/enums/ml.schedule.type';

@Injectable()
export class MLScheduleService extends AdminApiService {
    async statistical() {
        const api = ApiUrl.ToUrl('/admin/MLSchedule/Statistical');
        return await this.ToResultApi(api, MethodType.Get);
    }
    async getMaxIndex(id: number) {
        const api = ApiUrl.ToUrl('/admin/MLScheduleHistory/MaxIndex/' + id);
        return await this.ToResultApi(api, MethodType.Get);
    }
    async cancel(item: MLScheduleEntity) {
        const api = ApiUrl.ToUrl('/admin/MLSchedule/Cancel/' + item.Id);

        let reason = item.CancelText;
        switch (item.CancelType) {
            case MLScheduleCancelType.OtherBooking: reason = 'Đã đặt lịch khác';
            case MLScheduleCancelType.NotNeed: reason = 'Không có nhu cầu';
            case MLScheduleCancelType.Busy: reason = 'Bận việc';
            default: reason = item.CancelText;
        }
        let params = { 
            Ip: item.Ip,
            Reason: reason,
            Type: item.CancelType,
            OldStatus: item.OldStatus,
        };
        return await this.ToResultApi(api, MethodType.Put, params);
    }
    async update(item: MLScheduleEntity) {
        const api = ApiUrl.ToUrl('/admin/MLSchedule/Update/' + item.Id);
        let params = {
            Ip: item.Ip,
            Type: item.Type,
            Notes: item.Notes,
            UserShedule: {
                Name: item.UserSheduleName,
                Email: item.UserSheduleEmail,
                Phone: item.UserShedulePhone,
            },
            UserArticle: {
                Name: item.UserArticleName,
                Email: item.UserArticleEmail,
                Phone: item.UserArticlePhone,
            },
            ScheduleDate: item.ScheduleLookupDate,
            ScheduleTime: item.ScheduleLookupTime,
        };
        return await this.ToResultApi(api, MethodType.Put, params);
    }
    async updateStatus(item: MLScheduleEntity) {
        const api = ApiUrl.ToUrl('/admin/MLSchedule/UpdateStatus/' + item.Id);

        let reason = item.CancelText;
        switch (item.RejectType) {
            case MLScheduleRejectType.Busy: reason = 'Bận việc';
            case MLScheduleRejectType.Sold: reason = 'Đã bán';
            default: reason = item.CancelText;
        }
        let params = {
            Ip: item.Ip,
            Reason: reason,
            Status: item.Status,
            Type: item.RejectType,
            OldStatus: item.OldStatus,
        };
        return await this.ToResultApi(api, MethodType.Put, params);
    }
    async facilities(point: CoordinateData, distance: number = 5) {
        const api = ApiUrl.ToUrl('/admin/Facility/FindFacilites?lat=' + point.Lat + '&lng=' + point.Lng + '&distance=' + distance);
        return await this.ToResultApi(api, MethodType.Get);
    }
    async updateStatusMultiple(items: any[], item: MLScheduleEntity, ) {
        const api = ApiUrl.ToUrl('/admin/MLSchedule/UpdateStatusMultiple');

        let reason = item.CancelText;
        switch (item.RejectType) {
            case MLScheduleRejectType.Busy: reason = 'Bận việc';
            case MLScheduleRejectType.Sold: reason = 'Đã bán';
            default: reason = item.CancelText;
        }
        let params = {            
            Ip: item.Ip,
            Items: items,
            Reason: reason,
            Status: item.Status,
            Type: item.RejectType,
        };
        return await this.ToResultApi(api, MethodType.Put, params);
    }
}