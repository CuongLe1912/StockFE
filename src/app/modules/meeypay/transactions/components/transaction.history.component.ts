import * as _ from 'lodash';
import { Component, Input, OnInit } from '@angular/core';
import { GridData } from '../../../../_core/domains/data/grid.data';
import { DataType } from '../../../../_core/domains/enums/data.type';
import { OptionItem } from "../../../../_core/domains/data/option.item";
import { ConstantHelper } from "../../../../_core/helpers/constant.helper";
import { GridComponent } from '../../../../_core/components/grid/grid.component';
import { MPTransactionsEntity } from '../../../../_core/domains/entities/meeypay/mp.transactions.entity';
import { UtilityExHelper } from "../../../../_core/helpers/utility.helper";
import { ToastrHelper } from "../../../../_core/helpers/toastr.helper";
import { MPTransactionStatusType, TransactionHistoryType } from '../../../../_core/domains/entities/meeypay/enums/mp.transaction.status.type';

@Component({
    selector: 'ml-transaction-history',
    templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class MLTransactionHistoryComponent extends GridComponent implements OnInit {
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
        HidePaging: true,
        Reference: MPTransactionsEntity,
    };
    @Input() items: [];

    constructor() {
        super();
        this.properties = [
            {
                Property: 'Action', Title: 'Hành động', Type: DataType.String, DisableOrder: true,
                Format: ((item: any) => {
                    if (!item.Action) return '';
                    if (item.HistoryTypeId == TransactionHistoryType.ApproveTransaction) return 'CSKH duyệt'
                    if (item.HistoryTypeId == TransactionHistoryType.UpdateTransactionFail) {
                        if (item.StatusBeforeEnum == MPTransactionStatusType.Waiting)
                            return 'CSKH từ chối';
                        return 'Kế toán từ chối';
                    }
                    if (item.HistoryTypeId == TransactionHistoryType.UpdateTransactionSuccess) return 'Kế toán duyệt'
                    if (item.HistoryTypeId == TransactionHistoryType.CancelTransaction) return 'Kế toán từ chối'
                    return item.Action;
                })
            },
            {
                Property: 'StatusBefore', Title: 'Trạng thái trước', Type: DataType.String, DisableOrder: true,
                Format: ((item: any) => {
                    if (item.HistoryTypeId == TransactionHistoryType.OpsNote) {
                        if (!item.StatusBefore) {
                            let status = '';
                            let index = this.items.findIndex(c => c == item);
                            if (index > 1) {
                                let itemIndex: any = this.items[index - 1];
                                status = itemIndex.StatusAfter;
                            }
                            if (status) return status;
                        }
                    }
                    return item.StatusBefore;
                })
            },
            {
                Property: 'StatusAfter', Title: 'Trạng thái sau', Type: DataType.String, DisableOrder: true,
                Format: ((item: any) => {
                    if (item.HistoryTypeId == TransactionHistoryType.OpsNote) {
                        if (!item.StatusAfter) {
                            let status = '';
                            let index = this.items.findIndex(c => c == item);
                            if (index > 1) {
                                let itemIndex: any = this.items[index - 1];
                                status = itemIndex.StatusAfter;
                            }
                            if (status) return status;
                        }
                    }
                    return item.StatusAfter;
                })
            },
            { Property: 'Description', Title: 'Ghi chú', Type: DataType.String, DisableOrder: true, },
            {
                Property: 'CreateBy', Title: 'Người thực hiện', Type: DataType.String, DisableOrder: true,
                Format: ((item: any) => {
                    return this.getCreateBy(item.CreateBy)
                })
            },
            { Property: 'CreateTime', Title: 'Thời gian', Type: DataType.String, DisableOrder: true },
            {
                Property: 'RequestText', Title: 'Thông tin yêu cầu', Type: DataType.String, DisableOrder: true,
                Format: ((item: any) => {
                    if (!item.Request) return ''
                    return '<a routerLink="quickView" type="copy" tooltip="Sao chép"><i class="la la-copy"></i> Sao chép</a>'
                })
            },
        ];
    }

    quickView(item: any, type: string) {
        if (type === 'copy') {
            UtilityExHelper.copyString(item.Request);
            ToastrHelper.Success('Sao chép đường dẫn thành công');
        }
    }

    async ngOnInit() {
        this.render(this.obj, this.items);
    }

    getCreateBy(item) {
        if (item == null) return "Hệ thống"
        if (item.includes('@')) return item
        let option: OptionItem = ConstantHelper.MP_TRANSACTION_AUTHOR_TYPES.find((c) => c.value == item.toLowerCase());
        if (option === undefined) {
            return item
        }
        return option.label;
    }

    copyLink(item: string) {
        UtilityExHelper.copyString(item);
        ToastrHelper.Success('Sao chép đường dẫn thành công');
    }
}