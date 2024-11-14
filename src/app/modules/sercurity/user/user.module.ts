import { UserService } from './user.service';
import { RouterModule } from '@angular/router';
import { ShareModule } from '../../share.module';
import { Component, NgModule, OnInit } from '@angular/core';
import { UtilityModule } from '../../utility.module';
import { AppConfig } from '../../../_core/helpers/app.config';
import { GridData } from '../../../_core/domains/data/grid.data';
import { DataType } from '../../../_core/domains/enums/data.type';
import { ResultApi } from '../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../_core/helpers/toastr.helper';
import { LockUserComponent } from './lock.user/lock.user.component';
import { EditUserComponent } from './edit.user/edit.user.component';
import { ViewUserComponent } from './view.user/view.user.component';
import { ActionData } from '../../../_core/domains/data/action.data';
import { ActionType } from '../../../_core/domains/enums/action.type';
import { StatusType } from '../../../_core/domains/enums/status.type';
import { UtilityExHelper } from '../../../_core/helpers/utility.helper';
import { AdminAuthGuard } from "../../../_core/guards/admin.auth.guard";
import { UserEntity } from '../../../_core/domains/entities/user.entity';
import { UserEditRoleComponent } from './_components/edit.role.component';
import { UserEditTeamComponent } from './_components/edit.team.component';
import { UserViewRoleComponent } from './_components/view.role.component';
import { UserViewTeamComponent } from './_components/view.team.component';
import { ModalSizeType } from '../../../_core/domains/enums/modal.size.type';
import { GridComponent } from '../../../_core/components/grid/grid.component';
import { TransferUserComponent } from './transfer.user/transfer.user.component';
import { NavigationStateData } from '../../../_core/domains/data/navigation.state';
import { UserEditRolePermissionComponent } from './_components/edit.role.permission.component';

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class UserComponent extends GridComponent implements OnInit {
    obj: GridData = {
        Exports: [],
        Imports: [],
        Actions: [
            {
                icon: 'la la-eye',
                name: ActionType.ViewDetail,
                className: 'btn btn-warning',
                systemName: ActionType.ViewDetail,
                hidden: (item: any) => {
                    return !item[ActionType.ViewDetail]
                },
                click: (item: any) => {
                    this.view(item);
                }
            },
            {
                icon: 'la la-pencil',
                name: ActionType.Edit,
                systemName: ActionType.Edit,
                className: 'btn btn-primary',
                hidden: (item: any) => {
                    return !item[ActionType.Edit]
                },
                click: (item: any) => {
                    this.edit(item);
                }
            },
        ],
        MoreActions: [
            {
                icon: 'la la-key',
                name: ActionType.ResetPassword,
                systemName: ActionType.ResetPassword,
                hidden: ((item: any) => {
                    return !(!item.LockStatus && item[ActionType.ResetPassword]);
                }),
                click: ((item: any) => {
                    this.dialogService.ConfirmAsync('Xác nhận thực hiện Thiết lập lại mật khẩu cho tài khoản <b>' + item.Name + '</b>', async () => {
                        await this.apiService.adminResetPassword(item.Id).then((result: ResultApi) => {
                            if (ResultApi.IsSuccess(result)) {
                                if (result.Object) ToastrHelper.Success('Hệ thống đã gửi email thiết lập mật khẩu mới cho nhân viên');
                                else ToastrHelper.Error('Không thể gửi Email cho nhân viên');
                            } else ToastrHelper.ErrorResult(result);
                        });
                    });
                })
            },
            {
                icon: 'la la-unlock',
                name: ActionType.UnLock,
                systemName: ActionType.UnLock,
                hidden: ((item: any) => {
                    return !(item.LockStatus && item[ActionType.UnLock]);
                }),
                click: ((item: any) => {
                    this.dialogService.ConfirmAsync('Xác nhận mở khóa cho tài khoản <b>' + item.Name + '</b>', async () => {
                        await this.apiService.unLockUser(item.Id).then((result: ResultApi) => {
                            if (ResultApi.IsSuccess(result)) {
                                ToastrHelper.Success('Mở khóa tài khoản thành công');
                                this.loadItems();
                            } else ToastrHelper.ErrorResult(result);
                        });
                    });
                })
            },
            {
                icon: 'la la-lock',
                name: ActionType.Lock,
                systemName: ActionType.Lock,
                hidden: ((item: any) => {
                    return !(!item.LockStatus && item[ActionType.Lock]);
                }),
                click: (async (item: UserEntity) => {
                    this.dialogService.WapperAsync({
                        cancelText: 'Đóng',
                        confirmText: 'Xác nhận',
                        object: LockUserComponent,
                        size: ModalSizeType.Large,
                        objectExtra: { id: item.Id },
                        title: 'Khóa tài khoản nhân viên',
                    }, async () => {
                        this.loadItems();
                    });
                })
            },
            {
                name: 'Điều chuyển',
                icon: 'la la-share-alt',
                className: 'btn btn-success',
                systemName: ActionType.Empty,
                hidden: ((item: any) => {
                    return !this.authen.account.IsAdmin;
                }),
                click: (async (item: UserEntity) => {
                    this.dialogService.WapperAsync({
                        cancelText: 'Đóng',
                        confirmText: 'Xác nhận',
                        size: ModalSizeType.Large,
                        objectExtra: { id: item.Id },
                        object: TransferUserComponent,
                        title: 'Điều chuyển tin đăng và khách hàng',
                    }, async () => {
                        this.loadItems();
                    });
                })
            },
            {
                icon: 'la la-history',
                name: ActionType.History,
                systemName: ActionType.History,
                className: 'btn btn-outline-primary',
                hidden: (item: any) => {
                    return !item[ActionType.History]
                },
                click: (item: any) => {
                    this.viewHistory(item.Id);
                }
            },
            {
                icon: 'la la-shield',
                name: ActionType.CreateOTP,
                systemName: ActionType.CreateOTP,
                className: 'btn btn-outline-primary',
                hidden: (item: any) => {
                    return !(item.NeedOTP && !item.OTPQrCodeImage)
                },
                click: (item: any) => {
                    this.createOtp(item);
                }
            },
            {
                icon: 'la la-shield',
                name: ActionType.ViewOTP,
                systemName: ActionType.ViewOTP,
                className: 'btn btn-outline-primary',
                hidden: (item: any) => {
                    return !(item.NeedOTP && item.OTPQrCodeImage)
                },
                click: (item: any) => {
                    this.viewOtp(item);
                }
            }
        ],
        Title: 'Nhân viên',
        Reference: UserEntity,
        SearchText: 'Nhập tên, email, số điện thoại',
    };

    constructor(public apiService: UserService) {
        super();
        this.properties = [
            { Property: 'Id', Title: 'Id', Type: DataType.Number },
            {
                Property: 'FullName', Title: 'Thông tin', Type: DataType.String,
                Format: ((item: any) => {
                    item.Name = item.FullName;
                    let text = '<a routerLink="view">' + UtilityExHelper.escapeHtml(item.FullName) + '</a>';
                    if (item.Phone) text += '<p><i class=\'la la-phone\'></i> ' + item.Phone + '</p>';
                    if (item.Email) text += '<p><i class=\'la la-inbox\'></i> ' + item.Email + '</p>';
                    return text;
                })
            },
            {
                Property: 'Position', Title: 'Vị trí', Type: DataType.String,
                Format: ((item: any) => {
                    let text = '';
                    if (item.Position) text += '<p>' + item.Position + '</p>';
                    if (item.Department) text += '<p>' + item.Department + '</p>';
                    return text;
                })
            },
            { Property: 'Team', Title: 'Nhóm', Type: DataType.String },
            { Property: 'Role', Title: 'Quyền', Type: DataType.String },
            {
                Property: 'Product', Title: 'Sản phẩm', Type: DataType.String, Align: 'center',
                Format: ((item: any) => {
                    if (item.Product) {
                        let text: string = '';
                        let arrayItems = item.Product.indexOf(',') >= 0 ? item.Product.split(',') : [item.Product];
                        arrayItems.forEach((textItem: string) => {
                            text += '<div>' + textItem.trim() + '</div>';
                        });
                        return text;
                    } return '';
                })
            },
            {
                Property: 'Locked', Title: 'Trạng thái', Type: DataType.String, Align: 'center',
                Format: ((item: any) => {
                    item.LockStatus = item.Locked ? true : false;
                    let text = item.Locked ? 'Bị khóa' : 'Hoạt động',
                        status = item.Locked ? StatusType.Warning : StatusType.Success;
                    return UtilityExHelper.formatText(text, status);
                })
            },
            { Property: 'ExtPhoneNumber', Title: 'Số máy lẻ', Type: DataType.String, Align: 'center' },
            { Property: 'RefCode', Title: 'Mã giới thiệu', Type: DataType.String, Align: 'center' },
            { Property: 'LastLogin', Title: 'Thời gian truy cập', Type: DataType.DateTime, Align: 'center' },
        ];
    }

    async ngOnInit(): Promise<void> {
        await this.render(this.obj);
        this.obj.Features.push(ActionData.resetCache(() => this.resetCache()));        
    }

    addNew() {
        let obj: NavigationStateData = {
            prevUrl: '/admin/user',
            prevData: this.itemData,
        };
        this.router.navigate(['/admin/user/add'], { state: { params: JSON.stringify(obj) } });
    }

    edit(item: UserEntity) {
        let obj: NavigationStateData = {
            id: item.Id,
            prevUrl: '/admin/user',
            prevData: this.itemData,
        };
        this.router.navigate(['/admin/user/edit'], { state: { params: JSON.stringify(obj) } });
    }

    view(item: UserEntity) {
        let obj: NavigationStateData = {
            id: item.Id,
            prevUrl: '/admin/user',
            prevData: this.itemData,
        };
        this.router.navigate(['/admin/user/view'], { state: { params: JSON.stringify(obj) } });
    }

    createOtp(item) {
        this.dialogService.Confirm("Bạn có chắc muốn tạo mã OTP cho tài khoản " + item.Name, async () => {
            this.loading = true;
            this.loadingText = 'Đang tạo tài khoản OTP...';
            await this.apiService.generateAuthenticator(item.Id).then(async (result: ResultApi) => {
                this.loading = false;
                if (ResultApi.IsSuccess(result)) {
                    ToastrHelper.Success('Tạo mã OTP thành công!');
                    await this.loadItems();
                    setTimeout(() => {
                        this.viewOtp(result.Object);
                    }, 500);                    
                } else ToastrHelper.ErrorResult(result);
            });
        });
    }

    viewOtp(item) {
        if (item.OTPQrCodeImage) {
            let content = '<p class="text-center">Tải Google Authenticator và quét QR code để sử dụng!</p>';
            content += '<p class="text-center"><img src="' + item.OTPQrCodeImage + '" /></p>';
            this.dialogService.Alert('Xem Mã OTP', content);
        }
    }
}

@NgModule({
    declarations: [
        UserComponent,
        LockUserComponent,
        EditUserComponent,
        TransferUserComponent,
        UserViewRoleComponent,
        UserEditRoleComponent,
        UserViewTeamComponent,
        UserEditTeamComponent,
        UserEditRolePermissionComponent
    ],
    imports: [
        ShareModule,
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: UserComponent, pathMatch: 'full', data: { state: 'user' }, canActivate: [AdminAuthGuard] },
            { path: 'add', component: EditUserComponent, pathMatch: 'full', data: { state: 'add_user' }, canActivate: [AdminAuthGuard] },
            { path: 'edit', component: EditUserComponent, pathMatch: 'full', data: { state: 'edit_user' }, canActivate: [AdminAuthGuard] },
            { path: 'view', component: ViewUserComponent, pathMatch: 'full', data: { state: 'view_user' }, canActivate: [AdminAuthGuard] },
        ])
    ],
    providers: [UserService]
})
export class UserModule { }