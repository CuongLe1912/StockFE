import * as _ from 'lodash';
import { AppInjector } from '../../../../app.module';
import { MeeyCrmService } from '../../meeycrm.service';
import { Component, OnInit, Input } from '@angular/core';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { MCRMCustomerNoteEmailEntity } from '../../../../_core/domains/entities/meeycrm/mcrm.customer.note.entity';

@Component({
    templateUrl: './view.note.email.component.html',
    styleUrls: ['./view.note.email.component.scss'],
})
export class MCRMViewNoteEmailComponent implements OnInit {
    @Input() params: any;
    service: MeeyCrmService;
    item: MCRMCustomerNoteEmailEntity;

    constructor() {
        this.service = AppInjector.get(MeeyCrmService);
    }

    ngOnInit() {
        this.loadItem();
    }
    private async loadItem() {
        let item = this.params && this.params['item'];
        this.service.item('MCRMCustomerNoteEmail', item.Id).then((result: ResultApi) => {
            if (ResultApi.IsSuccess(result)) {
                this.item = EntityHelper.createEntity(MCRMCustomerNoteEmailEntity, result.Object);
            }
        })
    }
}