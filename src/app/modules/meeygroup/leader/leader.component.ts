import { Component } from "@angular/core";
import { GridData } from "../../../_core/domains/data/grid.data";
import { DataType } from "../../../_core/domains/enums/data.type";
import { UtilityExHelper } from "../../../_core/helpers/utility.helper";
import { EditLeaderComponent } from "./edit.leader/edit.leader.component";
import { ModalSizeType } from "../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../_core/components/grid/grid.component";
import { MGLeaderEntity } from "../../../_core/domains/entities/meeygroup/mg.leader.entity";

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class LeaderComponent extends GridComponent {
    obj: GridData = {
        Imports: [],
        Exports: [],
        Reference: MGLeaderEntity,
    };

    constructor() {
        super();
        this.properties = [
            { Property: 'Id', Title: 'Id', Type: DataType.Number },
            { Property: 'Name', Title: 'Họ và tên', Type: DataType.String },
            { Property: 'Link', Title: 'Đường dẫn', Type: DataType.String },
            { Property: 'Image', Title: 'Ảnh đại diện', Type: DataType.Image },
            {
                Property: 'PositionVn', Title: 'Chức vụ', Type: DataType.String,
                Format: (item: any) => {
                    return UtilityExHelper.renderInformationFormat([
                        item.PositionVn,
                        item.PositionEn
                    ]);
                }
            },
            {
                Property: 'CategoryVn', Title: 'Nhóm lãnh đạo', Type: DataType.String,
                Format: (item: any) => {
                    return UtilityExHelper.renderInformationFormat([
                        item.CategoryVn,
                        item.CategoryEn
                    ]);
                }
            },
            { Property: 'Order', Title: 'Thứ tự hiển thị', Type: DataType.Number, Align: 'center' },
        ];
        this.render(this.obj);
    }

    addNew() {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: this.obj.Title,
            confirmText: 'Tạo Lãnh đạo',
            size: ModalSizeType.Medium,
            object: EditLeaderComponent,
        }, () => this.loadItems());
    }

    edit(item: MGLeaderEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: this.obj.Title,
            size: ModalSizeType.Medium,
            confirmText: 'Lưu thay đổi',
            objectExtra: { id: item.Id },
            object: EditLeaderComponent,
        }, () => this.loadItems());
    }

    view(item: MGLeaderEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: this.obj.Title,
            size: ModalSizeType.Medium,
            object: EditLeaderComponent,
            objectExtra: { id: item.Id, viewer: true },
        });
    }
}