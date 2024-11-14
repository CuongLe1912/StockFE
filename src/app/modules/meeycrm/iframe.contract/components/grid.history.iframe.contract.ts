import { Component, Input } from '@angular/core';
import { GridData } from '../../../../_core/domains/data/grid.data';
import { ActionData } from '../../../../_core/domains/data/action.data';
import { ModalSizeType } from '../../../../_core/domains/enums/modal.size.type';
import { GridComponent } from '../../../../_core/components/grid/grid.component';
import { ActionType } from '../../../../_core/domains/enums/action.type';
import { MCRMIframeContractEntity } from '../../../../_core/domains/entities/meeycrm/mcrm.ifame.contract.entity';
import { DataType } from '../../../../_core/domains/enums/data.type';
import { UtilityExHelper } from '../../../../_core/helpers/utility.helper';
import { PipeType } from '../../../../_core/domains/enums/pipe.type';
import { ModalViewProfileComponent } from '../../../../_core/modal/view.profile/view.profile.component';

@Component({
    selector: 'mcrm-grid-history-iframe',
    templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class MCRMHistoryIframeComponent extends GridComponent {
    @Input() params: any;

    obj: GridData = {
        Reference: MCRMIframeContractEntity,
        Size: ModalSizeType.Large,
        UpdatedBy: false,
        Imports: [],
        Exports: [],
        Filters: [],
        Features: [],
        Actions: [],
        DisableAutoLoad: true,
        HideCustomFilter: true,
        HideSearch: true,
        NotKeepPrevData: true,
        IsPopup: true,
    };

    id: any;

    constructor() {
        super();
    }

    async ngOnInit() {
        this.id = this.params && this.params['id'];

        this.properties = [
            { Property: 'CreatedDate', Title: 'Thời gian', Type: DataType.DateTime },
            {
                Property: 'Action', Title: 'Tác động', Type: DataType.String,
                Format: (item) => {
                    return item.Action;
                }
            },
            {
                Property: 'Created', Title: 'Người thực hiện', Type: DataType.String,
                Format: ((item: any) => {
                    let text: string = '';
                    if (item.CreatedBy) text += '<p><a routerLink="quickView" type="createby">' + UtilityExHelper.escapeHtml(item.CreatedBy) + '</a></p>';
                    return text;
                })
            },
            { Property: 'Note', Title: 'Ghi chú', Type: DataType.String },
        ]

        this.obj.Url = 'admin/MCRMIframeContract/GetHistory/' + this.id;
        this.render(this.obj);
    }

    quickView(item, type: string) {
        if (type) {
            if (type == 'createby') this.quickViewProfile(item.CreatedById);
        }
    }

    public quickViewProfile(id: number) {
        this.dialogService.WapperAboveAsync({
            cancelText: 'Đóng',
            objectExtra: { id: id },
            size: ModalSizeType.Large,
            title: 'Thông tin tài khoản',
            object: ModalViewProfileComponent,
        });
    }
}