import { RoleService } from './role.service';
import { RouterModule } from '@angular/router';
import { ShareModule } from '../../share.module';
import { UserService } from '../user/user.service';
import { Component, NgModule } from '@angular/core';
import { UtilityModule } from '../../utility.module';
import { GridData } from '../../../_core/domains/data/grid.data';
import { DataType } from '../../../_core/domains/enums/data.type';
import { EditRoleComponent } from './edit.role/edit.role.component';
import { ViewRoleComponent } from './view.role/view.role.component';
import { ActionData } from '../../../_core/domains/data/action.data';
import { ActionType } from '../../../_core/domains/enums/action.type';
import { UtilityExHelper } from "../../../_core/helpers/utility.helper";
import { AdminAuthGuard } from '../../../_core/guards/admin.auth.guard';
import { RoleEntity } from '../../../_core/domains/entities/role.entity';
import { ModalSizeType } from '../../../_core/domains/enums/modal.size.type';
import { GridEditComponent } from '../../../_core/components/grid/grid.edit.component';
import { EditRolePermissionComponent } from './edit.permission/edit.permission.component';

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class RoleComponent extends GridEditComponent {
    obj: GridData = {
        Filters: [],
        Imports: [],
        Exports: [],
        InlineFilters: ['OrganizationId'],
        Actions: [
            ActionData.edit((item: any) => {
                this.edit(item);
            }),
            ActionData.view((item: any) => {
                this.view(item);
            })
        ],
        MoreActions: [
            {
                icon: 'la la-book',
                name: ActionType.Role,
                systemName: ActionType.Role,
                click: ((item: RoleEntity) => {
                    this.editPermission(item);
                })
            },
            {
                icon: 'la la-users',
                name: ActionType.EditMember,
                systemName: ActionType.EditMember,
                click: ((item: RoleEntity) => {
                    this.popupChoiceUser(item);
                })
            },
            ActionData.history((item: RoleEntity) => {
                this.viewHistory(item.Id);
            })
        ],
        Reference: RoleEntity,
        SearchText: 'Nhập mã, tên quyền'
    };

    constructor() {
        super();
        this.properties = [
            { Property: 'Id', Title: 'Id', Type: DataType.Number },
            {
                Property: 'Code', Title: 'Mã quyền', Type: DataType.String,
                Format: ((item: any) => {
                    return '<a routerLink="view">' + UtilityExHelper.escapeHtml(item.Code) + '</a>';
                })
            },
            { Property: 'Name', Title: 'Tên quyền', Type: DataType.String },
            {
                Property: 'Amount', Title: 'Số lượng nhân viên', Type: DataType.String, Align: 'center',
                Click: ((item: RoleEntity) => {
                    this.popupViewChoiceUser(item);
                }),
                Format: ((item: any) => {
                    return item.Amount + ' nhân viên'
                }),
            },
            { Property: 'Organization', Title: 'Website', Type: DataType.String },
        ];
        this.render(this.obj);
    }    

    editPermission(item: RoleEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: 'Phân quyền',
            confirmText: 'Lưu thay đổi',
            objectExtra: { id: item.Id },
            size: ModalSizeType.ExtraLarge,
            object: EditRolePermissionComponent,
        }, async () => {
            this.loadItems();
        }, null, async () => {
            this.loadItems();
        });
    }
}

@NgModule({
    declarations: [
        RoleComponent,
        EditRoleComponent,
        ViewRoleComponent,
        EditRolePermissionComponent
    ],
    imports: [
        ShareModule,
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: RoleComponent, pathMatch: 'full', data: { state: 'role' }, canActivate: [AdminAuthGuard] },
            { path: 'add', component: EditRoleComponent, pathMatch: 'full', data: { state: 'add_role' }, canActivate: [AdminAuthGuard] },
            { path: 'edit', component: EditRoleComponent, pathMatch: 'full', data: { state: 'edit_role' }, canActivate: [AdminAuthGuard] },
            { path: 'view', component: ViewRoleComponent, pathMatch: 'full', data: { state: 'view_role' }, canActivate: [AdminAuthGuard] },
        ])
    ],
    providers: [RoleService, UserService]
})
export class RoleModule { }