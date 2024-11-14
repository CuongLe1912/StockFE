import * as _ from 'lodash';
import { Component, Input, OnInit } from '@angular/core';
import { GridData } from '../../../../_core/domains/data/grid.data';
import { DataType } from '../../../../_core/domains/enums/data.type';
import { PagingData } from '../../../../_core/domains/data/paging.data';
import { GridComponent } from '../../../../_core/components/grid/grid.component';
import { MPTransactionsEntity } from '../../../../_core/domains/entities/meeypay/mp.transactions.entity';

@Component({
    selector: 'mp-wallet-history',
    templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class MPWalletHistoryComponent extends GridComponent implements OnInit {
    @Input() params: any;
    obj: GridData = {
        Exports: [],
        Imports: [],
        Filters: [],
        Actions: [],
        Features: [],
        IsPopup: true,
        HideSearch: true,
        UpdatedBy: false,
        HidePaging: true,
        HideCustomFilter: true,
        Title: 'Cộng/trừ tiền vào ví',
        Reference: MPTransactionsEntity,
    };

    constructor() {
        super();
        this.properties = [
            { Property: 'CreateTime', Title: 'Thời gian', Type: DataType.String },
            { Property: 'Action', Title: 'Ý nghĩa', Type: DataType.String },
            {
                Property: 'Amount', Title: 'Số tiền', Type: DataType.Number, Align: 'right',
                Format: (item: any) => {
                    if (item.Amount) {
                        let amount = item.Amount.toLocaleString("vi-VN", { maximumFractionDigits: 2 }) + ' đ';
                        if (item.ActionId.toString() == '3') amount = '-' + amount;
                        else if (item.ActionId.toString() == '2')  amount = '+' + amount;
                        return amount;
                    }
                    return '';
                }
            },
            { Property: 'WalletType', Title: 'Loại ví', Type: DataType.String },
            { Property: 'WalletId', Title: 'Mã ví', Type: DataType.String },
            {
                Property: 'BalanceAmountBefore', Title: 'Số dư trước giao dịch', Type: DataType.Number, Align: 'right',
                Format: (item: any) => {
                    if (item.BalanceAmountBefore) return item.BalanceAmountBefore.toLocaleString("vi-VN", { maximumFractionDigits: 2 }) + ' đ';
                    return '';
                }
            },
            {
                Property: 'BalanceAmountAfter', Title: 'Số dư sau giao dịch', Type: DataType.Number, Align: 'right',
                Format: (item: any) => {
                    if (item.BalanceAmountAfter) return item.BalanceAmountAfter.toLocaleString("vi-VN", { maximumFractionDigits: 2 }) + ' đ';
                    return '';
                }
            },
        ];
    }

    async ngOnInit() {
        this.setPageSize(10000);
        let items = this.params && this.params['items'];
        await this.render(this.obj, items || []);
    }
}