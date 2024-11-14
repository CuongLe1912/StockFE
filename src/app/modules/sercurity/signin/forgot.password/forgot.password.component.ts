import * as _ from 'lodash';
import { AppInjector } from '../../../../app.module';
import { Component, Input, OnInit } from "@angular/core";
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { ValidatorHelper } from '../../../../_core/helpers/validator.helper';
import { AdminApiService } from '../../../../_core/services/admin.api.service';
import { AdminUserForgotPasswordDto } from '../../../../_core/domains/objects/user.dto';

@Component({
    templateUrl: './forgot.password.component.html',
    styleUrls: [
        './forgot.password.component.scss',
        '../../../../../assets/css/modal.scss'
    ],
})
export class ForgotPasswordComponent implements OnInit {    
    disabled: boolean = true;
    service: AdminApiService;
    item: AdminUserForgotPasswordDto = new AdminUserForgotPasswordDto();

    constructor() {
        this.service = AppInjector.get(AdminApiService);
    }

    ngOnInit() {
    }

    valueChange() {
        this.disabled = this.item.Email && ValidatorHelper.validEmail(this.item.Email) ? false : true;
    }

    public async confirm(): Promise<boolean> {
        if (this.item) {
            if (await validation(this.item)) {
                return await this.service.resetPassword(this.item.Email).then((result: ResultApi) => {
                    if (ResultApi.IsSuccess(result)) return true;
                    else {
                        ToastrHelper.ErrorResult(result);
                        return false;
                    }
                }, (e: any) => {
                    ToastrHelper.Exception(e);
                    return false;
                });
            }
        }
        return false;
    }
}