import * as _ from 'lodash';
import { MLUserService } from '../user.service';
import { AppInjector } from '../../../app.module';
import { Component, OnInit, Input } from '@angular/core';
import { validation } from '../../../_core/decorators/validator';
import { ResultApi } from '../../../_core/domains/data/result.api';
import { EntityHelper } from '../../../_core/helpers/entity.helper';
import { ToastrHelper } from '../../../_core/helpers/toastr.helper';
import { OptionItem } from '../../../_core/domains/data/option.item';
import { ConstantHelper } from '../../../_core/helpers/constant.helper';
import { MLUserLockEntity } from '../../../_core/domains/entities/meeyland/ml.user.entity';

@Component({
    templateUrl: './user.unlock.component.html',
    styleUrls: ['./user.unlock.component.scss'],
})
export class MLUserUnLockComponent implements OnInit {
    @Input() params: any;
    service: MLUserService;
    item: MLUserLockEntity = new MLUserLockEntity();

    constructor() {
        this.service = AppInjector.get(MLUserService);
    }

    ngOnInit() {
        this.loadItem();
    }
    typeChange() {
        let option: OptionItem = ConstantHelper.ML_USER_REASON_LOCK_TYPES.find(c => c.value == this.item.Type);
        if (option)
            this.item.Reason = option.label;
    }
    async confirm() {
        if (this.item) {
            return await this.service.unlockUser(this.item).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    let message = 'Mở khóa tài khoản thành công';
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
        this.item = EntityHelper.createEntity(MLUserLockEntity, item);
    }
}