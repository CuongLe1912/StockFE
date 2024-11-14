import { RouterModule } from "@angular/router";
import { Component, NgModule } from "@angular/core";
import { UtilityModule } from "../../utility.module";
import { GridData } from "../../../_core/domains/data/grid.data";
import { DataType } from "../../../_core/domains/enums/data.type";
import { ActionData } from "../../../_core/domains/data/action.data";
import { AdminAuthGuard } from "../../../_core/guards/admin.auth.guard";
import { ModalSizeType } from "../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../_core/components/grid/grid.component";
import { LogActivityEntity } from "../../../_core/domains/entities/log.activity.entity";
import { EditLogActivityComponent } from "./edit.log.activity/edit.log.activity.component";
import { LogActivityBodyComponent } from "./log.activity.body/log.activity.body.component";

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class LogActivityComponent extends GridComponent {
    obj: GridData = {
        Size: ModalSizeType.Large,
        Reference: LogActivityEntity,
        Features: [
            ActionData.reload(() => { this.loadItems(); })
        ],
    };

    constructor() {
        super();
        this.properties = [
            { Property: 'Id', Title: 'Id', Type: DataType.Number },
            { Property: 'DateTime', Title: 'Thời gian', Type: DataType.DateTime, AllowFilter: true },
            {
                Property: 'FullName', Title: 'Thông tin', Type: DataType.String,
                Format: ((item: any) => {
                    let text = '<p>' + item.FullName + '</p>';
                    if (item.Phone) text += '<p><i class=\'la la-phone\'></i> ' + item.Phone + '</p>';
                    if (item.Email) text += '<p><i class=\'la la-inbox\'></i> ' + item.Email + '</p>';
                    return text;
                })
            },
            { Property: 'Url', Title: 'Url', Type: DataType.String },
            {
                Property: 'Controller', Title: 'Controller', Type: DataType.String,
                Format: ((item: any) => {
                    return '<p>' + item.Controller + '/' + item.Action + '</p>' + '<p>' + item.Method + '</p>';
                })
            },
            {
                Property: 'ObjectId', Title: 'Đối tượng', Type: DataType.String, Align: 'center',
                Format: ((item: any) => {
                    return item.ObjectId ? '<a>' + item.ObjectId + '</a>' : '';
                }),
                Click: ((item: any) => {
                    this.viewBody(item);
                })
            },
            { Property: 'Ip', Title: 'Ip', Type: DataType.String },
            { Property: 'Notes', Title: 'Ghi chú', Type: DataType.String },
        ];
        this.render(this.obj);
    }

    edit(item: LogActivityEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: this.obj.Title,
            size: ModalSizeType.Large,
            objectExtra: { id: item.Id },
            object: EditLogActivityComponent,
        });
    }

    viewBody(item: LogActivityEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: this.obj.Title,
            objectExtra: { id: item.Id },
            size: ModalSizeType.ExtraLarge,
            object: LogActivityBodyComponent,
        });
    }
}

@NgModule({
    declarations: [
        LogActivityComponent,
        EditLogActivityComponent,
        LogActivityBodyComponent
    ],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: LogActivityComponent, pathMatch: 'full', data: { state: 'logactivity' }, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class LogActivityModule { }