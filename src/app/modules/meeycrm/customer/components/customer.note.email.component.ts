import { Component, Input, OnInit } from "@angular/core";
import { GridData } from "../../../../_core/domains/data/grid.data";
import { DataType } from "../../../../_core/domains/enums/data.type";
import { ActionType } from "../../../../_core/domains/enums/action.type";
import { ConstantHelper } from "../../../../_core/helpers/constant.helper";
import { ModalSizeType } from "../../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../../_core/components/grid/grid.component";
import { MCRMViewNoteEmailComponent } from "../view.note.email/view.note.email.component";
import { MCRMCustomerNoteEmailEntity } from "../../../../_core/domains/entities/meeycrm/mcrm.customer.note.entity";

@Component({
    selector: 'mcrm-customer-note-email',
    templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class MCRMCustomerNoteEmailComponent extends GridComponent implements OnInit {
    obj: GridData = {
        Exports: [],
        Imports: [],
        Filters: [],
        Actions: [
            {
                icon: 'la la-eye',
                name: ActionType.View,
                systemName: ActionType.Empty,
                className: 'btn btn-warning',
                click: (item: any) => {
                    this.dialogService.WapperAsync({
                        cancelText: 'Đóng',
                        objectExtra: {
                            item: item,
                        },
                        title: 'Xem email khách hàng',
                        size: ModalSizeType.ExtraLarge,
                        object: MCRMViewNoteEmailComponent,
                    });
                },
            }
        ],
        IsPopup: true,
        UpdatedBy: true,
        HideSearch: true,
        HideHeadActions: true,
        HideCustomFilter: true,
        Size: ModalSizeType.Small,
        Reference: MCRMCustomerNoteEmailEntity,
    };
    @Input() id: number;
    @Input() leadId: number;

    constructor() {
        super();
        this.properties = [
            {
                Property: 'EmailFrom', Title: 'Người gửi', Type: DataType.String,
                Format: ((item: MCRMCustomerNoteEmailEntity) => {
                    let text = '<p>' + item.EmailFrom + '</p>';
                    return text;
                })
            },
            {
                Property: 'EmailTo', Title: 'Người nhận', Type: DataType.String,
                Format: ((item: MCRMCustomerNoteEmailEntity) => {
                    let text = '<p>' + item.EmailTo + '</p>';
                    if (item.EmailCc) text += '<p>' + item.EmailCc + '</p>';
                    if (item.EmailBcc) text += '<p>' + item.EmailBcc + '</p>';
                    return text;
                })
            },
            { Property: 'Title', Title: 'Tiêu đề', Type: DataType.String },
            {
                Property: 'Status', Title: 'Trạng thái', Type: DataType.String, Align: 'center',
                Format: ((item: MCRMCustomerNoteEmailEntity) => {
                    let text: string = '';
                    let option = ConstantHelper.ML_CUSTOMER_NOTE_EMAIL_STATUS_TYPES.find(c => c.value == item.Status);
                    if (option) text = '<p>' + (option && option.label) + '</p>';
                    return text;
                })
            },
            { Property: 'User', Title: 'Người thực hiện', Type: DataType.String },
        ];
    }

    async ngOnInit() {
        if (this.id) {
            this.obj.Url = '/admin/MCRMCustomerNoteEmail/Items/' + this.id;
        } else if (this.leadId) {
            this.obj.Url = '/admin/MCRMCustomerNoteEmail/LeadItems/' + this.leadId;
        }
        await this.render(this.obj);
    }
}