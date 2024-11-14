import * as _ from 'lodash';
import { AppInjector } from '../../../../app.module';
import { MLScheduleService } from '../schedule.service';
import { Component, Input, OnInit } from "@angular/core";
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { AdminDataService } from '../../../../_core/services/admin.data.service';
import { MLScheduleEntity } from '../../../../_core/domains/entities/meeyland/ml.schedule.entity';
import { MLScheduleCancelType } from '../../../../_core/domains/entities/meeyland/enums/ml.schedule.type';

@Component({
    templateUrl: './schedule.edit.cancel.component.html',
    styleUrls: ['./schedule.edit.cancel.component.scss'],
})
export class MLScheduleEditCancelComponent implements OnInit {
    @Input() params: any;
    data: AdminDataService;
    loading: boolean = true;
    service: MLScheduleService;
    MLScheduleCancelType = MLScheduleCancelType;
    item: MLScheduleEntity = new MLScheduleEntity();

    constructor() {
        this.data = AppInjector.get(AdminDataService);
        this.service = AppInjector.get(MLScheduleService);
    }

    ngOnInit() {
        this.loadItem();
    }

    async confirm() {
        let valid = this.item.CancelType == MLScheduleCancelType.OtherReason
            ? await validation(this.item, ['CancelType', 'CancelText'])
            : await validation(this.item, ['CancelType']);
        if (valid && this.item.Id) {
            this.item.Ip = this.data.countryIp.Ip;
            return await this.service.cancel(this.item).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    ToastrHelper.Success('Hủy lịch hẹn thành công');
                    return true;
                }
                ToastrHelper.ErrorResult(result);
                return false;
            }, (e) => {
                ToastrHelper.Exception(e);
                return false;
            });
        }
        return false;
    }
    private async loadItem() {
        let id = this.params && this.params['id'];
        if (id) {
            await this.service.item('mlschedule', id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(MLScheduleEntity, result.Object as MLScheduleEntity);
                    this.item.OldStatus = _.cloneDeep(this.item.Status);
                    this.item.CancelType = MLScheduleCancelType.Busy;
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            });
        }
        this.loading = false;
    }
}