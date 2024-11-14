import { GridComponent } from "./grid.component";
import { ResultApi } from "../../../_core/domains/data/result.api";
import { ToastrHelper } from "../../../_core/helpers/toastr.helper";
import { ActionType } from "../../../_core/domains/enums/action.type";
import { BaseEntity } from "../../../_core/domains/entities/base.entity";
import { ModalSizeType } from "../../../_core/domains/enums/modal.size.type";
import { NavigationStateData } from "../../../_core/domains/data/navigation.state";
import { ChoiceUserComponent } from "../../../modules/sercurity/user/choice.user/choice.user.component";
import { ViewChoiceUserComponent } from "../../../modules/sercurity/user/choice.user/view.choice.user.component";

export abstract class GridEditComponent extends GridComponent {
    addNew() {
        let obj: NavigationStateData = {
            object: this.obj,
            prevData: this.itemData,
            className: this.obj.Reference.name,
            prevUrl: '/admin/' + this.obj.ReferenceName,
        };
        this.router.navigate(['/admin/' + this.obj.ReferenceName + '/add'], { state: { params: JSON.stringify(obj) } });
    }

    trash(item: any) {
        if (this.obj && this.obj.Reference) {
            this.dialogService.ConfirmAsync('Có phải bạn muốn <b>' + (item.IsDelete ? 'khôi phục' : 'xóa') + '</b> dữ liệu này?', async () => {
                await this.service.trashVerify(this.obj.ReferenceName, item.Id).then((result: ResultApi) => {
                    if (ResultApi.IsSuccess(result)) {
                        ToastrHelper.Success((item.IsDelete ? 'Khôi phục ' : 'Xóa ') + this.obj.Title.toLowerCase() + ' thành công');
                        this.loadItems();
                    } else ToastrHelper.ErrorResult(result);
                });
            });
        }
    }

    view(item: BaseEntity) {
        let obj: NavigationStateData = {
            id: item.Id,
            viewer: true,
            object: this.obj,
            prevData: this.itemData,
            className: this.obj.Reference.name,
            prevUrl: '/admin/' + this.obj.ReferenceName,
        };
        this.router.navigate(['/admin/' + this.obj.ReferenceName + '/view'], { state: { params: JSON.stringify(obj) } });
    }

    edit(item: BaseEntity) {
        let obj: NavigationStateData = {
            id: item.Id,
            object: this.obj,
            prevData: this.itemData,
            className: this.obj.Reference.name,
            prevUrl: '/admin/' + this.obj.ReferenceName,
        };
        this.router.navigate(['/admin/' + this.obj.ReferenceName + '/edit'], { state: { params: JSON.stringify(obj) } });
    }

    popupChoiceUser(item: BaseEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: 'Thêm nhân viên',
            object: ChoiceUserComponent,
            confirmText: 'Chọn nhân viên',
            size: ModalSizeType.ExtraLarge,
            objectExtra: {
                id: item.Id,
                autoSave: true,
                navigation: true,
                type: this.obj.ReferenceName,
            },
        }, async () => {
            this.loadItems();
        });
    }

    popupViewChoiceUser(item: BaseEntity) {
        let addUser = this.authen.permissionAllow(this.obj.ReferenceName, ActionType.EditMember),
            deleteUser = this.authen.permissionAllow(this.obj.ReferenceName, ActionType.EditMember);
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            confirmText: 'Lưu thay đổi',
            size: ModalSizeType.ExtraLarge,
            object: ViewChoiceUserComponent,
            title: 'Xem danh sách nhân viên',
            objectExtra: {
                id: item.Id,
                autoSave: true,
                type: this.obj.ReferenceName,
                addUser: addUser,
                navigation: true,
                deleteUser: deleteUser,
                choiceComplete: () => {
                    this.loadItems();
                }
            },
        }, async () => {
            this.loadItems();
        });
    }
}