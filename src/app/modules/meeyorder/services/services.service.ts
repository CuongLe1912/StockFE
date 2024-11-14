import { Injectable } from "@angular/core";
import { PriceConfigEntity } from "../../../_core/domains/entities/meeyorder/price.config.entity";
import { ComboEntity } from "../../../_core/domains/entities/meeyorder/combo.entity";
import { MOServicesEntity } from "../../../_core/domains/entities/meeyorder/services.entity";
import { MethodType } from "../../../_core/domains/enums/method.type";
import { ApiUrl } from "../../../_core/helpers/api.url.helper";
import { AdminApiService } from "../../../_core/services/admin.api.service";

@Injectable()
export class MOServicesService extends AdminApiService {
    async ServiceByIds(ids: string) {
        const api = ApiUrl.ToUrl('/admin/moservices/ServiceByIds?ids=' + ids);
        return await this.ToResultApi(api, MethodType.Get);
    }

    async addOrUpdateService(item: MOServicesEntity) {
        const api = ApiUrl.ToUrl('/admin/moservices/AddOrUpdateService');
        return await this.ToResultApi(api, MethodType.Post, item);
    }

    async AddOrUpdateCombo(item: ComboEntity) {
        const api = ApiUrl.ToUrl('/admin/moservices/AddOrUpdateCombo');
        return await this.ToResultApi(api, MethodType.Post, item);
    }

    async PriceConfigActive(id: number) {
        const api = ApiUrl.ToUrl('/admin/moservices/PriceConfigActive/' + id);
        return await this.ToResultApi(api, MethodType.Get);
    }

    async addPriceConfigService(item: PriceConfigEntity) {
        const api = ApiUrl.ToUrl('/admin/moservices/AddPriceConfigService');
        return await this.ToResultApi(api, MethodType.Post, item);
    }

    async addPriceConfigCombo(item: PriceConfigEntity) {
        const api = ApiUrl.ToUrl('/admin/moservices/AddPriceConfigCombo');
        return await this.ToResultApi(api, MethodType.Post, item);
    }

    async PriceConfigCancel(id: number) {
        const api = ApiUrl.ToUrl('/admin/moservices/PriceConfigCancel/' + id);
        return await this.ToResultApi(api, MethodType.Delete);
    }

    async AddPriceListService(item: { PriceConfig: PriceConfigEntity[] }) {
        const api = ApiUrl.ToUrl('/admin/moservices/AddPriceListService');
        return await this.ToResultApi(api, MethodType.Post, item);
    }
}