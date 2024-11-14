import * as _ from 'lodash';
import { AppInjector } from '../../../../../app.module';
import { Component, Input, OnInit } from "@angular/core";
import { validation } from '../../../../../_core/decorators/validator';
import { ResultApi } from '../../../../../_core/domains/data/result.api';
import { MLBusinessAccountService } from '../../business.account.service';
import { ToastrHelper } from '../../../../../_core/helpers/toastr.helper';
import { AdminDialogService } from '../../../../../_core/services/admin.dialog.service';
import { MLEmployeeEntity } from '../../../../../_core/domains/entities/meeyland/ml.employee.entity';

@Component({
    templateUrl: './remove.employee.component.html',
    styleUrls: ['./remove.employee.component.scss'],
})
export class MLRemoveEmployeeComponent implements OnInit {
    active: boolean;
    balance: string;
    errorMessage: string;
    @Input() params: any;
    disabled: boolean = true;
    service: MLBusinessAccountService;
    dialogService: AdminDialogService;
    item: MLEmployeeEntity = new MLEmployeeEntity();

    constructor() {
        this.service = AppInjector.get(MLBusinessAccountService);
        this.dialogService = AppInjector.get(AdminDialogService);
    }

    async ngOnInit() {
        this.balance = this.params && this.params['balance'];
    }

    valueChange() {
        this.disabled = this.item.Reason ? false : true;
    }

    public async confirm(): Promise<boolean> {
        this.errorMessage = null;
        if (await validation(this.item, ['Reason'])) {
            let id = this.params && this.params['id'];
            if (id) {
                return await this.service.deleteUser(id, this.item).then((result: ResultApi) => {
                    if (ResultApi.IsSuccess(result)) {
                        ToastrHelper.Success('Xóa nhân viên thành công');
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