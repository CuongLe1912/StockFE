import * as _ from 'lodash';
import { AppInjector } from '../../../../../app.module';
import { Component, Input, OnInit } from "@angular/core";
import { MLScheduleService } from '../../schedule.service';
import { validation } from '../../../../../_core/decorators/validator';
import { ResultApi } from '../../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../../_core/helpers/toastr.helper';
import { AdminDialogService } from '../../../../../_core/services/admin.dialog.service';
import { MLScheduleHistoryEntity } from '../../../../../_core/domains/entities/meeyland/ml.schedule.entity';

@Component({
    templateUrl: './edit.schedule.history.component.html',
    styleUrls: ['./edit.schedule.history.component.scss'],
})
export class MLEditScheduleHistoryComponent implements OnInit {
    viewer: boolean;
    loading: boolean;
    @Input() params: any;
    service: MLScheduleService;
    item: MLScheduleHistoryEntity = new MLScheduleHistoryEntity();

    constructor() {
        this.service = AppInjector.get(MLScheduleService);
    }

    async ngOnInit() {
        if (this.params) {
            this.item.Id = this.params['id'];
            this.viewer = this.params['viewer'];
            this.item.Index = this.params['index'];
            this.item.MLScheduleId = this.params['scheduleId'];
        }
        await this.loadItem();
    }

    async confirm() {
        let valid = await validation(this.item, ['UserId', 'DateTime', 'Content']);
        if (valid) {
            return await this.service.save('MLScheduleHistory', this.item).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    ToastrHelper.Success('Lưu lịch sử hỗ trợ thành công');
                    return true;
                }
                ToastrHelper.ErrorResult(result)
                return false;
            }, (e) => {
                ToastrHelper.Exception(e);
                return false;
            });
        }
        return false;
    }

    async loadItem() {
        if (this.item.Id) {
            await this.service.item('MLScheduleHistory', this.item.Id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    let item: MLScheduleHistoryEntity = result.Object;
                    if (item) {
                        this.item.Id = item.Id;
                        this.item.Index = item.Index;
                        this.item.UserId = item.UserId;
                        this.item.Content = item.Content;
                        this.item.DateTime = item.DateTime;
                    }
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            });
        }
        this.loading = false;
    }
}