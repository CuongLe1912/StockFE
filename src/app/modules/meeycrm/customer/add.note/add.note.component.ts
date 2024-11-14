import * as _ from 'lodash';
import { AppInjector } from '../../../../app.module';
import { MeeyCrmService } from '../../meeycrm.service';
import { Component, OnInit, Input } from '@angular/core';
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { MCRMCustomerLeadEntity } from '../../../../_core/domains/entities/meeycrm/mcrm.customer.lead.entity';
import { MCRMCustomerNoteDto, MCRMCustomerEntity } from '../../../../_core/domains/entities/meeycrm/mcrm.customer.entity';

@Component({
    templateUrl: './add.note.component.html',
    styleUrls: ['./add.note.component.scss'],
})
export class MCRMAddNoteComponent implements OnInit {
    status: string;
    errorMessage: string;
    @Input() params: any;
    service: MeeyCrmService;
    disabled: boolean = true;

    lead: boolean = false;
    entity: MCRMCustomerEntity;
    entityLead: MCRMCustomerLeadEntity;
    item: MCRMCustomerNoteDto = new MCRMCustomerNoteDto();

    constructor() {
        this.service = AppInjector.get(MeeyCrmService);
    }

    ngOnInit() {
        this.lead = this.params && this.params['lead'];
        this.loadItem();
    }
    async confirm() {
        let valid = this.lead 
            ? await validation(this.item, ['Note'])
            : await validation(this.item, ['Phones', 'Note']);
        if (valid && this.item) {
            let obj: MCRMCustomerNoteDto = {
                Id: this.item.Id,
                Note: this.item.Note,
                Phones: this.item.Phones || [this.item.PhoneText],
                CustomerId: this.item.CustomerId || this.item.CustomerLeadId,
            };
            return await this.service.addOrUpdateNote(obj, this.lead).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    let message = this.item.Id
                        ? 'Sửa ghi chú khách hàng thành công'
                        : 'Thêm mới ghi chú khách hàng thành công';
                    ToastrHelper.Success(message);
                    return true;
                }
                let message = result && result.Description;
                if (message) {
                    this.errorMessage = message;
                    return false;
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
        if (this.lead) {
            let item = this.params && this.params['item'],
                note = this.params && this.params['note'];

            this.entityLead = EntityHelper.createEntity(MCRMCustomerLeadEntity, item);
            this.item = EntityHelper.createEntity(MCRMCustomerNoteDto, note);
            this.item.CustomerLeadId = this.entityLead.Id;
            this.item.PhoneText = this.entityLead.Phone;
        } else {
            let item = this.params && this.params['item'],
                note = this.params && this.params['note'];

            this.entity = EntityHelper.createEntity(MCRMCustomerEntity, item);
            this.item = EntityHelper.createEntity(MCRMCustomerNoteDto, note);
            this.item.CustomerId = this.entity.Id;
        }
    }

    async toggleDisableButton() {
        this.disabled = this.lead 
            ? !(await validation(this.item, ['Note'], true))
            : !(await validation(this.item, ['Phones', 'Note'], true));
    }
}