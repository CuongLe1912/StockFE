import { Injectable } from '@angular/core';
import { ApiUrl } from '../../_core/helpers/api.url.helper';
import { MethodType } from '../../_core/domains/enums/method.type';
import { AdminApiService } from '../../_core/services/admin.api.service';
import { MLArticleEntity, MLArticlePaymentEntity, MLArticleSyncDataTime, MLArticleTransferDto } from '../../_core/domains/entities/meeyland/ml.article.entity';

@Injectable()
export class MLArticleService extends AdminApiService {
    async loadConfig(item: any) {
        const api = ApiUrl.ToUrl('/admin/MLArticleConfig/LoadConfig');
        return await this.ToResultApi(api, MethodType.Post, item);
    }
    async parserData(link: string) {
        const api = ApiUrl.ToUrl('/admin/MLArticle/Parser');
        return await this.ToResultApi(api, MethodType.Post, {
            Link: link
        });
    }
    async itemByCode(meeyId: string) {
        const api = ApiUrl.ToUrl('/admin/MLArticle/Code/' + meeyId);
        return await this.ToResultApi(api, MethodType.Get);
    }
    async itemByMeeyId(meeyId: string) {
        const api = ApiUrl.ToUrl('/admin/MLArticle/MeeyId/' + meeyId);
        return await this.ToResultApi(api, MethodType.Get);
    } 
    async itemByReportId(reportId: string) {
        const api = ApiUrl.ToUrl('/admin/MLArticleReport/' + reportId);
        return await this.ToResultApi(api, MethodType.Get);
    } 
    async selectedProject(id: any) {
        let ids = Array.isArray(id)
            ? id
            : [id];
        const api = ApiUrl.ToUrl('/admin/MLArticleConfig/SelectedProjects');
        return await this.ToResultApi(api, MethodType.Post, { Ids: ids });
    } 
    async statistical() {
        const api = ApiUrl.ToUrl('/admin/MLArticle/statistical');
        return await this.ToResultApi(api, MethodType.Get);
    }
    async subscriptions() {
        const api = ApiUrl.ToUrl('/admin/MLArticle/Subscriptions');
        return await this.ToResultApi(api, MethodType.Get);
    }
    async subscriptionPush(id: string) {
        const api = ApiUrl.ToUrl('/admin/MLArticle/SubscriptionPush/' + id);
        return await this.ToResultApi(api, MethodType.Get);
    }
    async push(id: number) {
        const api = ApiUrl.ToUrl('/admin/MLArticle/push/');
        return await this.ToResultApi(api, MethodType.Post, { Ids: [id] });
    }
    async repost(id: number) {
        const api = ApiUrl.ToUrl('/admin/MLArticle/repost/' + id);
        return await this.ToResultApi(api, MethodType.Post);
    }
    async sync(ids: number[]) {
        const api = ApiUrl.ToUrl('/admin/MLArticle/sync');
        let params = {
            Ids: ids
        };
        return await this.ToResultApi(api, MethodType.Post, params);
    }
    async updateViewed(id: number) {
        const api = ApiUrl.ToUrl('/admin/MLArticle/UpdateViewed/' + id);
        return await this.ToResultApi(api, MethodType.Post);
    }
    async approve(id: number) {
        const api = ApiUrl.ToUrl('/admin/MLArticle/approve/' + id);
        return await this.ToResultApi(api, MethodType.Post);
    }
    async deleteArticle(id: number) {
        const api = ApiUrl.ToUrl('/admin/MLArticle/delete/' + id);
        return await this.ToResultApi(api, MethodType.Delete);
    }
    async approveContent(id: number) {
        const api = ApiUrl.ToUrl('/admin/MLArticle/approveContent/' + id);
        return await this.ToResultApi(api, MethodType.Post);
    }
    async verifyArticle(ids: number[]) {
        const api = ApiUrl.ToUrl('/admin/MLArticle/verify');
        let params = {
            Ids: ids
        };
        return await this.ToResultApi(api, MethodType.Post, params);
    }
    async addOrUpdate(item: MLArticleEntity) {
        const api = ApiUrl.ToUrl('/admin/MLArticle/AddOrUpdate');
        return await this.ToResultApi(api, MethodType.Put, item);
    }
    async addOrUpdateV4(item: MLArticleEntity) {
        const api = ApiUrl.ToUrl('/admin/MLArticle/AddOrUpdateV4');
        return await this.ToResultApi(api, MethodType.Put, item);
    }
    async getAllSaleItems(ids: number[]) {
        const api = ApiUrl.ToUrl('/admin/MLArticle/SaleItems?ids=' + ids.join(','));
        return await this.ToResultApi(api, MethodType.Get);
    }
    async reject(id: number, reason: string) {
        const api = ApiUrl.ToUrl('/admin/MLArticle/reject/' + id);
        return await this.ToResultApi(api, MethodType.Post, { Reason: reason });
    }
    async findUseerByPhoneOrEmail(keyword: string) {
        const api = ApiUrl.ToUrl('/admin/MLUser/GetByPhoneOrEmail/' + keyword);
        return await this.ToResultApi(api, MethodType.Get);
    }
    async markReport(reportId: string, reason: string) {
        const api = ApiUrl.ToUrl('/admin/MLArticleReport/mark');
        let params = {
            Reason: reason,
            ReportId: reportId,
        };
        return await this.ToResultApi(api, MethodType.Post, params);
    }
    async transfer(ids: number[], item: MLArticleTransferDto) {
        const api = ApiUrl.ToUrl('/admin/MLArticle/transfer');
        let params = {
            Ids: ids,
            Notes: item.Notes,
            SupportId: item.SupportId,
        };
        return await this.ToResultApi(api, MethodType.Post, params);
    }
    async cancelReport(ids: number[], reason: string, sendEmail: boolean, reportId: string) {
        const api = ApiUrl.ToUrl('/admin/MLArticleReport/cancel');
        let params = {
            Ids: ids,
            Reason: reason,
            ReportId: reportId,
            SendEmail: sendEmail
        };
        return await this.ToResultApi(api, MethodType.Post, params);
    }
    async rejectContent(id: number, reason: string, unPublish: boolean, sendEmail: boolean) {
        const api = ApiUrl.ToUrl('/admin/MLArticle/rejectContent/' + id);
        return await this.ToResultApi(api, MethodType.Post, { 
            Reason: reason, 
            UnPublish: unPublish,
            SendEmail: sendEmail
        });
    }
    async cancel(ids: number[], reason: string, images: string[], sendEmail: boolean) {
        const api = ApiUrl.ToUrl('/admin/MLArticle/cancel');
        let params = {
            Ids: ids,
            Reason: reason,
            Images: images,
            SendEmail: sendEmail
        };
        return await this.ToResultApi(api, MethodType.Post, params);
    }

    /// payment
    async sendOtp(phone: string) {
        const api = ApiUrl.ToUrl('/admin/MLArticle/SendOtp/');
        let params = {
            Phone: phone,
        };
        return await this.ToResultApi(api, MethodType.Post, params);
    }
    async payment(obj: MLArticlePaymentEntity) {
        const api = ApiUrl.ToUrl('/admin/MLArticle/Paymemt');
        let params = {
            Amount: obj.Amount,
            MeeyId: obj.MeeyId,
            OrderId: obj.OrderId,
            BuyerName: obj.BuyerName,
            BuyerPhone: obj.BuyerPhone,
            BuyerEmail: obj.BuyerEmail,
        };
        return await this.ToResultApi(api, MethodType.Post, params);
    }
    async reSendOtp(phone: string, requestId: string) {
        const api = ApiUrl.ToUrl('/admin/MLArticle/ReSendOtp/');
        let params = {
            Phone: phone,
            RequestId: requestId,
        };
        return await this.ToResultApi(api, MethodType.Post, params);
    }
    async verifyOtp(phone: string, requestId: string, otp: string) {
        const api = ApiUrl.ToUrl('/admin/MLArticle/VerifyOtp/');
        let params = {
            Otp: otp,
            Phone: phone,
            RequestId: requestId,
        };
        return await this.ToResultApi(api, MethodType.Post, params);
    }
    async getArticleIds(userId: number) {
        const api = ApiUrl.ToUrl('/admin/User/getArticleIds/' + userId);
        return await this.ToResultApi(api, MethodType.Get);
    }
    async syncDataArticle(obj: MLArticleSyncDataTime) {
        const api = ApiUrl.ToUrl('/admin/MLArticle/SyncData');
        return await this.ToResultApi(api, MethodType.Post, obj);
    }
}