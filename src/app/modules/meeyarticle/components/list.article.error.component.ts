import * as _ from 'lodash';
import { Component, Input, OnInit } from '@angular/core';
import { GridData } from '../../../_core/domains/data/grid.data';
import { DataType } from '../../../_core/domains/enums/data.type';
import { ModalSizeType } from '../../../_core/domains/enums/modal.size.type';
import { GridComponent } from '../../../_core/components/grid/grid.component';
import { MLArticleEntity } from '../../../_core/domains/entities/meeyland/ml.article.entity';

@Component({
    selector: 'ml-list-article-error',
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class MLListArticleErrorComponent extends GridComponent implements OnInit {
    obj: GridData = {
        Imports: [],
        Exports: [],
        Filters: [],
        Actions: [],
        Features: [],
        IsPopup: true,
        UpdatedBy: false,
        HideSearch: true,
        HidePaging: true,
        NotKeepPrevData: true,
        HideHeadActions: true,
        HideCustomFilter: true,
        Reference: MLArticleEntity,
        Size: ModalSizeType.ExtraLarge,
    };
    @Input() items: MLArticleEntity[];

    constructor() {
        super();
        this.properties = [
            { Property: 'Index', Title: 'STT', Type: DataType.Number, Align: 'center', ColumnWidth: 80 },
            { Property: 'Code', Title: 'Mã tin', Type: DataType.String, Align: 'center', ColumnWidth: 120 },
            { Property: 'Title', Title: 'Tiêu đề', Type: DataType.String },
            { Property: 'Status', Title: 'Trạng thái', Type: DataType.String },
            { Property: 'Reason', Title: 'Lý do', Type: DataType.String }
        ];
    }

    async ngOnInit() {
        this.render(this.obj, this.items);
    }
}