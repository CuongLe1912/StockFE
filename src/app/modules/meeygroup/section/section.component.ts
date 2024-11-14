import { Component } from "@angular/core";
import { GridData } from "../../../_core/domains/data/grid.data";
import { EditSectionComponent } from "./edit.section/edit.section.component";
import { ModalSizeType } from "../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../_core/components/grid/grid.component";
import { MGSectionEntity } from "../../../_core/domains/entities/meeygroup/mg.section.entity";
import { MGSectionPageType, MGSectionType } from "../../../_core/domains/entities/meeygroup/enums/mg.section.type";

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class SectionComponent extends GridComponent {
    obj: GridData = {
        Imports: [],
        Exports: [],
        Reference: MGSectionEntity,
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
            confirmText: 'Tạo Nội dung',
            object: EditSectionComponent,
            objectExtra: {
                page: MGSectionPageType.HomePage
            },
        }, () => this.loadItems());
    }

    edit(item: MGSectionEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: this.obj.Title,
            size: ModalSizeType.Large,
            confirmText: 'Lưu thay đổi',
            objectExtra: { id: item.Id },
            object: EditSectionComponent,
        }, () => this.loadItems());
    }

    view(item: MGSectionEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: this.obj.Title,
            size: ModalSizeType.Large,
            object: EditSectionComponent,
            objectExtra: { id: item.Id, viewer: true },
        });
    }
}