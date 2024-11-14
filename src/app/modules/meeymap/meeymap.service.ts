import { Injectable } from '@angular/core';
import { ApiUrl } from '../../_core/helpers/api.url.helper';
import { MethodType } from '../../_core/domains/enums/method.type';
import { AdminApiService } from '../../_core/services/admin.api.service';
import { MMRequestEntity } from '../../_core/domains/entities/meeymap/mm.request.entity';
import { MMLookupHistoryEntity } from '../../_core/domains/entities/meeymap/mm.lookup.history.entity';
import { MMLookupHistoryAssignListEntity } from '../../_core/domains/entities/meeymap/mm.lookup.history.assign.entity';

@Injectable()
export class MeeymapService extends AdminApiService {
    async itemByMeeyId(meeyId: string) {
        const api = ApiUrl.ToUrl('/admin/MMLookupHistory/MeeyId/' + meeyId);
        return await this.ToResultApi(api, MethodType.Get);
    }
    async statistical() {
        const api = ApiUrl.ToUrl('/admin/MMLookupHistory/Statistical');
        return await this.ToResultApi(api, MethodType.Get);
    }
    async historyAssign(id: number) {
        const api = ApiUrl.ToUrl('/admin/MMLookupHistory/HistoryAssign/' + id);
        return await this.ToResultApi(api, MethodType.Get);
    }
    async assign(obj: MMLookupHistoryEntity) {
        const api = ApiUrl.ToUrl('/admin/MMLookupHistory/Assign/' + obj.Id);
        let params = {
            UserId: obj.UserId
        };
        return await this.ToResultApi(api, MethodType.Post, params);
    }
    async addNote(obj: MMLookupHistoryEntity) {
        const api = ApiUrl.ToUrl('/admin/MMLookupHistory/AddNote/' + obj.Id);
        let params = {
            Notes: obj.Notes
        };
        return await this.ToResultApi(api, MethodType.Post, params);
    }
    async assigns(obj: MMLookupHistoryAssignListEntity) {
        const api = ApiUrl.ToUrl('/admin/MMLookupHistory/Assigns/');
        let params = {
            Ids: obj.Ids,
            UserId: obj.UserId
        };
        return await this.ToResultApi(api, MethodType.Post, params);
    }

    async updateStatus(item: MMRequestEntity) {
        const api = ApiUrl.ToUrl('/admin/mmrequest/UpdateStatus');
        return await this.ToResultApi(api, MethodType.Put, item);
    }
    async addNoteAndUpdateStatus(item: MMRequestEntity) {
        const api = ApiUrl.ToUrl('/admin/mmrequest/AddNoteAndUpdateStatus');
        return await this.ToResultApi(api, MethodType.Put, item);
    }
}