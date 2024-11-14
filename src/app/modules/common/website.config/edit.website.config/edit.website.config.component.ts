import * as _ from 'lodash';
import { AppInjector } from '../../../../app.module';
import { Component, Input, OnInit } from "@angular/core";
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { AdminApiService } from '../../../../_core/services/admin.api.service';
import { WebsiteConfigEntity } from '../../../../_core/domains/entities/website.config.entity';

@Component({
    templateUrl: './edit.website.config.component.html',
    styleUrls: [
        './edit.website.config.component.scss',
        '../../../../../assets/css/modal.scss'
    ],
})
export class EditWebsiteConfigComponent implements OnInit {
    content: string;
    viewer: boolean;
    @Input() params: any;
    loading: boolean = true;
    service: AdminApiService;
    loadingTemplate: boolean = false;
    item: WebsiteConfigEntity = new WebsiteConfigEntity();

    constructor() {
        this.service = AppInjector.get(AdminApiService);
    }

    ngOnInit() {
        this.loadItem();
        this.loading = false;
    }

    private async loadItem() {
        this.item = new WebsiteConfigEntity();
        let id = this.params && this.params['id'];
        this.viewer = this.params && this.params['viewer'];
        if (id) {
            await this.service.item('websiteconfig', id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(WebsiteConfigEntity, result.Object as WebsiteConfigEntity);
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            });
        }
    }

    public async confirm(): Promise<boolean> {
        if (this.item) {
            if (await validation(this.item)) {
                let obj: WebsiteConfigEntity = _.cloneDeep(this.item);
                return await this.service.save('websiteconfig', obj).then((result: ResultApi) => {
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