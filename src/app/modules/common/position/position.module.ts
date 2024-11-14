import { RouterModule } from "@angular/router";
import { ShareModule } from "../../share.module";
import { Component, NgModule } from "@angular/core";
import { UtilityModule } from "../../utility.module";
import { PositionService } from "./position.service";
import { GridData } from "../../../_core/domains/data/grid.data";
import { DataType } from "../../../_core/domains/enums/data.type";
import { ResultApi } from "../../../_core/domains/data/result.api";
import { ToastrHelper } from "../../../_core/helpers/toastr.helper";
import { ActionData } from "../../../_core/domains/data/action.data";
import { ActionType } from "../../../_core/domains/enums/action.type";
import { AdminAuthGuard } from "../../../_core/guards/admin.auth.guard";
import { UtilityExHelper } from "../../../_core/helpers/utility.helper";
import { DecoratorHelper } from "../../../_core/helpers/decorator.helper";
import { ModalSizeType } from "../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../_core/components/grid/grid.component";
import { PositionEntity } from "../../../_core/domains/entities/position.entity";
import { ChoiceUserComponent } from "../../sercurity/user/choice.user/choice.user.component";
import { ViewChoiceUserComponent } from "../../sercurity/user/choice.user/view.choice.user.component";

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class PositionComponent extends GridComponent {
    obj: GridData = {
        Reference: PositionEntity,
        Size: ModalSizeType.Medium,
        MoreActions: [
            {
                icon: 'la la-users',
                name: ActionType.EditMember,
                systemName: ActionType.EditMember,
                click: ((item: PositionEntity) => {
                    this.editMember(item);
                })
            },
            ActionData.history((item: PositionEntity) => {
                this.viewHistory(item.Id);
            })
        ]
    };

    constructor() {
        super();
        this.properties = [
            { Property: 'Id', Title: 'Id', Type: DataType.Number },
            {
                Property: 'Name', Title: 'Tên', Type: DataType.String,
                Format: ((item: any) => {
                    return '<a routerLink="view">' + UtilityExHelper.escapeHtml(item.Name) + '</a>';
                })
            },
            { Property: 'Code', Title: 'Tên viết tắt', Type: DataType.String },
            { Property: 'Description', Title: 'Miêu tả', Type: DataType.String },
            {
                Property: 'Amount', Title: 'Số lượng nhân viên', Type: DataType.String, Align: 'center',
                Click: ((item: PositionEntity) => {
                    this.viewMember(item);
                }),
                Format: ((item: any) => {
                    return item.Amount + ' nhân viên'
                })
            }
        ];
        this.render(this.obj);
    }

    trash(item: any) {
        if (this.obj && this.obj.Reference) {
            let table = DecoratorHelper.decoratorClass(this.obj.Reference);
            this.dialogService.ConfirmAsync('Có phải bạn muốn <b>' + (item.IsDelete ? 'khôi phục' : 'xóa') + '</b> dữ liệu này?', async () => {
                await this.service.trashVerify(table.name, item.Id).then((result: ResultApi) => {
                    if (ResultApi.IsSuccess(result)) {
                        ToastrHelper.Success((item.IsDelete ? 'Khôi phục ' : 'Xóa ') + this.obj.Title.toLowerCase() + ' thành công');
                        this.loadItems();
                    } else ToastrHelper.ErrorResult(result);
                });
            });
        }
    }

    editMember(item: PositionEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: 'Nhân viên',
            confirmText: 'Lưu thay đổi',
            object: ChoiceUserComponent,
            size: ModalSizeType.ExtraLarge,
            objectExtra: { id: item.Id, type: 'position'},
        }, async () => {
            this.loadItems();
        }, null, async () => {
            this.loadItems();
        });
    }

    viewMember(item: PositionEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: 'Xem nhân viên',
            size: ModalSizeType.ExtraLarge,
            object: ViewChoiceUserComponent,
            objectExtra: { id: item.Id, type: 'position'},
        });
    }
}

@NgModule({
    declarations: [
        PositionComponent
    ],
    imports: [
        ShareModule,
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: PositionComponent, pathMatch: 'full', data: { state: 'position' }, canActivate: [AdminAuthGuard] },
        ])
    ],
    providers: [PositionService]
})
export class PositionModule { }