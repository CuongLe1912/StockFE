declare var $;
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { MLUserService } from '../user.service';
import { AppInjector } from '../../../app.module';
import { Component, Input, ViewChild } from '@angular/core';
import { AppConfig } from '../../../_core/helpers/app.config';
import { ResultApi } from '../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../_core/helpers/entity.helper';
import { OptionItem } from '../../../_core/domains/data/option.item';
import { ActionData } from '../../../_core/domains/data/action.data';
import { ActionType } from '../../../_core/domains/enums/action.type';
import { MLUserLockComponent } from '../user.lock/user.lock.component';
import { UtilityExHelper } from '../../../_core/helpers/utility.helper';
import { ConstantHelper } from '../../../_core/helpers/constant.helper';
import { EditorComponent } from '../../../_core/editor/editor.component';
import { ModalSizeType } from '../../../_core/domains/enums/modal.size.type';
import { MLUserUnLockComponent } from '../user.unlock/user.unlock.component';
import { MLUserDeleteComponent } from '../user.delete/user.delete.component';
import { EditComponent } from '../../../_core/components/edit/edit.component';
import { AdminAuthService } from '../../../_core/services/admin.auth.service';
import { MLUserHistoryComponent } from '../components/user.history.component';
import { AdminDialogService } from '../../../_core/services/admin.dialog.service';
import { NavigationStateData } from '../../../_core/domains/data/navigation.state';
import { MLUserResetPasswordComponent } from '../user.reset.password/user.reset.password.component';
import { MLUserResetPasswordType, MLUserStatusType, MLUserType } from '../../../_core/domains/entities/meeyland/enums/ml.user.type';
import { MLUserEntity, MLUserLockEntity, MLUserResetPasswordEntity, MLUserVerifyPhoneEntity } from '../../../_core/domains/entities/meeyland/ml.user.entity';
import { MOTransactionRewardService } from '../../meeyorder/transaction.reward/transactionreward.service';

@Component({
    templateUrl: './view.user.component.html',
    styleUrls: ['./view.user.component.scss'],
})
export class MLViewUserComponent extends EditComponent {
    @Input() params: any;
    actions: ActionData[] = [];

    now: Date = new Date();
    loading: boolean = true;
    loadingService: boolean = true;
    loadingHistory: boolean = true;
    loadingTransaction: boolean = true;

    id: number;
    meeyId: string;
    router: Router;
    dayPackage: any;
    roundPackage: any;
    MLUserType = MLUserType;
    state: NavigationStateData;
    tab: string = 'information';
    serviceTab: string = 'article';
    MLUserStatusType = MLUserStatusType;
    item: MLUserEntity = new MLUserEntity();
    itemTransactionReward: any;
    itemTransactionRewardNumb: any;
    service: MLUserService;
    serviceTransactionReward: MOTransactionRewardService;
    authen: AdminAuthService;
    dialog: AdminDialogService;

    @ViewChild('uploadAvatar') uploadAvatar: EditorComponent;
    @ViewChild('history') historyComponent: MLUserHistoryComponent;

    constructor() {
        super();
        this.router = AppInjector.get(Router);
        this.service = AppInjector.get(MLUserService);
        this.serviceTransactionReward = AppInjector.get(MOTransactionRewardService);
        this.authen = AppInjector.get(AdminAuthService);
        this.dialog = AppInjector.get(AdminDialogService);
        this.state = this.getUrlState();
    }

    async ngOnInit() {
        this.meeyId = this.getParam('meeyId') || this.getParam('meeyid');
        if (!this.meeyId) this.id = this.getParam('id');
        if (this.state) {
            this.id = this.id || this.state.id;
            this.addBreadcrumb(this.id || this.meeyId ? 'Xem khách hàng' : 'Thêm khách hàng');
        }
        await this.loadItem();
        // đọc html meeyid lấy meeyid
        if(this.meeyId == null || this.meeyId == undefined){
            var htmlString = this.state.object?.MeeyId;
            var parser = new DOMParser();
            var doc = parser.parseFromString(htmlString, 'text/html');
            var aTag = doc.querySelector('a[data]');
            this.meeyId = aTag.getAttribute('data');
        }
        
        await this.getTransactionReward(this.meeyId);
        this.renderActions();
        this.loading = false;
    }

    selectedTab(tab: string) {
        this.tab = tab;
    }

    selectedServiceTab(tab: string) {
        this.serviceTab = tab;
        if (this.serviceTab == 'mappackage') {
            this.service.callApiByUrl('/MMLookupHistory/DayPackage/' + this.item.MeeyId).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.dayPackage = result.Object;
                    if (this.dayPackage && this.dayPackage.ExpireTime)
                        this.dayPackage.ExpireTime = new Date(this.dayPackage.ExpireTime);
                    console.log(this.dayPackage.ExpireTime, this.now, this.dayPackage.ExpireTime >= this.now);
                }
            });
            this.service.callApiByUrl('/MMLookupHistory/RoundPackage/' + this.item.MeeyId).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.roundPackage = result.Object;
                }
            });
        }
    }
    async getTransactionReward(id:string){
        if (id) {
            await this.serviceTransactionReward.getNumbUserWalletTransactionReward(id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.itemTransactionRewardNumb = result.Object ? result.Object?.available : 0
                    this.itemTransactionReward = result.Object?.available ? result.Object?.available.toLocaleString("vi-VN", { maximumFractionDigits: 2 }) + ' đ' : 0
                } else {
                    this.itemTransactionRewardNumb = 0
                    ToastrHelper.ErrorResult(result);
                }
            });
        }
    }
    edit(item: any) {
        let obj: NavigationStateData = {
            id: item.Id,
            prevUrl: '/admin/mluser',
            prevData: this.state.prevData,
        };
        this.router.navigate(['/admin/mluser/edit'], { state: { params: JSON.stringify(obj) } });
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
            await this.renderActions();
            this.historyComponent.loadItems();
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
            await this.renderActions();
            this.historyComponent.loadItems();
        });
    }
    deleteUser(item: any) {
        if (item.Balance) {
            let message = '<p>Tài khoản vẫn còn số dư, không được phép xóa</p>'
                + item.BalanceText.replace('<p>', '<p>Đang liên kết Meey Pay: ')
                + '<br /><p>Vui lòng thông báo khách hàng chuyển tiền khỏi tài khoản hoặc thực hiện thao tác chuyển tiền hộ khách hàng trước khi xóa';
            this.dialogService.ConfirmAsync(message, async () => {
                this.dialogService.Alert('Thông báo', 'Tính năng này sẽ được cập nhật ở phiên bản sau');
            }, null, 'Xóa tài khoản khách hàng', 'Chuyển tiền hộ khách');
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
                await this.renderActions();
                this.historyComponent.loadItems();
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
                await this.renderActions();
                this.historyComponent.loadItems();
            });
        } else {
            this.dialogService.Alert('Thông báo', 'Khách hàng không có thông tin Email hoặc Số điện thoại');
        }
    }
    async verifyPhone(item: any) {
        let allowVerify = await this.authen.permissionAllow('mluser', ActionType.Verify);
        if (allowVerify) {
            if (!item.PhoneVerified) {
                let name = UtilityExHelper.escapeHtml(item.NameCode || item.UserName);
                if (!item.Phone) {
                    this.dialogService.Alert('Thông báo', 'Tài khoản khách hàng không có số điện thoại, không thể xác nhận');
                    return;
                }
                if (item.Status == MLUserStatusType.Deleted) {
                    this.dialogService.Alert('Thông báo', 'Không thể xác nhận số điện thoại với tài khoản đã xóa');
                    return;
                }
                this.dialogService.ConfirmAsync('Xác nhận số điện thoại của khách hàng: <b>' + name + '</b> là đúng?', async () => {
                    let obj: MLUserVerifyPhoneEntity = {
                        Id: item.Id,
                        Phone: item.Phone,
                        Email: item.Email,
                        DialingCode: '+84',
                        Name: item.NameCode,
                    };
                    this.service.verifyPhone(obj).then(async (result: ResultApi) => {
                        if (ResultApi.IsSuccess(result)) {
                            ToastrHelper.Success('Xác nhận số điện thoại thành công');
                            await this.loadItem();
                            await this.renderActions();
                            this.historyComponent.loadItems();
                        } else ToastrHelper.ErrorResult(result);
                    }, (e) => {
                        ToastrHelper.Exception(e);
                    });
                }, null, 'Xác nhận Số điện thoại', 'Xác nhận');
            }
        }
    }
    async verifyEmail(item: any) {
        let allowVerify = await this.authen.permissionAllow('mluser', ActionType.Verify);
        if (allowVerify) {
            if (!item.EmailVerified) {
                let name = UtilityExHelper.escapeHtml(item.NameCode || item.UserName);
                if (!item.Email) {
                    this.dialogService.Alert('Thông báo', 'Tài khoản khách hàng không có email, không thể xác nhận');
                    return;
                }
                if (item.Status == MLUserStatusType.Deleted) {
                    this.dialogService.Alert('Thông báo', 'Không thể xác nhận Email với tài khoản đã xóa');
                    return;
                }
                this.dialogService.ConfirmAsync('Xác nhận email của khách hàng: <b>' + name + '</b> là đúng?', async () => {
                    let obj: MLUserVerifyPhoneEntity = {
                        Id: item.Id,
                        Phone: item.Phone,
                        Email: item.Email,
                        DialingCode: '+84',
                        Name: item.NameCode,
                    };
                    await this.service.verifyEmail(obj).then(async (result: ResultApi) => {
                        if (ResultApi.IsSuccess(result)) {
                            ToastrHelper.Success('Xác nhận email thành công');
                            await this.loadItem();
                            await this.renderActions();
                            this.historyComponent.loadItems();
                        } else ToastrHelper.ErrorResult(result);
                    }, (e) => {
                        ToastrHelper.Exception(e);
                    });
                }, null, 'Xác nhận email', 'Xác nhận');
            }
        }
    }
    createTransaction(item: any) {
        if (item.MPConnected) {
            let url = AppConfig.getProtocol() + '//' + AppConfig.getDomain() + '/admin/mptransactions/add?phone=' + item.Phone;
            window.open(url, "_blank");
        } else this.dialogService.Alert('Thông báo', 'Tài khoản khách hàng chưa liên két ví, vui lòng thử lại sau');
    }

    private async loadItem() {
        if (this.id) {
            await this.service.item('mluser', this.id).then((result: ResultApi) => {
                this.renderItem(result);
            });
        } else if (this.meeyId) {
            await this.service.itemByMeeyId(this.meeyId).then((result: ResultApi) => {
                this.renderItem(result);
            });
        }
    }
    private async renderActions() {
        let actions: ActionData[] = [
            ActionData.back(() => { this.back() }),
        ];

        // Edit
        if (this.item.Status != MLUserStatusType.Deleted) {
            actions.push(ActionData.gotoEdit("Sửa tài khoản", () => { this.edit(this.item) }));
        }

        // Lock/Unlock
        if (this.item.Status == MLUserStatusType.Locked) {
            actions.push({
                icon: 'la la-unlock',
                name: ActionType.UnLock,
                systemName: ActionType.UnLock,
                className: 'btn btn-outline-primary',
                click: (() => {
                    this.unlockUser(this.item);
                })
            });
        } else if (this.item.Status == MLUserStatusType.Active) {
            actions.push({
                icon: 'la la-lock',
                name: ActionType.Lock,
                systemName: ActionType.Lock,
                className: 'btn btn-outline-primary',
                click: (() => {
                    this.lockUser(this.item);
                })
            });
        }

        // ResetPassword
        if (this.item.Status == MLUserStatusType.Active) {
            actions.push({
                icon: 'la la-key',
                name: ActionType.ResetPassword,
                systemName: ActionType.ResetPassword,
                className: 'btn btn-outline-primary',
                click: (() => {
                    this.resetPassword(this.item);
                })
            });
        }

        // Delete
        if (this.item.Status != MLUserStatusType.Deleted) {
            actions.push({
                icon: 'la la-trash',
                name: ActionType.Delete,
                className: 'btn btn-danger',
                systemName: ActionType.Delete,
                click: (() => {
                    this.deleteUser(this.item);
                })
            });
        }
        this.actions = await this.authen.actionsAllow(MLUserEntity, actions);
    }
    private renderItem(result: ResultApi) {
        if (ResultApi.IsSuccess(result)) {
            this.item = EntityHelper.createEntity(MLUserEntity, result.Object);
            let option: OptionItem = ConstantHelper.ML_USER_STATUS_TYPES.find(c => c.value == this.item.Status);
            let text = '<span class="' + (option && option.color) + '">' + (option && option.label) + '</span>';
            this.item.StatusText = text;
            if (!this.item.Id) this.item.Id = this.id;
            this.item['WalletBalance'] = this.item.Balance || this.item.DiscountBalance1 || this.item.DiscountBalance2;
            if (this.item.MPConnected) {
                let text: string = '',
                    mainMoney = this.item.Balance == null ? '--' : this.item.Balance.toLocaleString("vi-VN", { maximumFractionDigits: 2 }) + ' đ',
                    discountBalance1 = this.item.DiscountBalance1 == null ? '--' : this.item.DiscountBalance1.toLocaleString("vi-VN", { maximumFractionDigits: 2 }) + ' đ',
                    discountBalance2 = this.item.DiscountBalance2 == null ? '--' : this.item.DiscountBalance2.toLocaleString("vi-VN", { maximumFractionDigits: 2 }) + ' đ';
                if (this.item.MPPhone) text += '<p>' + UtilityExHelper.escapeHtml(this.item.MPPhone) + '</p>';
                text += '<p style="color: #5867dd;" class="d-flex align-items-center justify-content-between"><span style="width: 120px; display: inline-block;"><i class=\'la la-caret-right\'></i> <b>TK Chính: </span><span>' + mainMoney + '</span></b></p>';
                text += '<p class="d-flex align-items-center justify-content-between"><span style="width: 120px; display: inline-block;"><i class=\'la la-caret-right\'></i> TKKM1: </span><span>' + discountBalance1 + '</span></p>';
                text += '<p class="d-flex align-items-center justify-content-between"><span style="width: 120px; display: inline-block;"><i class=\'la la-caret-right\'></i> TKKM2: </span><span>' + discountBalance2 + '</span></p>';
                this.item['BalanceText'] = text;
            } else {
                let text = '<p style="color: #384AD7;"><b><i class="la la-info" style="margin-right: 2px;"></i></b>Chưa liên kết</p>';
                this.item['BalanceText'] = text;
            }
            if (this.state?.object) {
                this.item.SaleV2 = this.state.object.SaleV2Name;
                this.item.SupportV2 = this.state.object.SupportV2Name;
            }
        }
    }
}