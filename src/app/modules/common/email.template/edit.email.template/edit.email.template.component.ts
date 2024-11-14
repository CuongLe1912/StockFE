import * as _ from 'lodash';
import { AppInjector } from '../../../../app.module';
import { Component, Input, OnInit } from "@angular/core";
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { AdminApiService } from '../../../../_core/services/admin.api.service';
import { EmailTemplateEntity } from '../../../../_core/domains/entities/email.template.entity';
import { EmailTemplateWrapperEntity } from '../../../../_core/domains/entities/email.template.wrapper.entity';

@Component({
    templateUrl: './edit.email.template.component.html',
    styleUrls: [
        './edit.email.template.component.scss',
        '../../../../../assets/css/modal.scss'
    ],
})
export class EditEmailTemplateComponent implements OnInit {
    content: string;
    viewer: boolean;
    @Input() params: any;
    loading: boolean = true;
    service: AdminApiService;
    loadingTemplate: boolean = false;
    wrapper: EmailTemplateWrapperEntity;
    item: EmailTemplateEntity = new EmailTemplateEntity();

    constructor() {
        this.service = AppInjector.get(AdminApiService);
    }

    ngOnInit() {
        this.loadItem();
        this.loading = false;
    }

    wrapperChange() {
        setTimeout(() => {
            this.content = null;
            this.loadingTemplate = true;
            if (this.item && this.item.EmailTemplateWrapperId) {
                this.service.item('emailtemplatewrapper', this.item.EmailTemplateWrapperId).then((result: ResultApi) => {
                    if (ResultApi.IsSuccess(result)) {
                        this.wrapper = result.Object;
                        if (this.wrapper) {
                            let content = this.wrapper.Content
                                .replace('{{content}}', this.item.Content || '')
                                .replace('{{header}}', this.wrapper.Header)
                                .replace('{{footer}}', this.wrapper.Footer);
                            this.content = content;
                        }
                    }
                    this.loadingTemplate = false;
                }, () => this.loadingTemplate = false)
            }
        }, 300);
    }

    contentChange() {
        if (!this.wrapper) this.wrapperChange();
        else {
            let content = this.wrapper.Content
                .replace('{{content}}', this.item.Content || '')
                .replace('{{header}}', this.wrapper.Header)
                .replace('{{footer}}', this.wrapper.Footer);
            this.content = content;
        }
    }

    private async loadItem() {
        this.item = new EmailTemplateEntity();
        let id = this.params && this.params['id'];
        this.viewer = this.params && this.params['viewer'];
        if (id) {
            await this.service.item('emailtemplate', id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(EmailTemplateEntity, result.Object as EmailTemplateEntity);
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            });
        }
    }

    public async confirm(): Promise<boolean> {
        if (this.item) {
            if (await validation(this.item)) {
                let obj: EmailTemplateEntity = _.cloneDeep(this.item);
                return await this.service.save('emailtemplate', obj).then((result: ResultApi) => {
                    if (ResultApi.IsSuccess(result)) {
                        ToastrHelper.Success('Lưu dữ liệu thành công');
                        return true;
                    } else {
                        ToastrHelper.ErrorResult(result);
                        return false;
                    }
                }, () => {
                    return false;
                });
            }
        }
        return false;
    }
}