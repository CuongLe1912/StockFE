import { Component } from "@angular/core";
import { GridData } from "../../../_core/domains/data/grid.data";
import { EditOfficeComponent } from "./edit.office/edit.office.component";
import { ModalSizeType } from "../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../_core/components/grid/grid.component";
import { MGOfficeEntity } from "../../../_core/domains/entities/meeygroup/mg.office.entity";

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class OfficeComponent extends GridComponent {
    obj: GridData = {
        Imports: [],
        Exports: [],
        Reference: MGOfficeEntity,
    };

    constructor() {
        super();
        this.render(this.obj);
    }

    addNew() {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: this.obj.Title,
            size: ModalSizeType.Large,
            object: EditOfficeComponent,
            confirmText: 'Tạo Văn phòng',
        }, () => this.loadItems());
    }

    edit(item: MGOfficeEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: this.obj.Title,
            size: ModalSizeType.Large,
            confirmText: 'Lưu thay đổi',
            objectExtra: { id: item.Id },
            object: EditOfficeComponent,
        }, () => this.loadItems());
    }

    view(item: MGOfficeEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: this.obj.Title,
            size: ModalSizeType.Large,
            object: EditOfficeComponent,
            objectExtra: { id: item.Id, viewer: true },
        });
    }
}