import { Component, Input, OnInit } from "@angular/core";
import { GridData } from "../../../../_core/domains/data/grid.data";
import { DataType } from "../../../../_core/domains/enums/data.type";
import { ConstantHelper } from "../../../../_core/helpers/constant.helper";
import { ModalSizeType } from "../../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../../_core/components/grid/grid.component";
import { MCRMCustomerNoteCallEntity } from "../../../../_core/domains/entities/meeycrm/mcrm.customer.note.entity";

@Component({
    selector: 'mcrm-customer-note-call',
    templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class MCRMCustomerNoteCallComponent extends GridComponent implements OnInit {
    obj: GridData = {
        Exports: [],
        Imports: [],
        Filters: [],
        Actions: [],
        IsPopup: true,
        UpdatedBy: true,
        HideSearch: true,
        HideHeadActions: true,
        HideCustomFilter: true,
        Size: ModalSizeType.Small,
        Reference: MCRMCustomerNoteCallEntity,
    };
    @Input() id: number;

    constructor() {
        super();
        this.properties = [
            { Property: 'Phone', Title: 'Số điện thoại', Type: DataType.String },
            { Property: 'Note', Title: 'Nội dung', Type: DataType.String },
            {
                Property: 'Type', Title: 'Loại', Type: DataType.String, Align: 'center',
                Format: ((item: MCRMCustomerNoteCallEntity) => {
                    let text: string = '';
                    let option = ConstantHelper.ML_CUSTOMER_NOTE_CALL_TYPES.find(c => c.value == item.Type);
                    if (option) text = '<p>' + (option && option.label) + '</p>';
                    return text;
                })
            },
            {
                Property: 'Status', Title: 'Trạng thái', Type: DataType.String, Align: 'center',
                Format: ((item: MCRMCustomerNoteCallEntity) => {
                    let text: string = '';
                    let option = ConstantHelper.ML_CUSTOMER_NOTE_CALL_STATUS_TYPES.find(c => c.value == item.Status);
                    if (option) text = '<p>' + (option && option.label) + '</p>';
                    return text;
                })
            },
            { Property: 'ConnectTime', Title: 'Thời gian kết nối', Type: DataType.String },
            { Property: 'User', Title: 'Người thực hiện', Type: DataType.String },
        ];
    }

    async ngOnInit() {
        if (this.id) {
            this.obj.Url = '/admin/MCRMCustomerNoteCall/Items/' + this.id;
        }
        await this.render(this.obj);
    }
}