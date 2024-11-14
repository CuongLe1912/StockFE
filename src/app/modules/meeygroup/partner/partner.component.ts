import { Component } from "@angular/core";
import { GridData } from "../../../_core/domains/data/grid.data";
import { DataType } from "../../../_core/domains/enums/data.type";
import { ModalSizeType } from "../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../_core/components/grid/grid.component";
import { EditPartnerComponent } from "./edit.partner/edit.partner.component";
import { MGPartnerEntity } from "../../../_core/domains/entities/meeygroup/mg.partner.entity";

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class PartnerComponent extends GridComponent {
    obj: GridData = {
        Imports: [],
        Exports: [],
        Size: ModalSizeType.Large,
        Reference: MGPartnerEntity,
    };

    constructor() {
        super();
        this.properties = [
            { Property: 'Id', Title: 'Id', Type: DataType.Number },
            { Property: 'Type', Title: 'Loại', Type: DataType.DropDown },
            { Property: 'Image', Title: 'Ảnh', Type: DataType.Image },
            { Property: 'Link', Title: 'Đường dẫn', Type: DataType.String },
            { Property: 'NameVn', Title: 'Tên - Tiếng Việt', Type: DataType.String },
            { Property: 'NameEn', Title: 'Tên - Tiếng Anh', Type: DataType.String },
        ];
        this.render(this.obj);
    }

    addNew() {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: this.obj.Title,
            confirmText: 'Tạo Đối tác',
            size: ModalSizeType.Large,
            object: EditPartnerComponent,
        }, () => this.loadItems());
    }

    edit(item: MGPartnerEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: this.obj.Title,
            size: ModalSizeType.Large,
            confirmText: 'Lưu thay đổi',
            objectExtra: { id: item.Id },
            object: EditPartnerComponent,
        }, () => this.loadItems());
    }

    view(item: MGPartnerEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: this.obj.Title,
            size: ModalSizeType.Large,
            object: EditPartnerComponent,
            objectExtra: { id: item.Id, viewer: true },
        });
    }
}