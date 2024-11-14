import * as _ from 'lodash';
import { Component, OnInit } from "@angular/core";
import { GridData } from "../../../_core/domains/data/grid.data";
import { DataType } from "../../../_core/domains/enums/data.type";
import { PipeType } from '../../../_core/domains/enums/pipe.type';
import { ActionData } from "../../../_core/domains/data/action.data";
import { GridComponent } from "../../../_core/components/grid/grid.component";
import { NavigationStateData } from '../../../_core/domains/data/navigation.state';
import { MPOProjectCustomerEntity } from "../../../_core/domains/entities/meeyproject/mpo.project.customer.entity";

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class ProjectCustomerComponent extends GridComponent implements OnInit {
    obj: GridData = {
        Filters: [],
        Imports: [],
        Exports: [],
        Actions: [
            ActionData.viewDetail((item: any) => this.view(item)),
        ],
        Features: [
            ActionData.reload(() => this.loadItems()),
        ],
        UpdatedBy: false,
        DisableAutoLoad: true,
        HideCustomFilter: true,
        ReferenceName: 'mpocustomer',
        Reference: MPOProjectCustomerEntity,
        SearchText: 'Tìm kiếm theo tên KH, Meey Id, số điện thoại',
    };

    constructor() {
        super();
    }

    async ngOnInit(): Promise<void> {
        this.properties = [
            { Property: 'Index', Title: 'STT', Type: DataType.Number, DisableOrder: true, Align: 'center' },
            { Property: 'Name', Title: 'Tên khách hàng', Type: DataType.String, DisableOrder: true },
            { Property: 'MeeyId', Title: 'Meey Id', Type: DataType.String, DisableOrder: true },
            { Property: 'Phone', Title: 'Số điện thoại', Type: DataType.String, DisableOrder: true },
            { Property: 'Role', Title: 'Nhóm quyền', Type: DataType.String, DisableOrder: true },
            { Property: 'FirstLogin', Title: 'Đăng nhập lần đầu', Type: DataType.DateTime, DisableOrder: true, PipeType: PipeType.DateTime },
            { Property: 'LastLogin', Title: 'Đăng nhập gần nhất', Type: DataType.DateTime, DisableOrder: true, PipeType: PipeType.DateTime },
        ];
        this.render(this.obj);
    }

    view(item: any) {
        let obj: NavigationStateData = {
            id: item.MeeyId,
            viewer: true,
            prevUrl: '/admin/mpoproject/customer',
        };
        this.router.navigate(['/admin/mpoproject/customer/view'], { state: { params: JSON.stringify(obj) } });
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