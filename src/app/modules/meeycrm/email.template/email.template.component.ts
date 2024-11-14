import { Component } from "@angular/core";
import { GridData } from "../../../_core/domains/data/grid.data";
import { ModalSizeType } from "../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../_core/components/grid/grid.component";
import { EditEmailTemplateComponent } from "./edit.email.template/edit.email.template.component";
import { MCRMEmailTemplateEntity } from "../../../_core/domains/entities/meeycrm/mcrm.email.template.entity";

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class EmailTemplateComponent extends GridComponent {
    obj: GridData = {
        Exports: [],
        Imports: [],
        Size: ModalSizeType.Large,
        Reference: MCRMEmailTemplateEntity,
    };

    constructor() {
        super();
        this.render(this.obj);
    }  

    addNew() {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: this.obj.Title,
            confirmText: 'Tạo mẫu',
            size: ModalSizeType.FullScreen,
            object: EditEmailTemplateComponent,
        }, () => this.loadItems());
    }

    edit(item: MCRMEmailTemplateEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: this.obj.Title,
            confirmText: 'Lưu thay đổi',
            objectExtra: { id: item.Id },
            size: ModalSizeType.FullScreen,
            object: EditEmailTemplateComponent,
        }, () => this.loadItems());
    }

    view(item: MCRMEmailTemplateEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: this.obj.Title,
            size: ModalSizeType.FullScreen,
            object: EditEmailTemplateComponent,
            objectExtra: { id: item.Id, viewer: true },
        });
    }
}