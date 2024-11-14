declare var $: any
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { validation } from '../../../_core/decorators/validator';
import { ResultApi } from '../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../_core/helpers/toastr.helper';
import { ResultType } from '../../../_core/domains/enums/result.type';
import { AdminApiService } from '../../../_core/services/admin.api.service';
import { AdminAuthService } from '../../../_core/services/admin.auth.service';
import { AdminDataService } from '../../../_core/services/admin.data.service';
import { AdminEventService } from '../../../_core/services/admin.event.service';
import { UserActivityHelper } from '../../../_core/helpers/user.activity.helper';
import { AdminDialogService } from '../../../_core/services/admin.dialog.service';
import { AdminUserDto, AdminUserLoginDto } from '../../../_core/domains/objects/user.dto';

@Component({
    styleUrls: ['./lock.component.scss', '../../../../assets/css/stepper.scss'],
    templateUrl: './lock.component.html',
})
export class LockComponent implements OnInit {
    formOtp = false;
    processing: boolean;
    item = new AdminUserLoginDto();
    userLogin = new AdminUserDto();
    products: string[] = ['Redt', 'Meey 3D', 'Meey Map', 'Meey Land', 'Meey Group', 'Meey Bank', 'Meey Share', 'Meey Review', 'Meey Project', 'Meey CRM (CĐT)', 'Meey CRM (Nội bộ)'];
    services: string[] = ['Meey Id', 'Meey Pay', 'Meey SEO', 'Meey Order', 'Meey Coupon', 'Meey Banner', 'Meey Affiliate'];

    constructor(
        public router: Router,
        public data: AdminDataService,
        public event: AdminEventService,
        public authen: AdminAuthService,
        public service: AdminApiService,
        public dialog: AdminDialogService) {
        this.item.UserName = this.authen.account && this.authen.account.UserName;
    }

    ngOnInit() {
        if (!this.authen.account) {
            this.router.navigateByUrl('/admin/signin');
            return;
        }
        if (this.authen.account && !this.authen.account.Locked)
            this.router.navigateByUrl('/');
    }

    submitSignIn(e: any) {
        if (e && e.keyCode === 13) {
            this.signin();
        }
    }

    signOut() {
        this.authen.logout();
    }

    signUp() {
        this.dialog.Alert('Thông báo', 'Vui lòng liên hệ <b>Admin</b> để tạo tài khoản');
    }

    tutorial() {
        this.dialog.Alert('Thông báo', 'Vui lòng liên hệ <b>Admin</b> để được hướng dẫn');
    }

    contact() {
        this.dialog.Alert('Thông báo', 'Vui lòng liên hệ <b>Admin</b>');
    }

    async signin() {
        let valid = await validation(this.item, ['UserName', 'Password']);
        if (valid) {
            this.processing = true;
            let obj: AdminUserLoginDto = _.cloneDeep(this.item);
            obj.Password = UserActivityHelper.CreateHash256(obj.Password);
            obj.Activity = await UserActivityHelper.UserActivity(this.data.countryIp);
            this.service.signin(obj).then(async (result: ResultApi) => {
                if (result && result.Type == ResultType.Success) {
                    this.userLogin = result.Object;
                    if (this.userLogin.NeedOTP) {
                        this.formOtp = true;
                        $("#kt_otp_form").fadeIn(200);
                        $("#kt_login_form").fadeOut(200);
                    } else {
                        this.formOtp = false;
                        await this.authen.login(result.Object);
                    }                    
                } else ToastrHelper.ErrorResult(result);
                this.processing = false;
            }, (ex: any) => {
                this.processing = false;
                ToastrHelper.Exception(ex);
            });
        }
    }

    async loginOtp() {
        let valid = await validation(this.item, ['Otp']);
        if (valid) {
            this.processing = true;
            this.service.validateAuthenticator(this.userLogin.Id, this.item.Otp).then(async (result: ResultApi) => {
                if (result && result.Type == ResultType.Success) {
                    this.formOtp = false;
                    await this.authen.login(this.userLogin);
                } else ToastrHelper.ErrorResult(result);
                this.processing = false;
            }, (ex: any) => {
                this.processing = false;
                this.item.Otp = null;
                ToastrHelper.Exception(ex);
            });
        }
    }
}
