import { Component, OnInit } from "@angular/core";
import { GridData } from "../../../_core/domains/data/grid.data";
import { DataType } from "../../../_core/domains/enums/data.type";
import { ActionData } from "../../../_core/domains/data/action.data";
import { ConstantHelper } from "../../../_core/helpers/constant.helper";
import { GridComponent } from "../../../_core/components/grid/grid.component";
import { M3DChardDashboardComponent } from "../chart.dashboard/3d.chart.dashboard.component";
import { M3DDashboardTourEntity } from "../../../_core/domains/entities/meey3d/m3d.dashboard.entity";


@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html'
  })

export class M3dDashboardComponent extends GridComponent implements OnInit{
    item: any;
    obj: GridData = {
        Filters: [],
        Imports: [],
        Exports: [],
        Actions: [
        
        ],
        Features: [
        ActionData.reload(() => this.loadItems()),
        ],
        UpdatedBy: false,
        DisableAutoLoad: true,
        HideSearch: true,
        // SearchText: 'Tìm theo tên,mô tả...',
        Reference: M3DDashboardTourEntity,
        StatisticalComponent: M3DChardDashboardComponent,
        CustomFilters: ['CreatedAt', 'CategoryId'],
        Url: "admin/M3DDashboard/ListTourDashboard",
    };

    constructor() {
        super()
    }
    ngOnInit() {
        this.properties = [
            { Property: 'Index', Title: 'STT', Type: DataType.Number, DisableOrder: true, Align: 'center' },
            { Property: 'Title', Title: 'Tên Tour 3D', Type: DataType.String, DisableOrder: true,},
            { Property: 'TotalView', Title: 'Lượt xem', Type: DataType.Number, DisableOrder: true,},
            { Property: 'TotalLike', Title: 'Lượt thích', Type: DataType.Number, DisableOrder: true,},
            { Property: 'TotalShare', Title: 'Lượt chia sẻ', Type: DataType.Number, DisableOrder: true,},
            { Property: 'TotalCall', Title: 'Lượt gọi điện', Type: DataType.Number, DisableOrder: true,},
            { Property: 'TotalDevice', Title: 'Người xem', Type: DataType.Number, DisableOrder: true,},
            {
                Property: 'CategoryId', Title: 'Danh mục', Type: DataType.String, DisableOrder: true,
                Format: (item: any) => {
                  if (item.CategoryId != null) {
                    let option = ConstantHelper.M3D_TOUR_CATEGORY_TYPE.find(c => c.value == item.CategoryId);
                    let text = '';
                    if(option != undefined){
                      text = '<p>' + (option && option.label) + '</p>';    
                    }                                    
                    return text;
                  }
                  return '';
                }
            },
            { Property: 'TotalSub', Title: 'Lượt đăng ký tư vấn', Type: DataType.Number, DisableOrder: true,},
          ]
          this.render(this.obj);
    }
    loadComplete(): void {
      if (this.items && this.items.length > 0) {
        let pagesize = this.itemData.Paging?.Size || 20;
        let pageindex = this.itemData.Paging?.Index || 1;
        this.items.forEach((item: any, index) => {
          item.Index = (pagesize * (pageindex - 1)) + (index + 1);
        });
      }
    }
 
}