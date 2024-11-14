import * as _ from 'lodash';
import { Component, Input, OnInit } from '@angular/core';
import { GridData } from '../../../../_core/domains/data/grid.data';
import { DataType } from '../../../../_core/domains/enums/data.type';
import { ModalSizeType } from '../../../../_core/domains/enums/modal.size.type';
import { GridComponent } from '../../../../_core/components/grid/grid.component';
import { MSMetaSeoEntity } from '../../../../_core/domains/entities/meeyseo/ms.meta.seo.entity';

@Component({
    selector: 'ms-list-tag-history',
    templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class MSMetaSeoHistoryComponent extends GridComponent implements OnInit {
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
        Reference: MSMetaSeoEntity,
        Size: ModalSizeType.ExtraLarge,
    };
    @Input() params: any;

    constructor() {
        super();
        this.properties = [
            {
                Property: '_Id', Title: 'Id', Type: DataType.String, DisableOrder: true,
                Format: (item: any) => {
                    let IdPrev = item['_Id'];
                    let text = "";
                    if (item._Id.length > 6) {
                        let start = item._Id.substring(0, 3);
                        let end = item._Id.slice(-3);
                        //text = start + "..." + end;
                        text = '<p style="min-height: 25px; overflow: visible;"><a style="text-decoration: none !important;" data="' + IdPrev + '" tooltip="Sao chép" flow="right"><i routerlink="copy" class="la la-copy"></i></a> ' + start + "..." + end + '</p>'
                    } else text = '<p style="min-height: 25px; overflow: visible;"><a style="text-decoration: none !important;" data="' + IdPrev + '" tooltip="Sao chép" flow="right"><i routerlink="copy" class="la la-copy"></i></a> ' + item._Id + '</p>'
                    return text;
                }
            },
            {
                Property: 'Action', Title: 'Hành động', Type: DataType.String,
                Format: (item: any) => {
                    let text = '<p>Chỉnh sửa</p>';
                    if (item.Action == 'insert') text = '<p>Thêm mới</p>';
                    return text;
                }
            },
            { Property: 'Content', Title: 'Nội dung', Type: DataType.String, DisableOrder: true },
            { Property: 'CreatedBy', Title: 'Người thực hiện', Type: DataType.String, DisableOrder: true },
            { Property: 'CreatedAt', Title: 'Thời gian', Type: DataType.DateTime },
            { Property: 'IpAddress', Title: 'IP', Type: DataType.String }
        ];
    }

    async ngOnInit() {
        this.setPageSize(50);
        let id = this.params && this.params['id'];
        let type = this.params && this.params['type'];
        this.obj.Url = '/admin/MSMetaSeo/Histories/' + id + '?type=' + type;
        this.render(this.obj);
    }
}