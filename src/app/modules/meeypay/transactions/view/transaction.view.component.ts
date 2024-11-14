import * as _ from 'lodash';
import { AppInjector } from '../../../../app.module';
import { Component, Input, OnInit } from '@angular/core';
import { MPTransactionService } from '../transactions.service';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { ActionData } from '../../../../_core/domains/data/action.data';
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { MPTransactionsEntity } from '../../../../_core/domains/entities/meeypay/mp.transactions.entity';
import { MPTransactionType } from '../../../../_core/domains/entities/meeypay/enums/mp.transaction.status.type';

@Component({
    templateUrl: './transaction.view.component.html',
    styleUrls: [
        './transaction.view.component.scss',
        '../../../../../assets/css/modal.scss'
    ],
})
export class MPTransactionViewComponent extends EditComponent implements OnInit {
    @Input() params: any;
    loading: boolean = true;
    service: MPTransactionService;
    MPTransactionType = MPTransactionType;
    item: MPTransactionsEntity = new MPTransactionsEntity();


    constructor() {
        super();
        this.state = this.getUrlState();
        this.service = AppInjector.get(MPTransactionService);
    }

    async ngOnInit() {
        await this.loadItem();
        this.loading = false;
    }

    private async loadItem() {
        let id = this.state && this.state.id;
        this.item = new MPTransactionsEntity();
        if (id) {
            await this.service.item('mptransaction', id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    let item = result.Object as MPTransactionsEntity;
                    this.item = EntityHelper.createEntity(MPTransactionsEntity, result.Object as MPTransactionsEntity);
                    this.item.WalletChangeHistories = item.WalletChangeHistories;
                    this.item.TransactionHistories = item.TransactionHistories;
                    let popup = this.params && this.params['popup'];
                    if (!popup) {
                        let name = '';                 
                        this.renderActions();       
                        if (this.state.prevUrl.indexOf('transfer') >= 0) name = 'Chuyển tiền';
                        else if (this.state.prevUrl.indexOf('deposit') >= 0) name = 'Nạp tiền';
                        else if (this.state.prevUrl.indexOf('payment') >= 0) name = 'Thanh toán';
                        else if (this.state.prevUrl.indexOf('withdrawl') >= 0) name = 'Rút tiền';
                        else if (this.state.prevUrl.indexOf('transactions') >= 0) name = 'Danh sách';
                        this.breadcrumbs = [
                            { Name: 'Meey Pay' },
                            { Name: 'Quản lý giao dịch' },
                            { Name: name, Link: this.state.prevUrl },
                            { Name: 'Chi tiết giao dịch: ' + this.item.Code }
                        ];
                    }
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            });
        }
    }
    private async renderActions() {
        let actions: ActionData[] = [
            ActionData.back(() => { this.back() }),
        ];
        this.actions = actions;
    }
}