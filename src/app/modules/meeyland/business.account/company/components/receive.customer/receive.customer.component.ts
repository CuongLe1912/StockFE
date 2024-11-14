import * as _ from 'lodash';
import { Component, OnInit, Input } from '@angular/core';
import { AppInjector } from '../../../../../../app.module';
import { validation } from '../../../../../../_core/decorators/validator';
import { ResultApi } from '../../../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../../../_core/helpers/toastr.helper';
import { MLBusinessAccountService } from '../../../business.account.service';
import { MLCompanyEntity } from '../../../../../../_core/domains/entities/meeyland/ml.company.entity';

@Component({
    templateUrl: './receive.customer.component.html',
    styleUrls: ['./receive.customer.component.scss'],
})
export class ReceiveCustomerComponent {
    status: string;
    errorMessage: string;
    @Input() params: any;
    disabled: boolean = true;
    service: MLBusinessAccountService;    
    item: MLCompanyEntity = new MLCompanyEntity();

    constructor() {
        this.service = AppInjector.get(MLBusinessAccountService);
    }
    
    async confirm() {
        let id = this.params && this.params['id'];
        let valid = await validation(this.item, ['Reason']);
        if (valid && this.item) {
            return await this.service.receiveCustomer(id, this.item).then((result: ResultApi) => {
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

    async toggleDisableButton() {
        this.disabled = !(await validation(this.item, ['Reason'], true));
    }
}