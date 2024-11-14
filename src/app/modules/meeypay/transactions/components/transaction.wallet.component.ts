import * as _ from 'lodash';
import { Component, Input, OnInit } from '@angular/core';
import { GridData } from '../../../../_core/domains/data/grid.data';
import { DataType } from '../../../../_core/domains/enums/data.type';
import { GridComponent } from '../../../../_core/components/grid/grid.component';
import { MPTransactionsEntity } from '../../../../_core/domains/entities/meeypay/mp.transactions.entity';

@Component({
    selector: 'ml-transaction-wallet',
    templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class MLTransactionWalletComponent extends GridComponent implements OnInit {
    obj: GridData = {
        Exports: [],
        Imports: [],
        Filters: [],
        Actions: [],
        Features: [],
        IsPopup: true,
        HideSearch: true,
        UpdatedBy: false,
        NotKeepPrevData: true,
        HideHeadActions: true,
        HideCustomFilter: true,
        Reference: MPTransactionsEntity,
        HidePaging: true
    };
    @Input() items: [];

    constructor() {
        super();
        this.properties = [
            { Property: 'Index', Title: 'STT', Type: DataType.Number, Align: 'center', DisableOrder: true, ColumnWidth: 80 },
            { Property: 'Action', Title: 'Ý nghĩa', Type: DataType.String, DisableOrder: true, },
            { Property: 'Amount', Title: 'Số tiền', Type: DataType.String, DisableOrder: true,
                Format: ((item: any) => {
                    if(item.Amount) {
                        let str = '+ '
                        if(item.ActionId === 7 || item.ActionId === 3) {
                            str = '- '
                        }
                        return str + item.Amount.toLocaleString("vi-VN", { maximumFractionDigits: 2 }) + ' đ'
                    }
                    return 0 + ' đ';
                })
            },
            { Property: 'WalletType', Title: 'Loại ví', Type: DataType.String, DisableOrder: true, },
            { Property: 'WalletId', Title: 'Mã ví', Type: DataType.String, DisableOrder: true, },
            { Property: 'BalanceAmountBefore', Title: 'Số dư trước giao dịch', Type: DataType.String, DisableOrder: true,
                Format: ((item: any) => {
                    if(item.BalanceAmountBefore) {
                        return item.BalanceAmountBefore.toLocaleString("vi-VN", { maximumFractionDigits: 2 }) + ' đ'
                    }
                    return 0 + ' đ';
                })
            },
            { Property: 'FreezeAmountBefore', Title: 'Số dư đóng băng trước', Type: DataType.String, DisableOrder: true,
                Format: ((item: any) => {
                    if(item.FreezeAmountBefore) {
                        return item.FreezeAmountBefore.toLocaleString("vi-VN", { maximumFractionDigits: 2 }) + ' đ'
                    }
                    return 0 + ' đ';
                })
            },
            { Property: 'BalanceAmountAfter', Title: 'Số dư sau giao dịch', Type: DataType.String, DisableOrder: true,
                Format: ((item: any) => {
                    if(item.BalanceAmountAfter) {
                        return item.BalanceAmountAfter.toLocaleString("vi-VN", { maximumFractionDigits: 2 }) + ' đ'
                    }
                    return 0 + ' đ';
                })
            },
            { Property: 'FreezeAmountAfter ', Title: 'Số dư đóng băng sau', Type: DataType.String, DisableOrder: true,
                Format: ((item: any) => {
                    if(item.FreezeAmountAfter) {
                        return item.FreezeAmountAfter.toLocaleString("vi-VN", { maximumFractionDigits: 2 }) + ' đ'
                    }
                    return 0 + ' đ';
                })
            },
            { Property: 'CreateTime', Title: 'Thời gian', Type: DataType.String, DisableOrder: true, }
        ];
    }

    async ngOnInit() {
        let items = [];
        let index = 1;
        this.items.forEach((item: any) => {
            if (item?.WalletChangeHistories) {
                item.WalletChangeHistories.forEach((history: any) => {
                    history.Index = index;
                    items.push(history);
                    index++;
                })                
            }
        });
        this.render(this.obj, items);
    }
}