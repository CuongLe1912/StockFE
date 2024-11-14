import * as _ from 'lodash';
import { Component, Input, OnInit } from '@angular/core';
import { GridData } from '../../../_core/domains/data/grid.data';
import { DataType } from '../../../_core/domains/enums/data.type';
import { UtilityExHelper } from '../../../_core/helpers/utility.helper';
import { ModalSizeType } from '../../../_core/domains/enums/modal.size.type';
import { GridComponent } from '../../../_core/components/grid/grid.component';
import { MLArticleEntity } from '../../../_core/domains/entities/meeyland/ml.article.entity';

@Component({
    selector: 'ml-list-article-waring-price',
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class MLListArticleWarningPriceComponent extends GridComponent implements OnInit {
    obj: GridData = {
        Imports: [],
        Exports: [],
        Filters: [],
        Actions: [],
        Features: [],
        IsPopup: true,
        UpdatedBy: false,
        HideSearch: true,
        NotKeepPrevData: true,
        HideHeadActions: true,
        HideCustomFilter: true,
        Reference: MLArticleEntity,
        Size: ModalSizeType.ExtraLarge,
    };
    @Input() params: any;

    constructor() {
        super();
        this.properties = [
            { Property: 'DateTime', Title: 'Thời gian', Type: DataType.DateTime },
            { Property: 'Content', Title: 'Nội dung cảnh báo', Type: DataType.String },
            { Property: 'Price', Title: 'Giá đề xuất', Type: DataType.String },
            {
                Property: 'Creator', Title: 'Người cảnh báo', Type: DataType.String,
                Format: ((item: any) => {
                    let text = item.Creator && UtilityExHelper.renderUserInfoFormat(item.Creator.Name, item.Creator.Phone, item.Creator.Email);
                    return text;
                })
            },
        ];
    }

    async ngOnInit() {
        this.setPageSize(50);
        let id = this.params && this.params['id'];
        this.obj.Url = '/admin/MLArticle/WarningPrices/' + id;
        this.render(this.obj);
    }
}