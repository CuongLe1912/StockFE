import { Injectable } from '@angular/core';
import { ApiUrl } from '../../../_core/helpers/api.url.helper';
import { MethodType } from '../../../_core/domains/enums/method.type';
import { AdminApiService } from '../../../_core/services/admin.api.service';
import { MLCompanyEntity } from '../../../_core/domains/entities/meeyland/ml.company.entity';
import { MLEmployeeEntity } from '../../../_core/domains/entities/meeyland/ml.employee.entity';

@Injectable()
export class MLBusinessAccountService extends AdminApiService {
    async getCompany(meeyId: string) {
        const api = ApiUrl.ToUrl('/admin/mlcompany/GetByMeeyId/' + meeyId);
        return await this.ToResultApi(api, MethodType.Get);
    }
    async lookupUser(keyword: string) {
        const api = ApiUrl.ToUrl('/admin/mlemployee/lookup?keyword=' + keyword);
        return await this.ToResultApi(api, MethodType.Get);
    }
    async getUserByMeeyId(meeyId: string) {
        const api = ApiUrl.ToUrl('/admin/MLUser/GetByMeeyId/' + meeyId);
        return await this.ToResultApi(api, MethodType.Get);
    }
    async deleteUser(id: number, obj: MLEmployeeEntity) {
        const api = ApiUrl.ToUrl('/admin/mlemployee/removeuser/' + id);
        let params = {
            Reason: obj.Reason
        };
        return await this.ToResultApi(api, MethodType.Post, params);
    }
    async rejectCompany(id: number, obj: MLCompanyEntity) {
        const api = ApiUrl.ToUrl('/admin/mlcompany/reject/' + id);
        let params = {
            Reason: obj.Notes
        };
        return await this.ToResultApi(api, MethodType.Post, params);
    }
    async approveCompany(id: number, obj: MLCompanyEntity) {
        const api = ApiUrl.ToUrl('/admin/mlcompany/approve/' + id);
        let params = {
            Reason: obj.Notes
        };
        return await this.ToResultApi(api, MethodType.Post, params);
    }
    async addUser(companyId: number, obj: MLEmployeeEntity) {
        const api = ApiUrl.ToUrl('/admin/mlemployee/adduser/' + companyId);
        let params = {
            Name: obj.Name,
            Email: obj.Email,
            Phone: obj.Phone,
            MeeyId: obj.MeeyId
        };
        return await this.ToResultApi(api, MethodType.Post, params);
    }    
    async receiveCustomer(id: number, obj: MLCompanyEntity) {
        const api = ApiUrl.ToUrl('/admin/mlcompany/receiveCustomer/' + id);
        let params = {
            Reason: obj.Reason
        };
        return await this.ToResultApi(api, MethodType.Post, params);
    }
}