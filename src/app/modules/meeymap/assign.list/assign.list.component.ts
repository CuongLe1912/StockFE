import * as _ from 'lodash';
import { AppInjector } from '../../../app.module';
import { MeeymapService } from '../meeymap.service';
import { Component, OnInit, Input } from '@angular/core';
import { validation } from '../../../_core/decorators/validator';
import { ResultApi } from '../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../_core/helpers/toastr.helper';
import { AdminDialogService } from '../../../_core/services/admin.dialog.service';
import { MMLookupHistoryEntity } from '../../../_core/domains/entities/meeymap/mm.lookup.history.entity';
import { MMLookupHistoryAssignListEntity } from '../../../_core/domains/entities/meeymap/mm.lookup.history.assign.entity';

@Component({
    templateUrl: './assign.list.component.html',
    styleUrls: ['./assign.list.component.scss'],
})
export class MMAssignListComponent implements OnInit {
    errorMessage: string;
    @Input() params: any;
    service: MeeymapService;
    dialogService: AdminDialogService;
    item: MMLookupHistoryAssignListEntity ;

    constructor() {
        this.service = AppInjector.get(MeeymapService);
        this.dialogService = AppInjector.get(AdminDialogService);
    }

    async ngOnInit() {
        if (this.params) {
            let items = this.params['items'] as MMLookupHistoryEntity[];
            this.item = new MMLookupHistoryAssignListEntity();
            this.item.Ids = items && items.map(c => c.Id);
        }
    }

    public async confirm(): Promise<boolean> {
        this.errorMessage = null;
        if (await validation(this.item, ['UserId'])) {
            if (this.item) {
                return await this.service.assigns(this.item).then((result: ResultApi) => {
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