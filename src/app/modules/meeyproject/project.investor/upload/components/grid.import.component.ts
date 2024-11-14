import * as _ from 'lodash';
import { formatDate } from '@angular/common';
import { HttpEventType } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { GridData } from '../../../../../_core/domains/data/grid.data';
import { DataType } from '../../../../../_core/domains/enums/data.type';
import { ResultApi } from '../../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../../_core/helpers/toastr.helper';
import { MethodType } from '../../../../../_core/domains/enums/method.type';
import { ModalSizeType } from '../../../../../_core/domains/enums/modal.size.type';
import { GridComponent } from '../../../../../_core/components/grid/grid.component';
import { BaseEntity } from '../../../../../_core/domains/entities/base.entity';

@Component({
    templateUrl: '../../../../../_core/components/grid/grid.component.html',
})
export class MPOGridImportInvestorComponent extends GridComponent implements OnInit {
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
        Reference: BaseEntity,
    };

    constructor() {
        super();
    }

    async ngOnInit() {
        this.properties = [
            {
                Property: 'index', Title: 'STT', Type: DataType.String, DisableOrder: true,
            },
            {
                Property: 'name', Title: 'Tên chủ đầu tư', Type: DataType.String, DisableOrder: true,
            },
            {
                Property: 'description', Title: 'Giới thiệu', Type: DataType.String, DisableOrder: true,
            },
            {
                Property: 'message', Title: 'Mô tả', Type: DataType.String, DisableOrder: true,
                Format: (item: any) => {
                    let text = '';
                    if (item?._id) {
                        text = '<p class="kt-badge kt-badge--inline kt-badge--success" title="Hợp lệ">Hợp lệ</p>';
                    } else {
                        let error = 'Dòng ' + item.STT + ': ' + item.error;
                        text = '<p class="text-danger" title= "' + error + '">' + error + '</p>';
                    }

                    return text;
                }
            },
        ];
        let items = this.params && this.params['items'];
        if (items && items.length > 0) {
            items.forEach((item: any, index) => {
                if (item) item.index = index + 1;
            });
        }
        this.render(this.obj, items);
    }
}
