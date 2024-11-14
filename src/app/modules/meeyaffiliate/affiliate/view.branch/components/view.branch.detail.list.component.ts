import { Component, Input, OnInit } from "@angular/core";
import { GridData } from "../../../../../_core/domains/data/grid.data";
import { BaseEntity } from "../../../../../_core/domains/entities/base.entity";
import { GridComponent } from "../../../../../_core/components/grid/grid.component";
import { DataType } from "../../../../../_core/domains/enums/data.type";
import { OptionItem } from "../../../../../_core/domains/data/option.item";
import { ConstantHelper } from "../../../../../_core/helpers/constant.helper";

@Component({
    selector: 'maf-view-branch-detail-list',
    templateUrl: '../../../../../_core/components/grid/grid.component.html',
})
export class MAFViewBranchDetailListComponent extends GridComponent implements OnInit {
    @Input() params: any;
    @Input() url: any;

    obj: GridData = {
        Reference: BaseEntity,
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
        PageSizes: [5, 10, 20, 50, 100],
        DisableAutoLoad: true,
    };

    constructor() {
        super();
    }

    ngOnInit() {
        this.obj.Url = this.url;
        this.properties = [
            { Property: 'Ref', Title: 'Mã Ref', Type: DataType.String },
            { Property: 'Name', Title: 'Họ Tên', Type: DataType.String },
            {
                Property: 'Phone', Title: 'Số điện thoại', Type: DataType.String,
                Format: ((item: any) => {
                    if (item.Phone) return item.Phone;
                    if (item.MeeyId) return item.MeeyId;
                    return '';
                })
            },
            { Property: 'Branch', Title: 'Nhánh', Type: DataType.String },
            { Property: 'RankCumulative', Title: 'Cấp bậc', Type: DataType.String },
            {
                Property: 'F1Amount', Title: 'Doanh số F1', Type: DataType.String, Align: 'right',
                Format: ((item: any) => {
                    if (!item.F1Amount) return ''
                    return item.F1Amount.toLocaleString("vi-VN", { maximumFractionDigits: 2 });
                })
            },
            {
                Property: 'Commission', Title: 'Hoa hồng', Type: DataType.String, Align: 'right',
                Format: ((item: any) => {
                    if (!item.Commission) return ''
                    return item.Commission.toLocaleString("vi-VN", { maximumFractionDigits: 2 });
                })
            },
            {
                Property: 'PayAmount', Title: 'Hoa hồng thực nhận', Type: DataType.String, Align: 'right',
                Format: ((item: any) => {
                    if (!item.PayAmount) return ''
                    return item.PayAmount.toLocaleString("vi-VN", { maximumFractionDigits: 2 });
                })
            },
            { Property: 'PaymentDate', Title: 'Thời gian thanh toán', Type: DataType.DateTime },
            {
                Property: 'Status', Title: 'Trạng thái', Type: DataType.String,
                Format: ((item: any) => {
                    let text = '';
                    let option: OptionItem = ConstantHelper.MAF_STATUS_COMMISSION_TYPES.find((c) => c.value == item.Status);
                    text = '<p><span class="' + (option && option.color) + '">' + (option && option.label) + "</span></p>";
                    return text
                })
            },
        ]
        this.render(this.obj);
    }
}