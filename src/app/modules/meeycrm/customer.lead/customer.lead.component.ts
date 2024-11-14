import { Component } from "@angular/core";
import { AppInjector } from "../../../app.module";
import { MeeyCrmService } from "../meeycrm.service";
import { AppConfig } from "../../../_core/helpers/app.config";
import { GridData } from "../../../_core/domains/data/grid.data";
import { DataType } from "../../../_core/domains/enums/data.type";
import { ResultApi } from "../../../_core/domains/data/result.api";
import { ToastrHelper } from "../../../_core/helpers/toastr.helper";
import { ActionData } from "../../../_core/domains/data/action.data";
import { GoogleSigninService } from "../../../google-signin.service";
import { ActionType } from "../../../_core/domains/enums/action.type";
import { UtilityExHelper } from "../../../_core/helpers/utility.helper";
import { ConstantHelper } from "../../../_core/helpers/constant.helper";
import { BaseEntity } from "../../../_core/domains/entities/base.entity";
import { ModalSizeType } from "../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../_core/components/grid/grid.component";
import { MCRMAddNoteComponent } from "../customer/add.note/add.note.component";
import { NavigationStateData } from "../../../_core/domains/data/navigation.state";
import { MCRMCallLogDto } from "../../../_core/domains/entities/meeycrm/mcrm.calllog.entity";
import { MCRMAddNoteCallComponent } from "../customer/add.note.call/add.note.call.component";
import { UpdateStatusLeadComponent } from "./update.status.lead/update.status.lead.component";
import { MCRMAddNoteEmailComponent } from "../customer/add.note.email/add.note.email.component";
import { MCRMCustomerHistoryComponent } from "../customer/components/customer.history.component";
import { MCRMCallLogType } from "../../../_core/domains/entities/meeycrm/enums/mcrm.calllog.type";
import { ModalViewProfileComponent } from "../../../_core/modal/view.profile/view.profile.component";
import { PopupSigninGmailComponent } from "../customer/popup.signin.gmail/popup.signin.gmail.component";
import { MCRMImportCustomerLeadComponent } from "./import.customer.lead/import.customer.lead.component";
import { MCRMCustomerLeadEntity } from "../../../_core/domains/entities/meeycrm/mcrm.customer.lead.entity";
import { MCRMCustomerNoteCallStatusType } from "../../../_core/domains/entities/meeycrm/enums/mcrm.customer.type";
import { StatisticalCustomerLeadComponent } from "./statistical.customer.lead/statistical.customer.lead.component";
import { MCRMCustomerLeadStatusType } from "../../../_core/domains/entities/meeycrm/enums/mcrm.customer.status.type";

@Component({
    templateUrl: "../../../_core/components/grid/grid.component.html",
})
export class MCRMCustomerLeadComponent extends GridComponent {
    obj: GridData = {
        Reference: MCRMCustomerLeadEntity,
        Size: ModalSizeType.Large,
        UpdatedBy: false,
        Imports: [],
        Exports: [],
        Filters: [],
        Features: [
            ActionData.importData(() => {
                this.importData();
            }),
            ActionData.addNew(() => {
                this.addNew();
            }),
            ActionData.reload(() => {
                this.loadItems();
            }),
        ],
        Actions: [
            {
                icon: "la la-eye",
                name: ActionType.View,
                className: "btn btn-warning",
                systemName: ActionType.ViewDetail,
                click: (item: any) => this.view(item),
            },
            {
                icon: "la la-pencil",
                name: ActionType.Edit,
                className: "btn btn-success",
                systemName: ActionType.Edit,
                click: (item: MCRMCustomerLeadEntity) => {
                    let originalItem = this.originalItems.find(c => c.Id == item.Id);
                    this.edit(originalItem);
                },
            },
        ],
        MoreActions: [
            {
                icon: 'la la-phone',
                name: ActionType.Call,
                systemName: ActionType.Call,
                className: 'btn btn-success',
                hidden: (item: any) => {
                    return !(item[ActionType.Call] && item['PhoneText']);
                },
                click: (item: MCRMCustomerLeadEntity) => {
                    let originalItem = this.originalItems.find(c => c.Id == item.Id);
                    if (originalItem)
                        this.addNoteCall(originalItem);
                }
            },
            {
                name: ActionType.Notes,
                icon: 'la la-sticky-note',
                systemName: ActionType.Notes,
                hidden: (item: any) => {
                    return !item[ActionType.Notes];
                },
                click: (item: MCRMCustomerLeadEntity) => {
                    let originalItem = this.originalItems.find(c => c.Id == item.Id);
                    if (originalItem)
                        this.addNote(originalItem);
                }
            },
            {
                icon: 'la la-send',
                name: ActionType.SendEmail,
                systemName: ActionType.SendEmail,
                hidden: (item: any) => {
                    return !item[ActionType.SendEmail];
                },
                click: (item: MCRMCustomerLeadEntity) => {
                    let originalItem = this.originalItems.find(c => c.Id == item.Id);
                    if (originalItem)
                        this.addNoteEmail(originalItem);
                }
            },
            {
                icon: 'la la-exchange',
                name: ActionType.UpdateStatus,
                systemName: ActionType.UpdateStatus,
                hidden: (item: any) => {
                    return !(item[ActionType.UpdateStatus] && item.CustomerStatusTypeOrg == MCRMCustomerLeadStatusType.BeingExploited);
                },
                click: (item: MCRMCustomerLeadEntity) => {
                    let originalItem = this.originalItems.find(c => c.Id == item.Id);
                    if (originalItem)
                        this.updateStatus(originalItem);
                }
            },
            {
                icon: 'la la-user',
                name: 'Thiết lập MeeyID',
                systemName: ActionType.CreateMeeyId,
                hidden: (item: any) => {
                    return !(item[ActionType.CreateMeeyId] && item.CustomerStatusTypeOrg == MCRMCustomerLeadStatusType.BeingExploited);
                },
                click: (item: MCRMCustomerLeadEntity) => {
                    let originalItem = this.originalItems.find(c => c.Id == item.Id);
                    if (originalItem)
                        this.createMeeyId(originalItem);
                }
            },
            {
                name: 'Lịch sử',
                icon: 'la la-book',
                systemName: ActionType.View,
                click: ((item: MCRMCustomerLeadEntity) => {
                    let originalItem = this.originalItems.find(c => c.Id == item.Id);
                    this.history(originalItem);
                })
            },
        ],
        AsynLoad: () => this.asynLoad(),
        SearchText: 'Nhập Tên, Số điện thoại, Email',
        StatisticalComponent: StatisticalCustomerLeadComponent,
        CustomFilters: ['FilterSaleId', 'FilterCustomerType', 'CityId', 'FilterSupportId', 'FilterLastTimeSupport', 'CustomerActivityType', 'DistrictId', 'CustomerPotentialType'],
        DisableAutoLoad: true,
    };
    crmService: MeeyCrmService;
    userGoogle: gapi.auth2.GoogleUser;

    constructor(private signInGoogle: GoogleSigninService) {
        super();
        this.crmService = AppInjector.get(MeeyCrmService);
    }

    async ngOnInit() {
        this.properties = [
            {
                Property: 'Customer', Title: 'Khách hàng', Type: DataType.String,
                Format: ((item: any) => {
                    let text = '',
                        allow = item[ActionType.ViewDetail];
                    item['Code'] = item.Name || item.Phone;
                    if (item.Name) {
                        text += allow
                            ? '<p routerLink="quickView" type="view"><a>' + item.Name + '</a></p>'
                            : '<p>' + item.Name + '</p>';
                    }
                    if (item.MeeyId) {
                        let meeyId = item.MeeyId && item.MeeyId.length > 5
                            ? item.MeeyId.toString().substring(item.MeeyId.length - 5)
                            : item.MeeyId,
                            meeyIdText = allow ? '<a routerLink="quickView" type="user" tooltip="Xem chi tiết">' + meeyId + '</a>' : meeyId;
                        text += '<p style="min-height: 25px; overflow: visible;"> MeeyId: ' +
                            '<a style="text-decoration: none !important;" data="' + item.MeeyId + '" tooltip="Sao chép" flow="right">' +
                            '<i routerlink="copy" class="la la-copy"></i></a> ' + meeyIdText + '</p>';
                    }
                    if (item.CustomerType != null && item.CustomerType != undefined) {
                        let option = ConstantHelper.ML_CUSTOMER_TYPES.find(c => c.value == item.CustomerType);
                        if (option) text += '<p><i class=\'la la-user\'></i> ' + option.label + '</p>';
                    }
                    if (item.Source) {
                        text += '<p><i class=\'la la-globe\'></i> ' + item.Source + '</p>';
                    }
                    if (item.CreatedDate) {
                        let date = UtilityExHelper.dateTimeString(item.CreatedDate);
                        text += '<p><i class=\'la la-calendar\'></i> ' + date + '</p>';
                    }
                    return text;
                })
            },
            {
                Property: 'CustomerStatusType', Title: 'Trạng thái tài khoản', Type: DataType.String, Align: 'center',
                Format: ((item: any) => {
                    let text: string = '';
                    item['CustomerStatusTypeOrg'] = item.CustomerStatusType;
                    if (item.CustomerStatusType != null && item.CustomerStatusType != undefined) {
                        let option = ConstantHelper.ML_CUSTOMER_LEAD_STATUS_TYPES.find(c => c.value == item.CustomerStatusType);
                        if (option) text = '<p class="' + (option && option.color) + '">' + (option && option.label) + '</p>';
                    }
                    return text;
                })
            },
            {
                Property: 'Sale', Title: 'Nhân viên chăm sóc', Type: DataType.String,
                Format: ((item: any) => {
                    let text: string = '';
                    text += '<p>Sale: <a routerLink="quickView" type="sale">' + UtilityExHelper.escapeHtml(item.Sale) + '</a></p>';
                    text += '<p>CSKH: <a routerLink="quickView" type="support">' + UtilityExHelper.escapeHtml(item.Support) + '</a></p>';
                    return text;
                })
            },
            {
                Property: "CustomerPotentialType",
                Title: "Mức độ tiềm năng",
                Type: DataType.String,
            },
            {
                Property: 'Phone', Title: 'Thông tin liên lạc', Type: DataType.String,
                Format: ((item: any) => {
                    let text = '';
                    item['PhoneText'] = item.Phone;
                    if (item.Phone) {
                        let phone = item.Phone || '';
                        while (phone.indexOf('/') >= 0) phone = phone.replace('/', ',');
                        while (phone.indexOf(';') >= 0) phone = phone.replace(';', ',');
                        let phones = phone.split(',').map(c => c.trim()).filter((v, i, a) => a.indexOf(v) === i);
                        if (phones && phones.length > 0) {
                            text += '<p><i class=\'la la-phone\'></i> ';
                            phones.forEach((itemPhone: string) => {
                                itemPhone = UtilityExHelper.trimChars(itemPhone, [' ', ',']);
                                if (itemPhone) {
                                    text += item[ActionType.Call]
                                        ? '<a routerLink="quickView" type="' + itemPhone + '">' + itemPhone + '</a>, '
                                        : '<span>' + itemPhone + '</span>, ';
                                }
                            });
                            text = UtilityExHelper.trimChars(text, [' ', ',']);
                            text += '</p>';
                        }
                    }
                    if (item.Email) {
                        let email = item.Email || '';
                        while (email.indexOf('/') >= 0) email = email.replace('/', ',');
                        while (email.indexOf(';') >= 0) email = email.replace(';', ',');
                        let emails = email.split(',').map(c => c.trim()).filter((v, i, a) => a.indexOf(v) === i);
                        if (emails && emails.length > 0) {
                            text += '<p><i class=\'la la-inbox\'></i> ';
                            emails.forEach((itemEmail: string) => {
                                itemEmail = UtilityExHelper.trimChars(itemEmail, [' ', ',']);
                                if (itemEmail) {
                                    text += item[ActionType.SendEmail]
                                        ? '<a routerLink="quickView" type="' + itemEmail + '">' + itemEmail + '</a>, '
                                        : '<span>' + itemEmail + '</span>, ';
                                }
                            });
                            text = UtilityExHelper.trimChars(text, [' ', ',']);
                            text += '</p>';
                        }
                    }
                    if (item.Address || item.Ward || item.District || item.City) {
                        let address: string[] = [];
                        if (item?.Address) address.push(item.Address);
                        if (item?.Ward) address.push(item.Ward);
                        if (item?.District) address.push(item.District);
                        if (item?.City) address.push(item.City);
                        text += '<p>Địa chỉ: ' + address.join(', ') + '</p>'
                    }
                    return text;
                })
            },
            {
                Property: "LastTimeSupport",
                Title: "Ngày chăm sóc gần đây",
                Type: DataType.String,
                Format: ((item: any) => {
                    let text = '';
                    let originItem = <MCRMCustomerLeadEntity>this.originalItems.find(c => c.Id == item.Id);
                    if (originItem.LastTimeSupport) {
                        let date = UtilityExHelper.dateTimeString(originItem.LastTimeSupport);
                        text += '<p><i class=\'la la-calendar\'></i> ' + date + '</p>';
                    }
                    text += '<div class="kt-spinner kt-spinner--v2 kt-spinner--primary" style="margin-top: 12px;"></div>';
                    return text;
                })
            },
            {
                Property: "CustomerActivityType",
                Title: "Loại hình hoạt động",
                Type: DataType.String,
            },
        ];
        this.render(this.obj);

        // refresh
        if (!this.subscribeRefreshGrids) {
            this.subscribeRefreshGrids = this.event.RefreshGrids.subscribe(async () => {
                await this.loadItems();
            });
        }
    }

    addNew() {
        let obj: NavigationStateData = {
            prevData: this.itemData,
            prevUrl: '/admin/meeycrm/customerlead',
        };
        this.router.navigate(['/admin/meeycrm/customerlead/add'], { state: { params: JSON.stringify(obj) } });
    }
    importData() {
        this.dialogService.WapperAsync({
            cancelText: '',
            confirmText: '',
            title: 'Import Lead ID',
            size: ModalSizeType.Medium,
            object: MCRMImportCustomerLeadComponent,
        });
    }

    public asynLoad() {
        // load sale
        let ids = this.items && this.items.map(c => c.Id);
        if (ids && ids.length > 0) {
            let idsString = ids.join(',');
            this.crmService.getLastNoteItems(idsString, true).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    let items: any[] = result.Object;
                    items.forEach((item: any) => {
                        let itemDb = this.items.find(c => c.Id == item.Id);
                        if (itemDb) {
                            let text: string = '',
                                lastTimeSupport: string = itemDb['LastTimeSupport'] || '',
                                status: MCRMCustomerNoteCallStatusType = <MCRMCustomerNoteCallStatusType>item.Status;
                            if (status) {
                                let option = ConstantHelper.ML_CUSTOMER_NOTE_CALL_STATUS_TYPES.find(c => c.value == status);
                                if (option) text += '<p>Kết quả: ' + option.label + '</p>';
                            }
                            text += item.Note ? '<p>Ghi chú: ' + UtilityExHelper.escapeHtml(item.Note) + '</p>' : '';
                            itemDb['LastTimeSupport'] = lastTimeSupport.replace('<div class="kt-spinner kt-spinner--v2 kt-spinner--primary" style="margin-top: 12px;"></div>', text);
                        }
                    });
                }
            });
        }
    }

    view(item: BaseEntity) {
        let url = AppConfig.getProtocol() + '//' + AppConfig.getDomain() + '/admin/meeycrm/customerlead/view?id=' + item.Id;
        window.open(url, "_blank");
    }
    history(item: any) {
        this.dialogService.WapperAsync({
            cancelText: "Đóng",
            size: ModalSizeType.ExtraLarge,
            objectExtra: {
                leadId: item.Id,
            },
            title: "Lịch sử",
            object: MCRMCustomerHistoryComponent,
        });
    }
    edit(item: BaseEntity) {
        let obj: NavigationStateData = {
            id: item.Id,
            prevData: this.itemData,
            prevUrl: '/admin/meeycrm/customerlead',
        };
        this.router.navigate(['/admin/meeycrm/customerlead/edit'], { state: { params: JSON.stringify(obj) } });
    }
    createMeeyId(item: BaseEntity) {
        let url = AppConfig.getProtocol() + '//' + AppConfig.getDomain() + '/admin/mluser/add?leadId=' + item.Id;
        window.open(url, "_blank");
    }

    addNote(item: any) {
        let code = item.Name || item.Phone;
        this.dialogService.WapperAsync({
            cancelText: 'Hủy',
            confirmText: 'Xác nhận',
            size: ModalSizeType.Large,
            objectExtra: {
                item: item,
                lead: true,
            },
            object: MCRMAddNoteComponent,
            title: 'Thêm/sửa ghi chú khách hàng [' + code + ']',
        }, async () => {
            this.loadItems();
        });
    }
    addNoteCall(item: any) {
        let code = item.Name || item.Phone;
        this.dialogService.WapperAsync({
            cancelText: 'Hủy',
            objectExtra: {
                item: item,
                lead: true,
            },
            confirmText: 'Lưu thông tin',
            size: ModalSizeType.ExtraLarge,
            object: MCRMAddNoteCallComponent,
            title: 'Nghe/Gọi điện cho khách hàng [' + code + ']',
        }, async () => {
            this.loadItems();
        });
    }
    updateStatus(item: any) {
        this.dialogService.WapperAsync({
            cancelText: 'Hủy',
            confirmText: 'Xác nhận',
            size: ModalSizeType.Large,
            objectExtra: {
                item: item,
                lead: true,
            },
            object: UpdateStatusLeadComponent,
            title: 'Chuyển trạng thái khách hàng [' + item.Code + ']',
        }, async () => {
            this.loadItems();
        });
    }
    async makeCall(item: any, phone: string) {
        let obj: MCRMCallLogDto = {
            Phone: phone,
            Opening: false,
            Customer: item,
            TypeName: 'Cuộc gọi đi',
            MCRMCustomerLeadId: item.Id,
            Type: MCRMCallLogType.Outbound,
            Message: 'Kết nối tới tổng đài...',
            Extension: this.authen.account.ExtPhoneNumber
        };
        this.dataService.addCallItem(obj);
        await this.crmService.makeCall({
            PrefixNumber: 1,
            Phone: obj.Phone,
            CustomerId: obj.MCRMCustomerId,
        }).then((result: ResultApi) => {
            let message = result && result.Description;
            if (ResultApi.IsSuccess(result)) {
                obj.Message = 'Đang đổ chuông...';
            } else {
                obj.Message = message;
                this.dataService.closeCallItem(obj);
            }
        }, (e) => {
            ToastrHelper.Exception(e);
        });
    }
    async addNoteEmail(item: any, email?: string) {
        let code = item.Name || item.Phone;
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
                    title: 'Gửi email cho khách hàng [' + code + ']',
                }, async () => {
                    this.loadItems();
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
                                        lead: true,
                                        email: email,
                                        user: this.userGoogle
                                    },
                                    confirmText: 'Gửi Email',
                                    size: ModalSizeType.ExtraLarge,
                                    object: MCRMAddNoteEmailComponent,
                                    title: 'Gửi email cho khách hàng [' + item.Code + ']',
                                }, async () => {
                                    this.loadItems();
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
                                                lead: true,
                                                email: email,
                                                user: this.userGoogle
                                            },
                                            confirmText: 'Gửi Email',
                                            size: ModalSizeType.ExtraLarge,
                                            object: MCRMAddNoteEmailComponent,
                                            title: 'Gửi email cho khách hàng [' + item.Code + ']',
                                        }, async () => {
                                            this.loadItems();
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

    quickView(item: any, type: string) {
        if (type) {
            if (type == "view") this.view(item);
            if (type == "user") {
                let obj: NavigationStateData = {
                    prevUrl: '/admin/mluser',
                };
                let url = AppConfig.getProtocol() + '//' + AppConfig.getDomain() + '/admin/mluser/view?meeyId=' + item['MeeyId'];
                this.setUrlState(obj, 'mluser');
                window.open(url, "_blank");
            }
            if (type == "sale") this.quickViewProfile(item.SaleId);
            if (type == "createby") this.quickViewProfile(item.CreatedById);
        }
    }
    public quickViewProfile(id: number) {
        this.dialogService.WapperAsync({
            cancelText: "Đóng",
            objectExtra: { id: id },
            size: ModalSizeType.Large,
            title: "Thông tin tài khoản",
            object: ModalViewProfileComponent,
        });
    }
    private popupSigninErrorMail(message: string) {
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
    private setUrlState(state: NavigationStateData, controller: string = null) {
      if (!controller) controller = this.getController();
      let stateKey = 'params',
        sessionKey = 'session_' + stateKey + '_' + controller;
      if (state) sessionStorage.setItem(sessionKey, JSON.stringify(state));
    }
}