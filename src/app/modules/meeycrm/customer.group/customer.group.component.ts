import { Component } from "@angular/core";
import { GridData } from "../../../_core/domains/data/grid.data";
import { DataType } from "../../../_core/domains/enums/data.type";
import { ModalSizeType } from "../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../_core/components/grid/grid.component";
import { MCRMCustomerGroupEntity } from "../../../_core/domains/entities/meeycrm/mcrm.customer.group.entity";

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class MCRMCustomerGroupComponent extends GridComponent {
    obj: GridData = {
        Exports: [],
        Imports: [],
        Size: ModalSizeType.Medium,
        Reference: MCRMCustomerGroupEntity,
    };

    constructor() {
        super();
        this.properties = [
            { Property: 'Id', Title: 'Id', Type: DataType.Number },
            { Property: 'Name', Type: DataType.String },
            { Property: 'Description', Type: DataType.String },
        ];
        this.render(this.obj);
    }
}