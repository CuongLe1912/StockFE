import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { AppInjector } from '../../../../app.module';
import { MeeyCrmService } from '../../meeycrm.service';
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { ButtonType } from '../../../../_core/domains/enums/button.type';
import { Component, OnInit, Input, OnDestroy, ViewChild } from '@angular/core';
import { MCRMCallLogComponent } from '../components/customer.calllog.component';
import { AdminDataService } from '../../../../_core/services/admin.data.service';
import { AdminAuthService } from '../../../../_core/services/admin.auth.service';
import { AdminEventService } from '../../../../_core/services/admin.event.service';
import { MCRMCallLogDto } from '../../../../_core/domains/entities/meeycrm/mcrm.calllog.entity';
import { MCRMCallLogType } from '../../../../_core/domains/entities/meeycrm/enums/mcrm.calllog.type';
import { MCRMCustomerLeadEntity } from '../../../../_core/domains/entities/meeycrm/mcrm.customer.lead.entity';
import { MCRMCustomerEntity, MCRMCustomerNoteCallDto } from '../../../../_core/domains/entities/meeycrm/mcrm.customer.entity';

@Component({
    templateUrl: './add.note.call.component.html',
    styleUrls: ['./add.note.call.component.scss'],
})
export class MCRMAddNoteCallComponent implements OnInit, OnDestroy {
    connected: boolean;
    connecting: boolean;
    @Input() params: any;
    service: MeeyCrmService;
    ButtonType = ButtonType;
    disabled: boolean = true;
    authen: AdminAuthService;
    dataService: AdminDataService;
    eventService: AdminEventService;
    subscribeSignalrNotify: Subscription;

    lead: boolean = false;
    itemOpen: MCRMCallLogDto;
    entity: MCRMCustomerEntity;
    entityLead: MCRMCustomerLeadEntity;
    item: MCRMCustomerNoteCallDto = new MCRMCustomerNoteCallDto();
    @ViewChild('noteCallLog') noteCallLogComponent: MCRMCallLogComponent;

    constructor() {
        this.service = AppInjector.get(MeeyCrmService);
        this.authen = AppInjector.get(AdminAuthService);
        this.dataService = AppInjector.get(AdminDataService);
        this.eventService = AppInjector.get(AdminEventService);
        if (!this.subscribeSignalrNotify) {
            this.subscribeSignalrNotify = this.eventService.SignalrNotify.subscribe((notify: any) => {
                if (notify.type && notify.type.indexOf('call_') >= 0) {
                    let itemOpen = this.dataService.findAndUpdateCallItem(notify.object);
                    if (itemOpen &&
                        itemOpen.Extension == this.authen.account.ExtPhoneNumber &&
                        (this.item.Phone == itemOpen.Phone || this.item.PhoneText == itemOpen.Phone)) {
                        this.itemOpen = itemOpen;
                        this.item.CallLogId = this.itemOpen.Id;
                        this.item.CallId = this.itemOpen.CallId;
                        switch (notify.type) {
                            case 'call_answer': {
                                this.dataService.startIntervalTime(this.itemOpen);
                                if (!this.itemOpen) {
                                    this.resetState();
                                }
                            } break;
                            case 'call_hangup': {
                                this.dataService.endCallItem(this.itemOpen);
                                this.item.Message = this.itemOpen.Message;
                                this.reloadNoteCall();
                                this.resetState();
                            } break;
                            case 'call_hangup_detail': {
                                this.dataService.endCallItem(this.itemOpen);
                                this.item.Message = this.itemOpen.Message;
                                this.reloadNoteCall();
                                this.resetState();
                            } break;
                            case 'call_incoming': {
                                this.dataService.incomingCallItem(this.itemOpen);
                                if (!this.itemOpen) {
                                    this.resetState();
                                }
                            } break;
                            case 'call_outcoming': {
                                this.dataService.outcomingCallItem(this.itemOpen);
                                if (!this.itemOpen) {
                                    this.resetState();
                                }
                            } break;
                        }
                    }
                }
            });
        }
    }

    ngOnInit() {
        this.lead = this.params && this.params['lead'];
        this.loadItem();
    }

    ngOnDestroy() {
        if (this.subscribeSignalrNotify) {
            this.subscribeSignalrNotify.unsubscribe();
            this.subscribeSignalrNotify = null;
        }
    }

    close() {
        this.minimize();
    }
    minimize() {
        if (this.itemOpen) {
            this.dataService.minimizeCallItem(this.itemOpen);
        }
    }
    phoneChange() {
        let item = this.dataService.findCallItem(this.item.Phone);
        if (item) {
            this.itemOpen = item;
        }
    }

    async confirm() {
        let valid = await validation(this.item, ['Status']);
        if (valid && this.item) {
            if (!this.item.CallId) this.item.CallId = this.itemOpen && this.itemOpen.CallId;
            if (!this.item.CallLogId) this.item.CallLogId = this.itemOpen && this.itemOpen.Id;

            let obj: MCRMCustomerNoteCallDto = {
                Id: this.item.Id,
                Note: this.item.Note,
                Type: this.item.Type,
                CallId: this.item.CallId,
                Status: this.item.Status,
                CallLogId: this.item.CallLogId,
                Phone: this.item.Phone || this.item.PhoneText,
                CustomerId: this.item.CustomerId || this.item.CustomerLeadId,
            };
            return await this.service.addNoteCall(obj, this.lead).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    let message = this.item.Id
                        ? 'Sửa ghi chú gọi điện khách hàng thành công'
                        : 'Thêm mới ghi chú gọi điện khách hàng thành công';
                    ToastrHelper.Success(message);
                    this.minimize();
                    return true;
                }
                ToastrHelper.ErrorResult(result);
                return false;
            }, (e) => {
                ToastrHelper.Exception(e);
                return false;
            });
        }
        return false;
    }
    async makeCall() {
        this.connected = false;
        this.connecting = true;
        this.item.Message = 'Kết nối tới tổng đài...';
        await this.service.makeCall(this.item, this.lead).then((result: ResultApi) => {
            this.connecting = false;
            let message = result && result.Description;
            if (ResultApi.IsSuccess(result)) {
                this.connected = true;
                this.item.Message = 'Đang đổ chuông...';

                let obj = new MCRMCallLogDto();
                obj.Opening = true;
                obj.Customer = this.entity;
                obj.TypeName = 'Cuộc gọi đi';
                obj.Message = 'Đang đổ chuông...';
                obj.Type = MCRMCallLogType.Outbound;
                obj.MCRMCustomerId = this.entity?.Id;
                obj.MCRMCustomerLeadId = this.entityLead?.Id;
                obj.Phone = this.item.Phone || this.item.PhoneText;
                obj.Extension = this.authen.account.ExtPhoneNumber;
                this.dataService.addCallItem(obj);
                this.itemOpen = obj;
                return;
            } else {
                this.itemOpen = null;
                this.connected = false;
                this.item.Message = message;
            }
        }, (e) => {
            this.connecting = false;
            this.item.Message = null;
            ToastrHelper.Exception(e);
        });
    }
    private resetState() {
        this.itemOpen = null;
        this.connected = false;
        this.connecting = false;
    }
    private async loadItem() {
        if (this.lead) {
            let item = this.params && this.params['item'],
                callId = this.params && this.params['callId'];
            this.entityLead = EntityHelper.createEntity(MCRMCustomerLeadEntity, item);
            this.item.PhoneText = this.entityLead.Phone;
            this.item.CustomerLeadId = this.entityLead.Id;
            if (callId) {
                this.itemOpen = this.dataService.findCallItem(callId);
                if (this.itemOpen) {
                    this.connected = true;
                    this.item.CallLogId = this.itemOpen.Id;
                    this.item.CallId = this.itemOpen.CallId;
                }
            }
        } else {
            let item = this.params && this.params['item'],
                callId = this.params && this.params['callId'];
            this.entity = EntityHelper.createEntity(MCRMCustomerEntity, item);
            this.item.CustomerId = this.entity.Id;
            if (callId) {
                this.itemOpen = this.dataService.findCallItem(callId);
                if (this.itemOpen) {
                    this.connected = true;
                    this.item.CallLogId = this.itemOpen.Id;
                    this.item.CallId = this.itemOpen.CallId;
                }
            }            
        }
    }
    private reloadNoteCall() {
        this.noteCallLogComponent.loadItems();
    }
    async toggleDisableButton() {
        let valid = await validation(this.item, ['Status'], true);
        this.disabled = !(valid);
    }
}