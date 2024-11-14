import { Injectable } from '@angular/core';
import { ApiUrl } from '../../_core/helpers/api.url.helper';
import { TableData } from '../../_core/domains/data/table.data';
import { MethodType } from '../../_core/domains/enums/method.type';
import { AdminApiService } from '../../_core/services/admin.api.service';
import { MLUserResetPasswordType } from '../../_core/domains/entities/meeyland/enums/ml.user.type';
import { MCRMCustomerContactDto } from '../../_core/domains/entities/meeycrm/mcrm.customer.contact.entity';
import { MLUserDeleteEntity, MLUserEntity, MLUserLockEntity, MLUserResetPasswordEntity, MLUserVerifyPhoneEntity } from '../../_core/domains/entities/meeyland/ml.user.entity';

@Injectable()
export class MLUserService extends AdminApiService {
    async findCustomer(obj: MCRMCustomerContactDto) {
        const api = ApiUrl.ToUrl('/admin/MCRMCustomer/FindCustomer/');
        return await this.ToResultApi(api, MethodType.Post, obj);
    }
    async itemByMeeyId(meeyId: string) {
        const api = ApiUrl.ToUrl('/admin/MLUser/MeeyId/' + meeyId);
        return await this.ToResultApi(api, MethodType.Get);
    }
    async statistical() {
        const api = ApiUrl.ToUrl('/admin/MLUser/Statistical');
        return await this.ToResultApi(api, MethodType.Get);
    }
    async getAllSaleArticleItems(ids: number[]) {
        const api = ApiUrl.ToUrl('/admin/MLArticle/SaleItems?ids=' + ids.join(','));
        return await this.ToResultApi(api, MethodType.Get);
    }
    async getAllWalletItems(ids: number[]) {
        const api = ApiUrl.ToUrl('/admin/MLUser/WalletItems?ids=' + ids.join(','));
        return await this.ToResultApi(api, MethodType.Get);
    }
    async GetAllWalletByMeeyIds(meeyIds: string[]) {
        const api = ApiUrl.ToUrl('/admin/MLUser/WalletItemsByMeeyId?ids=' + meeyIds.join(','));
        return await this.ToResultApi(api, MethodType.Get);
    }
    async GetAllFnAmounts(nodeIds: number[]) {
        const api = ApiUrl.ToUrl('/admin/MAFAffiliateSynthetic/FnAmountItems?ids=' + nodeIds.join(','));
        return await this.ToResultApi(api, MethodType.Get);
    }
    async getUserByMeeyId(meeyId: string) {
        const api = ApiUrl.ToUrl('/admin/MLUser/GetByMeeyId/' + meeyId);
        return await this.ToResultApi(api, MethodType.Get);
    }
    async getListByMeeyIds(meeyIds: string[]) {
        const api = ApiUrl.ToUrl('/admin/MLUser/GetByMeeyIds');
        return await this.ToResultApi(api, MethodType.Post, meeyIds);
    }
    async getByPhoneOrEmail(keyword: string) {
        const api = ApiUrl.ToUrl('/admin/MLUser/GetByPhoneOrEmail/' + keyword);
        return await this.ToResultApi(api, MethodType.Get);
    }

    async haveService(id: number) {
        const api = ApiUrl.ToUrl('/admin/MLUser/HaveService/' + id);
        return await this.ToResultApi(api, MethodType.Get);
    }
    async addOrUpdate(item: MLUserEntity) {
        const api = ApiUrl.ToUrl('/admin/mluser/AddOrUpdate');
        return await this.ToResultApi(api, MethodType.Put, item);
    }
    async lockUser(item: MLUserLockEntity) {
        const api = ApiUrl.ToUrl('/admin/MLUser/Lock/' + item.Id);
        let params = {
            Reason: item.Reason
        };
        return await this.ToResultApi(api, MethodType.Put, params);
    }
    async statisticalEmbed(obj?: TableData) {
        const api = ApiUrl.ToUrl('/admin/MLUser/StatisticalEmbed');
        return await this.ToResultApi(api, MethodType.Post, obj);
    }
    async unlockUser(item: MLUserLockEntity) {
        const api = ApiUrl.ToUrl('/admin/MLUser/UnLock/' + item.Id);
        let params = {
            Reason: item.Reason
        };
        return await this.ToResultApi(api, MethodType.Put, params);
    }
    async deleteUser(item: MLUserDeleteEntity) {
        const api = ApiUrl.ToUrl('/admin/MLUser/Delete/' + item.Id);
        let params = {
            Reason: item.Reason
        };
        return await this.ToResultApi(api, MethodType.Put, params);
    }
    async verifyPhone(item: MLUserVerifyPhoneEntity) {
        const api = ApiUrl.ToUrl('/admin/MLUser/VerifyPhone/' + item.Id);
        let params = {
            Phone: item.Phone,
            DialingCode: '+84',
        };
        return await this.ToResultApi(api, MethodType.Put, params);
    }
    async verifyEmail(item: MLUserVerifyPhoneEntity) {
        const api = ApiUrl.ToUrl('/admin/MLUser/VerifyEmail/' + item.Id);
        let params = {
            Email: item.Email,
        };
        return await this.ToResultApi(api, MethodType.Put, params);
    }
    async resetPasswordForUser(item: MLUserResetPasswordEntity) {
        const api = ApiUrl.ToUrl('/admin/MLUser/ResetPassword/' + item.Id);
        let type = item.Type == MLUserResetPasswordType.Sms ? 'sms' : 'email';
        let params = {
            Type: type
        };
        return await this.ToResultApi(api, MethodType.Put, params);
    }
    async importToCRM(id: number) {
        const api = ApiUrl.ToUrl('/admin/MLUser/ImportToCrm/' + id);
        return await this.ToResultApi(api, MethodType.Post, id);
    }
}