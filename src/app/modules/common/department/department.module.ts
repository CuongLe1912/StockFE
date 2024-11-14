import { RouterModule } from "@angular/router";
import { ShareModule } from "../../share.module";
import { Component, NgModule } from "@angular/core";
import { UtilityModule } from "../../utility.module";
import { DepartmentService } from "./department.service";
import { GridData } from "../../../_core/domains/data/grid.data";
import { DataType } from "../../../_core/domains/enums/data.type";
import { ActionData } from "../../../_core/domains/data/action.data";
import { ActionType } from "../../../_core/domains/enums/action.type";
import { UtilityExHelper } from "../../../_core/helpers/utility.helper";
import { AdminAuthGuard } from "../../../_core/guards/admin.auth.guard";
import { ModalSizeType } from "../../../_core/domains/enums/modal.size.type";
import { DepartmentEntity } from "../../../_core/domains/entities/department.entity";
import { ViewDepartmentComponent } from "./view.department/view.department.component";
import { EditDepartmentComponent } from "./edit.department/edit.department.component";
import { GridEditComponent } from "../../../_core/components/grid/grid.edit.component";

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class DepartmentComponent extends GridEditComponent {
    obj: GridData = {
        Filters: [],
        Imports: [],
        Exports: [],
        Size: ModalSizeType.Medium,
        Reference: DepartmentEntity,
        MoreActions: [
            {
                icon: 'la la-users',
                name: ActionType.EditMember,
                systemName: ActionType.EditMember,
                click: ((item: DepartmentEntity) => {
                    this.popupChoiceUser(item);
                })
            },
            ActionData.history((item: DepartmentEntity) => {
                this.viewHistory(item.Id);
            })
        ],
        SearchText: 'Nhập tên phòng ban, tên viết tắt'
    };

    constructor() {
        super();
        this.properties = [
            { Property: 'Id', Title: 'Id', Type: DataType.Number },
            {
                Property: 'Name', Title: 'Tên phòng ban', Type: DataType.String,
                Format: ((item: any) => {
                    item['NameText'] = item['Name'];
                    return '<a routerLink="view">' + UtilityExHelper.escapeHtml(item.Name) + '</a>';
                })
            },
            { Property: 'Code', Title: 'Tên viết tắt', Type: DataType.String },
            { Property: 'Description', Title: 'Ghi chú', Type: DataType.String },
            { Property: 'Type', Title: 'Loại phòng', Type: DataType.String },
            {
                Property: 'Amount', Title: 'Số lượng nhân viên', Type: DataType.String, Align: 'center',
                Click: ((item: DepartmentEntity) => {
                    this.popupViewChoiceUser(item);
                }),
                Format: ((item: any) => {
                    return item.Amount + ' nhân viên'
                })
            }
        ];
        this.render(this.obj);
    }
}

@NgModule({
    declarations: [
        DepartmentComponent,
        ViewDepartmentComponent,
        EditDepartmentComponent
    ],
    imports: [
        ShareModule,
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: DepartmentComponent, pathMatch: 'full', data: { state: 'department' }, canActivate: [AdminAuthGuard] },
            { path: 'add', component: EditDepartmentComponent, pathMatch: 'full', data: { state: 'add_department' }, canActivate: [AdminAuthGuard] },
            { path: 'view', component: ViewDepartmentComponent, pathMatch: 'full', data: { state: 'view_department' }, canActivate: [AdminAuthGuard] },
            { path: 'edit', component: EditDepartmentComponent, pathMatch: 'full', data: { state: 'edit_department' }, canActivate: [AdminAuthGuard] },
        ])
    ],
    providers: [DepartmentService]
})
export class DepartmentModule { }