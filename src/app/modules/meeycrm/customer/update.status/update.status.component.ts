import * as _ from 'lodash';
import { AppInjector } from '../../../../app.module';
import { MeeyCrmService } from '../../meeycrm.service';
import { Component, OnInit, Input } from '@angular/core';
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { MCRMCustomerStatusType } from '../../../../_core/domains/entities/meeycrm/enums/mcrm.customer.type';
import { MCRMCustomerStatusDto, MCRMCustomerEntity } from '../../../../_core/domains/entities/meeycrm/mcrm.customer.entity';

@Component({
    templateUrl: './update.status.component.html',
    styleUrls: ['./update.status.component.scss'],
})
export class UpdateStatusComponent implements OnInit {
    status: string;
    errorMessage: string;
    @Input() params: any;
    service: MeeyCrmService;

    entity: MCRMCustomerEntity = new MCRMCustomerEntity();
    item: MCRMCustomerStatusDto = new MCRMCustomerStatusDto();

    constructor() {
        this.service = AppInjector.get(MeeyCrmService);
    }

    ngOnInit() {
        this.loadItem();
    }
    async confirm() {
        let valid = await validation(this.item, ['Note']);
        if (valid && this.item) {
            return await this.service.updateStatus(this.item).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    let message = 'Chuyển trạng thái khách hàng thành công';
                    ToastrHelper.Success(message);
                    return true;
                }
                let message = result && result.Description;
                if (message) {
                    this.errorMessage = message;
                    return false;
                }
                ToastrHelper.ErrorResult(result);
                return false;
            }, (e) => {
                ToastrHelper.Exception(e);
                return false;
            });
        }
        return false;
    }
    private async loadItem() {
        let item = this.params && this.params['item'];
        this.entity = EntityHelper.createEntity(MCRMCustomerEntity, item);
        this.item.Ids = [this.entity.Id];
        switch (this.entity.CustomerStatusType) {
            case MCRMCustomerStatusType.Reject:
            case MCRMCustomerStatusType.Consider:
            case MCRMCustomerStatusType.NotApproach:
                this.item.Status = this.entity.CustomerStatusType;
                break;
        }
    }
}