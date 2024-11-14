import * as _ from 'lodash';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GridData } from '../../../../../_core/domains/data/grid.data';
import { DataType } from '../../../../../_core/domains/enums/data.type';
import { GridComponent } from '../../../../../_core/components/grid/grid.component';
import { MPTransactionBalanceEntity } from '../../../../../_core/domains/entities/meeypay/mp.transactions.entity';
import { ConstantHelper } from "../../../../../_core/helpers/constant.helper";

@Component({
    selector: 'mp-balance-component',
    templateUrl: '../../../../../_core/components/grid/grid.component.html',
})
export class MPBalanceComponent extends GridComponent implements OnInit {
    @Input() params: any;
    @Input() viewer: boolean;
    @Input() code: any;
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
        Title: 'Số dư ví',
        Reference: MPTransactionBalanceEntity,
    };
    @Output() selected: EventEmitter<any> = new EventEmitter<any>();

    constructor() {
        super();
        this.properties = [
            { Property: 'walletype', Title: 'Loại ví', Type: DataType.String, DisableOrder: true },
            { Property: 'walletId', Title: 'Mã ví', Type: DataType.String, DisableOrder: true },
            {
                Property: 'status', Title: 'Trạng thái', Type: DataType.String, DisableOrder: true,
                Format: ((item: any) => {
                    let text: string = '';
                    if (item.status != null && item.status != undefined) {
                        let option = ConstantHelper.MP_TRANSACTION_STATUS_WALLET_TYPES.find(c => c.value == item.status);
                        if (option) text += '<p>' + (option && option.label) + '</p>';
                    }
                    return text;
                })
            },
            {
                Property: 'balanceAmount', Title: 'Số dư hiện tại (vnđ)', Type: DataType.String, Align: 'right', DisableOrder: true,
                Format: (item: any) => {
                    // if (item.balanceAmount) return item.balanceAmount.toLocaleString("vi-VN", { maximumFractionDigits: 2 }) + `${item.curencyCode ? item.curencyCode : 'VND'}`;
                    if (item.balanceAmount) return item.balanceAmount.toLocaleString("vi-VN", { maximumFractionDigits: 2 });
                    return 0;
                }
            },
            // {
            //     Property: 'walleChoose', Title: 'Nạp tiền', Type: DataType.String, Align: 'center',
            //     Click: ((item: any) => {
            //         let originalItem = this.originalItems.find(c => c['walletTypeId'] == item.walletTypeId);
            //         item.walletTypeId !== 2 ? this.selected.emit(originalItem) : '';
            //     }),
            //     Format: (item: any) => {
            //         let checked = item.walletTypeId === 1;
            //         if (this.code['items']) {
            //             let text = item.walletTypeId === 1 ? '<label class="kt-radio kt-radio--bold" style="padding-left: 20px; margin-bottom: 15px;"><input type="radio" name="group_wallet" ' + 'disabled' + (checked ? ' checked' : '') + '><span></span></label>' : '';
            //             return text;
            //         } else {
            //             let disabled = item.walletTypeId === 2 ? 'disabled' : '';
            //             let text = item.walletTypeId !== 2 ? '<label class="kt-radio kt-radio--bold" style="padding-left: 20px; margin-bottom: 15px;"><input type="radio" name="group_wallet" ' + disabled + (checked ? ' checked' : '') + '><span></span></label>' : '';
            //             return text;
            //         }
            //     }
            // },
        ];
    }

    async ngOnInit() {
        let data = this.params && this.params['items'];
        await this.render(this.obj, data || []);
    }
}