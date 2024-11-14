import { Component, OnInit } from "@angular/core";
import { GridData } from "../../../_core/domains/data/grid.data";
import { DataType } from "../../../_core/domains/enums/data.type";
import { ActionData } from "../../../_core/domains/data/action.data";
import { GridComponent } from "../../../_core/components/grid/grid.component";
import { MPOContributesEntity } from "../../../_core/domains/entities/meeyproject/mpo.contributes.entity";

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class ProjectContributeComponent extends GridComponent implements OnInit {
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
        Reference: MPOContributesEntity,
        SearchText: 'Nhập tên, số điện thoại',
    };

    constructor() {
        super();
    }

    async ngOnInit(): Promise<void> {
        this.properties = [
            { Property: 'Index', Title: 'STT', Type: DataType.Number, DisableOrder: true, Align: 'center' },
            { Property: 'Name', Title: 'Tên dự án', Type: DataType.String, DisableOrder: true },
            { Property: 'Phone', Title: 'Số điện thoại', Type: DataType.String, DisableOrder: true },
            { Property: 'Content', Title: 'Miêu tả', Type: DataType.String, DisableOrder: true },
            { Property: 'CreatedBy', Title: 'Người tạo', Type: DataType.String, DisableOrder: true },
            { Property: 'CreatedAt', Title: 'Ngày tạo', Type: DataType.DateTime, DisableOrder: true },
            { Property: 'UpdatedBy', Title: 'Người cập nhật', Type: DataType.String, DisableOrder: true },
            { Property: 'UpdatedAt', Title: 'Ngày cập nhật', Type: DataType.DateTime, DisableOrder: true },
        ];
        this.render(this.obj);
    }
}