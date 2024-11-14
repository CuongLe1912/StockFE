declare var $;
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { MLUserService } from '../user.service';
import { AppInjector } from '../../../app.module';
import { Component, Input, ViewChild } from '@angular/core';
import { AppConfig } from '../../../_core/helpers/app.config';
import { validation } from '../../../_core/decorators/validator';
import { ResultApi } from '../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../_core/helpers/entity.helper';
import { OptionItem } from '../../../_core/domains/data/option.item';
import { ActionData } from '../../../_core/domains/data/action.data';
import { MLUserLockComponent } from '../user.lock/user.lock.component';
import { UtilityExHelper } from '../../../_core/helpers/utility.helper';
import { ConstantHelper } from '../../../_core/helpers/constant.helper';
import { EditorComponent } from '../../../_core/editor/editor.component';
import { BaseEntity } from '../../../_core/domains/entities/base.entity';
import { ModalSizeType } from '../../../_core/domains/enums/modal.size.type';
import { MLUserUnLockComponent } from '../user.unlock/user.unlock.component';
import { MLUserDeleteComponent } from '../user.delete/user.delete.component';
import { EditComponent } from '../../../_core/components/edit/edit.component';
import { AdminAuthService } from '../../../_core/services/admin.auth.service';
import { MLUserHistoryComponent } from '../components/user.history.component';
import { AdminDialogService } from '../../../_core/services/admin.dialog.service';
import { NavigationStateData } from '../../../_core/domains/data/navigation.state';
import { MLUserResetPasswordComponent } from '../user.reset.password/user.reset.password.component';
import { MLUserResetPasswordType, MLUserType } from '../../../_core/domains/entities/meeyland/enums/ml.user.type';
import { MLUserEntity, MLUserLockEntity, MLUserResetPasswordEntity } from '../../../_core/domains/entities/meeyland/ml.user.entity';

@Component({
    templateUrl: './edit.user.component.html',
    styleUrls: ['./edit.user.component.scss'],
})
export class MLEditUserComponent extends EditComponent {
    @Input() params: any;
    actions: ActionData[] = [];

    loading: boolean = true;
    loadingService: boolean = true;
    loadingHistory: boolean = true;
    loadingTransaction: boolean = true;

    id: number;
    router: Router;
    MLUserType = MLUserType;
    state: NavigationStateData;
    item: MLUserEntity = new MLUserEntity();

    service: MLUserService;
    authen: AdminAuthService;
    dialog: AdminDialogService;
    fileReadonly : boolean;
    @ViewChild('uploadAvatar') uploadAvatar: EditorComponent;
    @ViewChild('uploadFile') uploadFile: EditorComponent;
    constructor() {
        super();
        this.router = AppInjector.get(Router);
        this.service = AppInjector.get(MLUserService);
        this.authen = AppInjector.get(AdminAuthService);
        this.dialog = AppInjector.get(AdminDialogService);
        this.state = this.getUrlState();
    }

    async ngOnInit() {
        this.id = this.params && this.params['id'];
        if (this.state) {
            this.id = this.id || this.state.id;
        }
        await this.loadItem();
        await this.renderActions();
        this.addBreadcrumb(this.id ? 'Sửa khách hàng' : 'Thêm mới khách hàng');
        this.loading = false;
    }

    view(item: BaseEntity) {
        let obj: NavigationStateData = {
            id: item.Id,
            prevUrl: '/admin/mluser',
            prevData: this.state.prevData,
        };
        this.router.navigate(['/admin/mluser/view'], { state: { params: JSON.stringify(obj) } });
    }
    lockUser(item: any) {
        let obj: MLUserLockEntity = {
            Id: item.Id,
            Phone: UtilityExHelper.escapeHtml(item.Phone),
            Email: UtilityExHelper.escapeHtml(item.Email),
            Name: UtilityExHelper.escapeHtml(item.NameCode),
        };
        this.dialogService.WapperAsync({
            cancelText: 'Bỏ qua',
            confirmText: 'Xác nhận',
            objectExtra: { item: obj },
            size: ModalSizeType.Medium,
            object: MLUserLockComponent,
            title: 'Khóa tài khoản khách hàng',
        }, async () => {
            await this.loadItem();
        });
    }
    unlockUser(item: any) {
        let obj: MLUserLockEntity = {
            Id: item.Id,
            Phone: UtilityExHelper.escapeHtml(item.Phone),
            Email: UtilityExHelper.escapeHtml(item.Email),
            Name: UtilityExHelper.escapeHtml(item.NameCode),
        };
        this.dialogService.WapperAsync({
            cancelText: 'Bỏ qua',
            confirmText: 'Xác nhận',
            objectExtra: { item: obj },
            size: ModalSizeType.Medium,
            object: MLUserUnLockComponent,
            title: 'Mở khóa tài khoản khách hàng',
        }, async () => {
            await this.loadItem();
        });
    }
    deleteUser(item: any) {
        if (item.WalletBalance) {
            let message = '<p>Tài khoản vẫn còn số dư, không được phép xóa</p>'
                + item.Balance
                + '<br /><p>Vui lòng thông báo khách hàng chuyển tiền khỏi tài khoản hoặc thực hiện thao tác chuyển tiền hộ khách hàng trước khi xóa';
            this.dialogService.Confirm(message, () => {
                this.dialogService.AlertTimeOut('Thông báo', 'Tính năng này sẽ được cập nhật ở phiên bản sau');
            }, null, 'Xóa tài khoản khách hàng');
        } else {
            let obj: MLUserLockEntity = {
                Id: item.Id,
                Phone: UtilityExHelper.escapeHtml(item.Phone),
                Email: UtilityExHelper.escapeHtml(item.Email),
                Name: UtilityExHelper.escapeHtml(item.NameCode),
            };
            this.dialogService.WapperAsync({
                cancelText: 'Bỏ qua',
                confirmText: 'Xác nhận',
                objectExtra: { item: obj },
                size: ModalSizeType.Medium,
                object: MLUserDeleteComponent,
                title: 'Xóa tài khoản khách hàng',
            }, async () => {
                await this.loadItem();
            });
        }
    }
    viewHistory(item: any) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: 'Lịch sử tài khoản',
            objectExtra: { item: item },
            size: ModalSizeType.ExtraLarge,
            object: MLUserHistoryComponent,
        });
    }
    viewCompany(item: any) {
        let obj: NavigationStateData = {
            id: item.CompanyMeeyId,
            prevUrl: '/admin/mlcompany',
        };
        let url = AppConfig.getProtocol() + '//' + AppConfig.getDomain() + '/admin/mlemployee';
        this.setUrlState(obj, 'mlemployee');
        window.open(url, "_blank");
    }
    resetPassword(item: any) {
        let obj: MLUserResetPasswordEntity = {
            Id: item.Id,
            Type: item.Email
                ? MLUserResetPasswordType.Email
                : item.Phone ? MLUserResetPasswordType.Sms : null,
            Phone: UtilityExHelper.escapeHtml(item.Phone),
            Email: UtilityExHelper.escapeHtml(item.Email),
            Name: UtilityExHelper.escapeHtml(item.NameCode),
        };
        if (obj.Type) {
            this.dialogService.WapperAsync({
                cancelText: 'Bỏ qua',
                confirmText: 'Xác nhận',
                objectExtra: { item: obj },
                size: ModalSizeType.Medium,
                title: 'Xác nhận thiết lập mật khẩu',
                object: MLUserResetPasswordComponent,
            }, async () => {
                await this.loadItem();
            });
        } else {
            this.dialogService.AlertTimeOut('Thông báo', 'Khách hàng không có thông tin Email hoặc Số điện thoại');
        }
    }

    public async confirmAndBack() {
        await this.confirm(() => {
            this.back();
        });
    }
    public async confirmAndReset() {
        await this.confirm(() => {
            this.state.id = null;
            this.item = new MLUserEntity();
            this.router.navigate(['/admin/user/add'], { state: { params: JSON.stringify(this.state) } });
        });
    }
    public async confirm(complete: () => void): Promise<boolean> {
        if (this.item) {
            if (await validation(this.item, ['Name', 'Phone', 'Email', 'Website'])) {
                this.processing = true;
                let message = '<div><p>Xác nhận sửa thông tin khách hàng?</p> <br /><p style="color: red;">Lưu ý: Sửa số điện thoại không làm thay đổi liên kết ví hiện tại (nếu có)</p></div>';
                this.dialogService.ConfirmAsync(message, async () => {
                    this.processing = true;
                                        
                    // upload
                    let images = await this.uploadAvatar.image.upload();
                    
                    // update user
                    let obj: MLUserEntity = _.cloneDeep(this.item);
                    if(obj.Type == MLUserType.Brokers || obj.Type == MLUserType.BrokerIndividual){
                        // upload image
                        let fileBroker = await this.uploadFile.upload();
                        obj.BrokerCertificate = fileBroker && fileBroker.length > 0 ? fileBroker[0].Path : '';
                        obj.NameBrokerCertificate = fileBroker && fileBroker.length > 0 ? fileBroker[0].Name : '';
                    }
                    else{
                        obj.BrokerCertificate = "";
                        obj.NameBrokerCertificate = "";
                    }
                    obj.Avatar = images && images.length > 0 ? images[0].Path : '';
                    return await this.service.addOrUpdate(obj).then((result: ResultApi) => {
                        this.processing = false;
                        if (ResultApi.IsSuccess(result)) {
                            if (this.id) ToastrHelper.Success('Lưu dữ liệu thành công');
                            else {
                                this.dialog.Alert('Thông báo', '<p>Tạo tài khoản thành công</p><p>Hệ thống đã gửi Email/SMS thông báo tới khách hàng</p>')
                            }
                            if (complete) complete();
                            return true;
                        } else {
                            ToastrHelper.ErrorResult(result);
                            return false;
                        }
                    }, (e: any) => {
                        ToastrHelper.Exception(e);
                        return false;
                    });
                }, () => this.processing = false);
            } else this.processing = false;
        }
        return false;
    }

    private async loadItem() {
        if (this.id) {
            await this.service.item('mluser', this.id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(MLUserEntity, result.Object);
                    let option: OptionItem = ConstantHelper.ML_USER_STATUS_TYPES.find(c => c.value == this.item.Status);
                    let text = '<span class="' + (option && option.color) + '">' + (option && option.label) + '</span>';
                    this.item.StatusText = text;
                    this.item.Id = this.id;
                }
            });
        }
    }
    private async renderActions() {
        let actions: ActionData[] = [
            ActionData.back(() => { this.back() }),
        ];

        // Add/Save
        if (this.id) {
            actions.push(ActionData.saveUpdate('Lưu thay đổi', () => { this.confirmAndBack() }));
        }
        this.actions = await this.authen.actionsAllow(MLUserEntity, actions);
    }

    fileChange() {
        this.fileReadonly = true;
    }
}