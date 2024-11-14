import { Component, Input, OnInit } from "@angular/core";
import { GridData } from "../../../../_core/domains/data/grid.data";
import { DataType } from "../../../../_core/domains/enums/data.type";
import { MCRMAddNoteComponent } from "../add.note/add.note.component";
import { ActionType } from "../../../../_core/domains/enums/action.type";
import { ModalSizeType } from "../../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../../_core/components/grid/grid.component";
import { MCRMCustomerEntity } from "../../../../_core/domains/entities/meeycrm/mcrm.customer.entity";
import { MCRMCustomerNoteEntity } from "../../../../_core/domains/entities/meeycrm/mcrm.customer.note.entity";

@Component({
    selector: 'mcrm-customer-note',
    templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class MCRMCustomerNoteComponent extends GridComponent implements OnInit {
    obj: GridData = {
        Exports: [],
        Imports: [],
        Filters: [],
        Actions: [
            {
                icon: 'la la-pencil',
                name: ActionType.Edit,
                systemName: ActionType.Empty,
                className: 'btn btn-primary',
                click: (item: any) => {
                    this.edit(item);
                }
            },
            {
                icon: 'la la-trash',
                name: ActionType.Delete,
                className: 'btn btn-danger',
                systemName: ActionType.Empty,
                click: (item: any) => {
                    this.delete(item);
                }
            }
        ],
        IsPopup: true,
        UpdatedBy: true,
        HideSearch: true,
        HideHeadActions: true,
        HideCustomFilter: true,
        Size: ModalSizeType.Small,
        Reference: MCRMCustomerNoteEntity,
    };
    @Input() id: number;
    @Input() leadId: number;
    @Input() hideAction: boolean;
    @Input() customer: MCRMCustomerEntity;

    constructor() {
        super();
        this.properties = [
            { Property: 'Phone', Title: 'Số điện thoại', Type: DataType.String },
            { Property: 'Note', Title: 'Nội dung', Type: DataType.String },
        ];
    }

    async ngOnInit() {
        if (this.id) {
            this.obj.Url = '/admin/MCRMCustomerNote/Items/' + this.id;
        } else if (this.leadId) {
            this.obj.Url = '/admin/MCRMCustomerNote/LeadItems/' + this.leadId;
        }
        if (this.hideAction) this.obj.Actions = [];
        await this.render(this.obj);
    }

    edit(item: MCRMCustomerNoteEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Hủy',
            confirmText: 'Xác nhận',
            size: ModalSizeType.Large,
            object: MCRMAddNoteComponent,
            objectExtra: { item: this.customer, note: item },
            title: 'Thêm/sửa ghi chú khách hàng [' + this.customer.Code + ']',
        }, async () => {
            this.loadItems();
        });
    }
}