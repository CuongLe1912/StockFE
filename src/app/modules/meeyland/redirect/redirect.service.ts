import { Injectable } from "@angular/core";
import { ApiUrl } from "../../../_core/helpers/api.url.helper";
import { MethodType } from "../../../_core/domains/enums/method.type";
import { AdminApiService } from "../../../_core/services/admin.api.service";

@Injectable()
export class MLRedirectService extends AdminApiService {
    async save(item: any) {
        const _url = '/admin/MLRedirect/' + (item?._id ? `UpdateRedirect/${item._id}` : 'AddRedirect');
        return await this.ToResultApi(ApiUrl.ToUrl(_url), item?._id ? MethodType.Put : MethodType.Post, item);
    }

    async delete(item: any) {
        const _url = '/admin/MLRedirect/DeleteRedirect';
        return await this.ToResultApi(ApiUrl.ToUrl(_url), MethodType.Post, item);
    }
}