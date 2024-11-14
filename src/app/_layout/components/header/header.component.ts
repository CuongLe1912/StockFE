import * as _ from 'lodash';
import { version } from 'package.json'
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AppConfig } from '../../../_core/helpers/app.config';
import { ResultApi } from '../../../_core/domains/data/result.api';
import { EntityHelper } from '../../../_core/helpers/entity.helper';
import { ToastrHelper } from '../../../_core/helpers/toastr.helper';
import { NotifyDto } from '../../../_core/domains/objects/notify.dto';
import { ProductionType } from '../../../_core/domains/enums/project.type';
import { AdminApiService } from '../../../_core/services/admin.api.service';
import { ModalSizeType } from '../../../_core/domains/enums/modal.size.type';
import { AdminDataService } from '../../../_core/services/admin.data.service';
import { AdminAuthService } from '../../../_core/services/admin.auth.service';
import { UserActivityHelper } from '../../../_core/helpers/user.activity.helper';
import { AdminDialogService } from '../../../_core/services/admin.dialog.service';
import { LinkPermissionDto } from '../../../_core/domains/objects/link.permission.dto';
import { AdminUserDto, AdminUserLoginDto, UserDto } from '../../../_core/domains/objects/user.dto';
import { ModalViewProfileComponent } from '../../../_core/modal/view.profile/view.profile.component';
import { ModalEditProfileComponent } from '../../../_core/modal/edit.profile/edit.profile.component';
import { ModalChangePasswordComponent } from '../../../_core/modal/change.password/change.password.component';

@Component({
    selector: 'layout-header',
    templateUrl: 'header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class LayoutHeaderComponent implements OnInit {
    active: boolean;
    processing: boolean;
    activeNotify: boolean;

    notifies: NotifyDto[];

    loading: boolean;
    enviroment: string;
    currentUrl: string;
    loginItem: UserDto;
    appVersion = version;
    account: AdminUserDto;
    accountLetter: string;

    constructor(
        public router: Router,
        public data: AdminDataService,
        public authen: AdminAuthService,
        public service: AdminApiService,
        public dialog: AdminDialogService) {
        this.router.events.subscribe((val) => {
            if (val instanceof NavigationEnd) {
                this.currentUrl = val.url;
                this.activeLink();
            }
        });
        this.loginItem = EntityHelper.createEntity(UserDto);
    }

    ngOnInit() {
        this.loadNotifies();
        this.account = this.authen.account;
        this.enviroment = AppConfig.ProjectTypeName;
        if (this.account) {
            let accountName = this.account.UserName || this.account.Email;
            this.accountLetter = accountName && accountName.substr(0, 1).toUpperCase();
        }
    }

    lock() {
        this.active = false;
        this.authen.lock();
    }

    async login() {
        this.processing = true;
        let password = AppConfig.DefaultPassword;
        if (this.authen.account.ProductionType == ProductionType.Production)
            password = 'A5a$a#a@a!';
        let obj: AdminUserLoginDto = {
            RememberMe: false,
            UserName: this.loginItem.Account,
            Password: UserActivityHelper.CreateHash256(password),
            Activity: await UserActivityHelper.UserActivity(this.data.countryIp),
        }
        this.service.signin(obj).then(async (result: ResultApi) => {
            if (ResultApi.IsSuccess(result)) {
                await this.authen.login(result.Object, obj.RememberMe);
            } else ToastrHelper.ErrorResult(result);
            this.processing = false;
            location.reload();
        }, (ex: any) => {
            this.processing = false;
            ToastrHelper.Exception(ex);
        });
    }

    logout() {
        this.active = false;
        this.authen.logout();
    }

    closeAside() {
        if (this.data.activeMenuHeader) {
            this.data.activeMenuHeader = false;
        }
    }

    private activeLink() {
        if (this.authen.links && this.authen.links.length > 0) {
            this.authen.links.forEach((group: any) => {
                if (group && group.items && group.items.length > 0) {
                    group.items.forEach((item: LinkPermissionDto) => {
                        item.Active = false;
                        if (item.Childrens && item.Childrens.length > 0) {
                            item.Childrens.forEach((child: LinkPermissionDto) => {
                                child.Active = false;
                                if (child.Link == this.currentUrl) {
                                    item.Active = true;
                                    child.Active = true;
                                }
                            });
                        }
                    });
                }
            });
        }
    }

    public popupViewProfile() {
        this.active = false;
        this.dialog.WapperAsync({
            cancelText: 'Đóng',
            size: ModalSizeType.Large,
            title: 'Thông tin tài khoản',
            object: ModalViewProfileComponent,
            confirmText: 'Chỉnh sửa thông tin',
        }, async () => {
            setTimeout(() => {
                this.dialog.WapperAsync({
                    cancelText: 'Đóng',
                    confirmText: 'Cập nhật',
                    size: ModalSizeType.Large,
                    title: 'Sửa thông tin tài khoản',
                    object: ModalEditProfileComponent,
                });
            }, 100);
        });
    }

    public popupChangepassword() {
        this.active = false;
        this.dialog.WapperAsync({
            confirmText: 'Xác nhận',
            title: 'Thay đổi mật khẩu',
            object: ModalChangePasswordComponent,
        });
    }

    public popupNotify(notify: NotifyDto) {
        let content = notify.Content
            ? '<p>' + notify.Title + '</p><br /><p>' + notify.Content + '</p><br /><p>Thời gian: ' + notify.RelativeTime + '</p>'
            : '<p>' + notify.Title + '</p><br /><p>Thời gian: <b>' + notify.RelativeTime + '</b></p>';
        this.dialog.Alert('Thông báo', content);
    }

    navigateActivity() {
        this.active = false;
        this.router.navigateByUrl('/admin/useractivity');
    }

    navigate(childItem: LinkPermissionDto) {
        this.active = false;
        this.router.navigateByUrl(childItem.Link);
    }

    navigateCtrl(childItem: LinkPermissionDto) {
        this.active = false;
        let url = AppConfig.getProtocol() + '//' + AppConfig.getDomain() + childItem.Link;
        window.open(url, "_blank");
    }

    private loadNotifies() {
        this.service.notifies().then((result: ResultApi) => {
            if (ResultApi.IsSuccess(result)) {
                this.notifies = result.Object as NotifyDto[];
            }
        });
    }
}
