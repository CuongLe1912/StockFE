import { Component } from "@angular/core";
import { GridData } from "../../../_core/domains/data/grid.data";
import { EditPageComponent } from "./edit.page/edit.page.component";
import { ModalSizeType } from "../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../_core/components/grid/grid.component";
import { MGPageEntity } from "../../../_core/domains/entities/meeygroup/mg.page.entity";

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class PageComponent extends GridComponent {
    obj: GridData = {
        Imports: [],
        Exports: [],
        Reference: MGPageEntity,
    };

    constructor() {
        super();
        this.render(this.obj);
    }

    addNew() {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: this.obj.Title,
            confirmText: 'Tạo Trang',
            object: EditPageComponent,
            size: ModalSizeType.Medium,
        }, () => this.loadItems());
    }

    edit(item: MGPageEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: this.obj.Title,
            object: EditPageComponent,
            confirmText: 'Lưu thay đổi',
            size: ModalSizeType.Medium,
            objectExtra: { id: item.Id },
        }, () => this.loadItems());
    }

    view(item: MGPageEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: this.obj.Title,
            object: EditPageComponent,
            size: ModalSizeType.Medium,
            objectExtra: { id: item.Id, viewer: true },
        });
    }
}