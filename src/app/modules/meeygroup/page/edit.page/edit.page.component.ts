import * as _ from 'lodash';
import { AppInjector } from '../../../../app.module';
import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { AdminApiService } from '../../../../_core/services/admin.api.service';
import { MGPageEntity } from '../../../../_core/domains/entities/meeygroup/mg.page.entity';

@Component({
    templateUrl: './edit.page.component.html',
    styleUrls: [
        './edit.page.component.scss',
        '../../../../../assets/css/modal.scss'
    ],
})
export class EditPageComponent implements OnInit {
    viewer: boolean;
    tab: string = 'vn';
    item: MGPageEntity;
    @Input() params: any;
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
            await this.service.item('mgpage', id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(MGPageEntity, result.Object as MGPageEntity);
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            });
        } else this.item = new MGPageEntity();
    }

    public async confirm(): Promise<boolean> {
        if (this.item) {
            let valid = await validation(this.item);
            if (valid) {
                let obj: MGPageEntity = _.cloneDeep(this.item);
                return await this.service.save('mgpage', obj).then((result: ResultApi) => {
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