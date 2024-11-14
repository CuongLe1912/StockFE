import { RouterModule } from "@angular/router";
import { Component, NgModule } from "@angular/core";
import { UtilityModule } from "../../utility.module";
import { GridData } from "../../../_core/domains/data/grid.data";
import { DataType } from "../../../_core/domains/enums/data.type";
import { ActionData } from "../../../_core/domains/data/action.data";
import { AdminAuthGuard } from "../../../_core/guards/admin.auth.guard";
import { ModalSizeType } from "../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../_core/components/grid/grid.component";
import { LogExceptionEntity } from "../../../_core/domains/entities/log.exception.entity";
import { EditLogExceptionComponent } from "./edit.log.exception/edit.log.exception.component";

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class LogExceptionComponent extends GridComponent {
    obj: GridData = {
        Size: ModalSizeType.Large,
        Reference: LogExceptionEntity,
        Features: [
            ActionData.reload(() => { this.loadItems(); })
        ],
    };

    constructor() {
        super();
        this.properties = [
            { Property: 'Id', Title: 'Id', Type: DataType.Number },
            { Property: 'DateTime', Title: 'Thời gian', Type: DataType.DateTime },
            {
                Property: 'FullName', Title: 'Thông tin', Type: DataType.String,
                Format: ((item: any) => {
                    let text = '<p>' + item.FullName + '</p>';
                    if (item.Phone) text += '<p><i class=\'la la-phone\'></i> ' + item.Phone + '</p>';
                    if (item.Email) text += '<p><i class=\'la la-inbox\'></i> ' + item.Email + '</p>';
                    return text;
                })
            },
            {
                Property: 'Exception', Title: 'Exception', Type: DataType.String,
                Format: ((item: any) => {
                    return item.Exception && item.Exception.length > 50
                        ? item.Exception.substr(0, 50) + '...'
                        : item.Exception;
                })
            },
            { 
                Property: 'InnerException', Title: 'InnerException', Type: DataType.String,
                Format: ((item: any) => {
                    return item.InnerException && item.InnerException.length > 50
                        ? item.InnerException.substr(0, 50) + '...'
                        : item.InnerException;
                })
             },
            {
                Property: 'StackTrace', Title: 'StackTrace', Type: DataType.String,
                Format: ((item: any) => {
                    return item.StackTrace && item.StackTrace.length > 50
                        ? item.StackTrace.substr(0, 50) + '...'
                        : item.StackTrace;
                })
            }
        ];
        this.render(this.obj);
    }

    edit(item: LogExceptionEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Đóng',
            title: this.obj.Title,
            objectExtra: { id: item.Id },
            size: ModalSizeType.ExtraLarge,
            object: EditLogExceptionComponent,
        }, async () => {
            this.loadItems();
        });
    }
}

@NgModule({
    declarations: [
        LogExceptionComponent,
        EditLogExceptionComponent
    ],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: LogExceptionComponent, pathMatch: 'full', data: { state: 'logexception'}, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class LogExceptionModule { }