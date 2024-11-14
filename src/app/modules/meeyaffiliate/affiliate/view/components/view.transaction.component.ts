import * as _ from 'lodash';
import { Component, Input, OnInit } from '@angular/core';
import { AppConfig } from "../../../../../_core/helpers/app.config";
import { GridData } from '../../../../../_core/domains/data/grid.data';
import { DataType } from '../../../../../_core/domains/enums/data.type';
import { UtilityExHelper } from "../../../../../_core/helpers/utility.helper";
import { GridComponent } from '../../../../../_core/components/grid/grid.component';
import { MafAffiliateEntity } from "../../../../../_core/domains/entities/meeyaffiliate/affiliate.entity";

@Component({
    selector: 'maf-view-transaction',
    templateUrl: '../../../../../_core/components/grid/grid.component.html',
    styleUrls: [
        './view.component.scss',
    ],
})
export class MAFViewTransactionComponent extends GridComponent implements OnInit {
    obj: GridData = {
        Exports: [],
        Imports: [],
        Filters: [],
        Actions: [],
        Features: [],
        IsPopup: true,
        UpdatedBy: false,
        HideSearch: true,
        NotKeepPrevData: true,
        HideCustomFilter: true,
        InlineFilters: ['Month', 'FilterCommissionType'],
        Reference: MafAffiliateEntity,
        PageSizes: [5, 10, 20, 50, 100],
    };
    @Input() item: any;

    constructor() {
        super();
        this.properties = [
            {
                Property: null, Title: 'Nguồn', Type: DataType.String,
                Format: ((item: any) => {
                    return UtilityExHelper.renderUserInfoFormat(item.Name, item.Phone, null, true);
                })
            },
            {
                Property: 'TransactionId', Title: 'Mã giao dịch', Type: DataType.String,
                Format: ((item: any) => {
                    let url = AppConfig.getProtocol() + '//' + AppConfig.getDomain() + '/admin/mptransactions/view?id=' + item.TransactionId;
                    return `<a href="${url}" target="_blank">${item.TransactionId}</a>`

                })
            },
            { Property: 'DateTime', Title: 'Thời gian', Type: DataType.DateTime, Align: 'center' },
            { Property: 'Content', Title: 'Nội dung', Type: DataType.String },
            {
                Property: 'Amount', Title: 'Số tiền giao dịch', Type: DataType.String, Align: 'right',
                Format: ((item: any) => {
                    if (!item.Amount) return ''
                    return item.Amount.toLocaleString("vi-VN", { maximumFractionDigits: 2 });
                })
            },
            { Property: 'Types', Title: 'Phân loại', Type: DataType.String },
        ];
    }

    async ngOnInit() {
        this.setPageSize(20);
        this.obj.Url = '/admin/MAFAffiliate/TransactionItems/' + this.item.Id;
        this.render(this.obj);
    }

    quickView(item: any, type: string) {
        if (type === 'user') {
            let url = AppConfig.getProtocol() + '//' + AppConfig.getDomain() + '/admin/mluser/view?meeyId=' + item.MeeyId;
            window.open(url, "_blank");
        }
    }
}