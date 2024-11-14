import * as _ from 'lodash';
import { AppInjector } from '../../../../app.module';
import { Component, Input, OnInit } from "@angular/core";
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { AdminApiService } from '../../../../_core/services/admin.api.service';
import { MCRMCompanyEntity } from '../../../../_core/domains/entities/meeycrm/mcrm.company.entity';

@Component({
    templateUrl: './edit.company.component.html',
    styleUrls: [
        './edit.company.component.scss',
        '../../../../../assets/css/modal.scss'
    ],
})
export class EditCompanyComponent implements OnInit {
    @Input() params: any;
    loading: boolean = true;
    service: AdminApiService;
    tab: string = 'kt_exception';
    item: MCRMCompanyEntity = new MCRMCompanyEntity();

    constructor() {
        this.service = AppInjector.get(AdminApiService);
    }

    ngOnInit() {
        this.loadItem();
        this.loading = false;
    }

    private async loadItem() {
        this.item = new MCRMCompanyEntity();
        let id = this.params && this.params['id'];
        if (id) {
            await this.service.item('MCRMCompany', id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(MCRMCompanyEntity, result.Object);
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            });
        }
    }

    public async confirm(): Promise<boolean> {
        if (this.item) {
            let valid = await validation(this.item);
            if (valid) {
                let obj: MCRMCompanyEntity = _.cloneDeep(this.item);
                return await this.service.save('MCRMCompany', obj).then((result: ResultApi) => {
                    if (ResultApi.IsSuccess(result)) {
                        ToastrHelper.Success('Lưu dữ liệu thành công');
                        return true;
                    } else {
                        ToastrHelper.ErrorResult(result);
                        return false;
                    }
                }, () => {
                    return false;
                });
            }
        }
        return false;
    }
}