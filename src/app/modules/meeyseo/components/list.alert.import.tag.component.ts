import * as _ from 'lodash';
import { Component, Input, OnInit } from '@angular/core';
import { GridData } from '../../../_core/domains/data/grid.data';
import { DataType } from '../../../_core/domains/enums/data.type';
import { ModalSizeType } from '../../../_core/domains/enums/modal.size.type';
import { GridComponent } from '../../../_core/components/grid/grid.component';
import { MSConfirmImportEntity } from '../../../_core/domains/entities/meeyseo/ms.seo.entity';

@Component({
    selector: 'ms-list-alert-import-tag',
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class MSListAlertImportTagComponent extends GridComponent implements OnInit {
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
        Size: ModalSizeType.ExtraLarge,
        Reference: MSConfirmImportEntity,
    };
    @Input() items: any;

    constructor() {
        super();
        this.properties = [
            {
                Property: 'index', Title: 'STT', DisableOrder: true, Type: DataType.Number,
            },
            {
                Property: 'name', Title: 'Tag', DisableOrder: true, Type: DataType.String,
            },
            { Property: 'description', Title: 'Mô tả', DisableOrder: true, Type: DataType.String },
        ];
    }

    async ngOnInit() {
        this.renderItems(this.items);
    }
}