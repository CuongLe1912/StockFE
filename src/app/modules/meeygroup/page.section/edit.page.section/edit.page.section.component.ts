import * as _ from 'lodash';
import { AppInjector } from '../../../../app.module';
import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { AdminApiService } from '../../../../_core/services/admin.api.service';
import { MGPageSectionEntity } from '../../../../_core/domains/entities/meeygroup/mg.page.section.entity';

@Component({
    templateUrl: './edit.page.section.component.html',
    styleUrls: [
        './edit.page.section.component.scss',
        '../../../../../assets/css/modal.scss'
    ],
})
export class EditPageSectionComponent implements OnInit {
    viewer: boolean;
    tab: string = 'vn';
    @Input() params: any;
    loading: boolean = true;
    service: AdminApiService;
    item: MGPageSectionEntity;

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
            await this.service.item('mgpagesection', id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(MGPageSectionEntity, result.Object as MGPageSectionEntity);
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            });
        } else this.item = new MGPageSectionEntity();
    }

    public async confirm(): Promise<boolean> {
        if (this.item) {
            let valid = await validation(this.item);
            if (valid) {
                let obj: MGPageSectionEntity = _.cloneDeep(this.item);
                return await this.service.save('mgpagesection', obj).then((result: ResultApi) => {
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