import { Component } from "@angular/core";
import { GridData } from "../../../_core/domains/data/grid.data";
import { ModalSizeType } from "../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../_core/components/grid/grid.component";
import { EditCategoryLeaderComponent } from "./edit.category.leader/edit.category.leader.component";
import { MGCategoryLeaderEntity } from "../../../_core/domains/entities/meeygroup/mg.category.entity";

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class CategoryLeaderComponent extends GridComponent {
    obj: GridData = {
        Imports: [],
        Exports: [],
        Reference: MGCategoryLeaderEntity,
    };

    constructor() {
        super();
        this.render(this.obj);
    }

    addNew() {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: this.obj.Title,
            confirmText: 'Tạo Nhóm',
            size: ModalSizeType.Medium,
            object: EditCategoryLeaderComponent,
        }, () => this.loadItems());
    }

    edit(item: MGCategoryLeaderEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: this.obj.Title,
            size: ModalSizeType.Medium,
            confirmText: 'Lưu thay đổi',
            objectExtra: { id: item.Id },
            object: EditCategoryLeaderComponent,
        }, () => this.loadItems());
    }

    view(item: MGCategoryLeaderEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: this.obj.Title,
            size: ModalSizeType.Medium,
            object: EditCategoryLeaderComponent,
            objectExtra: { id: item.Id, viewer: true },
        });
    }
}