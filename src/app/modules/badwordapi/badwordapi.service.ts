import { Injectable } from "@angular/core";
import { ApiUrl } from "../../_core/helpers/api.url.helper";
import { MethodType } from "../../_core/domains/enums/method.type";
import { AdminApiService } from "../../_core/services/admin.api.service";
import { BadwordApiEntity } from "../../_core/domains/entities/badwordapi/badwordapi.entity";

@Injectable()
export class BadwordApiService extends AdminApiService {


    async Add(obj: BadwordApiEntity) {
        const api = ApiUrl.ToUrl('/admin/BadwordApi');
        return await this.ToResultApi(api, MethodType.Post, obj);
    }
    async Edit(obj: BadwordApiEntity){
        const api = ApiUrl.ToUrl('/admin/BadwordApi');
        return await this.ToResultApi(api, MethodType.Put, obj);
    }
    async DeleteMulti(ids : []){
        const api = ApiUrl.ToUrl('/admin/BadwordApi/delete_multi');
        return await this.ToResultApi(api, MethodType.Post, ids);
    }
}