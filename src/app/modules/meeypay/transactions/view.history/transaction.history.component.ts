import * as _ from 'lodash';
import { Component, Input, OnInit } from '@angular/core';
import { GridData } from '../../../../_core/domains/data/grid.data';
import { DataType } from '../../../../_core/domains/enums/data.type';
import { PagingData } from '../../../../_core/domains/data/paging.data';
import { GridComponent } from '../../../../_core/components/grid/grid.component';
import { MPTransactionsEntity } from '../../../../_core/domains/entities/meeypay/mp.transactions.entity';

@Component({
    selector: 'mp-transaction-history',
    templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class MPTransactionHistoryComponent extends GridComponent implements OnInit {
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
        Title: 'Lịch sử giao dịch',
        Reference: MPTransactionsEntity,
    };

    constructor() {
        super();
        this.properties = [
            { Property: 'CreateTime', Title: 'Thời gian', Type: DataType.String },
            { Property: 'Action', Title: 'Ý nghĩa', Type: DataType.String },
            { Property: 'StatusBefore', Title: 'Trạng thái trước', Type: DataType.String },
            { Property: 'StatusAfter', Title: 'Trạng thái sau', Type: DataType.String },
            { Property: 'Description', Title: 'Ghi chú', Type: DataType.String },
            { Property: 'CreateBy', Title: 'Người thực hiện', Type: DataType.String },
        ];
    }

    async ngOnInit() {
        this.setPageSize(10000);
        let items = this.params && this.params['items'];
        await this.render(this.obj, items || []);
    }
}