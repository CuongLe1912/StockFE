import * as _ from 'lodash';
import { AppInjector } from '../../../../app.module';
import { Component, Input, OnInit } from "@angular/core";
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { AdminApiService } from '../../../../_core/services/admin.api.service';
import { MGCategoryEntity } from '../../../../_core/domains/entities/meeygroup/mg.category.entity';

@Component({
    templateUrl: './edit.category.component.html',
    styleUrls: [
        './edit.category.component.scss',
        '../../../../../assets/css/modal.scss'
    ],
})
export class EditCategoryComponent implements OnInit {
    viewer: boolean;
    tab: string = 'vn';
    @Input() params: any;
    item: MGCategoryEntity;
    loading: boolean = true;
    service: AdminApiService;

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
        let id = this.params && this.params['id'];
        this.viewer = this.params && this.params['viewer'];
        if (id) {
            await this.service.item('mgcategory', id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(MGCategoryEntity, result.Object as MGCategoryEntity);
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            });
        } else this.item = new MGCategoryEntity();
    }

    public async confirm(): Promise<boolean> {
        if (this.item) {
            let valid = await validation(this.item);
            if (valid) {
                let obj: MGCategoryEntity = _.cloneDeep(this.item);
                return await this.service.save('mgcategory', obj).then((result: ResultApi) => {
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