import { GridData } from "../../../../_core/domains/data/grid.data";
import { DataType } from "../../../../_core/domains/enums/data.type";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ActionType } from "../../../../_core/domains/enums/action.type";
import { GridComponent } from "../../../../_core/components/grid/grid.component";
import { MLUserEntity } from "../../../../_core/domains/entities/meeyland/ml.user.entity";

@Component({
    selector: 'mc-grid-customerlistservice',
    templateUrl: "../../../../_core/components/grid/grid.component.html",
})
export class MCGridCustomerListServiceComponent extends GridComponent {
    allowViewDetail: boolean = true;
    obj: GridData = {
        Imports: [],
        Exports: [],
        Filters: [],
        IsPopup: true,
        Checkable: true,
        UpdatedBy: false,
        HideSearch: true,
        HidePaging: true,
        DisableAutoLoad: true,
        NotKeepPrevData: false,
        HideCustomFilter: true,
        Reference: MLUserEntity,
        Features: [
            {
                hide: true,
                icon: 'la la-trash',
                toggleCheckbox: true,
                name: ActionType.Delete,
                className: 'btn btn-danger',
                systemName: ActionType.Empty,
                click: () => {
                    let items = this.originalItems.filter(c => c.Checked);
                    this.deleteChoices(items);
                }
            },
        ],
        Actions: [
            {
                icon: 'la la-trash',
                name: ActionType.Delete,
                className: 'btn btn-danger',
                systemName: ActionType.Empty,
                click: (item: any) => this.delete(item)
            },
        ],
    };
    @Input() items: any[];
    @Output() deleted: EventEmitter<any[]> = new EventEmitter<any[]>();

    constructor() {
        super();
    }
    async ngOnInit() {
        this.properties = [
            { Property: 'Name', Title: 'Tên khách hàng', Type: DataType.String },
            { Property: 'Phone', Title: 'Số điện thoại', Type: DataType.String },
            { Property: 'Email', Title: 'Email', Type: DataType.String },
            { Property: 'Status', Title: 'Status', Type: DataType.String },
            { Property: 'MeeyId', Title: 'MeeyId', Type: DataType.String },
            //{ Property: 'Name', Title: 'Tên dịch vụ', Type: DataType.String },
        ]
        await this.render(this.obj, this.items);
    }

    delete(item: any): void {
        this.items = this.items.filter(c => c.MeeyId != item.MeeyId);
        this.deleted.emit(this.items);
    }

    deleteChoices(items: any[]) {
        this.items = this.items.filter(c => items.findIndex(p => p.MeeyId == c.MeeyId) == -1);
        this.deleted.emit(this.items);
    }
}
