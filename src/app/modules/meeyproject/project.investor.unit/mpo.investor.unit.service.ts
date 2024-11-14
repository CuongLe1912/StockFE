import { Injectable } from "@angular/core";
import { MethodType } from "../../../_core/domains/enums/method.type";
import { ApiUrl } from "../../../_core/helpers/api.url.helper";
import { AdminApiService } from "../../../_core/services/admin.api.service";


@Injectable()
export class InvestorUnitService extends AdminApiService {
    async delete(id: any) {
        const api = ApiUrl.ToUrl('/admin/MPOProjectInvestorUnit/DeleteRelatedUnit/' + id);
        const params = {
            deletedBy: {
                data: {
                    _id: this.getCurentUserId(),
                    fullname: this.getCurentUserFullName(),
                },
                source: "admin"
            }
        }
        return await this.ToResultApi(api, MethodType.Post, params);
    }

    async updateStatus(item: any) {
        const _url = ApiUrl.ToUrl('/admin/MPOProjectInvestorUnit/UpdateRelatedUnit/' + item.Id);
        let params = {
            relatedUnitType: item.RelatedUnitType,
            isActive: !item.isActive,
            updatedBy: {
                data: {
                    _id: this.getCurentUserId(),
                    fullname: this.getCurentUserFullName(),
                },
                source: 'admin'
            }
        }
        return await this.ToResultApi(ApiUrl.ToUrl(_url), MethodType.Put, params);
    }
}