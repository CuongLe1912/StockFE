import { Component, OnInit } from "@angular/core";
import { GridData } from "../../../_core/domains/data/grid.data";
import { DataType } from "../../../_core/domains/enums/data.type";
import { ActionData } from "../../../_core/domains/data/action.data";
import { ModalSizeType } from "../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../_core/components/grid/grid.component";
import { EditProjectCategoryComponent } from "./edit/edit.project.category.component";
import { MPOProjectCategoryEntity } from "../../../_core/domains/entities/meeyproject/mpo.project.category.entity";

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class ProjectCategoryComponent extends GridComponent implements OnInit {
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
        Reference: MPOProjectCategoryEntity,
        SearchText: 'Nhập tên chủ đề Video',
    };

    constructor() {
        super();
    }

    async ngOnInit(): Promise<void> {
        this.properties = [
            { Property: 'Index', Title: 'STT', Type: DataType.Number, DisableOrder: true, Align: 'center' },
            { Property: 'Name', Title: 'Tên chủ đề Video', Type: DataType.String, DisableOrder: true },
            { Property: 'NameEn', Title: 'Tên tiếng Anh', Type: DataType.String, DisableOrder: true },
            { Property: 'CreatedBy', Title: 'Người tạo', Type: DataType.String, DisableOrder: true },
            { Property: 'CreatedAt', Title: 'Ngày tạo', Type: DataType.DateTime, DisableOrder: true },
            { Property: 'UpdatedBy', Title: 'Người cập nhật', Type: DataType.String, DisableOrder: true },
            { Property: 'UpdatedAt', Title: 'Ngày cập nhật', Type: DataType.DateTime, DisableOrder: true },
            {
                Property: 'Active', Title: 'Trạng thái lựa chọn', Type: DataType.String, DisableOrder: true,
                Format: ((item: any) => {
                    return item.Active ? 'Cho phép chọn' : 'Không cho phép chọn'
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
            title: 'Thêm mới Chủ đề Video',
            className: 'modal-body-project',
            object: EditProjectCategoryComponent,
        }, async (item: any) => {
            await this.loadItems()
        });
    }

    edit(item: any) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            confirmText: 'Xác nhận',
            title: 'Sửa Chủ đề Video',
            size: ModalSizeType.Medium,
            className: 'modal-body-project',
            object: EditProjectCategoryComponent,
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
            title: 'Xem Chủ đề Video',
            size: ModalSizeType.Medium,
            className: 'modal-body-project',
            object: EditProjectCategoryComponent,
            objectExtra: {
                id: item.Id,
                viewer: true,
            }
        });
    }
}