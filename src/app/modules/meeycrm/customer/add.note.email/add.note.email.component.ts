import * as _ from 'lodash';
import { AppInjector } from '../../../../app.module';
import { MeeyCrmService } from '../../meeycrm.service';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { GoogleSigninService } from '../../../../google-signin.service';
import { EditorComponent } from '../../../../_core/editor/editor.component';
import { ModalSizeType } from '../../../../_core/domains/enums/modal.size.type';
import { AdminDialogService } from '../../../../_core/services/admin.dialog.service';
import { PopupSigninGmailComponent } from '../popup.signin.gmail/popup.signin.gmail.component';
import { MCRMCustomerLeadEntity } from '../../../../_core/domains/entities/meeycrm/mcrm.customer.lead.entity';
import { MCRMEmailTemplateEntity } from '../../../../_core/domains/entities/meeycrm/mcrm.email.template.entity';
import { MCRMCustomerNoteEmailDto, MCRMCustomerEntity } from '../../../../_core/domains/entities/meeycrm/mcrm.customer.entity';

@Component({
    templateUrl: './add.note.email.component.html',
    styleUrls: ['./add.note.email.component.scss'],
})
export class MCRMAddNoteEmailComponent implements OnInit {
    @ViewChild('uploadFile') uploadFile: EditorComponent;
    userGoogle: gapi.auth2.GoogleUser
    dialogService: AdminDialogService;
    status: string;
    activeCc: boolean;
    activeBcc: boolean;
    errorMessage: string;
    @Input() params: any;
    service: MeeyCrmService;
    disabled: boolean = false;

    lead: boolean = false;
    entity: MCRMCustomerEntity;
    entityLead: MCRMCustomerLeadEntity;
    item: MCRMCustomerNoteEmailDto = new MCRMCustomerNoteEmailDto();

    constructor(private signInGoogle: GoogleSigninService) {
        this.service = AppInjector.get(MeeyCrmService);
        this.dialogService = AppInjector.get(AdminDialogService);
    }

    ngOnInit() {
        this.lead = this.params && this.params['lead'];
        this.loadItem();
    }
    async confirm() {
        let columns = ['EmailFrom', 'EmailTo', 'Title', 'Content']
        if (this.activeCc && this.item.EmailCc) {
            columns.push('EmailCc')
        }
        if (this.activeBcc && this.item.EmailBcc) {
            columns.push('EmailBcc')
        }
        this.item.EmailFrom = this.userGoogle.getBasicProfile().getEmail()
        let valid = await validation(this.item, columns);
        if (valid && this.item) {
            let files = await this.uploadFile.upload();
            const attchment = files;
            this.item.Attachments = files.map(c => c.Path);
            const from = {
                name: this.userGoogle.getBasicProfile().getName(),
                addr: this.userGoogle.getBasicProfile().getEmail()
            }
            let to = []
            if (this.item.EmailTo) {
                this.item.EmailTo = this.item.EmailTo.replace(/;/g, ',');
                to = this.item.EmailTo.split(',')
                to = to.map(e => { return e.trim() }).filter(function (el) {
                    return el != null && el != '';
                });
                this.item.EmailTo = to.join(',')
            }
            let cc = []
            if (this.item.EmailCc) {
                this.item.EmailCc = this.item.EmailCc.replace(/;/g, ',');
                cc = this.item.EmailCc.split(',')
                cc = cc.map(e => { return e.trim() }).filter(function (el) {
                    return el != null && el != '';
                });
                this.item.EmailCc = cc.join(',')
            }
            let bcc = []
            if (this.item.EmailBcc) {
                this.item.EmailBcc = this.item.EmailBcc.replace(/;/g, ',');
                bcc = this.item.EmailBcc.split(',')
                bcc = bcc.map(e => { return e.trim() }).filter(function (el) {
                    return el != null && el != '';
                });
                this.item.EmailBcc = bcc.join(',')
            }
            const subject = this.item.Title
            const message = this.item.Content

            let checkSend = false;
            await this.signInGoogle.sendMessage(this.userGoogle, subject, message, from, to, cc, bcc, attchment).then((result) => {
                checkSend = true
            }).catch((e) => {
                ToastrHelper.Error(e?.error?.message);
                return false;
            })
            if (checkSend) {
                if (!this.item.CustomerId) this.item.CustomerId = this.item.CustomerLeadId;
                return await this.service.addNoteEmail(this.item, this.lead).then((result: ResultApi) => {
                    if (ResultApi.IsSuccess(result)) {
                        let message = 'Gửi email cho khách hàng thành công';
                        ToastrHelper.Success(message);
                        return true;
                    }
                    let message = result && result.Description;
                    if (message) {
                        this.errorMessage = message;
                        return false;
                    }
                    ToastrHelper.ErrorResult(result);
                    return false;
                }, (e) => {
                    ToastrHelper.Exception(e);
                    return false;
                });
            }
        }
        return false;
    }
    private async loadItem() {
        if (this.lead) {
            let item = this.params && this.params['item'];
            this.entityLead = EntityHelper.createEntity(MCRMCustomerLeadEntity, item);
            this.item.CustomerLeadId = this.entityLead.Id;
            this.item.EmailTo = this.params && this.params['email'] || this.entityLead.Email;
            if (this.item.EmailTo)
                this.item.EmailTo = this.item.EmailTo.replace(/;/g, ',');
        } else {
            let item = this.params && this.params['item'];
            this.entity = EntityHelper.createEntity(MCRMCustomerEntity, item);
            this.item.CustomerId = this.entity.Id;
            this.item.EmailTo = this.params && this.params['email'] || this.entity.Email;
            if (this.item.EmailTo)
                this.item.EmailTo = this.item.EmailTo.replace(/;/g, ',');
        }

        let user = this.params && this.params['user'];
        this.userGoogle = this.userGoogle || user;
    }

    toggleCc() {
        this.activeCc = !this.activeCc;
    }
    toggleBcc() {
        this.activeBcc = !this.activeBcc;
    }
    emailTemplateChange() {
        if (this.item.EmailTemplateId) {
            this.service.item('MCRMEmailTemplate', this.item.EmailTemplateId).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    let entity = EntityHelper.createEntity(MCRMEmailTemplateEntity, result.Object) as MCRMEmailTemplateEntity;
                    if (entity) {
                        this.item.Title = entity.Title;
                        this.item.Content = entity.Content;
                    }
                };
            });
        }
    }
    async toggleDisableButton() {
        // this.disabled = !(await validation(this.item, ['EmailFrom', 'EmailTo', 'Title', 'Content'], true));
    }

    getGoogleMail() {
        if (!this.userGoogle) return ''
        let text = '';
        if (this.userGoogle.getBasicProfile()) {
            if (this.userGoogle.getBasicProfile().getName()) text += '<span>' + this.userGoogle.getBasicProfile().getName() + ' - </span>'
            if (this.userGoogle.getBasicProfile().getEmail()) text += '<a style="cursor: pointer;">' + this.userGoogle.getBasicProfile().getEmail() + '</a>'
        }
        return text
    }

    async changeGmail() {
        await this.signInGoogle.signIn().then((user) => {
            this.userGoogle = user
            if (!this.userGoogle.getBasicProfile().getEmail().includes('@meeyland.com')) {
                this.popupSigninErrorMail('<p>Email: <a>' + this.userGoogle.getBasicProfile().getEmail() + '</a> không hợp lệ, Vui lòng chọn loại tài khoản email <a>(@meeyland.com)</a></p>')
            }
        })
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
}