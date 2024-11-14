import { Component } from "@angular/core";
import { GridData } from "../../../_core/domains/data/grid.data";
import { EditMessageComponent } from "./edit.message/edit.message.component";
import { ModalSizeType } from "../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../_core/components/grid/grid.component";
import { MGMessageEntity } from "../../../_core/domains/entities/meeygroup/mg.message.entity";

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class MessageComponent extends GridComponent {
    obj: GridData = {
        Imports: [],
        Exports: [],
        Reference: MGMessageEntity,
    };

    constructor() {
        super();
        this.render(this.obj);
    }

    addNew() {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: this.obj.Title,
            confirmText: 'Tạo Lời nhắn',
            object: EditMessageComponent,
            size: ModalSizeType.Medium,
        }, () => this.loadItems());
    }

    edit(item: MGMessageEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: this.obj.Title,
            object: EditMessageComponent,
            confirmText: 'Lưu thay đổi',
            size: ModalSizeType.Medium,
            objectExtra: { id: item.Id },
        }, () => this.loadItems());
    }

    view(item: MGMessageEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: this.obj.Title,
            object: EditMessageComponent,
            size: ModalSizeType.Medium,
            objectExtra: { id: item.Id, viewer: true },
        });
    }
}