import * as _ from 'lodash';
import { AppInjector } from '../../../app.module';
import { MBBannerService } from '../banner.service';
import { Component, Input, OnInit } from '@angular/core';
import { validation } from '../../../_core/decorators/validator';
import { ResultApi } from '../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../_core/helpers/entity.helper';
import { MethodType } from '../../../_core/domains/enums/method.type';
import { MBStatusType } from '../../../_core/domains/entities/meeybanner/enums/mb.status.type';
import { MBBannerUpdateStatusEntity } from '../../../_core/domains/entities/meeybanner/mb.banner.entitty';

@Component({
    templateUrl: './banner.running.component.html',
    styleUrls: ['./banner.running.component.scss'],
})
export class MBBannerRunningComponent implements OnInit {
    @Input() params: any;
    service: MBBannerService;
    item: MBBannerUpdateStatusEntity = new MBBannerUpdateStatusEntity();

    constructor() {
        this.service = AppInjector.get(MBBannerService);
    }

    ngOnInit() {
        this.loadItem();
    }

    async confirm() {
        //let prevStatus = this.item.Status;
        let valid = await validation(this.item);
        if (valid && this.item) {
            // const startDate = new Date(this.item.StartDate).getTime();
            // const currentDate = new Date().getTime();
            // if (startDate > currentDate) this.item.Status = MBStatusType.Approve;
            return await this.service.callApi('MBBanner', 'UpdateStatus', {
                Id: this.item.Id,
                Status: this.item.Status,
                EndDate: this.item.EndDate,
                StartDate: this.item.StartDate,
                DisplayTime: this.item.DisplayTime,
            }, MethodType.Put).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    let message = 'Chạy banner thành công.';
                    if(this.item.Status == MBStatusType.Approve) message = 'Duyệt banner thành công.';
                    ToastrHelper.Success(message);
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
        let item = this.params && this.params['item'];
        this.item = EntityHelper.createEntity(MBBannerUpdateStatusEntity, item);
    }
}