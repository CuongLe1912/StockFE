import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { GridData } from "../../../../_core/domains/data/grid.data";
import { DataType } from "../../../../_core/domains/enums/data.type";
import { ModalSizeType } from "../../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../../_core/components/grid/grid.component";
import { MCRMInvestorEntity } from "../../../../_core/domains/entities/meeycrm/mcrm.investor.entity";

@Component({
    selector: 'mcrm-investor-dealer',
    templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class MCRMDealerGridComponent extends GridComponent implements OnInit, OnDestroy {
    obj: GridData = {
        Exports: [],
        Imports: [],
        Filters: [],
        Actions: [],
        Features: [],
        IsPopup: true,
        UpdatedBy: false,
        HideSearch: true,
        NotKeepPrevData: true,
        HideHeadActions: true,
        HideCustomFilter: true,
        Reference: MCRMInvestorEntity,
        Size: ModalSizeType.ExtraLarge,
        HidePaging: true,
    };
    @Input() params: any;
    @Input() dataGrids: any;
    @Input() orderId: any;
    @Input() providerId: number;
    @Input() isOrderAdmin: boolean;

    itAsynLoad: any;

    constructor() {
        super();
    }

    ngOnDestroy() {
        if (this.itAsynLoad) {
            clearInterval(this.itAsynLoad);
        }
    }

    async ngOnInit() {
        let dataGrids = (this.params && this.params["dataGrids"]) || null;
        let orderId = (this.params && this.params["orderId"]) || null;
        this.orderId = this.orderId | orderId
        let providerId = (this.params && this.params["providerId"]) || null;
        if (!this.providerId) this.providerId = providerId

        if ((this.params && this.params["isOrderAdmin"])) {
            this.isOrderAdmin = (this.params && this.params["isOrderAdmin"]) || false;
        }

        if (this.isOrderAdmin) this.obj.Actions = []

        this.properties = [
            {
                Property: 'Index', Title: 'STT', Type: DataType.String, DisableOrder: true,
            },
            {
                Property: 'DealerName', Title: 'Tên đại lý', Type: DataType.String, DisableOrder: true,
            },
            {
                Property: 'RepresentativeName', Title: 'Người đại diện', Type: DataType.String, DisableOrder: true,
            },
            {
                Property: 'Phone', Title: 'Số điện thoại', Type: DataType.String, DisableOrder: true,
            },
            {
                Property: 'Email', Title: 'Email', Type: DataType.DropDown, DisableOrder: true,
            },
            {
                Property: 'Status', Title: 'Trạng thái', Type: DataType.String, DisableOrder: true,
            },
            {
                Property: 'SaleId', Title: 'NV chăm sóc', Type: DataType.String, DisableOrder: true,
            },
        ]
        // if (dataGrids) {
        //     this.dataGrids = this.dataGrids | dataGrids
        // }
        // this.dataGrids.forEach((item, i) => {
        //     item.Index = i + 1;
        // });
        this.render(this.obj);
    }
}