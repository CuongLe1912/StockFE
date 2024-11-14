import { Component, OnInit } from "@angular/core";
import { GridData } from "../../../../_core/domains/data/grid.data";
import { DataType } from "../../../../_core/domains/enums/data.type";
import { ActionType } from '../../../../_core/domains/enums/action.type';
import { ConstantHelper } from "../../../../_core/helpers/constant.helper";
import { ActionData } from '../../../../_core/domains/data/action.data';
import { ModalSizeType } from "../../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../../_core/components/grid/grid.component";
import { EditProfileComponent } from "./edit.profile/edit.profile.component";
import { MGProfileEntity } from "../../../../_core/domains/entities/meeygroup/v2/mg.profile.entity";
import { NavigationStateData } from "../../../../_core/domains/data/navigation.state";

@Component({
    templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class ProfileComponent extends GridComponent implements OnInit {
    obj: GridData = {
        Imports: [],
        Exports: [],
        Filters: [],
        UpdatedBy: false,
        DisableAutoLoad: true,
        Features: [
            ActionData.reload(() => this.loadItems())
        ],
        Reference: MGProfileEntity,
        SearchText: 'Tìm kiếm vị trí ứng tuyển, tên, email, số điện thoại',
        CustomFilters: ['RequestDate', 'Status'],
        Actions: [
            {
                name: 'Xem CV',
                icon: 'la la-eye',
                className: 'btn btn-warning',
                systemName: ActionType.View,
                click: (item: any) => this.quickView(item, 'file')
            },
            {
                icon: 'la la-pencil',
                name: 'Tạo/sửa ghi chú',
                className: 'btn btn-primary',
                systemName: ActionType.Notes,
                click: (item: any) => this.edit(item)
            },
            {
                icon: 'la la-refresh',
                name: 'Cập nhật trạng thái',
                className: 'btn btn-success',
                systemName: ActionType.UpdateState,
                click: (item: any) => {
                    this.updateStatus(item);
                },
            },
        ],
    };

    constructor() {
        super();
        this.properties = [
            { Property: 'Id', Title: 'STT', Type: DataType.Number },
            { Property: 'Name', Title: 'Ứng viên', Type: DataType.String },
            { Property: 'Email', Title: 'Email', Type: DataType.String },
            { Property: 'Phone', Title: 'Số điện thoại', Type: DataType.String },
            {
                Property: 'NomineeVn', Title: 'Vị trí ứng tuyển', Type: DataType.String,
                Format: (item: any) => {
                    let text: string = '';
                    if (item.TitleVn) text += '<p routerLink="quickView" type="view"><a>' + item.TitleVn + '</a></p>';
                    return text;
                }
            },
            // {
            //     Property: 'NomineeEn', Title: 'Vị trí ứng tuyển - Tiếng Anh', Type: DataType.String,
            //     Format: (item: any) => {
            //         let text: string = '';
            //         if (item.TitleEn) text += '<p routerLink="quickView" type="view"><a>' + item.TitleEn + '</a></p>';
            //         return text;
            //     }
            // },
            { Property: 'CreatedDate', Title: 'Ngày nộp', Type: DataType.DateTime },
            {
                Property: 'Status', Title: 'Trạng thái', Type: DataType.String,
                Format: ((item: any) => {
                    let text: string = '';
                    if (item.Status != null && item.Status != undefined) {
                        let option = ConstantHelper.MG_PROFILE_STATUS_TYPES.find(c => c.value == item.Status);
                        if (option) text += '<p style="' + (option && option.color) + '">' + (option && option.label) + '</p>';
                    }
                    return text;
                })
            },
            { Property: 'Note', Title: 'Ghi chú', Type: DataType.String },
        ];
    }

    ngOnInit() {
        this.render(this.obj);
    }

    quickView(item: MGProfileEntity, type: string) {
        let originalItem = this.originalItems.find(c => c.Id == item.Id);
        if (originalItem) {
            switch (type) {
                case 'file': {
                    window.open(originalItem['File'], "_blank");
                } break;
                case 'view': {
                    let obj: NavigationStateData = {
                        id: item.RecruitmentId,
                        viewer: true,
                        prevUrl: '/admin/meeygroupv2/recruitment',
                    };
                    this.router.navigateByUrl('/admin/meeygroupv2/recruitment/view?id=' + item.RecruitmentId, { state: { params: JSON.stringify(obj) } });
                } break;
            }
        }
    }

    // addNew() {
    //     this.dialogService.WapperAsync({
    //         cancelText: 'Đóng',
    //         title: "Tạo hồ sơ ứng viên",
    //         size: ModalSizeType.Large,
    //         confirmText: 'Tạo hồ sơ',
    //         object: EditProfileComponent,
    //         objectExtra: { isNew: true },
    //     }, () => this.loadItems());
    // }

    edit(item: MGProfileEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: this.obj.Title,
            size: ModalSizeType.Large,
            confirmText: 'Lưu thay đổi',
            objectExtra: { id: item.Id, viewer: true },
            object: EditProfileComponent,
        }, () => this.loadItems());
    }

    updateStatus(item: MGProfileEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: 'Cập nhật trạng thái',
            size: ModalSizeType.Large,
            confirmText: 'Lưu trạng thái',
            object: EditProfileComponent,
            objectExtra: { id: item.Id, viewer: true, updateStatus: true },
        }, () => this.loadItems());
    }
}