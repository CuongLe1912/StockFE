import { Component } from "@angular/core";
import { GridData } from "../../../_core/domains/data/grid.data";
import { ModalSizeType } from "../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../_core/components/grid/grid.component";
import { EditCategoryComponent } from "./edit.category/edit.category.component";
import { MGCategoryEntity } from "../../../_core/domains/entities/meeygroup/mg.category.entity";

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class CategoryComponent extends GridComponent {
    obj: GridData = {
        Imports: [],
        Exports: [],
        Reference: MGCategoryEntity,
    };

    constructor() {
        super();
        this.render(this.obj);
    }

    addNew() {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: this.obj.Title,
            confirmText: 'Tạo Chủ đề',
            size: ModalSizeType.Medium,
            object: EditCategoryComponent,
        }, () => this.loadItems());
    }

    edit(item: MGCategoryEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: this.obj.Title,
            size: ModalSizeType.Medium,
            confirmText: 'Lưu thay đổi',
            objectExtra: { id: item.Id },
            object: EditCategoryComponent,
        }, () => this.loadItems());
    }

    view(item: MGCategoryEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: this.obj.Title,
            size: ModalSizeType.Medium,
            object: EditCategoryComponent,
            objectExtra: { id: item.Id, viewer: true },
        });
    }
}