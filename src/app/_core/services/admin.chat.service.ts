import { Injectable } from '@angular/core';
import { ApiUrl } from '../helpers/api.url.helper';
import { AdminApiService } from './admin.api.service';
import { MethodType } from '../domains/enums/method.type';
import { MessageDto } from '../domains/objects/message.dto';

@Injectable()
export class AdminChatService extends AdminApiService {
    async users() {
        const api = ApiUrl.ToUrl('/admin/chat/users'); 
        return await this.ToResultApi(api, MethodType.Get);
    }
    async teams() {
        const api = ApiUrl.ToUrl('/admin/chat/teams'); 
        return await this.ToResultApi(api, MethodType.Get);
    }
    async groups() {
        const api = ApiUrl.ToUrl('/admin/chat/groups'); 
        return await this.ToResultApi(api, MethodType.Get);
    }
    async maskRead(sendId: number) {
        const api = ApiUrl.ToUrl('/admin/chat/maskRead/' + sendId); 
        return await this.ToResultApi(api, MethodType.Post);
    }
    async sendMessage(obj: MessageDto) {
        const api = ApiUrl.ToUrl('/admin/chat/sendMessage'); 
        let params = {
            Files: obj.Files,
            Content: obj.Content,
            ReceiveId: obj.ReceiveId,
        };
        return await this.ToResultApi(api, MethodType.Post, params);
    }
    async sendTeamMessage(obj: MessageDto) {
        const api = ApiUrl.ToUrl('/admin/chat/sendTeamMessage'); 
        let params = {
            Files: obj.Files,
            TeamId: obj.TeamId,
            Content: obj.Content,
        };
        return await this.ToResultApi(api, MethodType.Post, params);
    }
    async loadMessages(interactId: number, index: number = 1) {
        const api = ApiUrl.ToUrl('/admin/chat/loadMessages?interactId=' + interactId + '&index=' + index); 
        return await this.ToResultApi(api, MethodType.Get);
    }
    async loadTeamMessages(interactId: number, index: number = 1) {
        const api = ApiUrl.ToUrl('/admin/chat/loadTeamMessages?interactId=' + interactId + '&index=' + index); 
        return await this.ToResultApi(api, MethodType.Get);
    }
    async loadGroupMessages(interactId: number, index: number = 1) {
        const api = ApiUrl.ToUrl('/admin/chat/loadGroupMessages?interactId=' + interactId + '&index=' + index); 
        return await this.ToResultApi(api, MethodType.Get);
    }
}