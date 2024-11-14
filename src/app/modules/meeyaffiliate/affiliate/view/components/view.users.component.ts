import * as _ from 'lodash';
import { Component, Input, OnInit } from '@angular/core';
import { AppConfig } from "../../../../../_core/helpers/app.config";
import { GridData } from '../../../../../_core/domains/data/grid.data';
import { DataType } from '../../../../../_core/domains/enums/data.type';
import { OptionItem } from "../../../../../_core/domains/data/option.item";
import { ConstantHelper } from "../../../../../_core/helpers/constant.helper";
import { UtilityExHelper } from "../../../../../_core/helpers/utility.helper";
import { GridComponent } from '../../../../../_core/components/grid/grid.component';
import { MafAffiliateEntity } from "../../../../../_core/domains/entities/meeyaffiliate/affiliate.entity";

@Component({
    selector: 'maf-view-users',
    templateUrl: '../../../../../_core/components/grid/grid.component.html',
    styleUrls: [
        './view.component.scss',
    ],
})
export class MAFViewUsersComponent extends GridComponent implements OnInit {
    obj: GridData = {
        Exports: [],
        Imports: [],
        Filters: [],
        Actions: [],
        Features: [],
        IsPopup: false,
        UpdatedBy: false,
        HideSearch: true,
        NotKeepPrevData: true,
        HideCustomFilter: false,
        PageSizes: [5, 10, 20, 50, 100],
        DisableAutoLoad: true,
        CustomFilters: [
            'Level', 'Name', 'Phone'
        ],
        Reference: MafAffiliateEntity,
    };
    @Input() item: any;

    constructor() {
        super();
        this.properties = [
            {
                Property: 'Name', Title: 'Thành viên', Type: DataType.String,
                Format: ((item: any) => {
                    return UtilityExHelper.renderUserInfoFormat(item.Name, item.Phone, null, true);
                })
            },
            { Property: 'JoinDate', Title: 'Ngày tham gia', Type: DataType.DateTime, Align: 'Left', },
            { Property: 'RankCumulative', Title: 'Cấp bậc', Type: DataType.String },
            { Property: 'Linked', Title: 'Loại liên kết', Type: DataType.String },
            { Property: 'Level', Title: 'Tầng', Type: DataType.String },
            { Property: 'Source', Title: 'Nguồn', Type: DataType.String },
        ];
    }

    async ngOnInit() {
        this.setPageSize(50);
        this.obj.Url = '/admin/MAFAffiliate/MemberItems/' + this.item.Id;
        await this.render(this.obj);
        this.summaryText = 'Có <b>' + UtilityExHelper.formatNumbertoString(this.item.F1Count) + ' F1/' + UtilityExHelper.formatNumbertoString(this.itemData?.Paging?.Total) + '</b> Thành viên';
    }

    getCreateBy(item) {
        if (item == null) return "Khách hàng"
        if (item.includes('@')) return item
        let option: OptionItem = ConstantHelper.MP_TRANSACTION_AUTHOR_TYPES.find((c) => c.value == item);
        if (option === undefined) {
            return item
        }
        return option.label;
    }

    quickView(item: any, type: string) {
        if (type === 'user') {
            let url = AppConfig.getProtocol() + '//' + AppConfig.getDomain() + '/admin/mluser/view?meeyId=' + item.MeeyId;
            window.open(url, "_blank");
        }
    }
}