import { Injectable } from '@angular/core';
import { MethodType } from '../../../_core/domains/enums/method.type';
import { ApiUrl } from '../../../_core/helpers/api.url.helper';
import { AdminApiService } from '../../../_core/services/admin.api.service';

@Injectable()
export class MAFRankCumulativeService extends AdminApiService {

  async ActiveItem() {
    const api = ApiUrl.ToUrl('/admin/MAFRankCumulative/ActiveItem');
    return await this.ToResultApi(api, MethodType.Get);
  }

  async AddOrUpdate(items) {
    const api = ApiUrl.ToUrl('/admin/MAFRankCumulative/AddOrUpdate');
    return await this.ToResultApi(api, MethodType.Post, items);
  }

}
