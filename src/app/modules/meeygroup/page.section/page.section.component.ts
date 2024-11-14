import { Component } from "@angular/core";
import { GridData } from "../../../_core/domains/data/grid.data";
import { ModalSizeType } from "../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../_core/components/grid/grid.component";
import { EditPageSectionComponent } from "./edit.page.section/edit.page.section.component";
import { MGPageSectionEntity } from "../../../_core/domains/entities/meeygroup/mg.page.section.entity";

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class PageSectionComponent extends GridComponent {
    obj: GridData = {
        Imports: [],
        Exports: [],
        Reference: MGPageSectionEntity,
        CustomFilters: ['PageId', 'SectionId']
    };

    constructor() {
        super();
        this.render(this.obj);
    }

    addNew() {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: this.obj.Title,
            confirmText: 'Tạo Nội dung',
            size: ModalSizeType.ExtraLarge,
            object: EditPageSectionComponent,
        }, () => this.loadItems());
    }

    edit(item: MGPageSectionEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: this.obj.Title,
            confirmText: 'Lưu thay đổi',
            objectExtra: { id: item.Id },
            size: ModalSizeType.ExtraLarge,
            object: EditPageSectionComponent,
        }, () => this.loadItems());
    }

    view(item: MGPageSectionEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: this.obj.Title,
            size: ModalSizeType.ExtraLarge,
            object: EditPageSectionComponent,
            objectExtra: { id: item.Id, viewer: true },
        });
    }
}