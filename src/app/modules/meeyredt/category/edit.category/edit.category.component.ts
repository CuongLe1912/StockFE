import * as _ from 'lodash';
import { AppInjector } from '../../../../app.module';
import { Component, Input, OnInit } from "@angular/core";
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { MethodType } from '../../../../_core/domains/enums/method.type';
import { AdminApiService } from '../../../../_core/services/admin.api.service';
import { AdminAuthService } from '../../../../_core/services/admin.auth.service';
import { MRCategoryEntity } from '../../../../_core/domains/entities/meeyredt/mr.category.entity';

@Component({
    templateUrl: './edit.category.component.html',
    styleUrls: [
        './edit.category.component.scss',
        '../../../../../assets/css/modal.scss'
    ],
})
export class EditCategoryComponent implements OnInit {
    id: string;
    viewer: boolean;
    tab: string = 'vn';
    @Input() params: any;
    item: MRCategoryEntity;
    loading: boolean = true;
    service: AdminApiService;
    authen: AdminAuthService;

    constructor() {
        this.service = AppInjector.get(AdminApiService);
        this.authen = AppInjector.get(AdminAuthService);
    }

    ngOnInit() {
        this.loadItem();
        this.loading = false;
    }

    selectedTab(tab: string) {
        this.tab = tab;
    }

    private async loadItem() {
        this.id = this.params && this.params['id'];
        this.viewer = this.params && this.params['viewer'];
        if (this.id) {
            await this.service.item('mrcategory', this.id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(MRCategoryEntity, result.Object as MRCategoryEntity);
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            });
        } else this.item = new MRCategoryEntity();
    }

    public async confirm(): Promise<boolean> {
        if (this.item) {
            let valid = await validation(this.item);
            if (valid) {
                let data = {
                    "name": this.item.NameVn,
                    "author": {
                        "data": {
                            "id": this.authen.account.Id,
                            "fullname": this.authen.account.FullName
                        }
                    }
                };
                if (this.id) {
                    return await this.service.callApi('mrcategory', 'update/' + this.id, data, MethodType.Post).then((result: ResultApi) => {
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
                } else {
                    return await this.service.callApi('mrcategory', 'AddNew', data, MethodType.Post).then((result: ResultApi) => {
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
        }
        return false;
    }
}