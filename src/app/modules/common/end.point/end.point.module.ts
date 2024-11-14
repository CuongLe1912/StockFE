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
import { EndPointEntity } from "../../../_core/domains/entities/end.point.entity";

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class EndPointComponent extends GridComponent {
    obj: GridData = {
        Imports: [],
        Exports: [],
        Checkable: true,
        Size: ModalSizeType.Large,
        Reference: EndPointEntity,
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
            { Property: 'Id', Title: 'Id', Type: DataType.Number, AllowFilter: true },
            { Property: 'Url', Title: 'Url', Type: DataType.String, AllowFilter: true },
            { Property: 'Title', Title: 'Tiêu đề', Type: DataType.String, AllowFilter: true },
            {
                Property: 'Domain', Title: 'Tên miền', Type: DataType.String, AllowFilter: true,
                Format: (item: any) => {
                    let option = ConstantHelper.DOMAINS.find(c => c.value == item.Domain);
                    return option ? option.label : item.Domain;
                }
            },
            { Property: 'Method', Title: 'Phương thức', Type: DataType.DropDown, AllowFilter: true },
            {
                Property: 'Token/Key', Title: 'Thông tin xác thực', Type: DataType.String,
                Format: (item: any) => {
                    let text = '';
                    if (item.Token) text += 'Token: ' + item.Token;
                    if (item.AppKey) text += 'AppKey: ' + item.AppKey;
                    if (item.XApiKey) text += 'XApiKey: ' + item.XApiKey;
                    if (item.XClientId) text += 'XClientId: ' + item.XClientId;
                    if (item.SecretKey) text += 'SecretKey: ' + item.SecretKey;
                    return text;
                }
            },
            { Property: 'SystemName', Title: 'Tên hệ thống', Type: DataType.DropDown, AllowFilter: true },
        ];
        this.render(this.obj);
    }
}

@NgModule({
    declarations: [EndPointComponent],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: EndPointComponent, pathMatch: 'full', data: { state: 'endpoint' }, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class EndPointModule { }