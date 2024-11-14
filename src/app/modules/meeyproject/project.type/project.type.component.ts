import { Component, OnInit } from "@angular/core";
import { GridData } from "../../../_core/domains/data/grid.data";
import { DataType } from "../../../_core/domains/enums/data.type";
import { ActionData } from "../../../_core/domains/data/action.data";
import { ModalSizeType } from "../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../_core/components/grid/grid.component";
import { EditProjectTypeComponent } from "./edit/edit.project.type.component";
import { MPOProjectTypeEntity } from "../../../_core/domains/entities/meeyproject/mpo.project.type.entity";

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class ProjectTypeComponent extends GridComponent implements OnInit {
    obj: GridData = {
        Filters: [],
        Imports: [],
        Exports: [],
        Actions: [
            ActionData.edit((item: any) => this.edit(item)),
        ],
        Features: [
            ActionData.addNew(() => this.addNew()),
            ActionData.reload(() => this.loadItems()),
        ],
        UpdatedBy: false,
        DisableAutoLoad: true,
        HideCustomFilter: true,
        Reference: MPOProjectTypeEntity,
        SearchText: 'Nhập tên loại dự án',
    };

    constructor() {
        super();
    }

    async ngOnInit(): Promise<void> {
        this.properties = [
            { Property: 'Index', Title: 'STT', Type: DataType.Number, DisableOrder: true, Align: 'center' },
            { Property: 'Name', Title: 'Tên loại dự án', Type: DataType.String, DisableOrder: true },
            { Property: 'NameEn', Title: 'Tên tiếng Anh', Type: DataType.String, DisableOrder: true },
            { Property: 'CreatedBy', Title: 'Người tạo', Type: DataType.String, DisableOrder: true },
            { Property: 'CreatedAt', Title: 'Ngày tạo', Type: DataType.DateTime, DisableOrder: true },
            { Property: 'UpdatedBy', Title: 'Người cập nhật', Type: DataType.String, DisableOrder: true },
            { Property: 'UpdatedAt', Title: 'Ngày cập nhật', Type: DataType.DateTime, DisableOrder: true },
            {
                Property: 'Active', Title: 'Trạng thái lựa chọn', Type: DataType.String, DisableOrder: true,
                Format: ((item: any) => {
                    let text = item.Active ? 'Cho phép chọn' : 'Không cho phép chọn';
                    return text;
                }),
            },
        ];
        this.render(this.obj);
    }

    addNew() {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            confirmText: 'Xác nhận',
            size: ModalSizeType.Medium,
            title: 'Thêm mới Loại dự án',
            className: 'modal-body-project',
            object: EditProjectTypeComponent,
        }, async (item: any) => {
            await this.loadItems()
        });
    }

    edit(item: any) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            confirmText: 'Xác nhận',
            title: 'Sửa Loại dự án',
            size: ModalSizeType.Medium,
            className: 'modal-body-project',
            object: EditProjectTypeComponent,
            objectExtra: {
                id: item.Id,
            }
        }, async (item: any) => {
            await this.loadItems()
        });
    }

    view(item: any) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: 'Xem Loại dự án',
            size: ModalSizeType.Medium,
            className: 'modal-body-project',
            object: EditProjectTypeComponent,
            objectExtra: {
                id: item.Id,
                viewer: true,
            }
        });
    }
}