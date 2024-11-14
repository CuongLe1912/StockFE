declare var $: any
import { AppInjector } from '../../../app.module';
import { Component, OnInit } from '@angular/core';
import { HubType } from '../../domains/enums/hub.type';
import { HubDto } from '../../domains/objects/hub.dto';
import { validation } from '../../decorators/validator';
import { ResultApi } from '../../domains/data/result.api';
import { MessageDto } from '../../domains/objects/message.dto';
import { UtilityExHelper } from '../../helpers/utility.helper';
import { AdminAuthService } from '../../services/admin.auth.service';
import { AdminChatService } from '../../services/admin.chat.service';
import { AdminDataService } from '../../services/admin.data.service';
import { AdminEventService } from '../../services/admin.event.service';
import { MessageStatusType } from '../../domains/enums/message.status.type';

@Component({
    selector: 'chat',
    styleUrls: ['./chat.component.scss'],
    templateUrl: './chat.component.html',
})
export class ChatComponent implements OnInit {
    users: HubDto[];
    filterUsers: HubDto[] = [];

    teams: HubDto[];
    filterTeams: HubDto[] = [];

    groups: HubDto[];
    filterGroups: HubDto[] = [];

    HubType = HubType;
    searchText: string;
    hide: boolean = true;
    selectedItem: HubDto;
    pulseCount: number = 0;
    loading: boolean = true;
    selectedTab = 'chat_user';
    selectedItems: HubDto[] = [];

    auth: AdminAuthService;
    data: AdminDataService;
    event: AdminEventService;
    service: AdminChatService;

    messages: MessageDto[] = [];
    item: MessageDto = new MessageDto();

    constructor() {
        this.data = AppInjector.get(AdminDataService);
        this.auth = AppInjector.get(AdminAuthService);
        this.event = AppInjector.get(AdminEventService);
        this.service = AppInjector.get(AdminChatService);
    }

    async ngOnInit() {
        await this.loadUsers();
        await this.loadTeams();
        await this.loadGroups();
        this.loading = false;
        this.loadSignalr();
        this.pulseCount += this.users && this.users.reduce((sum, current) => sum + current.PulseCount, 0);
        this.pulseCount += this.teams && this.teams.reduce((sum, current) => sum + current.PulseCount, 0);
        this.pulseCount += this.groups && this.groups.reduce((sum, current) => sum + current.PulseCount, 0);
    }

    toggleChat() {
        this.pulseCount = 0;
        this.hide = !this.hide;
    }

    searchChange() {
        if (this.searchText) {
            this.filterTeams = this.teams && this.teams.filter(c => c.Name.indexOf(this.searchText) >= 0);
            this.filterGroups = this.groups && this.groups.filter(c => c.Name.indexOf(this.searchText) >= 0);
            this.filterUsers = this.users && this.users.filter(c => c.FullName.indexOf(this.searchText) >= 0);
        } else {
            this.filterUsers = this.users;
            this.filterTeams = this.teams;
            this.filterGroups = this.groups;
        }
    }

    async loadUsers() {
        await this.service.users().then((result: ResultApi) => {
            if (ResultApi.IsSuccess(result)) {
                this.users = result.Object;
                if (this.users && this.users.length > 0) {
                    this.users.forEach((item: HubDto) => {
                        item.Type == HubType.User;
                        item.Letter = item.Email && item.Email.substr(0, 2).toUpperCase();
                    });
                    this.filterUsers = this.users;
                }
            }
        });
    }

    async loadTeams() {
        await this.service.teams().then((result: ResultApi) => {
            if (ResultApi.IsSuccess(result)) {
                this.teams = result.Object;
                if (this.teams && this.teams.length > 0) {
                    this.teams.forEach((item: HubDto) => {
                        item.PulseCount = 0;
                        item.Type == HubType.Team;
                        item.Letter = item.Name && item.Name.substr(0, 2).toUpperCase();
                    });
                }
                this.filterTeams = this.teams;
            }
        });
    }

    async loadGroups() {
        await this.service.groups().then((result: ResultApi) => {
            if (ResultApi.IsSuccess(result)) {
                this.groups = result.Object;
                if (this.groups && this.groups.length > 0) {
                    this.groups.forEach((item: HubDto) => {
                        item.PulseCount = 0;
                        item.Type == HubType.Group;
                        item.Letter = item.Name && item.Name.substr(0, 2).toUpperCase();
                    });
                }
                this.filterGroups = this.groups;
            }
        });
    }

    async loadMessages(item: HubDto) {
        switch (item.Type) {
            case HubType.User: {
                await this.service.loadMessages(item.Id).then((result: ResultApi) => {
                    if (ResultApi.IsSuccess(result)) {
                        let items: MessageDto[] = result.Object;
                        if (items && items.length > 0) {
                            items.forEach((item: MessageDto) => {
                                item.SendShortName = UtilityExHelper.createShortName(item.SendShortName);
                                item.ReceiveName = UtilityExHelper.createShortName(item.ReceiveName);
                                this.messages.push(item);
                            });
                            this.scrollToBottom();
                        }
                    }
                });
            } break;
            case HubType.Team: {
                await this.service.loadTeamMessages(item.Id).then((result: ResultApi) => {
                    if (ResultApi.IsSuccess(result)) {
                        let items: MessageDto[] = result.Object;
                        if (items && items.length > 0) {
                            items.forEach((item: MessageDto) => {
                                item.SendShortName = UtilityExHelper.createShortName(item.SendShortName);
                                item.ReceiveName = UtilityExHelper.createShortName(item.ReceiveName);
                                this.messages.push(item);
                            });
                            this.scrollToBottom();
                        }
                    }
                });
            } break;
            case HubType.Group: {
                await this.service.loadGroupMessages(item.Id).then((result: ResultApi) => {
                    if (ResultApi.IsSuccess(result)) {
                        let items: MessageDto[] = result.Object;
                        if (items && items.length > 0) {
                            items.forEach((item: MessageDto) => {
                                item.SendShortName = UtilityExHelper.createShortName(item.SendShortName);
                                item.ReceiveName = UtilityExHelper.createShortName(item.ReceiveName);
                                this.messages.push(item);
                            });
                            this.scrollToBottom();
                        }
                    }
                });
            } break;
        }
        item.PulseCount = 0;
    }

    closeItem(item: HubDto) {
        // remove
        let index = this.selectedItems.findIndex(c => c.Type == item.Type && c.Id == item.Id);
        this.selectedItems.splice(index, 1);

        // auto select
        if (this.selectedItem && this.selectedItem.Type == item.Type && this.selectedItem.Id == item.Id)
            this.selectedItem = this.selectedItems &&
                this.selectedItems.length > 0 &&
                this.selectedItems[this.selectedItems.length - 1];
    }
    choiceItem(item: HubDto) {
        this.messages = [];
        let objItem = this.selectedItems && this.selectedItems.filter(c => c.Type == item.Type).find(c => c.Id == item.Id);
        if (!objItem) this.selectedItems.push(item);
        if (this.selectedItems.length > 9)
            this.selectedItems.shift();
        this.selectedItem = item;
        this.loadMessages(item);
    }

    viewUsers(item: HubDto) {

    }

    async sendMessage() {
        switch (this.selectedItem.Type) {
            case HubType.User: await this.sendUserMessage(); break;
            case HubType.Team: await this.sendTeamMessage(); break;
            case HubType.Group: await this.sendGroupMessage(); break;
        }
    }

    private loadSignalr() {
        this.event.SignalrNotify.subscribe((notify: any) => {
            switch (notify.type) {
                case 'chat': {
                    let item: MessageDto = notify.object;
                    if (item) {
                        this.pulseCount += 1;
                        item.ReceiveName = UtilityExHelper.createShortName(item.ReceiveName);
                        item.SendShortName = UtilityExHelper.createShortName(item.SendShortName);
                        if (item.TeamId) {
                            let team = this.teams.find(c => c.Id == item.TeamId);
                            if (team) {
                                if (!team.PulseCount) team.PulseCount = 0
                                if (this.selectedItem && this.selectedItem.Type == HubType.Team && this.selectedItem.Id == team.Id) {
                                    this.messages.push(item);
                                    this.scrollToBottom();
                                    team.PulseCount = 0;
                                } else {
                                    team.PulseCount += 1;
                                }
                            }
                        } else if (item.GroupId) {
                            let group = this.groups.find(c => c.Id == item.GroupId);
                            if (group) {
                                if (!group.PulseCount) group.PulseCount = 0
                                if (this.selectedItem && this.selectedItem.Type == HubType.Group && this.selectedItem.Id == group.Id) {
                                    this.messages.push(item);
                                    this.scrollToBottom();
                                    group.PulseCount = 0;
                                } else {
                                    group.PulseCount += 1;
                                }
                            }
                        } else if (item.SendId) {
                            let user = this.users && this.users.find(c => c.Id == item.SendId);
                            if (user) {
                                user.Online = true;
                                if (!user.PulseCount) user.PulseCount = 0
                                if (this.selectedItem && this.selectedItem.Type == HubType.User && this.selectedItem.Id == user.Id) {
                                    this.service.maskRead(item.SendId);
                                    this.messages.push(item);
                                    this.scrollToBottom();
                                    user.PulseCount = 0;
                                } else {
                                    user.PulseCount += 1;
                                }
                                this.users = this.users && this.users.sort((a, b) => Number(b.Online) - Number(a.Online));
                            }
                        }
                    }
                } break;
                case 'online': {
                    let item: HubDto = notify.object;
                    if (item) {
                        let itemDb = this.users && this.users.find(c => c.Id == item.Id);
                        if (itemDb) itemDb.Online = true;
                    }
                    this.users = this.users && this.users.sort((a, b) => Number(b.Online) - Number(a.Online));
                } break;
                case 'offline': {
                    let item: HubDto = notify.object;
                    if (item) {
                        let itemDb = this.users && this.users.find(c => c.Id == item.Id);
                        if (itemDb) itemDb.Online = false;
                    }
                    this.users = this.users && this.users.sort((a, b) => Number(b.Online) - Number(a.Online));
                } break;
            }
        })
    }
    private scrollToBottom() {
        setTimeout(() => {
            let element = $('#kt-portlet__body'),
                height = element.prop("scrollHeight");
            UtilityExHelper.scrollToPosition(element, height);
        }, 100);
    }
    private async sendUserMessage() {
        if (await validation(this.item)) {
            this.item.ReceiveId = this.selectedItem && this.selectedItem.Id;
            if (this.item.ReceiveId) {
                let message: MessageDto = {
                    Right: true,
                    DateTime: new Date(),
                    Files: this.item.Files,
                    Content: this.item.Content,
                    ReceiveId: this.item.ReceiveId,
                    Status: MessageStatusType.Init,
                    SendName: this.auth.account.FullName,
                    SendAvatar: this.auth.account.Avatar,
                    SendShortName: UtilityExHelper.createShortName(this.auth.account.FullName)
                };
                this.messages.push(message);
                this.item.Content = null;
                this.scrollToBottom();
                this.service.sendMessage(message).then((result: ResultApi) => {
                    if (ResultApi.IsSuccess(result)) {
                        message.Status = MessageStatusType.Sent;
                    } else message.Status = MessageStatusType.Fail;
                }, () => {
                    message.Status = MessageStatusType.Fail;
                });
            }
        }
    }
    private async sendTeamMessage() {
        if (await validation(this.item)) {
            this.item.TeamId = this.selectedItem && this.selectedItem.Id;
            if (this.item.TeamId) {
                let message: MessageDto = {
                    Right: true,
                    DateTime: new Date(),
                    Files: this.item.Files,
                    TeamId: this.item.TeamId,
                    Content: this.item.Content,
                    Status: MessageStatusType.Init,
                    SendName: this.auth.account.FullName,
                    SendAvatar: this.auth.account.Avatar,
                    SendShortName: UtilityExHelper.createShortName(this.auth.account.FullName)
                };
                this.messages.push(message);
                this.item.Content = null;
                this.scrollToBottom();
                this.service.sendTeamMessage(message).then((result: ResultApi) => {
                    if (ResultApi.IsSuccess(result)) {
                        message.Status = MessageStatusType.Sent;
                    } else message.Status = MessageStatusType.Fail;
                }, () => {
                    message.Status = MessageStatusType.Fail;
                });
            }
        }
    }
    private async sendGroupMessage() {
        if (await validation(this.item)) {
            this.item.GroupId = this.selectedItem && this.selectedItem.Id;
            if (this.item.GroupId) {
                let message: MessageDto = {
                    Right: true,
                    DateTime: new Date(),
                    Files: this.item.Files,
                    GroupId: this.item.GroupId,
                    Content: this.item.Content,
                    Status: MessageStatusType.Init,
                    SendName: this.auth.account.FullName,
                    SendAvatar: this.auth.account.Avatar,
                    SendShortName: UtilityExHelper.createShortName(this.auth.account.FullName)
                };
                this.messages.push(message);
                this.item.Content = null;
                this.scrollToBottom();
                this.service.sendTeamMessage(message).then((result: ResultApi) => {
                    if (ResultApi.IsSuccess(result)) {
                        message.Status = MessageStatusType.Sent;
                    } else message.Status = MessageStatusType.Fail;
                }, () => {
                    message.Status = MessageStatusType.Fail;
                });
            }
        }
    }
}
