import * as _ from 'lodash';
import { AppInjector } from '../../../../app.module';
import { Component, Input, OnInit } from "@angular/core";
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { AdminApiService } from '../../../../_core/services/admin.api.service';
import { LogActivityEntity } from '../../../../_core/domains/entities/log.activity.entity';

@Component({
    templateUrl: './log.activity.body.component.html',
    styleUrls: [
        './log.activity.body.component.scss',
        '../../../../../assets/css/modal.scss'
    ],
})
export class LogActivityBodyComponent implements OnInit {
    @Input() params: any;
    loading: boolean = true;
    service: AdminApiService;
    tab: string = 'kt_notes';
    item: LogActivityEntity = new LogActivityEntity();

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
        this.item = new LogActivityEntity();
        let id = this.params && this.params['id'];
        if (id) {
            await this.service.item('logactivity', id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(LogActivityEntity, result.Object as LogActivityEntity);
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            });
        }
    }
}