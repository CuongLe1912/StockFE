import { EventEmitter, Injectable } from "@angular/core";
import { ApiUrl } from "../../../_core/helpers/api.url.helper";
import { MethodType } from "../../../_core/domains/enums/method.type";
import { AdminApiService } from "../../../_core/services/admin.api.service";
import { MPRevenueEntity } from "../../../_core/domains/entities/meeypay/mp.revenue.entity";
import { MPTransactionBalanceEntity, MPTransactionWithdrawalEntity } from "../../../_core/domains/entities/meeypay/mp.transactions.entity";

@Injectable()
export class MOTransactionRewardService extends AdminApiService {
    async MPayAddRequestPromotion(item: MPTransactionBalanceEntity) {
        const api = ApiUrl.ToUrl('/admin/transactionreward/CreateTransactionAddKM');
        return await this.ToResultApi(api, MethodType.Post, item);
    }
    async getNumbUserWalletTransactionReward(id:string) {
        const api = ApiUrl.ToUrl('/admin/transactionreward/GetUserWallet/' + id);
        return await this.ToResultApi(api, MethodType.Get);
    }
    async MPaySearchCustomer(KeyWord: string) {
        const api = ApiUrl.ToUrl('/admin/transactionreward/SearchCustomer?KeyWord=' + KeyWord);
        return await this.ToResultApi(api, MethodType.Get);
    }

    async MPayListMerchants() {
        const api = ApiUrl.ToUrl('/admin/transactionreward/ListMerchants');
        return await this.ToResultApi(api, MethodType.Get);
    }

    async statistical(StartDate:number, EndDate:number) {
        const api = ApiUrl.ToUrl('/admin/transactionreward/Statistical');
        return await this.ToResultApi(api, MethodType.Post,{ startDate: StartDate, endDate : EndDate });
    }

    //api cộng tiền tài khoản chính, trường hợp nguồn tiền từ ngân hàng
    async MPayCreateTransactionAddMainByBank(item: MPTransactionBalanceEntity) {
        const api = ApiUrl.ToUrl('/admin/transactionreward/CreateTransactionAddMainByBank');
        return await this.ToResultApi(api, MethodType.Post, item);
    }

    //api cộng tiền tài khoản chính, trường hợp nguồn tiền nộp tại quầy
    async MPayCreateTransactionAddMainByCounter(item: MPTransactionBalanceEntity) {
        const api = ApiUrl.ToUrl('/admin/transactionreward/CreateTransactionAddMainByCounter');
        return await this.ToResultApi(api, MethodType.Post, item);
    }

    //api kiểm tra thông tin Mã tiền thu
    async MPayCheckPaymentCode(Code: string) {
        const api = ApiUrl.ToUrl('/admin/MPRevenue/ItemByCode?code=' + Code);
        return await this.ToResultApi(api, MethodType.Get);
    }

    async addOrUpdate(obj: MPRevenueEntity) {
        const api = ApiUrl.ToUrl('/admin/mprevenue/addorupdate');
        return await this.ToResultApi(api, MethodType.Put, obj);
    }
    async ApproveOrReject(item) {
        const api = ApiUrl.ToUrl('/admin/transactionreward/ApproveOrReject');
        return await this.ToResultApi(api, MethodType.Post, item);
    }
    async TransMeeyIdByIds(meeyId:string, ids: string[]) {
        const api = ApiUrl.ToUrl('/admin/transactionreward/TransMeeyIdByIds');
        return await this.ToResultApi(api, MethodType.Post, { MeeyId: meeyId, ids : ids });
    }
    async getHyperLink(transactionId:string) {
        const api = ApiUrl.ToUrl('/admin/transactionreward/HyperLink/'+transactionId);
        return await this.ToResultApi(api, MethodType.Get);
    }

    //api duyệt hoặc từ chối giao dịch rút tiền
    async MPayWithdrawalApproveOrReject(item: MPTransactionWithdrawalEntity) {
        const api = ApiUrl.ToUrl('/admin/transactionreward/WithdrawalApproveOrReject');
        return await this.ToResultApi(api, MethodType.Post, item);
    }

    async AddNote(item) {
        const api = ApiUrl.ToUrl('/admin/transactionreward/AddNote');
        return await this.ToResultApi(api, MethodType.Post, item);
    }
}