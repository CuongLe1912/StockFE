import { TeamService } from "./team.service";
import { RouterModule } from "@angular/router";
import { ShareModule } from "../../share.module";
import { Component, NgModule } from "@angular/core";
import { UtilityModule } from "../../utility.module";
import { GridData } from "../../../_core/domains/data/grid.data";
import { DataType } from "../../../_core/domains/enums/data.type";
import { ViewTeamComponent } from "./view.team/view.team.component";
import { EditTeamComponent } from "./edit.team/edit.team.component";
import { ActionData } from "../../../_core/domains/data/action.data";
import { ActionType } from "../../../_core/domains/enums/action.type";
import { AdminAuthGuard } from "../../../_core/guards/admin.auth.guard";
import { UtilityExHelper } from "../../../_core/helpers/utility.helper";
import { TeamEntity } from "../../../_core/domains/entities/team.entity";
import { ModalSizeType } from "../../../_core/domains/enums/modal.size.type";
import { GridEditComponent } from "../../../_core/components/grid/grid.edit.component";

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class TeamComponent extends GridEditComponent {
    obj: GridData = {
        Reference: TeamEntity,
        Filters: [],
        Imports: [],
        Exports: [],
        UpdatedBy: false,
        Actions: [
            ActionData.edit((item: any) => {
                this.edit(item);
            }),
            ActionData.delete((item: any) => {
                this.trash(item);
            })
        ],
        Size: ModalSizeType.Medium,
        InlineFilters: ['OrganizationId'],
        MoreActions: [
            {
                icon: 'la la-users',
                name: ActionType.EditMember,
                systemName: ActionType.EditMember,
                click: ((item: TeamEntity) => {
                    this.popupChoiceUser(item);
                })
            },
            ActionData.history((item: TeamEntity) => {
                this.viewHistory(item.Id);
            })
        ],
        SearchText: 'Nhập tên nhóm, tên viết tắt'
    };

    constructor() {
        super();
        this.properties = [
            { Property: 'Id', Title: 'Id', Type: DataType.Number },
            {
                Property: 'Name', Title: 'Tên nhóm', Type: DataType.String,
                Format: ((item: any) => {
                    return '<a routerLink="view">' + UtilityExHelper.escapeHtml(item.Name) + '</a>';
                })
            },
            { Property: 'Code', Title: 'Tên viết tắt', Type: DataType.String },
            { Property: 'Description', Title: 'Ghi chú', Type: DataType.String },
            {
                Property: 'Amount', Title: 'Số lượng nhân viên', Type: DataType.String, Align: 'center',
                Click: ((item: TeamEntity) => {
                    this.popupViewChoiceUser(item);
                }),
                Format: ((item: any) => {
                    return item.Amount + ' nhân viên'
                })
            },
            { Property: 'Organization', Title: 'Website', Type: DataType.String },
        ];
        this.render(this.obj);
    }
}

@NgModule({
    declarations: [
        TeamComponent,
        EditTeamComponent,
        ViewTeamComponent,
    ],
    imports: [
        ShareModule,
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: TeamComponent, pathMatch: 'full', data: { state: 'team' }, canActivate: [AdminAuthGuard] },
            { path: 'add', component: EditTeamComponent, pathMatch: 'full', data: { state: 'add_team' }, canActivate: [AdminAuthGuard] },
            { path: 'edit', component: EditTeamComponent, pathMatch: 'full', data: { state: 'edit_team' }, canActivate: [AdminAuthGuard] },
            { path: 'view', component: ViewTeamComponent, pathMatch: 'full', data: { state: 'view_team' }, canActivate: [AdminAuthGuard] },
        ])
    ],
    providers: [TeamService]
})
export class TeamModule { }