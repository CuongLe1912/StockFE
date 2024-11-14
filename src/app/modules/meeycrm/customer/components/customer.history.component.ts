import { Component, Input, OnInit } from "@angular/core";
import { GridData } from "../../../../_core/domains/data/grid.data";
import { DataType } from "../../../../_core/domains/enums/data.type";
import { ConstantHelper } from "../../../../_core/helpers/constant.helper";
import { ModalSizeType } from "../../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../../_core/components/grid/grid.component";
import { MCRMCustomerHistoryEntity, MCRMCustomerLeadHistoryEntity } from "../../../../_core/domains/entities/meeycrm/mcrm.customer.history.entity";

@Component({
    selector: 'mcrm-customer-history',
    templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class MCRMCustomerHistoryComponent extends GridComponent implements OnInit {
    obj: GridData = {
        Exports: [],
        Imports: [],
        Filters: [],
        Actions: [],
        IsPopup: true,
        UpdatedBy: true,
        HideSearch: true,
        HidePaging: true,
        HideHeadActions: true,
        HideCustomFilter: true,
        Size: ModalSizeType.Small,
        Reference: MCRMCustomerHistoryEntity,
    };
    @Input() id: number;
    @Input() params: any;
    @Input() leadId: number;

    constructor() {
        super();
        this.properties = [
            { Property: 'Id', Title: 'Id', Type: DataType.Number },
            {
                Property: 'Action', Title: 'Hành động', Type: DataType.String,
                Format: ((item: any) => {
                    let text: string = '';
                    if (item.Action != null && item.Action != undefined) {
                        let option = this.leadId 
                            ? ConstantHelper.ML_CUSTOMER_LEAD_ACTION_TYPES.find(c => c.value == item.Action)
                            : ConstantHelper.ML_CUSTOMER_ACTION_TYPES.find(c => c.value == item.Action);
                        if (option) text = '<p>' + (option && option.label) + '</p>';
                    }
                    return text;
                })
            },
            {
                Property: 'StatusBefore', Title: 'Trạng thái trước', Type: DataType.String, Align: 'center',
                Format: ((item: any) => {
                    let text: string = '';
                    if (item.StatusBefore != null && item.StatusBefore != undefined) {
                        let option = this.leadId 
                            ? ConstantHelper.ML_CUSTOMER_LEAD_STATUS_TYPES.find(c => c.value == item.StatusBefore)
                            : ConstantHelper.ML_CUSTOMER_STATUS_TYPES.find(c => c.value == item.StatusBefore);
                        if (option) text = '<p class="' + (option && option.color) + '">' + (option && option.label) + '</p>';
                    }
                    return text;
                })
            },
            {
                Property: 'StatusAfter', Title: 'Trạng thái sau', Type: DataType.String, Align: 'center',
                Format: ((item: any) => {
                    let text: string = '';
                    if (item.StatusAfter != null && item.StatusAfter != undefined) {
                        let option = this.leadId 
                            ? ConstantHelper.ML_CUSTOMER_LEAD_STATUS_TYPES.find(c => c.value == item.StatusAfter)
                            : ConstantHelper.ML_CUSTOMER_STATUS_TYPES.find(c => c.value == item.StatusAfter);
                        if (option) text = '<p class="' + (option && option.color) + '">' + (option && option.label) + '</p>';
                    }
                    return text;
                })
            },
            {
                Property: 'Detail', Title: 'Chi tiết', Type: DataType.String,
                Format: ((item: MCRMCustomerHistoryEntity) => {
                    return item.Detail;
                })
            },
        ];
    }

    async ngOnInit() {
        this.id = this.id || this.getParam('id');
        if (this.id) {
            this.obj.Url = '/admin/MCRMCustomerHistory/Items/' + this.id;
        } else {
            this.obj.Reference = MCRMCustomerLeadHistoryEntity;
            this.leadId = this.leadId || this.getParam('leadId');
            if (this.leadId) {
                this.obj.Url = '/admin/MCRMCustomerLeadHistory/Items/' + this.leadId;
            }
        }
        await this.render(this.obj);
    }
}