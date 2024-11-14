import * as _ from 'lodash';
import { AppInjector } from '../../../../app.module';
import { Component, Input, OnInit } from "@angular/core";
import { MPOProjectService } from '../../project.service';
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { MPOProjectTypeEntity } from '../../../../_core/domains/entities/meeyproject/mpo.project.type.entity';

@Component({
    templateUrl: './edit.project.type.component.html',
    styleUrls: [
        './edit.project.type.component.scss',
        '../../../../../assets/css/modal.scss'
    ],
})
export class EditProjectTypeComponent implements OnInit {
    id: string;
    viewer: boolean;    
    @Input() params: any;
    loading: boolean = true;
    disabled: boolean = true;
    service: MPOProjectService;
    item: MPOProjectTypeEntity = new MPOProjectTypeEntity();

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
                return await this.service.addOrUpdateProjectType(this.item).then((result: ResultApi) => {
                    if (ResultApi.IsSuccess(result)) {
                        let message = this.item.Id 
                            ? 'Cập nhật Loại dự án thành công'
                            : 'Thêm mới Loại dự án thành công';
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
        this.item = new MPOProjectTypeEntity();
        if (this.id) {
            await this.service.getProjectType(this.id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(MPOProjectTypeEntity, result.Object);
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            });
        }
        this.loading = false;
    }
}