import { Component, Input, OnInit } from "@angular/core";
import { GridData } from "../../../../_core/domains/data/grid.data";
import { DataType } from "../../../../_core/domains/enums/data.type";
import { ToastrHelper } from "../../../../_core/helpers/toastr.helper";
import { ActionData } from "../../../../_core/domains/data/action.data";
import { GridComponent } from "../../../../_core/components/grid/grid.component";
import { MLUserEntity } from "../../../../_core/domains/entities/meeyland/ml.user.entity";

@Component({
  templateUrl: "../../../../_core/components/grid/grid.component.html",
})
export class MCPopupCustomerListServiceComponent extends GridComponent implements OnInit {
  choiceComplete: (ids?: any[]) => void;
  items: any[];
  disabled: boolean;
  obj: GridData = {
    Exports: [],
    Imports: [],
    Filters: [],
    Actions: [],
    DisableAutoLoad: true,
    Features: [
      ActionData.reload(() => { this.loadItems(); }),
    ],
    IsPopup: true,
    Checkable: true,
    UpdatedBy: false,
    Reference: MLUserEntity,
    Title: 'Chọn dịch vụ',
    SearchText: 'Nhập Tên, Mã dịch vụ',
    CustomFilters: ["Status"],
  };
  @Input() listUncheck: any;
  @Input() params: any;

  // @Input() item: MOServicesEntity;

  constructor() {
    super();
  }

  async ngOnInit() {

    this.choiceComplete = this.params && this.params['choiceComplete'];
    this.listUncheck = this.params && this.params['listUncheck'];
    this.items = this.params && this.params['items'];
    
    this.properties = [

      { Property: 'Name', Title: 'Tên khách hàng', Type: DataType.String },
      { Property: 'Phone', Title: 'Số điện thoại', Type: DataType.String },
      { Property: 'Email', Title: 'Email', Type: DataType.String },
      { Property: 'Status', Title: 'Status', Type: DataType.String },
      { Property: 'MeeyId', Title: 'MeeyId', Type: DataType.String },
      { Property: 'Content', Title: 'Nội dung', Type: DataType.String },

    ]
    this.setPageSize(20);
    if(this.items){
      let items = this.items.filter(c => c.Status == 2);
      if (items && items.length > 0) this.disabled = true;
      this.renderItems(this.items);
    }
    else
      this.render(this.obj);
  }
  public async confirm(): Promise<boolean> {
    let checkItems = this.items && this.items.filter(c => c.Checked);
    let cloneItems = this.originalItems && this.originalItems.filter(c => checkItems.map(c => c["MeeyId"]).includes(c["MeeyId"]));
    if (!cloneItems || cloneItems.length == 0) {
      ToastrHelper.Error('Vui lòng chọn ít nhất 1 dịch vụ');
      return;
    }
    if (this.choiceComplete)
      this.choiceComplete(cloneItems);
    return true;

  }


  loadComplete() {
    if (this.listUncheck && this.listUncheck.length > 0) {
      this.items.forEach((item) => {
        let lst = this.listUncheck.find(c => c.MeeyId == item["MeeyId"])
        if ((lst && lst.MeeyId)) {
          item.Checked = true
          this.originalItems.find(c => c["MeeyId"] == lst.MeeyId).Checked = true
        }
      })
    }
  }
}
