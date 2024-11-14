import * as _ from 'lodash';
import { Component, Input, OnInit } from '@angular/core';
import { GridData } from '../../../_core/domains/data/grid.data';
import { DataType } from '../../../_core/domains/enums/data.type';
import { UtilityExHelper } from '../../../_core/helpers/utility.helper';
import { ModalSizeType } from '../../../_core/domains/enums/modal.size.type';
import { GridComponent } from '../../../_core/components/grid/grid.component';
import { MLArticleEntity } from '../../../_core/domains/entities/meeyland/ml.article.entity';

@Component({
    selector: 'ml-list-article-history',
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class MLListArticleHistoryComponent extends GridComponent implements OnInit {
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
            {
                Property: 'MeeyId', Title: 'Id', Type: DataType.String,
                Format: (item: any) => {
                    return UtilityExHelper.renderIdFormat(null, item.MeeyId);
                }
            },
            { Property: 'Action', Title: 'Hành động', Type: DataType.String },
            { Property: 'Content', Title: 'Nội dung', Type: DataType.String },
            {
                Property: 'Images', Title: 'Hình ảnh', Type: DataType.String, Align: 'center',
                Format: (item: any) => {
                    let text: string = '';
                    if (item.Images && item.Images.length > 0) {
                        let image = item.Images[0];
                        text += '<p><img style="width: 60px; margin-right: 10px;" src="' + image + '" /></p>';
                        if (item.Images.length >= 2) {
                            text += '<p style="margin-top: 5px;">';
                            text += '<a routerLink="quickView" type="image">' + item.Images.length + ' ảnh</a>';
                            text += '</p>';
                        }

                    }
                    return text;
                }
            },
            { Property: 'Creator', Title: 'Người thực hiện', Type: DataType.String },
            { Property: 'DateTime', Title: 'Thời gian', Type: DataType.DateTime },
            { Property: 'IP', Title: 'IP', Type: DataType.String }
        ];
    }

    async ngOnInit() {
        this.setPageSize(50);
        let id = this.params && this.params['id'];
        this.obj.Url = '/admin/MLArticle/Histories/' + id;
        this.render(this.obj);
    }
}