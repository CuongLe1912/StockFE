import * as _ from 'lodash';
import { AppInjector } from '../../../../../app.module';
import { Component, Input, OnInit } from "@angular/core";
import { AppConfig } from '../../../../../_core/helpers/app.config';
import { validation } from '../../../../../_core/decorators/validator';
import { ResultApi } from '../../../../../_core/domains/data/result.api';
import { MLBusinessAccountService } from '../../business.account.service';
import { ToastrHelper } from '../../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../../_core/helpers/entity.helper';
import { AdminDialogService } from '../../../../../_core/services/admin.dialog.service';
import { MLCompanyEntity } from '../../../../../_core/domains/entities/meeyland/ml.company.entity';

@Component({
    templateUrl: './approve.company.component.html',
    styleUrls: ['./approve.company.component.scss'],
})
export class MLCompanyApproveComponent implements OnInit {
    permissions: any[];
    @Input() params: any;
    errorMessage: string;
    loading: boolean = true;
    service: MLBusinessAccountService;
    dialogService: AdminDialogService;
    item: MLCompanyEntity = new MLCompanyEntity();

    constructor() {
        this.service = AppInjector.get(MLBusinessAccountService);
        this.dialogService = AppInjector.get(AdminDialogService);
    }

    async ngOnInit() {
        await this.loadItem();
        this.loading = false;
    }

    private async loadItem() {
        this.item = new MLCompanyEntity();
        let id = this.params && this.params['id'];
        if (id) {
            await this.service.item('MLCompany', id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(MLCompanyEntity, result.Object as MLCompanyEntity);
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            });
        }
    }

    public async confirm(): Promise<boolean> {
        let id = this.params && this.params['id'];
        if (id) {
            return await this.service.approveCompany(id, this.item).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    setTimeout(() => {
                        this.dialogService.Alert('Thông báo', 'Duyệt yêu cầu thành công');
                    }, 300);
                    return true;
                }
                this.errorMessage = result && result.Description;
                return false;
            }, (e) => {
                ToastrHelper.Exception(e);
                return false;
            });
        }
        return false;
    }

    public async reject(): Promise<boolean> {
        let id = this.params && this.params['id'];
        if (id && await validation(this.item, ['Notes'])) {
            return await this.service.rejectCompany(id, this.item).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    setTimeout(() => {
                        this.dialogService.Alert('Thông báo', 'Từ chối yêu cầu thành công');
                    }, 300);
                    return true;
                }
                this.errorMessage = result && result.Description;
                return false;
            }, (e) => {
                ToastrHelper.Exception(e);
                return false;
            });
        }
        return false;
    }

    navigateMeeyId(meeyId: string) {
        let url = AppConfig.getProtocol() + '//' + AppConfig.getDomain() + '/admin/mluser/view?meeyId=' + meeyId;
        window.open(url, "_blank");
    }
}