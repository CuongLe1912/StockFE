import * as _ from 'lodash';
import { AppInjector } from '../../../../../app.module';
import { Component, Input, OnInit } from "@angular/core";
import { MPTransactionService } from '../../transactions.service';
import { validation } from '../../../../../_core/decorators/validator';
import { ResultApi } from '../../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../../_core/helpers/entity.helper';
import { UtilityExHelper } from '../../../../../_core/helpers/utility.helper';
import { MPRevenueEntity } from '../../../../../_core/domains/entities/meeypay/mp.revenue.entity';

@Component({
    templateUrl: './edit.revenue.component.html',
    styleUrls: [
        './edit.revenue.component.scss',
        '../../../../../../assets/css/modal.scss'
    ],
})
export class EditRevenueComponent implements OnInit {
    viewer: boolean;
    @Input() params: any;
    loading: boolean = true;
    service: MPTransactionService;
    item: MPRevenueEntity = new MPRevenueEntity();


    constructor() {
        this.service = AppInjector.get(MPTransactionService);
    }

    ngOnInit() {
        this.loadItem();
        this.loading = false;
    }

    private async loadItem() {
        this.item = new MPRevenueEntity();
        let id = this.params && this.params['id'];
        this.viewer = this.params && this.params['viewer'];
        if (id) {
            await this.service.item('mprevenue', id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(MPRevenueEntity, result.Object as MPRevenueEntity);
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            });
        }
    }

    public async confirm(): Promise<boolean> {
        if (this.item) {
            if (await validation(this.item)) {
                let item: MPRevenueEntity = _.cloneDeep(this.item);
                item.Amount = UtilityExHelper.formatStringtoNumber(item.Amount);
                return await this.service.addOrUpdate(item).then((result: ResultApi) => {
                    if (ResultApi.IsSuccess(result)) {
                        let message = this.item.Id 
                            ? 'Lưu mã tiền thu thành công'
                            : 'Tạo mã tiền thu thành công'
                        ToastrHelper.Success(message);
                        return true;
                    } else {
                        ToastrHelper.ErrorResult(result);
                        return false;
                    }
                }, () => {
                    return false;
                });
            }
        }
        return false;
    }
}