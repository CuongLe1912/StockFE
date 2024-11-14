import { Injectable } from '@angular/core';
import { ApiUrl } from '../../_core/helpers/api.url.helper';
import { MethodType } from '../../_core/domains/enums/method.type';
import { AdminApiService } from '../../_core/services/admin.api.service';
import { MSBoxTextLink, MSTextLinkDetail } from '../../_core/domains/entities/meeyseo/ms.box.text.link.entity';

@Injectable()
export class MSSeoService extends AdminApiService {
    async getTag(id: string) {
        const api = ApiUrl.ToUrl('/admin/msseo/item/' + id);
        return await this.ToResultApi(api, MethodType.Get);
    }
    async loadConfig(item: any) {
        const api = ApiUrl.ToUrl('/admin/MSSeoConfig/LoadConfig');
        return await this.ToResultApi(api, MethodType.Post, item);
    }
    async selectedProject(id: any) {
        let ids = Array.isArray(id)
            ? id
            : [id];
        const api = ApiUrl.ToUrl('/admin/MSSeoConfig/SelectedProjects');
        return await this.ToResultApi(api, MethodType.Post, { Ids: ids });
    }
    async getTypes() {
        const api = ApiUrl.ToUrl('/admin/msboxtextlink/types');
        return await this.ToResultApi(api, MethodType.Get);
    }
    async getBoxDetails(type: number) {
        const api = ApiUrl.ToUrl('/admin/msboxtextlink/' + type);
        return await this.ToResultApi(api, MethodType.Get);
    }
    async saveBox(items: MSBoxTextLink[]) {
        let obj = items.map((c: MSBoxTextLink) => {
            return {
                Id: c.Id,
                Name: c.Name,
                Type: c.Type,
                Details: c.Details.map((p: MSTextLinkDetail) => {
                    return {
                        Id: p.Id,
                        Rel: p.Rel,
                        Url: p.Url,
                        Name: p.Name,
                        Target: p.Target,
                        NeedUpdate: p.NeedUpdate,
                    }
                })
            }
        });
        const api = ApiUrl.ToUrl('/admin/msboxtextlink/addOrUpdate');
        return await this.ToResultApi(api, MethodType.Post, obj);
    }
    async deleteBox(idBox: number) {
        const api = ApiUrl.ToUrl('/admin/msboxtextlink/' + idBox);
        return await this.ToResultApi(api, MethodType.Delete);
    }
    async deleteTextlink(idTextLink: number) {
        const api = ApiUrl.ToUrl('/admin/msboxtextlink/textlink/' + idTextLink);
        return await this.ToResultApi(api, MethodType.Delete);
    }
    async updateBoxRel(item: any) {
        const api = ApiUrl.ToUrl('/admin/msboxtextlink/updaterel');
        return await this.ToResultApi(api, MethodType.Put, item);
    }
    async updateBoxTarget(item: any) {
        const api = ApiUrl.ToUrl('/admin/msboxtextlink/updatetarget');
        return await this.ToResultApi(api, MethodType.Put, item);
    }
    async getMetaSeo(id: any, type: any) {
        const api = ApiUrl.ToUrl('/admin/MSMetaSeo/Item/' + id + "?type=" + type);
        return await this.ToResultApi(api, MethodType.Get);
    }
    async getMetaSeoV2(id: any) {
        const api = ApiUrl.ToUrl('/admin/MSMetaSeoV2/Item/' + id);
        return await this.ToResultApi(api, MethodType.Get);
    }
}