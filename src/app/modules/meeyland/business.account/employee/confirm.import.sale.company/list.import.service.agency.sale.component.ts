import * as _ from 'lodash';
import { Component, Input, OnInit } from '@angular/core';
import { GridData } from '../../../../../_core/domains/data/grid.data';
import { DataType } from '../../../../../_core/domains/enums/data.type';
import { ConstantHelper } from '../../../../../_core/helpers/constant.helper';
import { ModalSizeType } from '../../../../../_core/domains/enums/modal.size.type';
import { GridComponent } from '../../../../../_core/components/grid/grid.component';
import { MLCompanyImportSaleEntity } from '../../../../../_core/domains/entities/meeyland/ml.company.entity';
import { MLEmployeeImportStatusType } from '../../../../../_core/domains/entities/meeyland/enums/ml.employee.status.type';

@Component({
    selector: 'emloyee-sale-list-import',
    templateUrl: '../../../../../_core/components/grid/grid.component.html',
})
export class MLEmployeeListImportSaleComponent extends GridComponent implements OnInit {
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
        Reference: MLCompanyImportSaleEntity,
    };
    @Input() items: any;

    constructor() {
        super();
        this.properties = [
            { Property: 'Index', Title: 'STT', Type: DataType.String, DisableOrder: true, Align: 'center' },
            { Property: 'Name', Title: 'Họ tên', Type: DataType.String, DisableOrder: true },
            { Property: 'Phone', Title: 'Số điện thoại', Type: DataType.String, DisableOrder: true },
            { Property: 'Email', Title: 'Email', Type: DataType.String, DisableOrder: true },
            {
                Property: 'StatusValue', Title: 'Trạng thái', Type: DataType.String, DisableOrder: true, Align: 'center',
                Format: ((item: MLCompanyImportSaleEntity) => {
                    let text: string = '';
                    if (item.Status != null && item.Status == MLEmployeeImportStatusType.Success) {
                        let option = ConstantHelper.ML_EMPLOYEE_IMPORT_SALE_STATUS_TYPES.find(c => c.value == MLEmployeeImportStatusType.Success);
                        if (option) text = '<p class="' + (option && option.color) + '">' + (option && option.label) + '</p>';
                    }
                    if (item.Status != null && item.Status == MLEmployeeImportStatusType.Error) {
                        let option = ConstantHelper.ML_EMPLOYEE_IMPORT_SALE_STATUS_TYPES.find(c => c.value == MLEmployeeImportStatusType.Error);
                        if (option) text += '<p>' + (option && option.label) + '</p>';
                    }
                    return text;
                }),
            },
            {
                Property: 'Content', Title: 'Ghi chú', Type: DataType.String, DisableOrder: true, Format: ((obj) => {
                    return obj.Content;
                }),
            },
        ];
    }

    async ngOnInit() {
        this.renderItems(this.items);
    }
}