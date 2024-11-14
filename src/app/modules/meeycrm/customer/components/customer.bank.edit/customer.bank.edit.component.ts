import * as _ from 'lodash';
import { Component, OnInit } from "@angular/core";
import { AppInjector } from '../../../../../app.module';
import { MeeyCrmService } from '../../../meeycrm.service';
import { validation } from '../../../../../_core/decorators/validator';
import { ResultApi } from '../../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../../_core/helpers/entity.helper';
import { ActionData } from '../../../../../_core/domains/data/action.data';
import { ActionType } from '../../../../../_core/domains/enums/action.type';
import { MethodType } from '../../../../../_core/domains/enums/method.type';
import { EditComponent } from '../../../../../_core/components/edit/edit.component';
import { AdminDialogService } from '../../../../../_core/services/admin.dialog.service';
import { MSMetaSeoEntity } from '../../../../../_core/domains/entities/meeyseo/ms.meta.seo.entity';
import { MCRMCustomerBankEntity } from '../../../../../_core/domains/entities/meeycrm/mcrm.customer.bank.entity';

@Component({
    templateUrl: './customer.bank.edit.component.html',
    styleUrls: [
        './customer.bank.edit.component.scss',
        '../../../../../../assets/css/modal.scss'
    ],
})
export class MCRMCustomerBankEditComponent extends EditComponent implements OnInit {
    id: string;
    viewer: boolean;
    loading: boolean;
    service: MeeyCrmService;
    dialog: AdminDialogService;
    item: MCRMCustomerBankEntity = new MCRMCustomerBankEntity();

    constructor() {
        super();
        this.service = AppInjector.get(MeeyCrmService);
        this.dialog = AppInjector.get(AdminDialogService);
    }

    async ngOnInit(): Promise<void> {
        this.id = this.getParam('id');
        this.viewer = this.getParam('viewer');

        //this.updateBreadcrumbs();
        await this.loadItem();
        this.renderActions();
        this.loading = false;
    }

    async loadItem() {
        if (this.id) {
            this.loading = true;
            await this.service.callApi('MLCompany', this.id, null, MethodType.Get).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(MCRMCustomerBankEntity, result.Object);
                } else {
                    this.dialog.Alert('Thông báo', 'Dữ liệu tài khoản doanh nghiệp không tồn tại hoặc kết nối bị hỏng, vui lòng thử lại sau');
                }
            });
            this.loading = false;
        }
    }

    private async renderActions() {
        let actions: ActionData[] = [
            ActionData.back(() => { this.back() }),
        ];

        // Save && Publish
        actions.push({
            name: 'Lưu',
            icon: 'la la-plus',
            processButton: true,
            className: 'btn btn-success',
            systemName: ActionType.Edit,
            click: () => {
                this.confirm();
            }
        });
        this.actions = await this.authen.actionsAllow(MSMetaSeoEntity, actions);
    }

    async confirm() {
        this.processing = true;
        let valid = await validation(this.item);
        if (valid) {
            // call api
            let data = {
                "name": this.item.Name,
                "phone": this.item.Phone,
                "email": this.item.Email,
                "domain": this.item.Domain,
                "taxCode": this.item.TaxCode,
                "address": this.item.Address,
                "shortName": this.item.ShortName,
                "saleId": this.item?.SaleId,
                "amountMembers": this.item.AmountMembers,
                "registerNumber": this.item.RegisterNumber,
                "customerCareStaffId": this.item?.SupportId,
            };
            if (this.id) {
                data['orgId'] = this.id;
                return await this.service.callApi('MLCompany', 'Update', data, MethodType.Put).then((result: ResultApi) => {
                    if (ResultApi.IsSuccess(result)) {
                        ToastrHelper.Success('Cập nhật thành công');
                        this.processing = false;
                        return true;
                    }
                    ToastrHelper.ErrorResult(result);
                    this.processing = false;
                    return false;
                }, (e: any) => {
                    ToastrHelper.Exception(e);
                    this.processing = false;
                    return false;
                });
            }else{
                return await this.service.callApi('MLCompany', 'Create', data, MethodType.Post).then((result: ResultApi) => {
                    if (ResultApi.IsSuccess(result)) {
                        ToastrHelper.Success('Thêm mới thành công');
                        this.processing = false;
                        return true;
                    }
                    ToastrHelper.ErrorResult(result);
                    this.processing = false;
                    return false;
                }, (e: any) => {
                    ToastrHelper.Exception(e);
                    this.processing = false;
                    return false;
                });
            }
        };
        this.processing = false;
        return false;
    }

    // private updateBreadcrumbs() {
    //     this.breadcrumbs = [];
    //     this.breadcrumbs.push({ Name: 'Meey Land' });
    //     this.breadcrumbs.push({ Name: 'Quản lý Meta SEO', Link: '/admin/msseo/metaseo' });
    //     this.viewer ? this.breadcrumbs.push({ Name: 'Xem Meta SEO' }) : this.breadcrumbs.push({ Name: 'Sửa Meta SEO' });
    // }
}