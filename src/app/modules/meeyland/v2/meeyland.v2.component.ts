import * as _ from 'lodash';
import { AppInjector } from '../../../app.module';
import { Component, OnInit } from '@angular/core';
import { MeeylandV2Service } from './meeyland.v2.service';
import { validation } from '../../../_core/decorators/validator';
import { ResultApi } from '../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../_core/helpers/toastr.helper';
import { EditComponent } from '../../../_core/components/edit/edit.component';
import { MLCustomerV2Entity } from '../../../_core/domains/entities/meeyland/v2/ml.customer.v2.entity';

@Component({
    templateUrl: './meeyland.v2.component.html',
    styleUrls: ['./meeyland.v2.component.scss'],
})
export class MeeylandV2Component extends EditComponent implements OnInit {
    service: MeeylandV2Service;
    processingGetRootId: boolean;
    processingUpdateStatus: boolean;
    item: MLCustomerV2Entity = new MLCustomerV2Entity();

    constructor() {
        super();
        this.service = AppInjector.get(MeeylandV2Service);
    }

    async ngOnInit() {
    }

    async getRootId() {
        if (this.item) {
            this.processingGetRootId = true;
            if (await validation(this.item, ['Code2'])) {
                let id = parseInt(this.item.Code2.toLowerCase().replace('ml.', ''));
                return await this.service.getRootId(id).then((result: ResultApi) => {
                    this.processingGetRootId = false;
                    if (ResultApi.IsSuccess(result)) {
                        this.item.RootId = result.Object;
                    } else {
                        ToastrHelper.ErrorResult(result);
                    }
                });
            } else this.processingGetRootId = false;
        }
    }

    async updateStatus() {
        if (this.item) {
            if (await validation(this.item, ['Code'])) {
                this.dialogService.ConfirmAsync('Bạn có chắc chắn điều này không?', async () => {
                    this.processingUpdateStatus = true;
                    let id = parseInt(this.item.Code.toLowerCase().replace('ml.', ''));
                    return await this.service.updateStatus(id).then((result: ResultApi) => {
                        this.processingUpdateStatus = false;
                        if (ResultApi.IsSuccess(result)) {
                            ToastrHelper.Success('Cập nhật trạng thái thành công');
                        } else {
                            ToastrHelper.ErrorResult(result);
                        }
                    });
                });
            } else this.processingUpdateStatus = false;
        }
    }
}