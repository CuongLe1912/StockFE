import { Component } from "@angular/core";
import { GridData } from "../../../_core/domains/data/grid.data";
import { DataType } from "../../../_core/domains/enums/data.type";
import { AlignType } from "../../../_core/domains/enums/align.type";
import { UtilityExHelper } from "../../../_core/helpers/utility.helper";
import { ModalSizeType } from "../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../_core/components/grid/grid.component";
import { EditQRLeaderComponent } from "./edit.qr.leader/edit.qr.leader.component";
import { MGQRLeaderEntity } from "../../../_core/domains/entities/meeygroup/mg.qr.leader.entity";

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class QRLeaderComponent extends GridComponent {
    obj: GridData = {
        Imports: [],
        Exports: [],
        NotKeepPrevData: true,
        Reference: MGQRLeaderEntity,
    };

    constructor() {
        super();
        this.properties = [
            { Property: 'Id', Title: 'Id', Type: DataType.Number },
            { Property: 'Code', Title: 'Mã URL', Type: DataType.Number, Align: AlignType.Center },
            {
                Property: 'NameVn', Title: 'Họ và tên', Type: DataType.String,
                Format: (item: any) => {
                    return UtilityExHelper.renderInformationFormat([
                        item.NameVn,
                        item.NameEn
                    ]);
                }
            },
            { Property: 'Website', Title: 'Website', Type: DataType.String },
            { Property: 'Phone', Title: 'Số điện thoại', Type: DataType.String },
            { Property: 'Email', Title: 'Email', Type: DataType.String },
            { Property: 'Avatar', Title: 'Ảnh đại diện', Type: DataType.Image, Align: AlignType.Center },
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
                Property: 'CompanyVn', Title: 'Nhóm lãnh đạo', Type: DataType.String,
                Format: (item: any) => {
                    return UtilityExHelper.renderInformationFormat([
                        item.CompanyVn,
                        item.CompanyEn
                    ]);
                }
            }
        ];
        this.render(this.obj);
    }

    addNew() {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: this.obj.Title,
            confirmText: 'Tạo Lãnh đạo',
            size: ModalSizeType.Medium,
            object: EditQRLeaderComponent,
        }, () => this.loadItems());
    }

    edit(item: MGQRLeaderEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: this.obj.Title,
            size: ModalSizeType.Medium,
            confirmText: 'Lưu thay đổi',
            objectExtra: { id: item.Id },
            object: EditQRLeaderComponent,
        }, () => this.loadItems());
    }

    view(item: MGQRLeaderEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: this.obj.Title,
            size: ModalSizeType.Medium,
            object: EditQRLeaderComponent,
            objectExtra: { id: item.Id, viewer: true },
        });
    }
}