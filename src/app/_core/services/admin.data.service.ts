import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import { IpDto } from '../domains/objects/ip.dto';
import { HubConnection } from '@microsoft/signalr';
import { AdminApiService } from './admin.api.service';
import { ResultApi } from '../domains/data/result.api';
import { OptionItem } from '../domains/data/option.item';
import { ResultType } from '../domains/enums/result.type';
import { UtilityExHelper } from '../helpers/utility.helper';
import { MCRMCallLogDto } from '../domains/entities/meeycrm/mcrm.calllog.entity';
import { MCRMCallLogType } from '../domains/entities/meeycrm/enums/mcrm.calllog.type';

@Injectable()
export class AdminDataService {
    countryIp: IpDto;
    connection: HubConnection;
    ajaxItems: OptionItem[] = [];

    callItems: MCRMCallLogDto[] = [];

    // menu
    activeMenuAside: boolean = false;
    activeMenuHeader: boolean = false;

    constructor(private service: AdminApiService) {

    }

    public async loadCountryIp() {
        if (!this.countryIp) {
            await this.service.ip().then((result: ResultApi) => {
                if (result && result.Type == ResultType.Success) {
                    this.countryIp = result.Object as IpDto;
                }
            });
        }
    }

    public incomingCallItem(obj: MCRMCallLogDto) {
        let item = this.callItems.find(c => obj.CallId && c.CallId == obj.CallId) ||
            this.callItems.find(c => c.Phone == obj.Phone);
        if (item) {
            item.TypeName = 'Cuộc gọi đến';
            item.Message = 'Đang đổ chuông...';
            item.Type = MCRMCallLogType.Inbound;
        }
    }
    public outcomingCallItem(obj: MCRMCallLogDto) {
        let item = this.callItems.find(c => obj.CallId && c.CallId == obj.CallId) ||
            this.callItems.find(c => c.Phone == obj.Phone);
        if (item) {
            item.TypeName = 'Cuộc gọi đi';
            item.Message = 'Đang đổ chuông...';
            item.Type = MCRMCallLogType.Outbound;
        }
    }
    private stopIntervalTime(obj: MCRMCallLogDto) {
        let item = this.callItems.find(c => obj.CallId && c.CallId == obj.CallId) ||
            this.callItems.find(c => c.Phone == obj.Phone);
        if (item) {
            if (item.IntervalTime) {
                clearInterval(item.IntervalTime);
                item.IntervalTime = null;
            }
            item.Message = 'Kết thúc cuộc gọi';
        }
    }
    public startIntervalTime(obj: MCRMCallLogDto) {
        let item = this.callItems.find(c => obj.CallId && c.CallId == obj.CallId) ||
            this.callItems.find(c => c.Phone == obj.Phone);
        if (item) {
            item.Time = 0;
            this.stopIntervalTime(item);
            item.Message = 'Đã kết nối...';
            item.IntervalTime = setInterval(() => {
                item.Time = !item.Time ? 1 : item.Time + 1;
            }, 990);
        }
    }

    public addCallItem(obj: MCRMCallLogDto) {
        let item = this.callItems.find(c => obj.CallId && c.CallId == obj.CallId) ||
            this.callItems.find(c => c.Phone == obj.Phone);
        if (!item) {
            if (obj.Customer) {
                obj.Customer.ShortName = UtilityExHelper.createShortName(obj.Customer.Name);
            }
            this.callItems.push(obj);
        }
    }
    public endCallItem(obj: MCRMCallLogDto) {
        let item = this.callItems.find(c => obj.CallId && c.CallId == obj.CallId) ||
            this.callItems.find(c => c.Phone == obj.Phone);
        if (item) {
            this.stopIntervalTime(item);
            setTimeout(() => {
                this.callItems = this.callItems.filter(c => c.Phone != item.Phone);
            }, 5000);
        }
    }
    public closeCallItem(obj: MCRMCallLogDto) {
        let item = this.callItems.find(c => obj.CallId && c.CallId == obj.CallId) ||
            this.callItems.find(c => c.Phone == obj.Phone);
        if (item) {
            this.stopIntervalTime(item);
            item.Message = 'Đang đóng cuộc gọi...';
            setTimeout(() => {
                this.callItems = this.callItems.filter(c => c.Phone != item.Phone);
            }, 2000);
        }
    }
    public minimizeCallItem(obj: MCRMCallLogDto) {
        let item = this.callItems.find(c => obj.CallId && c.CallId == obj.CallId) ||
            this.callItems.find(c => c.Phone == obj.Phone);
        if (item) item.Opening = false;
    }
    public findCallItem(text: string): MCRMCallLogDto {
        return this.callItems.find(c => text && (c.CallId == text || c.Phone == text));
    }
    public findAndUpdateCallItem(obj: MCRMCallLogDto): MCRMCallLogDto {
        let item = this.callItems.find(c => obj.Id && c.Id == obj.Id) ||
            this.callItems.find(c => c.Phone == obj.Phone);
        if (!item) {
            if (obj.Customer) {
                obj.Customer.ShortName = UtilityExHelper.createShortName(obj.Customer.Name);
            }
            this.callItems.push(obj);
        } else {
            item.Id = obj.Id;
            item.Note = obj.Note;
            item.Type = obj.Type;
            item.CallId = obj.CallId;
            item.Status = obj.Status;
            item.Billsec = obj.Billsec;
            item.LastNote = obj.LastNote;
            item.Duration = obj.Duration;
            item.CallTime = obj.CallTime;
            item.Customer = obj.Customer;
            item.Extension = obj.Extension;
            item.CallStatus = obj.CallStatus;
            item.Recordingfile = obj.Recordingfile;
            if (item.Customer) {
                item.Customer.ShortName = UtilityExHelper.createShortName(item.Customer.Name);
            }
        }
        return item || obj;
    }
}
