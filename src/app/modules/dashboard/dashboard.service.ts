import { Injectable } from '@angular/core';
import { ApiUrl } from '../../_core/helpers/api.url.helper';
import { MethodType } from '../../_core/domains/enums/method.type';
import { AdminApiService } from '../../_core/services/admin.api.service';
import { MLArticleEntity, MLArticlePaymentEntity, MLArticleTransferDto } from '../../_core/domains/entities/meeyland/ml.article.entity';

@Injectable()
export class DashboardService extends AdminApiService {
    async statistical() {
        const api = ApiUrl.ToUrl('/admin/Utility/Statistical');
        return await this.ToResultApi(api, MethodType.Get);
    }
    async topCustomer(top: number = 10) {
        const api = ApiUrl.ToUrl('/admin/MCRMCustomer/TopItems/' + top);
        return await this.ToResultApi(api, MethodType.Get);
    }
}