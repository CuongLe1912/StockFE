import * as _ from 'lodash';
import { Component, Input, OnInit } from "@angular/core";
import { GridData } from '../../../_core/domains/data/grid.data';
import { DataType } from '../../../_core/domains/enums/data.type';
import { GridComponent } from '../../../_core/components/grid/grid.component';
import { MMLookupHistoryAssignEntity } from '../../../_core/domains/entities/meeymap/mm.lookup.history.assign.entity';

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class MLLookHistoryAssignComponent extends GridComponent implements OnInit {
    @Input() params: any;
    obj: GridData = {
        Actions: [],
        IsPopup: true,
        UpdatedBy: false,
        HideSearch: true,
        NotKeepPrevData: true,
        HideHeadActions: true,
        Reference: MMLookupHistoryAssignEntity
    };

    constructor() {
        super();
    }

    async ngOnInit() {
        let id = this.params && this.params['id'];
        this.itemData = {
            Paging: {
                Index: 1,
                Size: 10000,
            }
        };
        this.properties = [
            {
                Property: 'CreatedBy', Title: 'Người thao tác', Type: DataType.String,
                Format: (item: any) => {
                    return this.replaceEmail(item.CreatedBy);
                }
            },
            {
                Property: 'FromUser', Title: 'NV trước thay thế', Type: DataType.String,
                Format: (item: any) => {
                    return this.replaceEmail(item.FromUser);
                }
            },
            {
                Property: 'ToUser', Title: 'NV sau thay thế', Type: DataType.String,
                Format: (item: any) => {
                    return this.replaceEmail(item.ToUser);
                }
            },
            { Property: 'CreatedDate', Title: 'Thời gian thay thế', Type: DataType.DateTime },
        ];
        this.obj.Url = '/admin/MMLookupHistory/HistoryAssign/' + id;
        this.render(this.obj);
    }

    private replaceEmail(email: string): string {
        if (email) {
            return email.replace('@xvnd.com', '')
                .replace('@mailinator.com', '')
                .replace('@meeyland.com', '')
                .replace('@maildrop.cc', '')
                .replace('@gmail.com', '');
        }
        return '';
    }
}