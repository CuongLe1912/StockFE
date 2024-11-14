import { Injectable } from "@angular/core";
import { AdminApiService } from "../../../_core/services/admin.api.service";
import { MethodType } from "../../../_core/domains/enums/method.type";
import { ApiUrl } from "../../../_core/helpers/api.url.helper";
import { TableData } from "../../../_core/domains/data/table.data";
import { MAFNodeType } from "../../../_core/domains/entities/meeyaffiliate/enums/affiliate.type";

@Injectable()
export class MAFAffiliateService extends AdminApiService {
    async findRefCodeUser(keyword: string) {
        const api = ApiUrl.ToUrl('/admin/MAFAffiliate/FindRefCodeUser/' + keyword);
        return await this.ToResultApi(api, MethodType.Get);
    }
    async updateRefCodeUser(user: { RefCode: string, MeeyId: string }) {
        const api = ApiUrl.ToUrl('/admin/MAFAffiliate/UpdateRefCodeUser/');
        return await this.ToResultApi(api, MethodType.Put, user);
    }

    async TreeNode(pageIndex, pageSize, nodeId: number, branchId = null, search: string = null) {
        let url = '/admin/MAFAffiliate/TreeNode/';
        if (nodeId != null) {
            url += url.includes("?")
                ? "&nodeId=" + nodeId
                : "?nodeId=" + nodeId;
        }
        if (branchId != null) {
            url += url.includes("?")
                ? "&branchId=" + branchId
                : "?branchId=" + branchId;
        }
        if (search) {
            url += url.includes("?")
                ? "&search=" + search
                : "?search=" + search;
        }
        const api = ApiUrl.ToUrl(url);
        let obj: TableData = {
            Paging: {
                Index: 1,
                Size: 1000
            }
        };
        if (pageIndex) {
            obj.Paging.Index = pageIndex > 0 ? pageIndex : 1;
        }
        if (pageSize) {
            obj.Paging.Size = pageSize > 0 ? pageSize : 1;
        }
        return await this.ToResultApi(api, MethodType.Post, obj);
    }

    async addNoteRequest(item: any) {
        const api = ApiUrl.ToUrl('/admin/MAFAffiliateRequest/');
        return await this.ToResultApi(api, MethodType.Post, item);
    }

    async getCommissionItems(item: any, id: any, type: MAFNodeType) {
        const api = ApiUrl.ToUrl('/admin/MAFAffiliate/CommissionItems/' + id + '?type=' + type);
        return await this.ToResultApi(api, MethodType.Post, item);
    }

    async checkMeeyId(search: any, curentNodeId: number = 0, type: number = 0) {
        const api = ApiUrl.ToUrl('/admin/MAFAffiliate/CheckMeeyId/' + search + '?curentNodeId=' + curentNodeId + '&type=' + type);
        return await this.ToResultApi(api, MethodType.Get);
    }

    async addBranch(item: any) {
        const api = ApiUrl.ToUrl('/admin/MAFAffiliate/BranchAdd/');
        return await this.ToResultApi(api, MethodType.Post, item);
    }

    async addNode(item: any) {
        const api = ApiUrl.ToUrl('/admin/MAFAffiliate/AddNode');
        return await this.ToResultApi(api, MethodType.Post, item);
    }

    async lookupUser(keyword: string) {
        const api = ApiUrl.ToUrl('/admin/mlemployee/lookup?keyword=' + keyword);
        return await this.ToResultApi(api, MethodType.Get);
    }

    async addRank(item: any) {
        const api = ApiUrl.ToUrl('/admin/MAFAffiliate/RankAdd/');
        return await this.ToResultApi(api, MethodType.Post, item);
    }

    async changeRank(item: any) {
        const api = ApiUrl.ToUrl('/admin/MAFAffiliate/RankChange/');
        return await this.ToResultApi(api, MethodType.Post, item);
    }

    async approveRequestNode(item: any) {
        const api = ApiUrl.ToUrl('/admin/MAFAffiliateRequest/Approve/');
        return await this.ToResultApi(api, MethodType.Post, item);
    }

    async lookupBranch() {
        const api = ApiUrl.ToUrl('/admin/MAFAffiliate/LookupBranch');
        return await this.ToResultApi(api, MethodType.Get);
    }

    async lookupRank() {
        const api = ApiUrl.ToUrl('/admin/MAFAffiliate/LookupRanks');
        return await this.ToResultApi(api, MethodType.Get);
    }

    async approveRank(id: any) {
        const params = {
            NodeId: id
        }
        const api = ApiUrl.ToUrl('/admin/MAFAffiliate/ApproveRank');
        return await this.ToResultApi(api, MethodType.Post, params);
    }
}