import * as _ from 'lodash';
import { AppInjector } from '../../../app.module';
import { MeeymapService } from '../meeymap.service';
import { Component, OnInit, Input } from '@angular/core';
import { validation } from '../../../_core/decorators/validator';
import { ResultApi } from '../../../_core/domains/data/result.api';
import { EntityHelper } from '../../../_core/helpers/entity.helper';
import { ToastrHelper } from '../../../_core/helpers/toastr.helper';
import { AdminDialogService } from '../../../_core/services/admin.dialog.service';
import { MMLookupHistoryEntity } from '../../../_core/domains/entities/meeymap/mm.lookup.history.entity';

@Component({
    templateUrl: './assign.component.html',
    styleUrls: ['./assign.component.scss'],
})
export class MMAssignComponent implements OnInit {
    errorMessage: string;
    @Input() params: any;
    service: MeeymapService;
    dialogService: AdminDialogService;
    item: MMLookupHistoryEntity = new MMLookupHistoryEntity();

    constructor() {
        this.service = AppInjector.get(MeeymapService);
        this.dialogService = AppInjector.get(AdminDialogService);
    }

    async ngOnInit() {
        if (this.params) {
            this.item = EntityHelper.createEntity(MMLookupHistoryEntity, this.params['item']);
        }
    }

    public async confirm(): Promise<boolean> {
        this.errorMessage = null;
        if (await validation(this.item, ['UserId'])) {
            if (this.item) {
                return await this.service.assign(this.item).then((result: ResultApi) => {
                    if (ResultApi.IsSuccess(result)) {
                        ToastrHelper.Success('Gán nhân viên chăm sóc thành công');
                        return true;
                    }
                    this.errorMessage = result && result.Description;
                    return false;
                }, (e) => {
                    ToastrHelper.Exception(e);
                    return false;
                });
            }
        }
        return false;
    }
}