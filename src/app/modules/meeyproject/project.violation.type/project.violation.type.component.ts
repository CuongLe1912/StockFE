import * as _ from 'lodash';
import { Component, OnInit } from "@angular/core";
import { EnumHelper } from '../../../_core/helpers/enum.helper';
import { GridData } from "../../../_core/domains/data/grid.data";
import { DataType } from "../../../_core/domains/enums/data.type";
import { ActionData } from "../../../_core/domains/data/action.data";
import { OptionItem } from '../../../_core/domains/data/option.item';
import { ModalSizeType } from '../../../_core/domains/enums/modal.size.type';
import { GridComponent } from "../../../_core/components/grid/grid.component";
import { AdminDialogService } from '../../../_core/services/admin.dialog.service';
import { EditProjectViolationTypeComponent } from './edit/edit.project.violation.type.component';
import { MPOViolationType } from '../../../_core/domains/entities/meeyproject/enums/mpo.violation.type';
import { MPOProjectViolationTypeEntity } from '../../../_core/domains/entities/meeyproject/project.violation.type.entity';

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class ProjectViolationTypeComponent extends GridComponent implements OnInit {
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
        CustomFilters: ['Type', 'Active'],
        UpdatedBy: false,
        DisableAutoLoad: true,
        SearchText: 'Tìm kiếm theo tên loại vi phạm...',
        Reference: MPOProjectViolationTypeEntity,
    };

    violationType: OptionItem[] = [];

    constructor(private dialog: AdminDialogService) {
        super();
    }

    async ngOnInit(): Promise<void> {
        this.violationType = EnumHelper.exportOptionReverseItems(MPOViolationType);
        this.properties = [
            { Property: 'index', Title: 'STT', Type: DataType.Number, DisableOrder: true, },
            {
                Property: 'type', Title: 'Hình thức', Type: DataType.String, DisableOrder: true,
                Format: (item) => {
                    if (!item.type) return '';
                    let option = this.violationType.find(c => c.value == item.type);
                    if (option) return option.label;
                    return item.type;
                }
            },
            {
                Property: 'translationVi', Title: 'Loại vi phạm', Type: DataType.String, DisableOrder: true,
                Format: (item) => {
                    if (!item.translation || item.translation.length < 1) return '';
                    let translation = item.translation.find(c => c.languageCode == 'vi');
                    return translation ? translation.name : '';
                }
            },
            {
                Property: 'translationEn', Title: 'Loại vi phạm (Tiếng Anh)', Type: DataType.String, DisableOrder: true,
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
            // {
            //     Property: 'isActiveText', Title: 'Trạng thái lựa chọn', Type: DataType.String, DisableOrder: true,
            //     Format: (item) => {
            //         let checked = item.isActive ? true : false;
            //         let text = '<p class="d-flex align-items-center justify-content-center">'
            //             + '<span class="switch switch-primary switch-sm ' + (checked ? '' : 'switch-outline') + '" style="pointer-events: none;"><label>'
            //             + (checked
            //                 ? '<input type="checkbox" class="switch-disabled" checked="checked" name="select">'
            //                 : '<input type="checkbox" name="select">')
            //             + '<span></span></label></span></p>';
            //         return text;
            //     }
            // },
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
            title: 'Thêm mới Loại vi phạm',
            className: 'modal-body-project',
            object: EditProjectViolationTypeComponent,
        }, async (item: any) => {
            this.dialog.ConfirmAsync("Thêm mới loại vi phạm thành công !", async () => {
                this.addNew();
            }, null, "Thông báo", "Tạo thêm");
            await this.loadItems();
        });
    }

    edit(item: any) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            confirmText: 'Xác nhận',
            title: 'Sửa Loại vi phạm',
            size: ModalSizeType.Medium,
            className: 'modal-body-project',
            object: EditProjectViolationTypeComponent,
            objectExtra: {
                id: item._id,
            }
        }, async (item: any) => {
            await this.loadItems();
        });
    }
}