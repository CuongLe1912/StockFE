declare var toastr: any;
import * as _ from 'lodash';
import { Component } from '@angular/core';
import { validation } from '../../decorators/validator';
import { ResultApi } from '../../domains/data/result.api';
import { ToastrHelper } from '../../helpers/toastr.helper';
import { AdminApiService } from '../../services/admin.api.service';
import { AdminDataService } from '../../services/admin.data.service';
import { UserActivityHelper } from '../../helpers/user.activity.helper';
import { AdminUserResetPasswordDto } from '../../domains/objects/user.dto';

@Component({
    templateUrl: 'change.password.component.html',
})
export class ModalChangePasswordComponent {
    item: AdminUserResetPasswordDto = new AdminUserResetPasswordDto();

    constructor(
        public data: AdminDataService,
        public service: AdminApiService) {
    }

    public async confirm(): Promise<boolean> {
        let valid = await validation(this.item);
        if (!valid) return false;

        let entity: AdminUserResetPasswordDto = {
            Password: UserActivityHelper.CreateHash256(this.item.Password),
            Activity: await UserActivityHelper.UserActivity(this.data.countryIp),
            OldPassword: UserActivityHelper.CreateHash256(this.item.OldPassword),
            ConfirmPassword: UserActivityHelper.CreateHash256(this.item.ConfirmPassword),
        };
        return this.service.changePassword(entity).then((result: ResultApi) => {
            if (ResultApi.IsSuccess(result)) {
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
