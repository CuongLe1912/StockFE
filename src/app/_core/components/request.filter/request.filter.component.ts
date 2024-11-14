import * as _ from 'lodash';
import { AppInjector } from '../../../app.module';
import { validation } from '../../decorators/validator';
import { Component, OnInit, Input } from '@angular/core';
import { ResultApi } from '../../domains/data/result.api';
import { ToastrHelper } from '../../helpers/toastr.helper';
import { MethodType } from '../../domains/enums/method.type';
import { AdminApiService } from '../../services/admin.api.service';
import { RequestFilterEntity } from '../../domains/entities/request.filter.entity';

@Component({
    templateUrl: './request.filter.component.html',
    styleUrls: ['./request.filter.component.scss'],
})
export class RequestFilterComponent implements OnInit {
    errorMessage: string;
    @Input() params: any;
    disabled: boolean = true;
    service: AdminApiService;
    item: RequestFilterEntity = new RequestFilterEntity();

    constructor() {
        this.service = AppInjector.get(AdminApiService);
    }

    ngOnInit() {
        this.item.FilterData = this.params && this.params['filter'];
        this.item.Controller = this.params && this.params['controller'];
    }

    async confirm() {
        let valid = await validation(this.item, ['Name']);
        if (valid && this.item) {
            return await this.service.saveByUrl('/admin/requestFilter/addOrUpdate', MethodType.Put, this.item).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    let message = this.item.Id 
                        ? 'Lưu bộ lọc thành công'
                        : 'Thêm mới bộ lọc thành công';
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

    async toggleDisableButton() {
        this.disabled = !(await validation(this.item, ['Name'], true));
    }
}