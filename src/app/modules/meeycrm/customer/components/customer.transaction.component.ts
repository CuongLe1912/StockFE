import * as _ from 'lodash';
import { Component, Input, OnInit } from '@angular/core';
import { GridData } from '../../../../_core/domains/data/grid.data';
import { DataType } from '../../../../_core/domains/enums/data.type';
import { UtilityExHelper } from '../../../../_core/helpers/utility.helper';
import { GridComponent } from '../../../../_core/components/grid/grid.component';
import { MPTransactionsEntity } from '../../../../_core/domains/entities/meeypay/mp.transactions.entity';

@Component({
    selector: 'mcrm-customer-transaction',
    templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class MCRMCustomerTransactionComponent extends GridComponent implements OnInit {
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
    };
    @Input() id: number;

    constructor() {
        super();
        this.properties = [
            {
                Property: 'MeeyId', Title: 'Id', Type: DataType.String,
                Format: (item: any) => {
                    return UtilityExHelper.renderIdFormat(item.Id, item.MeeyId);
                }
            },
            { Property: 'DateTime', Title: 'Thời gian', Type: DataType.DateTime, AllowFilterInline: false, Align: 'center' },
            { 
                Property: 'TransactionTypeId', Title: 'Loại giao dịch', Type: DataType.String, AllowFilterInline: false, Align: 'center',
                Format: (item: any) => {
                    return item.TransactionType;
                }
            },
            {
                Property: 'ReceiveName', Title: 'Đối tác/Người nhận', Type: DataType.String, AllowFilterInline: false, Align: 'center',
                Format: (item: any) => {
                    let text: string = '';
                    if (item.MerchantName) text += '<p>' + item.MerchantName + '</p>';
                    if (item.ReceiveName) text += '<p>' + item.ReceiveName + '</p>';
                    if (item.ReceivePhone) text += '<p>' + item.ReceivePhone + '</p>';
                    if (item.ReceiveId) text += '<p>' + item.ReceiveId + '</p>';
                    return text;
                }
            },
            { 
                Property: 'PaymentMethodId', Title: 'Phương thức', Type: DataType.String, Align: 'center', AllowFilterInline: false,
                Format: (item: any) => {
                    return item.PaymentMethod;
                }
            },
            { Property: 'Status', Title: 'Trạng thái', Type: DataType.String, Align: 'center' },
            {
                Property: 'Amount', Title: 'Số tiền (đ)', Type: DataType.String, AllowFilterInline: false, Align: 'right',
                Format: (item: any) => {
                    return item.Amount && item.Amount.toLocaleString("vi-VN", { maximumFractionDigits: 2 });
                }
            },
            {
                Property: 'WalletBalanceBefore', Title: 'Số dư trước (đ)', Type: DataType.String,
                Format: (item: any) => {
                    if (item.WalletBalanceBefore) 
                        return item.WalletType + ': ' + item.WalletBalanceBefore.toLocaleString("vi-VN", { maximumFractionDigits: 2 });
                    return '';
                }
            },
            {
                Property: 'WalletBalanceAfter', Title: 'Số dư sau (đ)', Type: DataType.String,
                Format: (item: any) => {
                    if (item.WalletBalanceAfter) 
                        return item.WalletType + ': ' + item.WalletBalanceAfter.toLocaleString("vi-VN", { maximumFractionDigits: 2 });
                    return '';
                }
            },
            { Property: 'Code', Title: 'Mã giao dịch', Type: DataType.String, AllowFilterInline: false },
        ];
    }

    async ngOnInit() {
        if (this.id) {
            this.obj.Url = '/admin/MPTransactions/ItemsBySale/' + this.id;
        }
        this.render(this.obj);
    }
}