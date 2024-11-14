import * as _ from 'lodash';
import { AppInjector } from '../../../../app.module';
import { Component, Input, OnInit } from "@angular/core";
import { MPOProjectService } from '../../project.service';
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { MPOProjectCategoryEntity } from '../../../../_core/domains/entities/meeyproject/mpo.project.category.entity';

@Component({
    templateUrl: './edit.project.category.component.html',
    styleUrls: [
        './edit.project.category.component.scss',
        '../../../../../assets/css/modal.scss'
    ],
})
export class EditProjectCategoryComponent implements OnInit {
    id: string;
    viewer: boolean;
    @Input() params: any;
    loading: boolean = true;
    disabled: boolean = true;
    service: MPOProjectService;
    item: MPOProjectCategoryEntity = new MPOProjectCategoryEntity();

    constructor() {
        this.service = AppInjector.get(MPOProjectService);
    }

    async ngOnInit() {
        this.viewer = this.params && this.params['viewer'];
        this.id = this.params && this.params['id'];
        await this.loadItem();
    }

    async toggleDisableButton() {
        this.disabled = await validation(this.item, null, true) ? false : true;
    }

    public async confirm(): Promise<boolean> {
        if (this.item) {
            if (await validation(this.item)) {
                return await this.service.addOrUpdateProjectCategory(this.item).then((result: ResultApi) => {
                    if (ResultApi.IsSuccess(result)) {
                        let message = this.item.Id 
                            ? 'Cập nhật Chủ đề Video thành công'
                            : 'Thêm mới Chủ đề Video thành công';
                        ToastrHelper.Success(message);
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

    private async loadItem() {
        this.item = new MPOProjectCategoryEntity();
        if (this.id) {
            await this.service.getProjectCategory(this.id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(MPOProjectCategoryEntity, result.Object);
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            });
        }
        this.loading = false;
    }
}