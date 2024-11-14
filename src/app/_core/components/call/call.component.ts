import * as _ from 'lodash';
import { Router } from '@angular/router';
import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { ResultApi } from '../../domains/data/result.api';
import { ModalSizeType } from '../../domains/enums/modal.size.type';
import { AdminAuthService } from '../../services/admin.auth.service';
import { AdminDataService } from '../../services/admin.data.service';
import { AdminEventService } from '../../services/admin.event.service';
import { AdminDialogService } from '../../services/admin.dialog.service';
import { MeeyCrmService } from '../../../modules/meeycrm/meeycrm.service';
import { ActionType, ControllerType } from '../../domains/enums/action.type';
import { MCRMCallLogDto } from '../../domains/entities/meeycrm/mcrm.calllog.entity';
import { MCRMCallLogType } from '../../domains/entities/meeycrm/enums/mcrm.calllog.type';
import { MCRMAddCustomerComponent } from '../../../modules/meeycrm/customer/add.customer/add.customer.component';
import { MCRMViewCustomerComponent } from '../../../modules/meeycrm/customer/view.customer/view.customer.component';
import { MCRMAddNoteCallComponent } from '../../../modules/meeycrm/customer/add.note.call/add.note.call.component';

@Component({
    selector: 'call',
    templateUrl: './call.component.html',
    styleUrls: ['./call.component.scss'],
})
export class CallComponent implements OnDestroy {
    allowNoteCall: boolean = false;
    allowViewDetail: boolean = false;
    subscribeQuickPanel: Subscription;
    subscribeSignalrNotify: Subscription;

    constructor(
        public router: Router,
        public data: AdminDataService,
        public service: MeeyCrmService,
        public authen: AdminAuthService,
        public event: AdminEventService,
        public dialog: AdminDialogService) {
        if (!this.subscribeSignalrNotify) {
            this.subscribeSignalrNotify = this.event.SignalrNotify.subscribe(async (notify: any) => {
                if (notify.type && notify.type.indexOf('call_') >= 0) {
                    let item = this.data.findAndUpdateCallItem(notify.object);
                    if (item && item.Extension == this.authen.account.ExtPhoneNumber) {
                        switch (notify.type) {
                            case 'call_answer': {
                                this.data.startIntervalTime(item);
                            } break;
                            case 'call_hangup':
                            case 'call_hangup_detail': {
                                this.data.endCallItem(item);
                            } break;
                            case 'call_incoming': {
                                this.data.incomingCallItem(item);
                            } break;
                            case 'call_outcoming': {
                                this.data.outcomingCallItem(item);
                            } break;
                        }

                        // check permission
                        if (item.Type == MCRMCallLogType.Outbound) {
                            if (item.Customer) {
                                let allowNoteCall = await this.authen.permissionAllow(ControllerType.MCRMCustomer, ActionType.Call),
                                    allowViewDetail = await this.authen.permissionAllow(ControllerType.MCRMCustomer, ActionType.ViewDetail);
                                if (allowNoteCall || allowViewDetail) {
                                    await this.service.getPermissionCustomer(item.Customer.Id).then((result: ResultApi) => {
                                        let customer = result.Object;
                                        if (customer) {
                                            this.allowNoteCall = customer[ActionType.Call];
                                            this.allowViewDetail = customer[ActionType.ViewDetail];
                                        }
                                    });
                                }
                            }
                        } else {
                            this.allowNoteCall = true;
                            this.allowViewDetail = true;
                        }
                    }
                }
            });
        }
    }

    ngOnDestroy() {
        if (this.subscribeQuickPanel) {
            this.subscribeQuickPanel.unsubscribe();
            this.subscribeQuickPanel = null;
        }
    }

    closeItem(item: MCRMCallLogDto) {
        this.data.closeCallItem(item);
    }

    addCustomer(item: MCRMCallLogDto) {
        this.dialog.WapperAsync({
            cancelText: 'Hủy',
            objectExtra: {
                phone: item.Phone,
            },
            title: 'Thêm mới khách hàng',
            object: MCRMAddCustomerComponent,
            confirmText: 'Tạo khách hàng',
            size: ModalSizeType.ExtraLarge,
        });
    }

    addNoteCall(item: MCRMCallLogDto) {
        item.Opening = true;
        this.dialog.WapperAsync({
            cancelText: 'Hủy',
            objectExtra: {
                item: item.Customer,
                callId: item.CallId,
            },
            confirmText: 'Lưu thông tin',
            size: ModalSizeType.ExtraLarge,
            object: MCRMAddNoteCallComponent,
            title: 'Gọi điện cho khách hàng [' + item.Phone + ']',
        });
    }

    viewCustomer(item: MCRMCallLogDto) {
        let customerId = item.MCRMCustomerId || (item.Customer && item.Customer.Id);
        this.dialog.WapperAsync({
            cancelText: 'Đóng',
            size: ModalSizeType.FullScreen,
            objectExtra: {
                popup: true,
                id: customerId,
            },
            object: MCRMViewCustomerComponent,
            title: 'Chi tiết khách hàng [' + item.Phone + ']',
        });
    }
}