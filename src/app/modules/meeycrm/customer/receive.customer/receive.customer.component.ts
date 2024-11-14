import * as _ from 'lodash';
import { AppInjector } from '../../../../app.module';
import { MeeyCrmService } from '../../meeycrm.service';
import { Component, OnInit, Input } from '@angular/core';
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { MCRMCustomerEntity, MCRMCustomerReceiveDto } from '../../../../_core/domains/entities/meeycrm/mcrm.customer.entity';

@Component({
    templateUrl: './receive.customer.component.html',
    styleUrls: ['./receive.customer.component.scss'],
})
export class ReceiveCustomerComponent implements OnInit {
    status: string;
    errorMessage: string;
    @Input() params: any;
    service: MeeyCrmService;
    
    entity: MCRMCustomerEntity = new MCRMCustomerEntity();
    item: MCRMCustomerReceiveDto = new MCRMCustomerReceiveDto();

    constructor() {
        this.service = AppInjector.get(MeeyCrmService);
    }

    ngOnInit() {
        this.loadItem();
    }
    async confirm() {
        let valid = await validation(this.item, ['Note']);
        if (valid && this.item) {
            return await this.service.receiveCustomer(this.item).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    let message = 'Nhận khách hàng thành công';
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
        this.item.Id = this.entity.Id;
    }
}