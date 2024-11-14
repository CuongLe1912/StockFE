import { Injectable } from "@angular/core";
import { MethodType } from "../../domains/enums/method.type";
import { ApiUrl } from "../../helpers/api.url.helper";
import { AdminApiService } from "../../services/admin.api.service";
import { ModuleEntity } from "./entities/create.decorator.entity";

@Injectable()
export class CreateEntityService extends AdminApiService {
    async ExportFile(item: ModuleEntity) {
        const api = ApiUrl.ToUrl('/admin/createentity/exportFile');
        return await this.ToResultApi(api, MethodType.Post, item);
    }
}