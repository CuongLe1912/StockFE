import { Injectable } from "@angular/core";
import { ApiUrl } from "../../_core/helpers/api.url.helper";
import { MethodType } from "../../_core/domains/enums/method.type";
import { AdminApiService } from "../../_core/services/admin.api.service";

@Injectable()
export class M3DService extends AdminApiService{
    async statistical(obj: Object ) {
        const api = ApiUrl.ToUrl('/admin/M3DDashboard/Statistical');
        return await this.ToResultApi(api, MethodType.Post, obj);
    }
}

