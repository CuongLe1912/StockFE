import * as _ from 'lodash';
import { AppInjector } from '../../../../../app.module';
import { Component, Input, OnInit } from "@angular/core";
import { AppConfig } from '../../../../../_core/helpers/app.config';
import { ResultApi } from '../../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../../_core/helpers/entity.helper';
import { MLBusinessAccountService } from '../../business.account.service';
import { MLUserEntity } from '../../../../../_core/domains/entities/meeyland/ml.user.entity';
import { MLCompanyEntity } from '../../../../../_core/domains/entities/meeyland/ml.company.entity';

@Component({
    templateUrl: './view.company.component.html',
    styleUrls: ['./view.company.component.scss'],
})
export class MLCompanyViewComponent implements OnInit {
    permissions: any[];
    @Input() params: any;
    loading: boolean = true;
    service: MLBusinessAccountService;
    item: MLCompanyEntity = new MLCompanyEntity();

    constructor() {
        this.service = AppInjector.get(MLBusinessAccountService);
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
                    this.createEntity(result);
                    return;
                } ToastrHelper.ErrorResult(result);
            });
        } else {
            let meeyId = this.params && this.params['meeyId'];
            await this.service.getCompany(meeyId).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.createEntity(result);
                    return;
                } ToastrHelper.ErrorResult(result);
            });
        }
    }
    private createEntity(result: ResultApi) {
        this.item = EntityHelper.createEntity(MLCompanyEntity, result.Object as MLCompanyEntity);
        let creator = result.Object && result.Object.Creator as MLUserEntity;
        if (creator) {
            this.item.CreatorName = creator.Name;
            this.item.CreatorPhone = creator.Phone;
            this.item.CreatorEmail = creator.Email;
        }
    }

    navigateMeeyId(meeyId: string) {
        let url = AppConfig.getProtocol() + '//' + AppConfig.getDomain() + '/admin/mluser/view?meeyId=' + meeyId;
        window.open(url, "_blank");
    }
}