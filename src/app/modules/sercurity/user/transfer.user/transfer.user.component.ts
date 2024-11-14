import * as _ from 'lodash';
import { UserService } from '../user.service';
import { AppInjector } from '../../../../app.module';
import { Component, Input, OnInit } from "@angular/core";
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { StringType } from '../../../../_core/domains/enums/data.type';
import { AssignType } from '../../../../_core/domains/enums/assign.type';
import { UserEntity } from '../../../../_core/domains/entities/user.entity';
import { MeeyCrmService } from '../../../../modules/meeycrm/meeycrm.service';
import { AdminAuthService } from '../../../../_core/services/admin.auth.service';
import { MLArticleService } from '../../../../modules/meeyarticle/article.service';
import { MCRMCustomerAssignDto } from '../../../../_core/domains/entities/meeycrm/mcrm.customer.entity';

@Component({
    templateUrl: './transfer.user.component.html',
    styleUrls: [
        './transfer.user.component.scss',
        '../../../../../assets/css/modal.scss'
    ],
})
export class TransferUserComponent implements OnInit {
    @Input() params: number;

    service: UserService;
    auth: AdminAuthService;
    crmService: MeeyCrmService;
    articleService: MLArticleService;

    active: boolean;
    type: AssignType;
    articleIds: number[];
    customerIds: number[];
    StringType = StringType;
    loading: boolean = true;
    needTransfer: boolean = true;
    item: UserEntity = new UserEntity();
    assignItem: MCRMCustomerAssignDto = new MCRMCustomerAssignDto();
    assignArticleItem: MCRMCustomerAssignDto = new MCRMCustomerAssignDto();

    constructor() {
        this.service = AppInjector.get(UserService);
        this.auth = AppInjector.get(AdminAuthService);
        this.crmService = AppInjector.get(MeeyCrmService);
        this.articleService = AppInjector.get(MLArticleService);
    }

    async ngOnInit() {
        await this.loadItem();
        this.loading = false;
    }

    private async loadItem() {
        let id = this.params && this.params['id'];
        if (id) {
            await this.crmService.getCustomerIds(id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result))
                    this.customerIds = result.Object as number[];
            });
            await this.articleService.getArticleIds(id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result))
                    this.articleIds = result.Object as number[];
            });
            await this.service.item('user', id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    let obj = result.Object as UserEntity;
                    if (obj) {
                        this.item.IsSale = obj.IsSale;
                        this.item.FullName = obj.FullName;
                        this.item.IsSupport = obj.IsSupport;
                        this.type = this.item.IsSale
                            ? AssignType.Sale
                            : (this.item.IsSupport ? AssignType.Support : null);
                    }
                }
            });
            this.needTransfer = (this.customerIds && this.customerIds.length > 0) || (this.articleIds && this.articleIds.length > 0);
        }
    }
    private async transferArticle() {
        let valid = await validation(this.assignArticleItem, ['DepartmentId', 'UserId']);
        if (valid && this.assignArticleItem && this.articleIds && this.articleIds.length > 0) {
            this.assignArticleItem.Ids = this.articleIds;
            this.assignArticleItem.Note = 'Tự động điều chuyển khi khóa tài khoản nhân viên';
            switch (this.type) {
                case AssignType.Support: {
                    const chunkSize = 1000;
                    for (let i = 0; i < this.articleIds.length; i += chunkSize) {
                        const chunkIds = this.articleIds.slice(i, i + chunkSize);
                        await this.articleService.transfer(chunkIds, {
                            Notes: this.assignArticleItem.Note,
                            Coordinator: this.auth.account.Email,
                            SupportId: this.assignArticleItem.UserId,
                            DepartmentId: this.assignArticleItem.DepartmentId,
                        }).then((result: ResultApi) => {
                            if (ResultApi.IsSuccess(result)) {
                                let message = 'Điều chuyển ' + chunkIds.length + ' tin đăng thành công cho CSKH';
                                ToastrHelper.Success(message);
                            } else ToastrHelper.ErrorResult(result);
                        }, (e) => {
                            ToastrHelper.Exception(e);
                        });
                    }
                    return true;
                }
            }
        }
        return false;
    }
    private async transferCustomer() {
        let valid = await validation(this.assignItem, ['DepartmentId', 'UserId']);
        if (valid && this.assignItem && this.customerIds && this.customerIds.length > 0) {
            this.assignItem.Ids = this.customerIds;
            this.assignItem.Note = 'Tự động điều chuyển khi khóa tài khoản nhân viên';
            switch (this.type) {
                case AssignType.Sale: {
                    return await this.crmService.assignSale(this.assignItem).then((result: ResultApi) => {
                        if (ResultApi.IsSuccess(result)) {
                            let message = 'Điều chuyển ' + this.customerIds.length + ' khách hàng thành công cho NVKD';
                            ToastrHelper.Success(message);
                            return true;
                        }
                        ToastrHelper.ErrorResult(result);
                        return false;
                    }, (e) => {
                        ToastrHelper.Exception(e);
                        return false;
                    });
                }
                case AssignType.Support: {
                    return await this.crmService.assignSupport(this.assignItem).then((result: ResultApi) => {
                        if (ResultApi.IsSuccess(result)) {
                            let message = 'Điều chuyển ' + this.customerIds.length + ' khách hàng thành công cho CSKH';
                            ToastrHelper.Success(message);
                            return true;
                        }
                        ToastrHelper.ErrorResult(result);
                        return false;
                    }, (e) => {
                        ToastrHelper.Exception(e);
                        return false;
                    });
                }
            }

        }
        return false;
    }

    public async confirm(): Promise<boolean> {
        if (this.item) {
            let id = this.params && this.params['id'];
            if (id) {
                let valid: boolean = true;
                if (this.item.IsAutoTransferCustomer) {
                    valid = await this.transferCustomer();
                }
                if (valid && this.item.IsAutoTransferArticle) {
                    valid = await this.transferArticle();
                }
                return valid;
            }
        }
        return false;
    }
}