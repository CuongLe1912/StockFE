import * as _ from 'lodash';
import { Component, Input } from "@angular/core";
import { AppInjector } from '../../../../app.module';
import { MLScheduleService } from '../schedule.service';
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { OptionItem } from '../../../../_core/domains/data/option.item';
import { AdminDataService } from '../../../../_core/services/admin.data.service';
import { MLScheduleEntity } from '../../../../_core/domains/entities/meeyland/ml.schedule.entity';
import { MLScheduleRejectType, MLScheduleStatusType } from '../../../../_core/domains/entities/meeyland/enums/ml.schedule.type';

@Component({
    templateUrl: './schedule.edit.status.list.component.html',
    styleUrls: ['./schedule.edit.status.list.component.scss'],
})
export class MLScheduleEditStatusListComponent {
    @Input() params: any;
    data: AdminDataService;
    service: MLScheduleService;  
    MLScheduleRejectType = MLScheduleRejectType;
    MLScheduleStatusType = MLScheduleStatusType;
    item: MLScheduleEntity = new MLScheduleEntity();  
    statuses: OptionItem[] = [{ value: MLScheduleStatusType.Complete, label: 'Hoàn thành' }];

    constructor() {
        this.data = AppInjector.get(AdminDataService);
        this.item.RejectType = MLScheduleRejectType.Busy;
        this.service = AppInjector.get(MLScheduleService);
    }

    async confirm() {
        let valid = this.item.Status != MLScheduleStatusType.Reject
            ? await validation(this.item, ['Status'])
            : this.item.RejectType == MLScheduleRejectType.OtherReason
                ? await validation(this.item, ['RejectType', 'CancelText'])
                : await validation(this.item, ['RejectType']);
        if (valid) {
            this.item.Ip = this.data.countryIp.Ip;
            let items = this.params && this.params['items'];
            return await this.service.updateStatusMultiple(items, this.item).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    ToastrHelper.Success('Cập nhật lịch hẹn thành công');                    
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
}