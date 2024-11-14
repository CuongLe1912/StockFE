import { Component, OnInit } from "@angular/core";
import { GridData } from "../../../../_core/domains/data/grid.data";
import { DataType } from "../../../../_core/domains/enums/data.type";
import { ActionData } from "../../../../_core/domains/data/action.data";
import { ModalSizeType } from "../../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../../_core/components/grid/grid.component";
import { MafAffiliateNodeV1Entity } from "../../../../_core/domains/entities/meeyaffiliate/affiliate.node.v1.entity";

@Component({
    selector: 'mcrm-grid-customer-company',
    templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class MAFAffiliateNodeV1Component extends GridComponent implements OnInit {
    obj: GridData = {
        Actions: [],
        Imports: [],
        Exports: [],
        Filters: [],
        Features: [
            ActionData.reload(() => { this.loadItems(); })
        ],
        MoreActions: [],
        UpdatedBy: false,
        Reference: MafAffiliateNodeV1Entity,
        Size: ModalSizeType.ExtraLarge,
        Title: 'Cây hoa hồng cũ',
        CustomFilters: [],
        SearchText: 'Khách hàng',
    };

    constructor() {
        super();
    }

    async ngOnInit() {
        this.properties = [
            {
                Property: 'Name', Title: 'Thành viên', Type: DataType.String,
                Format: ((item: any) => {
                    let text = '';
                    if (item.Name) text += '<p>' + item.Name + '</p>';
                    if (item.Phone) text += '<p><i class=\'la la-phone\'></i> ' + item.Phone + '</p>';
                    if (item.Email && item.Email != 'null') text += '<p><i class=\'la la-inbox\'></i> ' + item.Email + '</p>';
                    if (item.MeeyId) text += '<p><i class=\'la la-user\'></i> ' + item.MeeyId + '</p>';
                    return text;
                })
            },
            { Property: 'JoinDate', Title: 'Ngày tham gia', Type: DataType.DateTime },
            { Property: 'Linked', Title: 'Loại liên kết', Type: DataType.String },
            {
                Property: 'Parent', Title: 'Người giới thiệu', Type: DataType.String,
                Format: ((item: any) => {
                    if (item.Parent) {
                        let text = '';
                        if (item.Parent.Name) text += '<p>' + item.Parent.Name + '</p>';
                        if (item.Parent.Phone) text += '<p><i class=\'la la-phone\'></i> ' + item.Parent.Phone + '</p>';
                        if (item.Parent.Email && item.Parent.Email != 'null') text += '<p><i class=\'la la-inbox\'></i> ' + item.Parent.Email + '</p>';
                        return text;
                    }
                    return '';
                })
            },
            { Property: 'Level', Title: 'Tầng', Type: DataType.Number },
            {
                Property: 'Source', Title: 'Nguồn', Type: DataType.String,
                Format: ((item: any) => {
                    let text = 'meeid';
                    return text;
                })
            },
        ];
        await this.render(this.obj);
    }
}