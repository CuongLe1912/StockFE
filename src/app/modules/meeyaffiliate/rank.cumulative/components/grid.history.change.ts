import { Component, OnInit } from "@angular/core";
import { GridData } from "../../../../_core/domains/data/grid.data";
import { DataType } from "../../../../_core/domains/enums/data.type";
import { BaseEntity } from "../../../../_core/domains/entities/base.entity";
import { GridComponent } from "../../../../_core/components/grid/grid.component";

@Component({
  selector: 'mo-service-grid',
  templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class MAFGridHistoryChangeComponent extends GridComponent implements OnInit {
  obj: GridData = {
    Exports: [],
    Imports: [],
    Filters: [],
    Actions: [],
    DisableAutoLoad: true,
    Features: [],
    IsPopup: true,
    UpdatedBy: false,
    Reference: BaseEntity,
    Title: 'Lịch sử thay đổi',
    HideCustomFilter: true,
    HideSearch: true,
  };

  constructor() {
    super();
  }

  ngOnInit() {
    this.properties = [
      { Property: 'DateTime', Title: 'Thời gian', Type: DataType.DateTime },
      { Property: 'CreatedBy', Title: 'Người thực hiện', Type: DataType.String },
      {
        Property: 'Content', Title: 'Nội dung', Type: DataType.String,
        Format: (item) => {
          {
            return item.Content;
          }
        }
      },
    ]
    this.obj.Url = '/admin/MAFRankCumulative/HistoryItems';
    this.render(this.obj);
  }

}