import { Component } from "@angular/core";
import { GridData } from "../../../_core/domains/data/grid.data";
import { ModalSizeType } from "../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../_core/components/grid/grid.component";
import { EditEmployeeComponent } from "./edit.employee/edit.employee.component";
import { MGEmployeeEntity } from "../../../_core/domains/entities/meeygroup/mg.employee.entity";

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class EmployeeComponent extends GridComponent {
    obj: GridData = {
        Imports: [],
        Exports: [],
        Reference: MGEmployeeEntity,
    };

    constructor() {
        super();
        this.render(this.obj);
    }

    addNew() {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: this.obj.Title,
            confirmText: 'Tạo Nhân viên',
            size: ModalSizeType.Medium,
            object: EditEmployeeComponent,
        }, () => this.loadItems());
    }

    edit(item: MGEmployeeEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: this.obj.Title,
            size: ModalSizeType.Medium,
            confirmText: 'Lưu thay đổi',
            objectExtra: { id: item.Id },
            object: EditEmployeeComponent,
        }, () => this.loadItems());
    }

    view(item: MGEmployeeEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: this.obj.Title,
            size: ModalSizeType.Medium,
            object: EditEmployeeComponent,
            objectExtra: { id: item.Id, viewer: true },
        });
    }
}