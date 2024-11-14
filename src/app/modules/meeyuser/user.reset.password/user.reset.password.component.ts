import * as _ from 'lodash';
import { MLUserService } from '../user.service';
import { AppInjector } from '../../../app.module';
import { Component, Input, OnInit } from "@angular/core";
import { EnumHelper } from '../../../_core/helpers/enum.helper';
import { validation } from '../../../_core/decorators/validator';
import { ResultApi } from '../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../_core/helpers/entity.helper';
import { OptionItem } from '../../../_core/domains/data/option.item';
import { MLUserResetPasswordEntity } from '../../../_core/domains/entities/meeyland/ml.user.entity';
import { MLUserResetPasswordType } from '../../../_core/domains/entities/meeyland/enums/ml.user.type';

@Component({
    templateUrl: './user.reset.password.component.html',
    styleUrls: ['./user.reset.password.component.scss'],
})
export class MLUserResetPasswordComponent implements OnInit {
    types: OptionItem[];
    @Input() params: any;
    service: MLUserService;
    item: MLUserResetPasswordEntity = new MLUserResetPasswordEntity();

    constructor() {
        this.service = AppInjector.get(MLUserService);
    }

    ngOnInit() {
        this.loadItem();
    }
    async confirm() {
        let valid = await validation(this.item, ['Type']);
        if (valid && this.item) {
            return await this.service.resetPasswordForUser(this.item).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    let type = EnumHelper.exportName(MLUserResetPasswordType, this.item.Type);
                    ToastrHelper.Success('Thiết lập mật khẩu thành công<br />Hệ thống đã tự động gửi ' + type + ' thông báo tới khách hàng');
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
        this.item = EntityHelper.createEntity(MLUserResetPasswordEntity, item);
        if (this.item.Email && this.item.Phone) {
            this.types = [
                { value: MLUserResetPasswordType.Email, label: 'Email' },
                { value: MLUserResetPasswordType.Sms, label: 'Tin nhắn', selected: true },
            ];
        } else if (this.item.Email) {
            this.types = [
                { value: MLUserResetPasswordType.Email, label: 'Email', selected: true },
                { value: MLUserResetPasswordType.Sms, label: 'Tin nhắn', disabled: true },
            ];
        } else if (this.item.Phone) {
            this.types = [
                { value: MLUserResetPasswordType.Email, label: 'Email', disabled: true },
                { value: MLUserResetPasswordType.Sms, label: 'Tin nhắn', selected: true },
            ];
        }
    }
}