import * as _ from 'lodash';
import { Component, Input, OnInit } from '@angular/core';
import { GridData } from '../../../../_core/domains/data/grid.data';
import { DataType } from '../../../../_core/domains/enums/data.type';
import { GridComponent } from '../../../../_core/components/grid/grid.component';
import { MPTransactionsEntity } from '../../../../_core/domains/entities/meeypay/mp.transactions.entity';
import {ConstantHelper} from "../../../../_core/helpers/constant.helper";
import {OptionItem} from "../../../../_core/domains/data/option.item";

@Component({
    selector: 'mo-transaction-ref',
    templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class MOTransactionRefComponent extends GridComponent implements OnInit {
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
            { Property: 'Id', Title: 'Mã giao dịch', Type: DataType.String, DisableOrder: true, },
            { Property: 'TransactionTypeId', Title: 'Loại giao dịch', Type: DataType.String, DisableOrder: true,
                Format: (item: any) => {
                    if (item.TransactionTypeId == null) return "";
                    let option: OptionItem = ConstantHelper.MP_TRANSACTION_TYPES.find((c) => c.value == item.TransactionTypeId);
                    let text = '<p>' + (option && option.label) + "</p>";
                    return text;
                }},
            { Property: 'Amount', Title: 'Số tiền', Type: DataType.String, DisableOrder: true,
                Format: ((item: any) => {
                    if(item.Amount) {
                        return item.Amount.toLocaleString("vi-VN", { maximumFractionDigits: 2 }) + ' đ'
                    }
                    return 0 + ' đ';
                })
            },
            { Property: 'Status', Title: 'Trạng thái', Type: DataType.String, DisableOrder: true,
                Format: (item: any) => {
                    if (item.Status == null) return "";
                    let option: OptionItem = ConstantHelper.MP_TRANSACTION_STATUS_TYPES.find((c) => c.value == item.Status);
                    let text = '<p class="' + (option && option.color) + '">' + (option && option.label) + "</p>";
                    return text;
                }
            },
            { Property: 'CreateDate', Title: 'Thời gian', Type: DataType.String, DisableOrder: true, }
        ];
    }

    async ngOnInit() {
        this.render(this.obj, this.items);
    }
}