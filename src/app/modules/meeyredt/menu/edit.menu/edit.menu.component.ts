import { AppInjector } from '../../../../app.module';
import { Component, Input, OnInit } from '@angular/core';
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { MethodType } from '../../../../_core/domains/enums/method.type';
import { AdminApiService } from '../../../../_core/services/admin.api.service';
import { AdminAuthService } from '../../../../_core/services/admin.auth.service';
import { MRMenuEntity } from '../../../../_core/domains/entities/meeyredt/mr.menu.entity';

@Component({
    templateUrl: './edit.menu.component.html',
    styleUrls: [
        './edit.menu.component.scss',
        '../../../../../assets/css/modal.scss'
    ],
})
export class EditMenuComponent implements OnInit {
    id: number;
    viewer: boolean;
    item: MRMenuEntity;
    @Input() params: any;
    loading: boolean = true;
    authen: AdminAuthService;
    service: AdminApiService;

    constructor() {
        this.service = AppInjector.get(AdminApiService);
        this.authen = AppInjector.get(AdminAuthService);
    }

    async ngOnInit() {
        this.loadItem();
        this.loading = false;
    }

    private async loadItem() {
        this.id = this.params && this.params['id'];
        this.viewer = this.params && this.params['viewer'];
        if (this.id) {
            await this.service.item('mrmenu', this.id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(MRMenuEntity, result.Object as MRMenuEntity);
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            });
        } else this.item = new MRMenuEntity();
        this.loading = false;
    }

    public async confirm(): Promise<boolean> {
        if (this.item) {
            let valid = await validation(this.item);
            if (valid) {
                let data = {
                    "name": this.item.Name,
                    "author": {
                        "data": {
                            "id": this.authen.account.Id,
                            "fullname": this.authen.account.FullName
                        }
                    }
                };
                if (this.id) {
                    return await this.service.callApi('MRMenu', 'Update/' + this.id, data, MethodType.Post).then((result: ResultApi) => {
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
                    return await this.service.callApi('MRMenu', 'AddNew', data, MethodType.Post).then((result: ResultApi) => {
                        if (ResultApi.IsSuccess(result)) {
                            ToastrHelper.Success('Tạo thành công');
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
