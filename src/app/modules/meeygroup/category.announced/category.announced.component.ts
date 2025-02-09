import { Component } from "@angular/core";
import { GridData } from "../../../_core/domains/data/grid.data";
import { ModalSizeType } from "../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../_core/components/grid/grid.component";
import { MGCategoryAnnouncedEntity } from "../../../_core/domains/entities/meeygroup/mg.category.entity";
import { EditCategoryAnnouncedComponent } from "./edit.category.announced/edit.category.announced.component";

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class CategoryAnnouncedComponent extends GridComponent {
    obj: GridData = {
        Imports: [],
        Exports: [],
        Reference: MGCategoryAnnouncedEntity,
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
            object: EditCategoryAnnouncedComponent,
        }, () => this.loadItems());
    }

    edit(item: MGCategoryAnnouncedEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: this.obj.Title,
            size: ModalSizeType.Medium,
            confirmText: 'Lưu thay đổi',
            objectExtra: { id: item.Id },
            object: EditCategoryAnnouncedComponent,
        }, () => this.loadItems());
    }

    view(item: MGCategoryAnnouncedEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: this.obj.Title,
            size: ModalSizeType.Medium,
            object: EditCategoryAnnouncedComponent,
            objectExtra: { id: item.Id, viewer: true },
        });
    }
}