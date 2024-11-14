import * as _ from 'lodash';
import { AppInjector } from '../../../../app.module';
import { Component, Input, OnInit } from "@angular/core";
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { AdminApiService } from '../../../../_core/services/admin.api.service';
import { EmailTemplateWrapperEntity } from '../../../../_core/domains/entities/email.template.wrapper.entity';

@Component({
    templateUrl: './edit.email.template.wrapper.component.html',
    styleUrls: [
        './edit.email.template.wrapper.component.scss',
        '../../../../../assets/css/modal.scss'
    ],
})
export class EditEmailTemplateWrapperComponent implements OnInit {
    @Input() params: any;
    loading: boolean = true;
    service: AdminApiService;
    tab: string = 'kt_content';
    item: EmailTemplateWrapperEntity = new EmailTemplateWrapperEntity();

    constructor() {
        this.service = AppInjector.get(AdminApiService);
    }

    ngOnInit() {
        this.loadItem();
        this.loading = false;
    }

    selectedTab(tab: string) {
        this.tab = tab;
    }

    private async loadItem() {
        this.item = new EmailTemplateWrapperEntity();
        let id = this.params && this.params['id'];
        if (id) {
            await this.service.item('emailtemplatewrapper', id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(EmailTemplateWrapperEntity, result.Object as EmailTemplateWrapperEntity);
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            });
        }
    }

    public async confirm(): Promise<boolean> {
        if (this.item) {
            if (await validation(this.item)) {
                let obj: EmailTemplateWrapperEntity = _.cloneDeep(this.item);
                return await this.service.save('emailtemplatewrapper', obj).then((result: ResultApi) => {
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