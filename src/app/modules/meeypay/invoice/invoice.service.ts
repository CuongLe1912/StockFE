import { EventEmitter, Injectable } from '@angular/core';
import { ApiUrl } from '../../../_core/helpers/api.url.helper';
import { MethodType } from '../../../_core/domains/enums/method.type';
import { AdminApiService } from '../../../_core/services/admin.api.service';
import { MPInvoiceEntity } from '../../../_core/domains/entities/meeypay/mp.invoice.entity';

@Injectable()
export class MPInvoiceService extends AdminApiService {
    async addList(items: MPInvoiceEntity[], idRemove: number = null) {
        let url = '/admin/mpinvoice/AddList';
        if (idRemove) {
            url += '?id=' + idRemove;
        }
        const api = ApiUrl.ToUrl(url);
        return await this.ToResultApi(api, MethodType.Post, items);
    }

    async exportInvoice(id, obj: MPInvoiceEntity) {
        const api = ApiUrl.ToUrl('/admin/mpinvoice/Export/' + id);
        if (obj) {
            delete obj.IsActive;
            delete obj.IsDelete;
            delete obj.CreatedBy;
            delete obj.UpdatedBy;
            delete obj.CreatedDate;
            delete obj.UpdatedDate;
        }
        return await this.ToResultApi(api, MethodType.Put, obj);
    }

    async checkTransactions(codes: any[]) {
        const api = ApiUrl.ToUrl('/admin/mpinvoice/CheckTransactions');
        return await this.ToResultApi(api, MethodType.Post, codes);
    }

    async groupInvoices(item: MPInvoiceEntity) {
        const api = ApiUrl.ToUrl('/admin/mpinvoice/GroupInvoices');
        return await this.ToResultApi(api, MethodType.Post, item);
    }
}
