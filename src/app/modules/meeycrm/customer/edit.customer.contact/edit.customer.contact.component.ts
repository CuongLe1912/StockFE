import * as _ from 'lodash';
import { AppInjector } from '../../../../app.module';
import { MeeyCrmService } from '../../meeycrm.service';
import { Component, Input, OnInit } from "@angular/core";
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { MCRMCustomerContactEntity } from '../../../../_core/domains/entities/meeycrm/mcrm.customer.contact.entity';

@Component({
    templateUrl: './edit.customer.contact.component.html',
    styleUrls: [
        './edit.customer.contact.component.scss',
        '../../../../../assets/css/modal.scss'
    ],
})
export class EditCustomerContactComponent implements OnInit {
    @Input() params: any;
    errorMessage: string;
    loading: boolean = true;
    service: MeeyCrmService;
    item: MCRMCustomerContactEntity = new MCRMCustomerContactEntity();

    constructor() {
        this.service = AppInjector.get(MeeyCrmService);
    }

    ngOnInit() {
        this.loadItem();
        this.loading = false;
    }

    private async loadItem() {
        this.item = new MCRMCustomerContactEntity();
        let id = this.params && this.params['id'];
        if (id) {
            await this.service.item('MCRMCustomerContact', id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(MCRMCustomerContactEntity, result.Object);
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            });
        } else this.item.MCRMCustomerId = this.params && this.params['customerId'];
    }

    public async confirm(): Promise<boolean> {
        if (this.item) {
            let valid = await validation(this.item);
            if (valid) {
                let obj: MCRMCustomerContactEntity = _.cloneDeep(this.item);
                return await this.service.addOrUpdateContact(obj).then((result: ResultApi) => {
                    if (ResultApi.IsSuccess(result)) {
                        ToastrHelper.Success('Lưu dữ liệu thành công');
                        return true;
                    } else {
                        if (result.Object) {
                            let customer = result.Object,
                                message = customer.Exists + ' đã tồn tại với mã: <b>' + customer.Code + '</b>';
                            if (customer.Sale) message += '<br />[Sale chăm sóc: <b>' + customer.Sale + '</b>]';
                            this.errorMessage = message;
                            return false;
                        }
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