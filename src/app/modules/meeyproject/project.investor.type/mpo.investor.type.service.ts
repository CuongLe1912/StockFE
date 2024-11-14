import { Injectable } from "@angular/core";
import { SaveType } from "../../../_core/domains/entities/meeyproject/enums/mpo.save.type";
import { MethodType } from "../../../_core/domains/enums/method.type";
import { ApiUrl } from "../../../_core/helpers/api.url.helper";
import { AdminApiService } from "../../../_core/services/admin.api.service";


@Injectable()
export class InvestorTypeService extends AdminApiService {
    async save(item: any, type: SaveType) {
        const _url = '/admin/mpoprojectinvestorunittype' + (type == SaveType.ADD ? '/AddInvestorUnitType' : `/UpdateInvestorUnitType/${item.Id}`);
        const api = ApiUrl.ToUrl(_url);
        const methodType = (type == SaveType.ADD ? MethodType.Post : MethodType.Put);
        let params = {
            name: item.Name,
            description: item.Description ?? "",
            isActive: item.Active
        }
        if (type == SaveType.ADD) {
            let insertParam = {
                createdBy: {
                    data: {
                        _id: this.getCurentUserId(),
                        fullname: this.getCurentUserFullName(),
                    },
                    source: 'admin'
                }
            }
            params = { ...params, ...insertParam };
        }
        else {
            let updateParam = {
                updatedBy: {
                    data: {
                        _id: this.getCurentUserId(),
                        fullname: this.getCurentUserFullName(),
                    },
                    source: 'admin'
                }
            }
            params = { ...params, ...updateParam };
        }
        return await this.ToResultApi(api, methodType, params);
    }

    async updateStatus(item: any) {
        const _url = `/admin/mpoprojectinvestorunittype/UpdateInvestorUnitType/${item.Id}`;
        let params = {
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

    async deleteType(id: number) {
        const api = ApiUrl.ToUrl('/admin/mpoprojectinvestorunittype/DeleteInvestorUnitType/' + id);
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
}