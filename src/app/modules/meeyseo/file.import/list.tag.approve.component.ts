import * as _ from 'lodash';
import { Component, Input, OnInit } from '@angular/core';
import { GridData } from '../../../_core/domains/data/grid.data';
import { DataType } from '../../../_core/domains/enums/data.type';
import { ModalSizeType } from '../../../_core/domains/enums/modal.size.type';
import { GridComponent } from '../../../_core/components/grid/grid.component';
import { MSConfirmImportEntity } from '../../../_core/domains/entities/meeyseo/ms.seo.entity';

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class MSListTagApproveComponent extends GridComponent implements OnInit {
    fileId: string;
    disabled: boolean;
    processing: boolean;
    @Input() params: any;
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

    constructor() {
        super();
        this.properties = [
            {
                Property: '_id', Title: 'ID', Type: DataType.String, DisableOrder: true,
            },
            {
                Property: 'name', Title: 'Tags', Type: DataType.String, DisableOrder: true,
            },
            {
                Property: 'errorDescription', Title: 'Mô tả', Type: DataType.String, DisableOrder: true,
                Format: (item: any) => {
                    let text = '';
                    let color = 'blue';
                    if (item.errorDescription !== null) {
                        color = 'red';
                    }
                    text = '<p style="color: ' + color + '" title= "' + item.errorDescription + '">' + (item.errorDescription !== null ? 'Lỗi: ' + item.errorDescription : 'Thành công') + '</p>';
                    return text;
                }
            },
        ];
    }

    async ngOnInit() {
        let items = this.params && this.params['items'],
            statisticals = this.params && this.params['statisticals'];
        this.renderItems(items, statisticals);
    }
}
