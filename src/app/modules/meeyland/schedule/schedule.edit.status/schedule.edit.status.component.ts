import * as _ from 'lodash';
import { AppInjector } from '../../../../app.module';
import { MLScheduleService } from '../schedule.service';
import { Component, Input, OnInit } from "@angular/core";
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { OptionItem } from '../../../../_core/domains/data/option.item';
import { AdminDataService } from '../../../../_core/services/admin.data.service';
import { MLScheduleEntity } from '../../../../_core/domains/entities/meeyland/ml.schedule.entity';
import { MLScheduleRejectType, MLScheduleStatusType } from '../../../../_core/domains/entities/meeyland/enums/ml.schedule.type';

@Component({
    templateUrl: './schedule.edit.status.component.html',
    styleUrls: ['./schedule.edit.status.component.scss'],
})
export class MLScheduleEditStatusComponent implements OnInit {
    @Input() params: any;
    statuses: OptionItem[];
    data: AdminDataService;
    loading: boolean = true;
    service: MLScheduleService;
    MLScheduleRejectType = MLScheduleRejectType;
    MLScheduleStatusType = MLScheduleStatusType;
    item: MLScheduleEntity = new MLScheduleEntity();

    constructor() {
        this.data = AppInjector.get(AdminDataService);
        this.service = AppInjector.get(MLScheduleService);
    }

    ngOnInit() {
        this.loadItem();
    }
    async confirm() {
        let valid = this.item.Status != MLScheduleStatusType.Reject
            ? await validation(this.item, ['Status'])
            : this.item.RejectType == MLScheduleRejectType.OtherReason
                ? await validation(this.item, ['RejectType', 'CancelText'])
                : await validation(this.item, ['RejectType']);
        if (valid && this.item.Id) {
            this.item.Ip = this.data.countryIp.Ip;
            return await this.service.updateStatus(this.item).then((result: ResultApi) => {
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
    private async loadItem() {
        let id = this.params && this.params['id'];
        if (id) {
            await this.service.item('mlschedule', id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(MLScheduleEntity, result.Object as MLScheduleEntity);
                    this.item.OldStatus = _.cloneDeep(this.item.Status);
                    this.item.RejectType = MLScheduleRejectType.Busy;
                    let statuses = [];
                    switch (<MLScheduleStatusType>this.item.Status) {
                        case MLScheduleStatusType.Request:
                            statuses = [
                                { value: MLScheduleStatusType.Accept, label: 'Đã xác nhận' },
                                { value: MLScheduleStatusType.Reject, label: 'Từ chối' },
                                { value: MLScheduleStatusType.Complete, label: 'Hoàn thành' },
                            ];
                            break;
                        case MLScheduleStatusType.Accept:
                            statuses = [
                                { value: MLScheduleStatusType.Complete, label: 'Hoàn thành' },
                            ];
                            break;
                    }
                    this.statuses = statuses;
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            });
        }
        this.loading = false;
    }
}