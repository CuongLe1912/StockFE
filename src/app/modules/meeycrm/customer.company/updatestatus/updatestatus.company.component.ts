import * as _ from 'lodash';
import { AppInjector } from '../../../../app.module';
import { Component, Input, OnInit } from "@angular/core";
import { AppConfig } from '../../../../_core/helpers/app.config';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { MethodType } from '../../../../_core/domains/enums/method.type';
import { AdminApiService } from '../../../../_core/services/admin.api.service';
import { AdminDialogService } from '../../../../_core/services/admin.dialog.service';
import { MLCompanyUpdateStatusEntity } from '../../../../_core/domains/entities/meeyland/ml.company.entity';

@Component({
    templateUrl: './updatestatus.company.component.html',
    styleUrls: ['./updatestatus.company.component.scss'],
})
export class MCRMCompanyUpdateStatusComponent implements OnInit {
    permissions: any[];
    @Input() params: any;
    errorMessage: string;
    loading: boolean = true;
    service: AdminApiService;
    dialogService: AdminDialogService;
    item: MLCompanyUpdateStatusEntity = new MLCompanyUpdateStatusEntity();

    constructor() {
        this.service = AppInjector.get(AdminApiService);
        this.dialogService = AppInjector.get(AdminDialogService);
    }

    async ngOnInit() {
        await this.loadItem();
        this.loading = false;
    }

    private async loadItem() {
        this.item = new MLCompanyUpdateStatusEntity();
        let id = this.params && this.params['id'];
        if (id) {
            await this.service.item('MLCompany', id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(MLCompanyUpdateStatusEntity, result.Object as MLCompanyUpdateStatusEntity);
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            });
        }
    }

    public async confirm(): Promise<boolean> {
        let id = this.params && this.params['id'];
        if (id) {
            this.item.Id = id;
            return await this.service.callApi('mlcompany', 'UpdateStatusCustomerBusiness', this.item, MethodType.Post).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    setTimeout(() => {
                        this.dialogService.Alert('Thông báo', 'Thay đổi trạng thái thành công');
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