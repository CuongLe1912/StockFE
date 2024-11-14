declare var $;
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { AppInjector } from '../../../../app.module';
import { MeeyCrmService } from '../../meeycrm.service';
import { MCRMAddNoteComponent } from '../add.note/add.note.component';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { ActionData } from '../../../../_core/domains/data/action.data';
import { GoogleSigninService } from '../../../../google-signin.service';
import { ActionType } from '../../../../_core/domains/enums/action.type';
import { AssignType } from '../../../../_core/domains/enums/assign.type';
import { MoreActionData } from '../../../../_core/domains/data/grid.data';
import { UtilityExHelper } from '../../../../_core/helpers/utility.helper';
import { EditorComponent } from '../../../../_core/editor/editor.component';
import { MCRMCallLogComponent } from '../components/customer.calllog.component';
import { ModalSizeType } from '../../../../_core/domains/enums/modal.size.type';
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { AdminAuthService } from '../../../../_core/services/admin.auth.service';
import { UpdateStatusComponent } from '../update.status/update.status.component';
import { MCRMCustomerNoteComponent } from '../components/customer.note.component';
import { GroupCustomerComponent } from '../group.customer/group.customer.component';
import { MCRMAddNoteCallComponent } from '../add.note.call/add.note.call.component';
import { AdminDialogService } from '../../../../_core/services/admin.dialog.service';
import { NavigationStateData } from '../../../../_core/domains/data/navigation.state';
import { MCRMAddNoteEmailComponent } from '../add.note.email/add.note.email.component';
import { AssignCustomerComponent } from '../assign.customer/assign.customer.component';
import { MCRMCustomerHistoryComponent } from '../components/customer.history.component';
import { ChangeDetectorRef, Component, Input, OnDestroy, ViewChild } from '@angular/core';
import { ReceiveCustomerComponent } from '../receive.customer/receive.customer.component';
import { MCRMCustomerNoteEmailComponent } from '../components/customer.note.email.component';
import { PopupSigninGmailComponent } from '../popup.signin.gmail/popup.signin.gmail.component';
import { MCRMCustomerEntity } from '../../../../_core/domains/entities/meeycrm/mcrm.customer.entity';
import { MCRMCustomerActivityType, MCRMCustomerStatusType } from '../../../../_core/domains/entities/meeycrm/enums/mcrm.customer.type';

@Component({
    templateUrl: './view.customer.component.html',
    styleUrls: ['./view.customer.component.scss'],
})
export class MCRMViewCustomerComponent extends EditComponent implements OnDestroy {
    @Input() params: any;
    actions: ActionData[] = [];
    moreActions: MoreActionData;

    loading: boolean = true;
    loadingService: boolean = true;
    loadingHistory: boolean = true;
    loadingTransaction: boolean = true;

    id: number;
    router: Router;
    popup: boolean;
    meeyId: string;
    tab: string = 'note';
    state: NavigationStateData;
    serviceTab: string = 'article';
    CustomerStatusType = MCRMCustomerStatusType;
    CustomerActivityType = MCRMCustomerActivityType;
    item: MCRMCustomerEntity = new MCRMCustomerEntity();

    service: MeeyCrmService;
    authen: AdminAuthService;
    dialog: AdminDialogService;

    userGoogle: gapi.auth2.GoogleUser

    buttons: any[] = [
        { id: 'card_information', name: 'Thông tin chung' },
        { id: 'card_user', name: 'Thông tin MeeyID' },
        { id: 'card_support', name: 'Lịch sử chăm sóc' },
        { id: 'card_transaction', name: 'Lịch sử giao dịch' },
        { id: 'card_order', name: 'Lịch sử đơn hàng' },
        { id: 'card_service', name: 'Dịch vụ sử dụng' },
        { id: 'card_history', name: 'Lịch sử tài khoản' },
    ];
    activeIndex: string = 'card_information';

    @ViewChild('uploadAvatar') uploadAvatar: EditorComponent;
    @ViewChild('note') noteComponent: MCRMCustomerNoteComponent;
    @ViewChild('history') historyComponent: MCRMCustomerHistoryComponent;
    @ViewChild('noteCallLog') noteCallLogComponent: MCRMCallLogComponent;
    @ViewChild('noteEmail') noteEmailComponent: MCRMCustomerNoteEmailComponent;

    constructor(private signInGoogle: GoogleSigninService, private ref: ChangeDetectorRef) {
        super();
        this.router = AppInjector.get(Router);
        this.service = AppInjector.get(MeeyCrmService);
        this.authen = AppInjector.get(AdminAuthService);
        this.dialog = AppInjector.get(AdminDialogService);
        this.state = this.getUrlState();

        this.signInGoogle.observable().subscribe(user => {
            this.userGoogle = user
            this.ref.detectChanges()
        })
    }

    ngOnDestroy(): void {
        window.removeEventListener('scroll', this.windowScroll, true);
    }

    async ngOnInit() {
        this.id = this.getParam('id');
        this.popup = this.getParam('popup');
        this.meeyId = this.getParam('meeyId');
        window.addEventListener('scroll', this.windowScroll, true);
        if (this.state) {
            this.id = this.id || this.state.id;
            this.addBreadcrumb(this.id ? 'Chi tiết khách hàng' : 'Thêm khách hàng');
        }
        if (!this.id && this.meeyId) {
            this.addBreadcrumb(this.meeyId ? 'Chi tiết khách hàng' : 'Thêm khách hàng');
        }
        await this.loadItem();
        if (!this.popup)
            this.renderActions();
        this.loading = false;
    }

    scrollToCard(item: any) {
        this.activeIndex = item.id;
        if (this.popup) {
            let scrollTop = $('.modal.show .modal-body').scrollTop(),
                offset = $('.modal.show .modal-body .popup #' + item.id).position().top;
            $('.modal.show .modal-body').animate({ scrollTop: offset + scrollTop - 70 });
        } else {
            let offset = $('#' + item.id).offset().top - 180;
            UtilityExHelper.scrollToPosition(null, offset);
        }
    }

    windowScroll = (event): void => {
        let topMenu = $("#top-menu").offset().top + 95;
        let cur = this.buttons.filter(c => $('#' + c.id).offset().top < topMenu);
        if (cur && cur.length > 0) {
            let button = cur[cur.length - 1];
            if (this.activeIndex != button.id) {
                this.activeIndex = button.id;
            }
        }
    };

    selectedTab(tab: string) {
        this.tab = tab;
    }

    selectedServiceTab(tab: string) {
        this.serviceTab = tab;
    }

    back() {
        this.router.navigate(['/admin/meeycrm/customer']);
    }
    async addNoteEmail(item: any) {
        let user = this.signInGoogle.currentUser();
        let login = true;
        if (user) {
            if (user?.getBasicProfile()?.getEmail()?.includes('@meeyland.com')) {
                this.userGoogle = user
                login = false;
                this.dialogService.WapperAsync({
                    cancelText: 'Hủy',
                    objectExtra: {
                        item: item,
                        user: this.userGoogle
                    },
                    confirmText: 'Gửi Email',
                    size: ModalSizeType.ExtraLarge,
                    object: MCRMAddNoteEmailComponent,
                    title: 'Gửi email cho khách hàng [' + item.Code + ']',
                }, async () => {
                    await this.noteEmailComponent.loadItems();
                });
            } else {
                this.signInGoogle.signOut()
            }
        }

        if (login) {
            this.dialogService.WapperAsync({
                cancelText: 'Đóng',
                confirmText: 'Tiếp tục',
                size: ModalSizeType.Medium,
                title: 'Kết nối tài khoản mail',
                object: PopupSigninGmailComponent,
            }, async () => {
                setTimeout(async () => {
                    try {
                        if (this.userGoogle) {
                            if (this.userGoogle?.getBasicProfile()?.getEmail()?.includes('@meeyland.com')) {
                                this.dialogService.WapperAsync({
                                    cancelText: 'Hủy',
                                    objectExtra: {
                                        item: item,
                                        user: this.userGoogle
                                    },
                                    confirmText: 'Gửi Email',
                                    size: ModalSizeType.ExtraLarge,
                                    object: MCRMAddNoteEmailComponent,
                                    title: 'Gửi email cho khách hàng [' + item.Code + ']',
                                }, async () => {
                                    await this.noteEmailComponent.loadItems();
                                });
                            } else {
                                this.popupSigninErrorMail('<p>Email: <a>' + this.userGoogle.getBasicProfile().getEmail() + '</a> không hợp lệ, Vui lòng chọn loại tài khoản email <a>(@meeyland.com)</a></p>')
                            }
                        } else {
                            await this.signInGoogle.signIn().then(() => {
                                if (this.userGoogle) {
                                    if (this.userGoogle?.getBasicProfile()?.getEmail()?.includes('@meeyland.com')) {
                                        this.dialogService.WapperAsync({
                                            cancelText: 'Hủy',
                                            objectExtra: {
                                                item: item,
                                                user: this.userGoogle
                                            },
                                            confirmText: 'Gửi Email',
                                            size: ModalSizeType.ExtraLarge,
                                            object: MCRMAddNoteEmailComponent,
                                            title: 'Gửi email cho khách hàng [' + item.Code + ']',
                                        }, async () => {
                                            await this.noteEmailComponent.loadItems();
                                        });
                                    } else {
                                        this.popupSigninErrorMail('<p>Email: <a>' + this.userGoogle.getBasicProfile().getEmail() + '</a> không hợp lệ, Vui lòng chọn loại tài khoản email <a>(@meeyland.com)</a></p>')
                                    }
                                }
                            }).catch(error => {
                                this.popupSigninErrorMail('<p>Vui lòng đăng nhập tài khoản gmail của bạn!</p>')
                            })
                        }
                    } catch (error) {
                        this.signInGoogle.signOut()
                    }
                }, 500);
            })
        }
    }
    edit(item: MCRMCustomerEntity) {
        let obj: NavigationStateData = {
            id: item.Id,
            object: item,
            prevData: this.state?.prevData,
            prevUrl: '/admin/meeycrm/customer',
        };
        this.router.navigate(['/admin/meeycrm/customer/edit'], { state: { params: JSON.stringify(obj) } });
    }
    addNote(item: MCRMCustomerEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Hủy',
            confirmText: 'Xác nhận',
            size: ModalSizeType.Large,
            objectExtra: { item: item },
            object: MCRMAddNoteComponent,
            title: 'Thêm/sửa ghi chú khách hàng [' + item.Code + ']',
        }, async () => {
            this.noteComponent.loadItems();
        });
    }

    popupSigninErrorMail(message) {
        setTimeout(() => {
            this.dialogService.WapperAsync({
                cancelText: 'Đóng',
                objectExtra: {
                    message: message,
                },
                size: ModalSizeType.Medium,
                title: 'Lỗi kết nối tài khoản email',
                object: PopupSigninGmailComponent,
            }, null, null, null, async () => {
                await this.signInGoogle.signOut();
            });
        })
    }
    addNoteCall(item: MCRMCustomerEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Hủy',
            objectExtra: {
                item: item
            },
            confirmText: 'Lưu thông tin',
            size: ModalSizeType.ExtraLarge,
            object: MCRMAddNoteCallComponent,
            title: 'Gọi điện cho khách hàng [' + item.Code + ']',
        }, async () => {
            await this.noteCallLogComponent.loadItems();
        }, null, null, () => {
            this.noteCallLogComponent.loadItems();
        });
    }
    updateStatus(item: MCRMCustomerEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Hủy',
            confirmText: 'Xác nhận',
            size: ModalSizeType.Large,
            objectExtra: { item: item },
            object: UpdateStatusComponent,
            title: 'Chuyển trạng thái khách hàng [' + item.Code + ']',
        }, async () => {
            this.historyComponent.loadItems();
            await this.loadItem();
            if (!this.popup)
                this.renderActions();
        });
    }
    transfer(items: any[], type: AssignType) {
        if (items && items.length > 0) {
            let cloneItems = _.cloneDeep(items);
            cloneItems.forEach((item: any, index: number) => {
                item.Index = index + 1;
            });
            this.dialogService.WapperAsync({
                cancelText: 'Hủy bỏ',
                confirmText: 'Xác nhận',
                size: ModalSizeType.ExtraLarge,
                title: 'Điều chuyển khách hàng',
                objectExtra: {
                    items: cloneItems,
                    type: <number>type,
                },
                object: AssignCustomerComponent,
            }, async () => {
                this.historyComponent.loadItems();
                await this.loadItem();
                if (!this.popup)
                    this.renderActions();
            });
        } else this.dialogService.Alert('Thông báo', 'Vui lòng chọn tối thiểu 1 bản ghi để điều chuyển');
    }
    receiveCustomer(item: MCRMCustomerEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Hủy',
            confirmText: 'Nhận khách',
            size: ModalSizeType.Large,
            objectExtra: { item: item },
            object: ReceiveCustomerComponent,
            title: 'Nhận khách hàng [' + item.Code + ']',
        }, async () => {
            this.historyComponent.loadItems();
            await this.loadItem();
            if (!this.popup)
                this.renderActions();
        });
    }
    groupCustomer(items: MCRMCustomerEntity[]) {
        if (items && items.length > 0) {
            let cloneItems = _.cloneDeep(items);
            cloneItems.forEach((item: any, index: number) => {
                item.Index = index + 1;
            });
            this.dialogService.WapperAsync({
                cancelText: 'Hủy bỏ',
                confirmText: 'Tiếp tục',
                title: 'Gộp khách hàng',
                size: ModalSizeType.ExtraLarge,
                objectExtra: {
                    items: cloneItems,
                },
                object: GroupCustomerComponent,
            }, async () => {
                this.historyComponent.loadItems();
                await this.loadItem();
                if (!this.popup)
                    this.renderActions();
            });
        } else this.dialogService.Alert('Thông báo', 'Vui lòng chọn tối thiểu 1 bản ghi để tạo yêu cầu');
    }

    private async loadItem() {
        if (this.id) {
            await this.service.getCustomer(this.id, 'view').then((result: ResultApi) => {
                this.renderItem(result);
            });
        } else {
            await this.service.getCustomer(this.meeyId, 'view').then((result: ResultApi) => {
                this.renderItem(result);
            });
        }
    }
    private async renderActions() {
        let actions: ActionData[] = [
            ActionData.back(() => { this.back() })];
        if (this.item[ActionType.Edit]) {
            actions.push(ActionData.gotoEdit("Sửa khách hàng", () => { this.edit(this.item) }));
        }

        let allowUpdateStatus = this.item[ActionType.UpdateStatus] && this.item.CustomerStatusType != MCRMCustomerStatusType.NotSale;
        if (allowUpdateStatus) {
            actions.push({
                icon: 'la la-exchange',
                name: 'Chuyển trạng thái',
                className: 'btn btn-warning',
                systemName: ActionType.UpdateStatus,
                click: () => {
                    this.updateStatus(this.item);
                }
            });
        }

        let allowReceiveCustomer = this.item.Expire && this.item[ActionType.ReceiveCustomer] &&
            ((this.authen.account.IsSale && this.authen.account.Email != this.item['SaleEmail']) ||
                (this.authen.account.IsSupport && this.authen.account.Email != this.item['SupportEmail']));
        if (allowReceiveCustomer) {
            actions.push({
                icon: 'la la-share-alt',
                name: 'Nhận khách hàng',
                className: 'btn btn-success',
                systemName: ActionType.ReceiveCustomer,
                click: () => {
                    this.receiveCustomer(this.item);
                }
            });
        }
        this.actions = await this.authen.actionsAllow(MCRMCustomerEntity, actions);

        let moreActions: ActionData[] = [];
        if (this.item[ActionType.Notes]) {
            moreActions.push({
                name: ActionType.Notes,
                icon: 'la la-sticky-note',
                className: 'btn btn-warning',
                systemName: ActionType.Notes,
                click: () => {
                    this.addNote(this.item);
                }
            });
        }
        if (this.item[ActionType.Call]) {
            if (this.item.Phone) {
                moreActions.push({
                    icon: 'la la-phone',
                    name: ActionType.Call,
                    systemName: ActionType.Call,
                    className: 'btn btn-primary',
                    click: () => {
                        this.addNoteCall(this.item);
                    }
                });
            }
        }
        if (this.item[ActionType.SendEmail]) {
            moreActions.push({
                icon: 'la la-send',
                name: ActionType.SendEmail,
                className: 'btn btn-success',
                systemName: ActionType.SendEmail,
                click: () => {
                    this.addNoteEmail(this.item);
                }
            });
        }
        if (this.item[ActionType.GroupCustomer]) {
            moreActions.push({
                icon: 'la la-group',
                className: 'btn btn-danger',
                name: ActionType.GroupCustomer,
                systemName: ActionType.GroupCustomer,
                click: () => {
                    this.groupCustomer([this.item]);
                }
            });
        }
        moreActions = await this.authen.actionsAllow(MCRMCustomerEntity, moreActions);
        this.moreActions = {
            Name: 'Thao tác',
            Icon: 'la la-bolt',
            Actions: moreActions,
        };
    }
    private renderItem(result: ResultApi) {
        if (ResultApi.IsSuccess(result)) {
            this.item = EntityHelper.createEntity(MCRMCustomerEntity, result.Object);

            // address
            this.item.AddressDetail = UtilityExHelper.join([
                this.item.Address,
                this.item.Ward,
                this.item.District,
                this.item.City,
            ]);
            if (this.id) this.item.Id = this.id;
            else this.id = this.item.Id;
            
            // phone
            let phone = this.item.Phone || '';
            while (phone.indexOf('/') >= 0) phone = phone.replace('/', ',');
            while (phone.indexOf(';') >= 0) phone = phone.replace(';', ',');
            phone = phone.split(',').map(c => c.trim()).filter((v, i, a) => a.indexOf(v) === i).join(', ');
            phone = UtilityExHelper.trimChars(phone, [' ', ',']);
            this.item.Phone = phone;

            // expire
            if (this.item.ExpireDay) {
                let expire: boolean = false;
                switch (this.item.CustomerStatusType) {
                    case MCRMCustomerStatusType.NotSale: {
                        expire = true;
                    } break;
                    case MCRMCustomerStatusType.Reject: {
                        if (this.item.ExpireDay && this.item.ExpireDay >= 0) {
                            expire = true;
                            this.item.ExpireMessage = "Quá hạn chăm sóc";
                        }
                    } break;
                    case MCRMCustomerStatusType.NotApproach: {
                        if (this.item.ExpireDay && this.item.ExpireDay >= 1) {
                            expire = true;
                            this.item.ExpireMessage = "Quá hạn chăm sóc";
                        }
                    } break;
                    case MCRMCustomerStatusType.Consider: {
                        if (this.item.ExpireDay && this.item.ExpireDay >= 10) {
                            expire = true;
                            this.item.ExpireMessage = "Quá hạn chăm sóc";
                        }
                    } break;
                    case MCRMCustomerStatusType.Success: {
                        if (this.item.ExpireDay && this.item.ExpireDay >= 30) {
                            expire = true;
                            this.item.ExpireMessage = "Quá hạn chăm sóc";
                        }
                    } break;
                }
                this.item.Expire = expire;
            } else this.item.Expire = true;
        } else {
            ToastrHelper.ErrorResult(result);
            this.router.navigate(['/admin/error/403']);
        }
    }
}