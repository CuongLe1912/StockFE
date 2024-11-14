declare var $;
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { AppInjector } from '../../../../app.module';
import { MeeyCrmService } from '../../meeycrm.service';
import { AppConfig } from '../../../../_core/helpers/app.config';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { ActionData } from '../../../../_core/domains/data/action.data';
import { GoogleSigninService } from '../../../../google-signin.service';
import { ActionType } from '../../../../_core/domains/enums/action.type';
import { MoreActionData } from '../../../../_core/domains/data/grid.data';
import { UtilityExHelper } from '../../../../_core/helpers/utility.helper';
import { EditorComponent } from '../../../../_core/editor/editor.component';
import { ModalSizeType } from '../../../../_core/domains/enums/modal.size.type';
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { AdminAuthService } from '../../../../_core/services/admin.auth.service';
import { MCRMAddNoteComponent } from '../../customer/add.note/add.note.component';
import { AdminDialogService } from '../../../../_core/services/admin.dialog.service';
import { NavigationStateData } from '../../../../_core/domains/data/navigation.state';
import { ChangeDetectorRef, Component, Input, OnDestroy, ViewChild } from '@angular/core';
import { MCRMCallLogComponent } from '../../customer/components/customer.calllog.component';
import { MCRMCustomerNoteComponent } from '../../customer/components/customer.note.component';
import { UpdateStatusLeadComponent } from '../update.status.lead/update.status.lead.component';
import { MCRMAddNoteCallComponent } from '../../customer/add.note.call/add.note.call.component';
import { MCRMAddNoteEmailComponent } from '../../customer/add.note.email/add.note.email.component';
import { MCRMCustomerHistoryComponent } from '../../customer/components/customer.history.component';
import { MCRMCustomerNoteEmailComponent } from '../../customer/components/customer.note.email.component';
import { PopupSigninGmailComponent } from '../../customer/popup.signin.gmail/popup.signin.gmail.component';
import { MCRMCustomerLeadEntity } from '../../../../_core/domains/entities/meeycrm/mcrm.customer.lead.entity';
import { MCRMCustomerActivityType } from '../../../../_core/domains/entities/meeycrm/enums/mcrm.customer.type';
import { MCRMCustomerLeadStatusType } from '../../../../_core/domains/entities/meeycrm/enums/mcrm.customer.status.type';

@Component({
    templateUrl: './view.customer.lead.component.html',
    styleUrls: ['./view.customer.lead.component.scss'],
})
export class MCRMViewCustomerLeadComponent extends EditComponent implements OnDestroy {
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
    tab: string = 'note';
    state: NavigationStateData;
    serviceTab: string = 'article';
    CustomerStatusType = MCRMCustomerLeadStatusType;
    CustomerActivityType = MCRMCustomerActivityType;
    item: MCRMCustomerLeadEntity = new MCRMCustomerLeadEntity();

    service: MeeyCrmService;
    authen: AdminAuthService;
    dialog: AdminDialogService;
    userGoogle: gapi.auth2.GoogleUser

    buttons: any[] = [
        { id: 'card_information', name: 'Thông tin chung' },
        { id: 'card_user', name: 'Thông tin MeeyID' },
        { id: 'card_support', name: 'Lịch sử chăm sóc' },
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
        window.addEventListener('scroll', this.windowScroll, true);
        
        // breadcrumbs
        this.breadcrumbs = [];
        this.breadcrumbs.push({ Name: 'CRM Nội bộ' });
        this.breadcrumbs.push({ Name: 'Quản lý khách hàng Lead ID', Link: '/admin/meeycrm/customerlead' });
        this.breadcrumbs.push({ Name: 'Chi tiết khách hàng' });

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

    windowScroll = (event: any): void => {
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
        this.router.navigate(['/admin/meeycrm/customerlead']);
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
                        lead: true,
                        user: this.userGoogle
                    },
                    confirmText: 'Gửi Email',
                    size: ModalSizeType.ExtraLarge,
                    object: MCRMAddNoteEmailComponent,
                    title: 'Gửi email cho khách hàng [' + item.Name + ']',
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
                                    title: 'Gửi email cho khách hàng [' + item.Name + ']',
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
                                            title: 'Gửi email cho khách hàng [' + item.Name + ']',
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
    edit(item: MCRMCustomerLeadEntity) {
        let obj: NavigationStateData = {
            id: item.Id,
            object: item,
            prevData: this.state?.prevData,
            prevUrl: '/admin/meeycrm/customerlead',
        };
        this.router.navigate(['/admin/meeycrm/customerlead/edit'], { state: { params: JSON.stringify(obj) } });
    }
    addNote(item: MCRMCustomerLeadEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Hủy',
            confirmText: 'Xác nhận',
            size: ModalSizeType.Large,
            objectExtra: { 
                item: item,
                lead: true,
            },
            object: MCRMAddNoteComponent,
            title: 'Thêm/sửa ghi chú khách hàng [' + item.Name + ']',
        }, async () => {
            this.noteComponent.loadItems();
        });
    }
    createMeeyId(item: MCRMCustomerLeadEntity) {
        let url = AppConfig.getProtocol() + '//' + AppConfig.getDomain() + '/admin/mluser/add?leadId=' + item.Id;
        window.open(url, "_blank");
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
    addNoteCall(item: MCRMCustomerLeadEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Hủy',
            objectExtra: {
                item: item,
                lead: true,
            },
            confirmText: 'Lưu thông tin',
            size: ModalSizeType.ExtraLarge,
            object: MCRMAddNoteCallComponent,
            title: 'Gọi điện cho khách hàng [' + item.Name + ']',
        }, async () => {
            await this.noteCallLogComponent.loadItems();
        }, null, null, () => {
            this.noteCallLogComponent.loadItems();
        });
    }
    updateStatus(item: MCRMCustomerLeadEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Hủy',
            confirmText: 'Xác nhận',
            size: ModalSizeType.Large,
            objectExtra: { item: item },
            object: UpdateStatusLeadComponent,
            title: 'Chuyển trạng thái khách hàng [' + item.Name + ']',
        }, async () => {
            this.historyComponent.loadItems();
            await this.loadItem();
            if (!this.popup)
                this.renderActions();
        });
    }

    private async loadItem() {
        if (this.id) {
            await this.service.getCustomerLead(this.id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(MCRMCustomerLeadEntity, result.Object);
                    this.item.Id = this.id;
                }else {
                    ToastrHelper.ErrorResult(result);
                    this.router.navigate(['/admin/error/403']); 
                }
            });
        }
    }
    private async renderActions() {
        let actions: ActionData[] = [
            ActionData.back(() => { this.router.navigate(['/admin/meeycrm/customerlead']) })];
        if (this.item[ActionType.Edit]) {
            actions.push(ActionData.gotoEdit("Sửa khách hàng", () => { this.edit(this.item) }));
        }

        let allowUpdateStatus = this.item[ActionType.UpdateStatus] && this.item.CustomerStatusType == MCRMCustomerLeadStatusType.BeingExploited;
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

        let allowCreateMeeyId = this.item[ActionType.CreateMeeyId] && this.item.CustomerStatusType == MCRMCustomerLeadStatusType.BeingExploited;
        if (allowCreateMeeyId) {
            actions.push({
                icon: 'la la-user',
                className: 'btn btn-warning',
                name: 'Tạo tài khoản khách hàng',
                systemName: ActionType.CreateMeeyId,
                click: () => {
                    this.createMeeyId(this.item);
                }
            });
        }
        
        this.actions = await this.authen.actionsAllow(MCRMCustomerLeadEntity, actions);

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
        moreActions = await this.authen.actionsAllow(MCRMCustomerLeadEntity, moreActions);
        this.moreActions = {
            Name: 'Thao tác',
            Icon: 'la la-bolt',
            Actions: moreActions,
        };
    }
}