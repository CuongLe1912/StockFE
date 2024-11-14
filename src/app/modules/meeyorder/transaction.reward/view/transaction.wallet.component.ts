import * as _ from 'lodash';
import { Component, Input, OnInit } from '@angular/core';
import { GridData } from '../../../../_core/domains/data/grid.data';
import { DataType } from '../../../../_core/domains/enums/data.type';
import { GridComponent } from '../../../../_core/components/grid/grid.component';
import { TransactionReWardEntity } from '../../../../_core/domains/entities/meeyorder/transactionward.entity';

@Component({
    selector: 'mo-transaction-wallet',
    templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class MOTransactionWalletComponent extends GridComponent implements OnInit {
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
        Reference: TransactionReWardEntity,
        HidePaging: true
    };
    @Input() items: [];

    constructor() {
        super();
        this.properties = [
            { Property: 'Index', Title: 'STT', Type: DataType.Number, Align: 'center', DisableOrder: true, ColumnWidth: 80 },
            { Property: 'Reason', Title: 'Ý nghĩa', Type: DataType.String, DisableOrder: true, },
            { Property: 'Amount', Title: 'Số tiền', Type: DataType.String, DisableOrder: true,
                Format: ((item: any) => {
                    if(item.Amount) {
                        let str = '+ '
                        if(item.Type === 'withdraw') {
                            str = '- '
                        }
                        return str + item.Amount.toLocaleString("vi-VN", { maximumFractionDigits: 2 }) + ' đ'
                    }
                    return 0 + ' đ';
                })
            },
            { Property: 'WalletType', Title: 'Loại ví', Type: DataType.String, DisableOrder: true, 
                Format: ((item: any) => {
                    return 'Tài  khoản ưu đãi';
                })
            },
            { Property: 'AmountBefore', Title: 'Số dư trước giao dịch', Type: DataType.String, DisableOrder: true,
                Format: ((item: any) => {
                    if(item.AmountBefore) {
                        return item.AmountBefore.toLocaleString("vi-VN", { maximumFractionDigits: 2 }) + ' đ'
                    }
                    return 0 + ' đ';
                })
            },
            // { Property: 'FreezeAmountBefore', Title: 'Số dư đóng băng trước', Type: DataType.String, DisableOrder: true,
            //     Format: ((item: any) => {
            //         if(item.FreezeAmountBefore) {
            //             return item.FreezeAmountBefore.toLocaleString("vi-VN", { maximumFractionDigits: 2 }) + ' đ'
            //         }
            //         return 0 + ' đ';
            //     })
            // },
            { Property: 'AmountAfter', Title: 'Số dư sau giao dịch', Type: DataType.String, DisableOrder: true,
                Format: ((item: any) => {
                    if(item.AmountAfter) {
                        return item.AmountAfter.toLocaleString("vi-VN", { maximumFractionDigits: 2 }) + ' đ'
                    }
                    return 0 + ' đ';
                })
            },
            // { Property: 'FreezeAmountAfter ', Title: 'Số dư đóng băng sau', Type: DataType.String, DisableOrder: true,
            //     Format: ((item: any) => {
            //         if(item.FreezeAmountAfter) {
            //             return item.FreezeAmountAfter.toLocaleString("vi-VN", { maximumFractionDigits: 2 }) + ' đ'
            //         }
            //         return 0 + ' đ';
            //     })
            // },
            { Property: 'CreateTime', Title: 'Thời gian', Type: DataType.String, DisableOrder: true, }
        ];
    }

    async ngOnInit() {
        let items = [];
        let index = 1;
        this.items.forEach((item: any) => {
            // if (item?.WalletChangeHistories) {
            //     item.WalletChangeHistories.forEach((history: any) => {
            //         history.Index = index;
            //         items.push(history);
            //         index++;
            //     })                
            // }
            item.Index = index;
            items.push(item);
            index++;
        });
        this.render(this.obj, this.items);
    }
}