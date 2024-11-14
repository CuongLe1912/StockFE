import * as _ from 'lodash';
import { Component, OnInit } from "@angular/core";
import { GridData } from "../../../_core/domains/data/grid.data";
import { DataType } from "../../../_core/domains/enums/data.type";
import { ActionData } from "../../../_core/domains/data/action.data";
import { GridComponent } from "../../../_core/components/grid/grid.component";
import { MPOProjectHashtagsEntity } from '../../../_core/domains/entities/meeyproject/mpo.project.hashtags.entity';

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class ProjectHashtagsComponent extends GridComponent implements OnInit {
    obj: GridData = {
        Filters: [],
        Imports: [],
        Exports: [],
        Actions: [],
        Features: [
            ActionData.reload(() => this.loadItems()),
        ],
        UpdatedBy: false,
        DisableAutoLoad: true,
        HideCustomFilter: true,
        SearchText: 'Tìm kiếm nhanh tên hashtag...',
        Reference: MPOProjectHashtagsEntity,
    };

    constructor() {
        super();
    }

    async ngOnInit(): Promise<void> {
        this.properties = [
            { Property: 'index', Title: 'STT', Type: DataType.Number, DisableOrder: true, },
            { Property: 'name', Title: 'Tên hashtag', Type: DataType.String, DisableOrder: true },
            { Property: 'createdAt', Title: 'Lần đầu tiên xuất hiện', Type: DataType.DateTime, DisableOrder: true },
            { Property: 'totalUsed', Title: 'Số video sử dụng', Type: DataType.String, DisableOrder: true },
        ];
        this.render(this.obj);
    }

    loadComplete(): void {
        if (this.items && this.items.length > 0) {
            let pagesize = this.itemData.Paging?.Size || 20;
            let pageindex = this.itemData.Paging?.Index || 1;
            this.items.forEach((item: any, index) => {
                item.index = (pagesize * (pageindex - 1)) + (index + 1);
            });
        }
    }
}