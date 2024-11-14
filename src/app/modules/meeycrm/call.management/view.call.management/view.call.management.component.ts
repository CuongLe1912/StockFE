import * as _ from 'lodash';
import { AppInjector } from '../../../../app.module';
import { MeeyCrmService } from '../../meeycrm.service';
import { Component, OnInit, Input } from '@angular/core';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { MCRMCallLogByIdEntity } from "../../../../_core/domains/entities/meeycrm/mcrm.call.management.entity";
import { UtilityExHelper } from "../../../../_core/helpers/utility.helper";

@Component({
    templateUrl: './view.call.management.component.html',
})
export class MCRMViewCallManagementcomponent implements OnInit {
    @Input() params: any;
    service: MeeyCrmService;
    item: MCRMCallLogByIdEntity;
    loading: boolean = true;

    constructor() {
        this.service = AppInjector.get(MeeyCrmService);
    }

    ngOnInit() {
        this.loadItem();
        this.loading = false;
    }

    private async loadItem() {
        let item = this.params && this.params['item'];
        await this.service.getCallLogById(item).then((result: ResultApi) => {
            if (ResultApi.IsSuccess(result)) {
                let data = result.Object;
                data.Duration = UtilityExHelper.toHHMMSS(data.Duration);
                this.item = EntityHelper.createEntity(MCRMCallLogByIdEntity, data);
            }
        })
    }
}