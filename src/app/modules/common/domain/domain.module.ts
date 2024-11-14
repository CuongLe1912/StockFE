import { RouterModule } from "@angular/router";
import { Component, NgModule } from "@angular/core";
import { UtilityModule } from "../../utility.module";
import { GridData } from "../../../_core/domains/data/grid.data";
import { DataType } from "../../../_core/domains/enums/data.type";
import { ActionData } from "../../../_core/domains/data/action.data";
import { ActionType } from "../../../_core/domains/enums/action.type";
import { ConstantHelper } from "../../../_core/helpers/constant.helper";
import { AdminAuthGuard } from "../../../_core/guards/admin.auth.guard";
import { ProductionType } from "../../../_core/domains/enums/project.type";
import { ModalSizeType } from "../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../_core/components/grid/grid.component";
import { DomainEntity } from "../../../_core/domains/entities/domain.entity";

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class DomainComponent extends GridComponent {
    obj: GridData = {
        Imports: [],
        Exports: [],
        Checkable: true,
        Size: ModalSizeType.Large,
        Reference: DomainEntity,
        Features: [
            ActionData.addNew(() => this.addNew()),
            ActionData.reload(() => this.loadItems()),
            ActionData.resetCache(() => this.resetCache()),
        ],
        MoreFeatures: {
            Name: 'Đồng bộ',
            Icon: 'la la-recycle',
            Actions: [
                {
                    toggleCheckbox: true,
                    name: 'Đồng bộ STAG',
                    icon: 'la la-retweet',
                    className: 'btn btn-warning',
                    systemName: ActionType.Empty,
                    click: () => {
                        this.syncItems(ProductionType.Stag);
                    }
                },
                {
                    toggleCheckbox: true,
                    name: 'Đồng bộ PROD',
                    icon: 'la la-retweet',
                    className: 'btn btn-warning',
                    systemName: ActionType.Empty,
                    click: () => {
                        this.syncItems(ProductionType.Production);
                    }
                }
            ]
        }
    };

    constructor() {
        super();
        this.properties = [
            { Property: 'Id', Title: 'Id', Type: DataType.Number },
            { Property: 'Label', Title: 'Tên', Type: DataType.String },
            { Property: 'Value', Title: 'Domain', Type: DataType.String },
            { Property: 'Group', Title: 'Nhóm', Type: DataType.String },
            {
                Property: 'Token/Key', Title: 'Thông tin xác thực', Type: DataType.String,
                Format: (item: any) => {
                    let text = '';
                    if (item.Token) text += '<div>Token: ' + item.Token + '</div>';
                    if (item.AppKey) text += '<div>AppKey: ' + item.AppKey + '</div>';
                    if (item.XApiKey) text += '<div>XApiKey: ' + item.XApiKey + '</div>';
                    if (item.XClientId) text += '<div>XClientId: ' + item.XClientId + '</div>';
                    if (item.SecretKey) text += '<div>SecretKey: ' + item.SecretKey + '</div>';
                    return text;
                }
            },
        ];
        this.render(this.obj);
    }
}

@NgModule({
    declarations: [DomainComponent],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: DomainComponent, pathMatch: 'full', data: { state: 'endpoint' }, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class DomainModule { }