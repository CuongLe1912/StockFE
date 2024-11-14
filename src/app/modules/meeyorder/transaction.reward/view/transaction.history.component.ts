import * as _ from 'lodash';
import { Component, Input, OnInit } from '@angular/core';
import { GridData } from '../../../../_core/domains/data/grid.data';
import { DataType } from '../../../../_core/domains/enums/data.type';
import { ToastrHelper } from "../../../../_core/helpers/toastr.helper";
import { UtilityExHelper } from "../../../../_core/helpers/utility.helper";
import { GridComponent } from '../../../../_core/components/grid/grid.component';
import { TransactionReWardEntity } from '../../../../_core/domains/entities/meeyorder/transactionward.entity';

@Component({
    selector: 'mo-transaction-history',
    templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class MOTransactionHistoryComponent extends GridComponent implements OnInit {
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
        Reference: TransactionReWardEntity,
    };
    @Input() items: [];

    constructor() {
        super();
        this.properties = [
            { Property: 'Action', Title: 'Hành động', Type: DataType.String, DisableOrder: true },
            {
                Property: 'statusBefore', Title: 'Trạng thái trước', Type: DataType.String, DisableOrder: true,
                Format: ((item: any) => {
                    
                    return item.StatusBefore == "new" ? "Tạo mới" 
                    : item.StatusBefore == "pending" ? "Đang xử lý"
                    : item.StatusBefore == "completed" ? "Thành công" : '';
                })
            },
            {
                Property: 'statusAfter', Title: 'Trạng thái sau', Type: DataType.String, DisableOrder: true,
                Format: ((item: any) => {
                    return item.StatusAfter == "new" ? "Tạo mới" 
                    : item.StatusAfter == "canceled" ? "Hủy"
                    : item.StatusAfter == "failure" ? "Thất bại"
                    : item.StatusAfter == "completed" ? "Thành công" : '';
                })
            },
            { Property: 'Reason', Title: 'Ghi chú', Type: DataType.String, DisableOrder: true },
            {
                Property: 'CreateByHistory', Title: 'Người thực hiện', Type: DataType.String, DisableOrder: true
                // Format: ((item: any) => {
                //     return 'Khách hàng'
                // })
            },
            { Property: 'CreateTime', Title: 'Thời gian', Type: DataType.String, DisableOrder: true,
                Format: ((item: any) => {
                    return item.CreatedAt;
                })
            },
            {
                Property: 'RequestText', Title: 'Thông tin yêu cầu', Type: DataType.String, DisableOrder: true,
                Format: ((item: any) => {
                    if (!item) return ''
                    return '<a routerLink="quickView" type="copy" tooltip="Sao chép"><i class="la la-copy"></i> Sao chép</a>'
                })
            },
        ];
    }

    quickView(item: any, type: string) {
        if (type === 'copy') {
            UtilityExHelper.copyString(JSON.stringify(item.Metadata));
            ToastrHelper.Success('Sao chép đường dẫn thành công');
        }
    }

    async ngOnInit() {
        this.render(this.obj, this.items);
    }
}