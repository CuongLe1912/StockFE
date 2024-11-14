import * as _ from 'lodash';
import { MLUserService } from '../user.service';
import { AppInjector } from '../../../app.module';
import { Component, OnInit, Input } from '@angular/core';
import { validation } from '../../../_core/decorators/validator';
import { ResultApi } from '../../../_core/domains/data/result.api';
import { EntityHelper } from '../../../_core/helpers/entity.helper';
import { ToastrHelper } from '../../../_core/helpers/toastr.helper';
import { MLUserDeleteEntity } from '../../../_core/domains/entities/meeyland/ml.user.entity';

@Component({
    templateUrl: './user.delete.component.html',
    styleUrls: ['./user.delete.component.scss'],
})
export class MLUserDeleteComponent implements OnInit {
    @Input() params: any;
    haveService: boolean;
    service: MLUserService;
    item: MLUserDeleteEntity = new MLUserDeleteEntity();

    constructor() {
        this.service = AppInjector.get(MLUserService);
    }

    ngOnInit() {
        this.loadItem();
    }
    async confirm() {
        let valid = await validation(this.item, ['Reason']);
        if (valid && this.item) {
            return await this.service.deleteUser(this.item).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    let message = 'Xóa tài khoản thành công';
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
        return false;
    }
    private async loadItem() {
        let item = this.params && this.params['item'];
        this.item = EntityHelper.createEntity(MLUserDeleteEntity, item);
        if (this.item && this.item.Id) {
            this.service.haveService(this.item.Id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result))
                    this.haveService = result.Object as boolean;
            });
        }
    }
}