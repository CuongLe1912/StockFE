declare var $;
import * as _ from 'lodash';
import { Component, Input, OnInit } from '@angular/core';
import { GridData } from '../../../../../_core/domains/data/grid.data';
import { ActionData } from '../../../../../_core/domains/data/action.data';
import { GridComponent } from '../../../../../_core/components/grid/grid.component';
import { MCRMSaleAssignConfigHistoryEntity } from '../../../../../_core/domains/entities/meeycrm/MCRMSaleAssignConfigHistory.entity';
@Component({
    templateUrl: '../../../../../_core/components/grid/grid.component.html',
    styleUrls: ['./show.history.component.scss'],
})
export class MCRMShowHistoryComponent extends GridComponent implements OnInit {
    @Input() params: any;
    actions: ActionData[] = [];
    loading: boolean = true;
    @Input() id: number;
    obj: GridData = {
        Imports: [],
        Exports: [],
        Filters: [],
        Actions: [],
        Features: [],
        IsPopup: true,
        HideSearch: true,
        UpdatedBy: false,
        DisableAutoLoad: true,
        Reference: MCRMSaleAssignConfigHistoryEntity,
      };
    constructor() {
        super();
    }
    ngOnInit() {
        this.loading = false;
        this.properties = [
            { Property: 'Action' },
            { Property: 'Detail',Format: ((item: any) => {
                return item.Detail;
              })},
            { Property: 'Note' },
            { Property: 'CreatedDate', Title:'Thực hiện',Format: ((item: any) => {
                return item.User + ' ' + item.CreatedDateHistory;
              }) },
        ];
        this.obj.Url = '/admin/MCRMAssignSaleConfigHistory/Items';
        this.render(this.obj);
    }
}