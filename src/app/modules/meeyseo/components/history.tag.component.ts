import * as _ from 'lodash';
import { Component, Input, OnInit } from '@angular/core';
import { GridData } from '../../../_core/domains/data/grid.data';
import { DataType } from '../../../_core/domains/enums/data.type';
import { OptionItem } from '../../../_core/domains/data/option.item';
import { ConstantHelper } from '../../../_core/helpers/constant.helper';
import { ModalSizeType } from '../../../_core/domains/enums/modal.size.type';
import { GridComponent } from '../../../_core/components/grid/grid.component';
import { MSSeoEntity } from '../../../_core/domains/entities/meeyseo/ms.seo.entity';

@Component({
    selector: 'ms-list-tag-history',
    styleUrls: ['./history.tag.component.scss'],
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class MSListTagHistoryComponent extends GridComponent implements OnInit {
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
        Reference: MSSeoEntity,
        Size: ModalSizeType.ExtraLarge,
    };
    @Input() params: any;

    constructor() {
        super();
        this.properties = [
            {
                Property: 'Id', Title: 'Id', Type: DataType.String, DisableOrder: true,
            },
            {
                Property: 'Action', Title: 'Hành động', Type: DataType.String,
                Format: (item: any) => {
                    let option: OptionItem = ConstantHelper.MS_TAG_ACTION_TYPES.find(c => c.value == item.Action);
                    let text = '<p>' + (option && option.label) + '</p>';
                    return text;
                }
            },
            { Property: 'Content', Title: 'Nội dung', Type: DataType.String },
            { Property: 'Creator', Title: 'Người thực hiện', Type: DataType.String },
            { Property: 'DateTime', Title: 'Thời gian', Type: DataType.DateTime },
            { Property: 'IP', Title: 'IP', Type: DataType.String }
        ];
    }

    async ngOnInit() {
        this.setPageSize(50);
        let id = this.params && this.params['id'];
        this.obj.Url = '/admin/MSSeo/Histories/' + id;
        this.render(this.obj);
    }
}