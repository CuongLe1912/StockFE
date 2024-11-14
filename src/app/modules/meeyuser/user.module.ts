import * as _ from 'lodash';
import { MLUserService } from './user.service';
import { RouterModule } from "@angular/router";
import { NgApexchartsModule } from 'ng-apexcharts';
import { HttpEventType } from '@angular/common/http';
import { ShareModule } from "../../modules/share.module";
import { AppConfig } from '../../_core/helpers/app.config';
import { UtilityModule } from "../../modules/utility.module";
import { GridData } from "../../_core/domains/data/grid.data";
import { DataType } from "../../_core/domains/enums/data.type";
import { ResultApi } from '../../_core/domains/data/result.api';
import { TableData } from '../../_core/domains/data/table.data';
import { ToastrHelper } from '../../_core/helpers/toastr.helper';
import { FilterData } from '../../_core/domains/data/filter.data';
import { ActionData } from "../../_core/domains/data/action.data";
import { OptionItem } from '../../_core/domains/data/option.item';
import { MLAddUserComponent } from './add.user/add.user.component';
import { ActionType } from "../../_core/domains/enums/action.type";
import { ExportType } from '../../_core/domains/enums/export.type';
import { ConstantHelper } from '../../_core/helpers/constant.helper';
import { AdminAuthGuard } from "../../_core/guards/admin.auth.guard";
import { UtilityExHelper } from "../../_core/helpers/utility.helper";
import { MLViewUserComponent } from './view.user/view.user.component';
import { BaseEntity } from '../../_core/domains/entities/base.entity';
import { MLUserLockComponent } from './user.lock/user.lock.component';
import { MLEditUserComponent } from './edit.user/edit.user.component';
import { Component, NgModule, OnDestroy, OnInit } from "@angular/core";
import { MLEmbedUserComponent } from './embed.user/embed.user.component';
import { ModalSizeType } from "../../_core/domains/enums/modal.size.type";
import { MLUserCouponComponent } from './components/user.coupon.component';
import { GridComponent } from "../../_core/components/grid/grid.component";
import { MLUserDeleteComponent } from './user.delete/user.delete.component';
import { MLUserUnLockComponent } from './user.unlock/user.unlock.component';
import { MLUserHistoryComponent } from './components/user.history.component';
import { NavigationStateData } from '../../_core/domains/data/navigation.state';
import { MLUserOrderPackageComponent } from './components/user.order.package.component';
import { MLUserStatisticalComponent } from './user.statistical/user.statistical.component';
import { ModalViewProfileComponent } from '../../_core/modal/view.profile/view.profile.component';
import { MLUserResetPasswordComponent } from './user.reset.password/user.reset.password.component';
import { MLUserStatisticalSaleComponent } from './user.statistical.sale/user.statistical.sale.component';
import { MLAddUserAffiliateComponent } from './components/add.user.affiliate/add.user.affiliate.component';
import { MLUserResetPasswordType, MLUserStatusType } from '../../_core/domains/entities/meeyland/enums/ml.user.type';
import { MLUserEntity, MLUserLockEntity, MLUserResetPasswordEntity, MLUserVerifyPhoneEntity } from "../../_core/domains/entities/meeyland/ml.user.entity";
import { MLUserStatisticalSaleTutorialComponent } from './user.statistical.sale/user.statistical.sale.tutorial/user.statistical.sale.tutorial.component';

@Component({
    templateUrl: '../../_core/components/grid/grid.component.html',
})
export class MLUserComponent extends GridComponent implements OnInit, OnDestroy {
    allowVerify: boolean = true;
    allowViewDetail: boolean = true;
    allowAddTransaction: boolean = true;
    obj: GridData = {
        Imports: [],
        Exports: [
            {
                name: 'Excel',
                systemName: ActionType.Export,
                click: async () => {
                    this.loadingText = 'Đang xuất dữ liệu...';
                    this.loading = true;
                    let obj: TableData = _.cloneDeep(this.itemData) || new TableData();
                    if (obj) {
                        obj.Export = {
                            Limit: 200000,
                            Type: ExportType.Excel,
                        };
                        obj.Paging.Index = 1;
                        obj.Paging.Size = obj.Export.Limit;
                    }
                    await this.service.downloadFile('mluser', obj).toPromise().then(data => {
                        switch (data.type) {
                            case HttpEventType.DownloadProgress:
                                break;
                            case HttpEventType.Response:
                                let extension = 'xlsx';
                                const downloadedFile = new Blob([data.body], { type: data.body.type });
                                const a = document.createElement('a');
                                a.setAttribute('style', 'display:none;');
                                document.body.appendChild(a);
                                a.download = 'meey_id' + '.' + extension;
                                a.href = URL.createObjectURL(downloadedFile);
                                a.target = '_blank';
                                a.click();
                                document.body.removeChild(a);
                                break;
                        }
                    }, () => {
                        ToastrHelper.Error('Lỗi hệ thống khi xuất dữ liệu, vui lòng thử lại sau');
                    });
                    this.loadingText = null;
                    this.loading = false;
                },
                icon: 'kt-nav__link-icon la la-file-excel-o',
            }
        ],
        Filters: [],
        Actions: [
            {
                icon: 'la la-eye',
                name: ActionType.ViewDetail,
                className: 'btn btn-warning',
                systemName: ActionType.ViewDetail,
                hidden: (item: any) => {
                    return !item[ActionType.ViewDetail];
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
                    return !(item[ActionType.Edit] && item.StatusCode != MLUserStatusType.Deleted);
                },
                click: (item: any) => {
                    this.edit(item);
                }
            },
            {
                icon: 'la la-lock',
                name: ActionType.Lock,
                systemName: ActionType.Lock,
                className: 'btn btn-danger',
                hidden: (item: any) => {
                    return !(item[ActionType.Lock] && item.StatusCode == MLUserStatusType.Active);
                },
                click: (item: any) => {
                    this.lockUser(item);
                }
            },
            {
                icon: 'la la-unlock',
                name: ActionType.UnLock,
                systemName: ActionType.UnLock,
                className: 'btn btn-danger',
                hidden: (item: any) => {
                    return !(item[ActionType.UnLock] && item.StatusCode == MLUserStatusType.Locked);
                },
                click: (item: any) => {
                    this.unlockUser(item);
                }
            }
        ],
        Features: [
            ActionData.reload(() => { this.loadItems(); })
        ],
        MoreActions: [
            {
                icon: 'la la-recycle',
                className: 'btn btn-warning',
                name: ActionType.ImportToCRM,
                systemName: ActionType.ImportToCRM,
                hidden: (item: any) => {
                    return item.HaveImport;
                },
                click: ((item: MLUserEntity) => {
                    this.importToCRM(item);
                })
            },
            {
                icon: 'la la-book',
                name: ActionType.History,
                className: 'btn btn-warning',
                systemName: ActionType.ViewDetail,
                hidden: (item: any) => {
                    return !item[ActionType.ViewDetail];
                },
                click: ((item: MLUserEntity) => {
                    this.viewHistory(item);
                })
            },
            {
                icon: 'la la-exchange',
                className: 'btn btn-danger',
                name: ActionType.ResetPassword,
                systemName: ActionType.ResetPassword,
                hidden: (item: any) => {
                    return !(item[ActionType.ResetPassword] && item.StatusCode == MLUserStatusType.Active);
                },
                click: (item: any) => {
                    this.resetPassword(item);
                }
            },
            {
                icon: 'la la-trash',
                name: 'Xóa tài khoản',
                className: 'btn btn-danger',
                systemName: ActionType.Delete,
                hidden: (item: any) => {
                    return !(item[ActionType.Delete] && item.StatusCode != MLUserStatusType.Deleted);
                },
                click: (item: any) => {
                    this.deleteUser(item);
                }
            }
        ],
        UpdatedBy: false,
        DisableAutoLoad: true,
        Reference: MLUserEntity,
        PageSizes: [5, 10, 20, 50],
        Title: 'Danh sách khách hàng',
        Size: ModalSizeType.ExtraLarge,
        AsynLoad: () => this.asynLoad(),
        SearchText: 'Nhập mã, điện thoại, email',
        StatisticalComponent: MLUserStatisticalComponent,
        CustomFilters: ['SaleIds', 'SupportIds', 'Source', 'AffiliateId', 'MPWalletLinked', 'DateTime', 'LastLogin', 'Status', 'PhoneVerified', 'CreatorId'],
    };

    constructor(public apiService: MLUserService) {
        super();
    }

    ngOnDestroy() {
        if (this.subscribeRefreshGrids) {
            this.subscribeRefreshGrids.unsubscribe();
            this.subscribeRefreshGrids = null;
        }
    }

    async ngOnInit() {
        let allowAddNew = await this.authen.permissionAllow('mluser', ActionType.AddNew);
        this.allowVerify = await this.authen.permissionAllow('mluser', ActionType.Verify);
        this.allowViewDetail = await this.authen.permissionAllow('mluser', ActionType.ViewDetail);
        this.allowAddTransaction = await this.authen.permissionAllow('mluser', ActionType.AddNewTransaction);
        if (allowAddNew) {
            this.obj.Features.unshift(ActionData.addNew(() => this.addNew()));
        }
        if (this.allowAddTransaction) {
            this.obj.MoreActions.push({
                icon: 'la la-info',
                className: 'btn btn-warning',
                name: ActionType.AddNewTransaction,
                systemName: ActionType.AddNewTransaction,
                hidden: ((item: any) => {
                    return !item.MPConnected;
                }),
                click: ((item: MLUserEntity) => {
                    let originalItem: any = this.originalItems.find(c => c.Id == item.Id);
                    if (originalItem.MPConnected) {
                        let url = AppConfig.getProtocol() + '//' + AppConfig.getDomain() + '/admin/mptransactions/add?phone=' + originalItem.Phone;
                        window.open(url, "_blank");
                    } else this.dialogService.Alert('Thông báo', 'Tài khoản khách hàng chưa liên két ví, vui lòng thử lại sau');
                })
            });
        }

        // columns
        this.properties = [
            {
                Property: 'MeeyId', Title: 'Id', Type: DataType.String,
                Format: (item: any) => {
                    return item.Viewer || !this.allowViewDetail
                        ? UtilityExHelper.renderIdFormat(item.Id, item.MeeyId)
                        : UtilityExHelper.renderIdFormat(item.Id, item.MeeyId, true);
                }
            },
            {
                Property: 'Name', Title: 'Thông tin khách hàng', Type: DataType.String,
                Format: ((item: any) => {
                    item['NameCode'] = item['Name'];
                    let text: string = '';
                    if (item.Name)
                        text += item.Viewer || !this.allowViewDetail
                            ? '<p>' + UtilityExHelper.escapeHtml(item.Name) + '</p>'
                            : '<p><a routerLink="quickView" type="view">' + UtilityExHelper.escapeHtml(item.Name) + '</a></p>';
                    if (item.Phone) text += '<p><i class=\'la la-phone\'></i> ' + UtilityExHelper.escapeHtml(item.Phone) + '</p>';
                    if (item.Email) text += '<p><i class=\'la la-inbox\'></i> ' + UtilityExHelper.escapeHtml(item.Email) + '</p>';
                    if (item.UserName) text += '<p><i class=\'la la-user\'></i> ' + UtilityExHelper.escapeHtml(item.UserName) + '</p>';
                    if (item.LeadStatusV2) text += '<p style="overflow: visible"><span tooltip="Trạng thái của V2"><i class=\'la la-info\'></i><span> ' + UtilityExHelper.escapeHtml(item.LeadStatusV2) + '</p>';
                    return text;
                })
            },
            {
                Property: 'Sale', Title: 'Nhân viên chăm sóc', Type: DataType.String,
                Format: ((item: any) => {
                    let text: string = '';
                    text += '<p>Sale: <a routerLink="quickView" type="sale">' + UtilityExHelper.escapeHtml(item.SaleEmail) + '</a></p>';
                    text += '<p>CSKH: <a routerLink="quickView" type="support">' + UtilityExHelper.escapeHtml(item.SupportEmail) + '</a></p>';
                    return text;
                })
            },
            {
                Property: 'Status', Title: 'Trạng thái', Type: DataType.String, Align: 'center',
                Format: (item: any) => {
                    item['StatusCode'] = item['Status'];
                    let option: OptionItem = ConstantHelper.ML_USER_STATUS_TYPES.find(c => c.value == item.Status);
                    let text = '<p class="' + (option && option.color) + '">' + (option && option.label) + '</p>';
                    return text;
                }
            },
            {
                Property: 'PhoneVerified', Title: 'Xác nhận SĐT', Type: DataType.String, Align: 'center',
                Format: (item: any) => {
                    item['PhoneVerifiedCode'] = item['PhoneVerified'];

                    if (!item.Phone) return '';
                    if (item.StatusCode == MLUserStatusType.Deleted)
                        return '';

                    let checked = item.PhoneVerified ? true : false;
                    let text = '<p class="d-flex align-items-center justify-content-center">'
                        + '<a routerLink="quickView" type="verified">'
                        + '<span class="switch switch-primary switch-sm ' + (checked ? '' : 'switch-outline') + '" style="pointer-events: none;"><label>'
                        + (checked
                            ? '<input type="checkbox" class="switch-disabled" checked="checked" name="select">'
                            : '<input type="checkbox" name="select">')
                        + '<span></span></label></span></a></p>';
                    return text;
                }
            },
            {
                Property: 'Balance', Title: 'Số dư TK', Type: DataType.String,
                Format: (item: any) => {
                    if (item.MPConnected)
                        return '<div class="kt-spinner kt-spinner--v2 kt-spinner--primary"></div>';
                    else {
                        if (item.Viewer || !this.allowViewDetail) {
                            return null;
                        } else {
                            let text = '<p style="color: #384AD7;"><b><i class="la la-info" style="margin-right: 2px;"></i></b>Chưa liên kết</p>';
                            return text;
                        }
                    }
                }
            },
            {
                Property: 'CreatedDate', Title: 'Thông tin tạo', Type: DataType.String, Align: 'center',
                Format: (item: any) => {
                    let text: string = '';
                    text += '<p>' + UtilityExHelper.dateTimeString(item.CreatedDate) + '</p>';
                    if (item.Source) text += '<p>' + item.Source + '</p>';
                    return text;
                }
            },
            {
                Property: 'LastLogin', Title: 'Đăng nhập gần nhất', Type: DataType.String, Align: 'center',
                Format: (item: any) => {
                    let text: string = '';
                    text += '<p>' + UtilityExHelper.dateTimeString(item.LastLogin) + '</p>';
                    if (item.LoginSource) text += '<p>' + item.LoginSource + '</p>';
                    return text;
                }
            },
        ];

        // render
        await this.render(this.obj);

        // refresh
        if (!this.subscribeRefreshGrids) {
            this.subscribeRefreshGrids = this.event.RefreshGrids.subscribe(async (obj: TableData) => {
                if (!this.itemData.Filters)
                    this.itemData.Filters = [];
                this.itemData.Filters = this.itemData.Filters
                    .filter(c => c.Name != 'CustomDateTime')
                    .filter(c => c.Name != 'HaveArticle')
                    .filter(c => c.Name != 'NotSale');
                if (obj) {
                    switch (obj.Name) {
                        case 'ToDay':
                        case 'Weekend': {
                            if (obj.Filters && obj.Filters.length > 0) {
                                obj.Filters.forEach((item: FilterData) => {
                                    this.itemData.Filters.push(item);
                                });
                            }
                        } break;
                    }
                }
                await this.loadItems();
            });
        }
    }

    addNew() {
        let obj: NavigationStateData = {
            prevData: this.itemData,
            prevUrl: '/admin/mluser',
        };
        this.router.navigate(['/admin/mluser/add'], { state: { params: JSON.stringify(obj) } });
    }
    asynLoad() {
        // load sale
        let ids = this.items && this.items.filter(c => c['MPConnected']).map(c => c.Id);
        if (ids && ids.length > 0) {
            this.apiService.getAllWalletItems(ids).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    let items: MLUserEntity[] = result.Object;
                    this.items.forEach((item: any) => {
                        let itemDb = items.find(c => c.Id == item.Id);
                        if (itemDb) {
                            item['WalletBalance'] = itemDb.Balance || itemDb.DiscountBalance1 || itemDb.DiscountBalance2;
                            if (item.Viewer || !this.allowViewDetail) {
                                item['Balance'] = '';
                            } else {
                                if (item.MPConnected) {
                                    let text: string = '',
                                        mainMoney = itemDb.Balance == null ? '--' : itemDb.Balance.toLocaleString("vi-VN", { maximumFractionDigits: 2 }) + ' đ',
                                        discountBalance1 = itemDb.DiscountBalance1 == null ? '--' : itemDb.DiscountBalance1.toLocaleString("vi-VN", { maximumFractionDigits: 2 }) + ' đ',
                                        discountBalance2 = itemDb.DiscountBalance2 == null ? '--' : itemDb.DiscountBalance2.toLocaleString("vi-VN", { maximumFractionDigits: 2 }) + ' đ';
                                    if (itemDb.MPPhone) text += '<p>' + UtilityExHelper.escapeHtml(itemDb.MPPhone) + '</p>';
                                    text += '<p style="color: #5867dd;" class="d-flex align-items-center justify-content-between"><span style="width: 120px; display: inline-block;"><i class=\'la la-caret-right\'></i> <b>TK Chính: </span><span>' + mainMoney + '</span></b></p>';
                                    text += '<p class="d-flex align-items-center justify-content-between"><span style="width: 120px; display: inline-block;"><i class=\'la la-caret-right\'></i> TKKM1: </span><span>' + discountBalance1 + '</span></p>';
                                    text += '<p class="d-flex align-items-center justify-content-between"><span style="width: 120px; display: inline-block;"><i class=\'la la-caret-right\'></i> TKKM2: </span><span>' + discountBalance2 + '</span></p>';
                                    item['Balance'] = text;
                                } else {
                                    let text = '<p style="color: #384AD7;"><b><i class="la la-info" style="margin-right: 2px;"></i></b>Chưa liên kết</p>';
                                    item['Balance'] = text;
                                }
                            }
                        }
                    });
                }
            });
        }
    }
    view(item: BaseEntity) {
        let obj: NavigationStateData = {
            id: item.Id,
            object: item,
            prevData: this.itemData,
            prevUrl: '/admin/mluser',
        };
        this.router.navigate(['/admin/mluser/view'], { state: { params: JSON.stringify(obj) } });
    }
    edit(item: BaseEntity) {
        let obj: NavigationStateData = {
            id: item.Id,
            object: item,
            prevData: this.itemData,
            prevUrl: '/admin/mluser',
        };
        this.router.navigate(['/admin/mluser/edit'], { state: { params: JSON.stringify(obj) } });
    }

    quickView(item: any, type: string) {
        switch (type) {
            case 'sale': this.quickViewProfile(item['SaleId'], item['SaleEmail']); break;
            case 'support': this.quickViewProfile(item['SupportId'], item['SupportEmail']); break;
            case 'view': {
                this.view(item);
            }; break;
            case 'verified': {
                if (!item.PhoneVerifiedCode && !item.Viewer && this.allowVerify) {
                    this.verifyPhone(item);
                }
            }; break;
        }
    }
    public quickViewProfile(id: number, email: string) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            objectExtra: {
                id: id,
                email: email
            },
            size: ModalSizeType.Large,
            title: 'Thông tin tài khoản',
            object: ModalViewProfileComponent,
        });
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
            await this.loadItems();
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
            await this.loadItems();
        });
    }
    deleteUser(item: any) {
        if (item.WalletBalance) {
            let message = '<p>Tài khoản vẫn còn số dư, không được phép xóa</p>'
                + item.Balance.replace('<p>', '<p>Đang liên kết Meey Pay: ')
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
                await this.loadItems();
            });
        }
    }
    verifyPhone(item: any) {
        let name = UtilityExHelper.escapeHtml(item.NameCode || item.UserName);
        if (!item.Phone) {
            this.dialogService.Alert('Thông báo', 'Tài khoản khách hàng không có số điện thoại, không thể xác nhận');
            return;
        }
        if (item.Viewer || !this.allowViewDetail) {
            return;
        }
        if (item.StatusCode == MLUserStatusType.Deleted) {
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
            await this.apiService.verifyPhone(obj).then(async (result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    ToastrHelper.Success('Xác nhận số điện thoại thành công');
                    await this.loadItems();
                } else ToastrHelper.ErrorResult(result);
            }, (e) => {
                ToastrHelper.Exception(e);
            });
        }, null, 'Xác nhận số điện thoại', 'Xác nhận');
    }
    verifyEmail(item: any) {
        let name = UtilityExHelper.escapeHtml(item.NameCode || item.UserName);
        if (!item.Email) {
            this.dialogService.Alert('Thông báo', 'Tài khoản khách hàng không có email, không thể xác nhận');
            return;
        }
        if (item.StatusCode == MLUserStatusType.Deleted) {
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
            await this.apiService.verifyEmail(obj).then(async (result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    ToastrHelper.Success('Xác nhận email thành công');
                    await this.loadItems();
                } else ToastrHelper.ErrorResult(result);
            }, (e) => {
                ToastrHelper.Exception(e);
            });
        }, null, 'Xác nhận email', 'Xác nhận');
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
                await this.loadItems();
            });
        } else {
            this.dialogService.Alert('Thông báo', 'Khách hàng không có thông tin Email hoặc Số điện thoại');
        }
    }
    importToCRM(item: BaseEntity) {
        this.dialogService.ConfirmAsync('Có phải bạn muốn nhập tài khoản này vào hệ thống CRM nội bộ', async () => {
            await this.apiService.importToCRM(item.Id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    let message = 'Đã nhập tài khoản vào hệ thống CRM nội bộ thành công';
                    ToastrHelper.Success(message);
                    return;
                }
                ToastrHelper.ErrorResult(result);
            });
        });
    }
}

@NgModule({
    declarations: [
        MLUserComponent,
        MLAddUserComponent,
        MLViewUserComponent,
        MLEditUserComponent,
        MLUserLockComponent,
        MLEmbedUserComponent,
        MLUserDeleteComponent,
        MLUserUnLockComponent,
        MLUserCouponComponent,
        MLUserStatisticalComponent,
        MLUserOrderPackageComponent,
        MLAddUserAffiliateComponent,
        MLUserResetPasswordComponent,
        MLUserStatisticalSaleComponent,
        MLUserStatisticalSaleTutorialComponent,
    ],
    imports: [
        ShareModule,
        UtilityModule,
        NgApexchartsModule,
        RouterModule.forChild([
            { path: '', component: MLUserComponent, pathMatch: 'full', data: { state: 'ml_user' }, canActivate: [AdminAuthGuard] },
            { path: 'add', component: MLAddUserComponent, pathMatch: 'full', data: { state: 'ml_add_user' }, canActivate: [AdminAuthGuard] },
            { path: 'edit', component: MLEditUserComponent, pathMatch: 'full', data: { state: 'ml_edit_user' }, canActivate: [AdminAuthGuard] },
            { path: 'view', component: MLViewUserComponent, pathMatch: 'full', data: { state: 'ml_view_user' }, canActivate: [AdminAuthGuard] },
            { path: 'statistical', component: MLUserStatisticalSaleComponent, pathMatch: 'full', data: { state: 'ml_view_statistic_user' }, canActivate: [AdminAuthGuard] },
        ])
    ],
    providers: [MLUserService]
})
export class MLUserModule { }