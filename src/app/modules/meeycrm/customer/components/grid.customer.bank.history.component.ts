import { Component, Input } from '@angular/core';
import { GridData } from '../../../../_core/domains/data/grid.data';
import { DataType } from '../../../../_core/domains/enums/data.type';
import { UtilityExHelper } from '../../../../_core/helpers/utility.helper';
import { BaseEntity } from '../../../../_core/domains/entities/base.entity';
import { ModalSizeType } from '../../../../_core/domains/enums/modal.size.type';
import { GridComponent } from '../../../../_core/components/grid/grid.component';


@Component({
    templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class MCRMCustomerBankHistoryComponent extends GridComponent {
    @Input() params: any;
    obj: GridData = {
        Reference: BaseEntity,
        Size: ModalSizeType.Large,
        UpdatedBy: false,
        Imports: [],
        Exports: [],
        Filters: [],
        Features: [],
        Actions: [],
        CustomFilters: [],
        HideCustomFilter: true,
        HideSearch: true,
        DisableAutoLoad: true,
        IsPopup: true,
    };

    constructor() {
        super();
    }

    async ngOnInit() {
        let meeyId = this.getParam('meeyId');

        this.properties = [
            { Property: 'createdAt', Title: 'Thời gian thực hiện', Type: DataType.DateTime },
            {
                Property: 'content', Title: 'Nội dung', Type: DataType.String,
                Format: (item) => {
                    if (!item.amount) return '';
                    return 'Cấp phát lượt tra cứu +' + item.amount;
                }
            },
            {
                Property: 'Created', Title: 'Người thực hiện', Type: DataType.String,
                Format: ((item: any) => {
                    let text: string = '';
                    if (item.author) text += '<p><a routerLink="quickView" type="createby">' + UtilityExHelper.escapeHtml(item.author) + '</a></p>';
                    return text;
                })
            },
            { Property: 'note', Title: 'Ghi chú', Type: DataType.String },
        ]
        
        this.obj.Url = '/admin/mcrmcustomer/historyBank/' + meeyId;
        this.render(this.obj);
    }
}