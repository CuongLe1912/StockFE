import * as _ from 'lodash';
import { AppInjector } from '../../../app.module';
import { MeeymapService } from '../meeymap.service';
import { Component, OnInit, Input } from '@angular/core';
import { validation } from '../../../_core/decorators/validator';
import { ResultApi } from '../../../_core/domains/data/result.api';
import { EntityHelper } from '../../../_core/helpers/entity.helper';
import { ToastrHelper } from '../../../_core/helpers/toastr.helper';
import { AdminDialogService } from '../../../_core/services/admin.dialog.service';
import { MMRequestEntity } from '../../../_core/domains/entities/meeymap/mm.request.entity';

@Component({
    templateUrl: './add.note.request.component.html',
})
export class MMAddNoteRequestComponent implements OnInit {
    errorMessage: string;
    @Input() params: any;
    service: MeeymapService;
    dialogService: AdminDialogService;
    item: MMRequestEntity = new MMRequestEntity();

    constructor() {
        this.service = AppInjector.get(MeeymapService);
        this.dialogService = AppInjector.get(AdminDialogService);
    }

    async ngOnInit() {
        if (this.params) {
            this.item = EntityHelper.createEntity(MMRequestEntity, this.params['item']);
        }
    }

    public async confirm(): Promise<boolean> {
        this.errorMessage = null;
        if (await validation(this.item, ['Note'])) {
            if (this.item) {
                return await this.service.addNoteAndUpdateStatus(this.item).then((result: ResultApi) => {
                    if (ResultApi.IsSuccess(result)) {
                        ToastrHelper.Success('Chăm sóc thành công');
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