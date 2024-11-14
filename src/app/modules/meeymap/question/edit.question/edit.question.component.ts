import * as _ from 'lodash';
import { AppInjector } from '../../../../app.module';
import { Component, Input, OnInit } from "@angular/core";
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { AdminApiService } from '../../../../_core/services/admin.api.service';
import { MMQuestionEntity } from '../../../../_core/domains/entities/meeymap/mm.question.entity';

@Component({
    templateUrl: './edit.question.component.html',
    styleUrls: [
        './edit.question.component.scss',
        '../../../../../assets/css/modal.scss'
    ],
})
export class MMQuestionEditComponent implements OnInit {
    viewer: boolean;
    @Input() params: any;
    service: AdminApiService;
    item: MMQuestionEntity = new MMQuestionEntity();

    constructor() {
        this.service = AppInjector.get(AdminApiService);
    }

    ngOnInit() {
        this.loadItem();
    }

    private async loadItem() {
        let item = this.params && this.params['item'];
        this.viewer = this.params && this.params['viewer'];
        this.item = EntityHelper.createEntity(MMQuestionEntity, item);
    }

    public async confirm(): Promise<boolean> {
        if (this.item) {
            if (this.viewer) {

            } else {
                if (await validation(this.item)) {
                    let obj: MMQuestionEntity = _.cloneDeep(this.item);
                    return await this.service.save('MMQuestion', obj).then((result: ResultApi) => {
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