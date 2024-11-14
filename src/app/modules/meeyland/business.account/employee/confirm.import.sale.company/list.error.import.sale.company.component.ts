import * as _ from 'lodash';
import { Component, Input, OnInit } from '@angular/core';
import { GridData } from '../../../../../_core/domains/data/grid.data';
import { DataType } from '../../../../../_core/domains/enums/data.type';
import { ModalSizeType } from '../../../../../_core/domains/enums/modal.size.type';
import { GridComponent } from '../../../../../_core/components/grid/grid.component';
import { MLEmployeeEntity } from '../../../../../_core/domains/entities/meeyland/ml.employee.entity';

@Component({
    templateUrl: '../../../../../_core/components/grid/grid.component.html',
})
export class MLEmployeeErrorImportSaleComponent extends GridComponent implements OnInit {
    obj: GridData = {
        Imports: [],
        Exports: [],
        Filters: [],
        Actions: [],
        Features: [],
        IsPopup: true,
        HidePaging: true,
        UpdatedBy: false,
        HideSearch: true,
        NotKeepPrevData: true,
        HideHeadActions: true,
        HideCustomFilter: true,
        Reference: MLEmployeeEntity,
        Size: ModalSizeType.ExtraLarge,
    };
    items: any;
    openNumber: number;
    inactiveNumber: number;
    inactionNumber: number;
    @Input() params: any;

    constructor() {
        super();
        this.properties = [
            { Property: 'Name', Title: 'Họ tên', Type: DataType.String, DisableOrder: true },
            { Property: 'Phone', Title: 'Số điện thoại', Type: DataType.String, DisableOrder: true },
            { Property: 'Email', Title: 'Email', Type: DataType.String, DisableOrder: true },
            { Property: 'Notes', Title: 'Nội dung', Type: DataType.String, DisableOrder: true },
        ];
    }

    async ngOnInit() {
        if (this.params) {
            if (this.params) {
                this.items = this.params['items'];

            }
        }
        this.render(this.obj, this.items);
    }
}