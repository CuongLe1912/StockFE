import * as _ from 'lodash';
import { AppInjector } from '../../../../app.module';
import { Component, Input, OnInit } from "@angular/core";
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { AdminApiService } from '../../../../_core/services/admin.api.service';
import { MLPartnerCodeEntity } from '../../../../_core/domains/entities/meeyland/ml.partner.entity';

@Component({
    templateUrl: './edit.partner.code.component.html',
    styleUrls: ['./edit.partner.code.component.scss'],
})
export class MLEditPartnerCodeComponent implements OnInit {
    @Input() params: any;
    disabled: boolean = true;
    service: AdminApiService;
    item: MLPartnerCodeEntity = new MLPartnerCodeEntity();

    constructor() {
        this.service = AppInjector.get(AdminApiService);
    }

    async ngOnInit() {
        this.item.Id = this.params && this.params['id'];
        this.item.MLPartnerId = this.params && this.params['partnerId'];
    }

    async confirm() {
        let valid = await validation(this.item);
        if (valid) {
            return await this.service.save('MLPartnerCode', this.item).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    let message = this.item.Id
                        ? 'Cập nhật thành công'
                        : 'Thêm mới thành công';
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

    async valueChange() {
        this.disabled = await validation(this.item, null, true) ? false : true
    }
}