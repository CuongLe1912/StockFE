import * as _ from 'lodash';
import { Component, OnInit } from "@angular/core";
import { GridData } from "../../../_core/domains/data/grid.data";
import { DataType } from "../../../_core/domains/enums/data.type";
import { ActionData } from "../../../_core/domains/data/action.data";
import { GridComponent } from "../../../_core/components/grid/grid.component";
import { ModalSizeType } from '../../../_core/domains/enums/modal.size.type';
import { EditProjectVerifyDocumentComponent } from './edit/edit.project.verify.document.component';
import { MPOProjectDocumentEntity } from '../../../_core/domains/entities/meeyproject/project.verify.document.entity';
import { AdminDialogService } from '../../../_core/services/admin.dialog.service';

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class ProjectVerifyDocumentComponent extends GridComponent implements OnInit {
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
        SearchText: 'Tìm kiếm theo giấy tờ...',
        Reference: MPOProjectDocumentEntity,
    };

    constructor(private dialog: AdminDialogService) {
        super();
    }

    async ngOnInit(): Promise<void> {
        this.properties = [
            { Property: 'index', Title: 'STT', Type: DataType.Number, DisableOrder: true, },
            {
                Property: 'translationVi', Title: 'Tên giấy tờ', Type: DataType.String, DisableOrder: true,
                Format: (item) => {
                    if (!item.translation || item.translation.length < 1) return '';
                    let translation = item.translation.find(c => c.languageCode == 'vi');
                    return translation ? translation.name : '';
                }
            },
            {
                Property: 'translationEn', Title: 'Tên Tiếng Anh', Type: DataType.String, DisableOrder: true,
                Format: (item) => {
                    if (!item.translation || item.translation.length < 1) return '';
                    let translation = item.translation.find(c => c.languageCode == 'en');
                    return translation ? translation.name : '';
                }
            },
            {
                Property: 'createdBy', Title: 'Người tạo', Type: DataType.String, DisableOrder: true,
                Format: (item) => {
                    if (!item.createdBy?.data?.fullname) return '';
                    return item.createdBy?.data?.fullname
                }
            },
            { Property: 'createdAt', Title: 'Ngày tạo', Type: DataType.DateTime, DisableOrder: true },
            {
                Property: 'updatedBy', Title: 'Người cập nhật gần nhất', Type: DataType.String, DisableOrder: true,
                Format: (item) => {
                    if (!item.updatedBy?.data?.fullname) return '';
                    return item.updatedBy?.data?.fullname
                }
            },
            { Property: 'updatedAt', Title: 'Ngày cập nhật gần nhất', Type: DataType.DateTime, DisableOrder: true },
            {
                Property: 'isActiveText', Title: 'Trạng thái lựa chọn', Type: DataType.String, DisableOrder: true,
                Format: ((item: any) => {
                    return item.isActive ? 'Cho phép chọn' : 'Không cho phép chọn'
                }),
            },
        ];
        this.render(this.obj);
    }

    loadComplete(): void {
        if (this.items && this.items.length > 0) {
            let pagesize = this.itemData.Paging?.Size || 20;
            let pageindex = this.itemData.Paging?.Index || 1;
            this.items.forEach((item: any, index) => {
                item.index = (pagesize * (pageindex - 1)) + (index + 1);
            });
        }
    }

    addNew() {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            confirmText: 'Xác nhận',
            size: ModalSizeType.Medium,
            title: 'Thêm mới Giấy tờ cần xác minh',
            className: 'modal-body-project',
            object: EditProjectVerifyDocumentComponent,
        }, async (item: any) => {
            this.dialog.ConfirmAsync("Thêm mới giấy tờ thành công !", async () => {
                this.addNew();
            }, null, "Thông báo", "Tạo thêm");
            await this.loadItems();
        });
    }

    edit(item: any) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            confirmText: 'Xác nhận',
            title: 'Sửa Giấy tờ cần xác minh',
            size: ModalSizeType.Medium,
            className: 'modal-body-project',
            object: EditProjectVerifyDocumentComponent,
            objectExtra: {
                id: item._id,
            }
        }, async (item: any) => {
            await this.loadItems()
        });
    }
}